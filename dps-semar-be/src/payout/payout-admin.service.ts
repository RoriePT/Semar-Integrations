import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Payout } from './entities/payout.entity';
import { plainToInstance } from 'class-transformer';
import { AdminPayoutDetailsResponseDto } from './dto/payout-details-response/admin-payout-details-response.dto';
import {
  PaginateRequestDto,
  parseEndDate,
  parseStartDate,
} from 'src/utils/dtos/paginate.dto';
import { AdminAllPayoutResponseDto } from './dto/paginate-response/admin-payout-response.dto';
import { TransactionUpdate } from 'src/transaction-updates/entities/transaction-update.entity';
import {
  ChannelName,
  OrderStatus,
  UserTypeForTransactionUpdates,
} from 'src/utils/enum/enum';
import { parseUserChannelDetails, roundOffAmount } from 'src/utils/utils';
import { paginateAndClamp } from 'src/utils/pagination.util';

@Injectable()
export class PayoutAdminService {
  constructor(
    @InjectRepository(Payout)
    private readonly payoutRepository: Repository<Payout>,
    @InjectRepository(TransactionUpdate)
    private readonly transactionUpdateRepository: Repository<TransactionUpdate>,
  ) {}

  async paginate(paginateRequestDto: PaginateRequestDto, showPending = false) {
    const {
      search,
      pageSize,
      pageNumber,
      startDate,
      endDate,
      sortBy,
      status,
      filterStatusArray,
      filterChannelArray,
      filterMadeVia,
      filterAmountLower,
      filterAmountUpper,
      filterMemberSearch,
      filterMerchantSearch,
      filterGatewayArray,
    } = paginateRequestDto;

    const queryBuilder = this.payoutRepository
      .createQueryBuilder('payout')
      .leftJoinAndSelect('payout.merchant', 'merchant')
      .leftJoinAndSelect('merchant.identity', 'identity')
      .leftJoinAndSelect('payout.user', 'user')
      .leftJoinAndSelect('payout.member', 'member');

    if (search)
      queryBuilder.andWhere(
        `CONCAT(payout.systemOrderId, ' ', payout.merchantOrderId) ILIKE :search`,
        {
          search: `%${search}%`,
        },
      );

    if (status) {
      queryBuilder.andWhere(`payout.status = :status`, {
        status: status.toUpperCase(),
      });
    }

    if (startDate && endDate) {
      const parsedStartDate = parseStartDate(startDate);
      const parsedEndDate = parseEndDate(endDate);

      queryBuilder.andWhere(
        'payout.created_at BETWEEN :startDate AND :endDate',
        {
          startDate: parsedStartDate,
          endDate: parsedEndDate,
        },
      );
    }

    if (sortBy)
      sortBy === 'latest'
        ? queryBuilder.orderBy('payout.createdAt', 'DESC')
        : queryBuilder.orderBy('payout.createdAt', 'ASC');

    // Apply filterStatusArray filter
    if (filterStatusArray && filterStatusArray.length > 0) {
      queryBuilder.andWhere('payout.status IN (:...filterStatusArray)', {
        filterStatusArray,
      });
    }

    // Apply filterChannelArray filter
    if (filterChannelArray && filterChannelArray.length > 0) {
      // Filter out invalid channel values
      const validChannels = filterChannelArray.filter((channel) =>
        [ChannelName.UPI, ChannelName.BANKING, ChannelName.E_WALLET].includes(
          channel,
        ),
      );
      
      if (validChannels.length > 0) {
        queryBuilder.andWhere('payout.channel IN (:...filterChannelArray)', {
          filterChannelArray: validChannels,
        });
      }
    }

    // Apply filterMadeVia filter
    if (filterMadeVia && filterMadeVia !== 'BOTH') {
      queryBuilder.andWhere('payout.payoutMadeVia = :filterMadeVia', {
        filterMadeVia: filterMadeVia,
      });

      if (filterMadeVia === 'MEMBER')
        queryBuilder.andWhere(
          `CONCAT(member.firstName, ' ', member.lastName) ILIKE :search`,
          {
            search: `%${filterMemberSearch}%`,
          },
        );

      if (filterMadeVia === 'GATEWAY')
        queryBuilder.andWhere(
          'payout.gatewayName IN (:...filterGatewayArray)',
          {
            filterGatewayArray: filterGatewayArray,
          },
        );
    }

    if (filterMerchantSearch) {
      queryBuilder.andWhere(
        `CONCAT(merchant.firstName, ' ', merchant.lastName) ILIKE :search`,
        {
          search: `%${filterMerchantSearch}%`,
        },
      );
    }

    // Apply filterAmountLower and filterAmountUpper filters
    if (filterAmountLower !== undefined && filterAmountLower !== null) {
      queryBuilder.andWhere('payout.amount >= :filterAmountLower', {
        filterAmountLower,
      });
    }
    if (filterAmountUpper !== undefined && filterAmountUpper !== null) {
      queryBuilder.andWhere('payout.amount <= :filterAmountUpper', {
        filterAmountUpper,
      });
    }

    const { rows, meta } = await paginateAndClamp(queryBuilder, {
      pageNumber,
      pageSize,
    });

    // fetch merchantCharge and systemProfit from transactionUpdate entity
    const dtos = await Promise.all(
      rows.map(async (row) => {
        const merchantRow = await this.transactionUpdateRepository.findOne({
          where: {
            systemOrderId: row?.systemOrderId,
            user: { id: row.merchant?.identity?.id },
            userType: UserTypeForTransactionUpdates.MERCHANT_BALANCE,
          },
          relations: ['payoutOrder', 'user', 'user.merchant', 'user.member'],
        });

        const payoutDetails = await this.payoutRepository.findOneBy({
          systemOrderId: merchantRow?.systemOrderId,
        });

        const systemProfitRow = await this.transactionUpdateRepository.findOne({
          where: {
            systemOrderId: row?.systemOrderId,
            userType: UserTypeForTransactionUpdates.SYSTEM_PROFIT,
          },
          relations: ['payoutOrder'],
        });

        const response = {
          ...row,
          merchantCharge: roundOffAmount(merchantRow?.amount),
          systemProfit:
            row.status === OrderStatus.COMPLETE
              ? roundOffAmount(systemProfitRow?.amount)
              : 0,
          callbackStatus: row?.notificationStatus,
          transactionId: payoutDetails.transactionId,
          receipt: payoutDetails.transactionReceipt,
        };

        return plainToInstance(AdminAllPayoutResponseDto, response);
      }),
    );

    return {
      total: meta.total,
      page: meta.page,
      pageSize: meta.pageSize,
      totalPages: meta.totalPages,
      startRecord: meta.startRecord,
      endRecord: meta.endRecord,
      data: dtos,
    };
  }

  async getPayoutDetails(id: string) {
    const payout = await this.payoutRepository.findOne({
      where: { systemOrderId: id },
      relations: ['user', 'merchant', 'member'],
    });
    if (!payout) throw new NotFoundException('Order not found!');

    const transactionUpdateEntries =
      await this.transactionUpdateRepository.find({
        where: {
          systemOrderId: id,
        },
        relations: ['payoutOrder', 'user'],
      });

    const response = {
      ...payout,
      transactionDetails: {
        gatewayError: payout.gatewayError,
        transactionId: payout.transactionId,
        receipt: payout.transactionReceipt,
        member: payout.member ? JSON.parse(payout.transactionDetails) : null,
        gateway: payout.gatewayName
          ? JSON.parse(payout.transactionDetails)
          : null,
        recipient: parseUserChannelDetails(payout?.user),
      },
      balancesAndProfit: transactionUpdateEntries,
    };

    return plainToInstance(AdminPayoutDetailsResponseDto, response);
  }

  async exportRecords(startDate: string, endDate: string) {
    startDate = parseStartDate(startDate);
    endDate = parseEndDate(endDate);

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    const [rows, total] = await this.payoutRepository.findAndCount({
      relations: ['user'],
      where: {
        createdAt: Between(parsedStartDate, parsedEndDate),
      },
    });

    const dtos = await Promise.all(
      rows.map(async (row) => {
        const merchantRow = await this.transactionUpdateRepository.findOne({
          where: {
            systemOrderId: row?.systemOrderId,
            user: { id: row.merchant?.identity?.id },
            userType: UserTypeForTransactionUpdates.MERCHANT_BALANCE,
          },
          relations: ['payoutOrder', 'user', 'user.merchant', 'user.member'],
        });

        const payoutDetails = await this.payoutRepository.findOneBy({
          systemOrderId: merchantRow?.systemOrderId,
        });

        const systemProfitRow = await this.transactionUpdateRepository.findOne({
          where: {
            systemOrderId: row?.systemOrderId,
            userType: UserTypeForTransactionUpdates.SYSTEM_PROFIT,
          },
          relations: ['payoutOrder'],
        });

        const response = {
          ...row,
          merchantCharge: merchantRow?.amount,
          systemProfit: systemProfitRow?.after,
          callbackStatus: row?.notificationStatus,
          transactionId: payoutDetails.transactionId,
        };

        return plainToInstance(AdminAllPayoutResponseDto, response);
      }),
    );

    return {
      total,
      data: dtos,
    };
  }
}
