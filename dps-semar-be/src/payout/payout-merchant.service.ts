import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Payout } from './entities/payout.entity';
import { plainToInstance } from 'class-transformer';
import { MerchantPayoutDetailsResponseDto } from './dto/payout-details-response/merchant-payout-details-response.dto';
import { MerchantAllPayoutResponseDto } from './dto/paginate-response/merchant-payout-response.dto';
import {
  PaginateRequestDto,
  parseEndDate,
  parseStartDate,
} from 'src/utils/dtos/paginate.dto';
import { TransactionUpdate } from 'src/transaction-updates/entities/transaction-update.entity';
import {
  OrderStatus,
  UserTypeForTransactionUpdates,
} from 'src/utils/enum/enum';
import {
  getServicerRateForMerchant,
  parseUserChannelDetails,
  roundOffAmount,
} from 'src/utils/utils';
import { EndUser } from 'src/end-user/entities/end-user.entity';
import { paginateAndClamp } from 'src/utils/pagination.util';

@Injectable()
export class PayoutMerchantService {
  constructor(
    @InjectRepository(Payout)
    private readonly payoutRepository: Repository<Payout>,
    @InjectRepository(EndUser)
    private readonly endUserRepository: Repository<EndUser>,
    @InjectRepository(TransactionUpdate)
    private readonly transactionUpdateRepository: Repository<TransactionUpdate>,
  ) {}

  async paginate(
    paginateRequestDto: PaginateRequestDto,
    userId,
    showPending = false,
  ) {
    const {
      search,
      pageSize,
      pageNumber,
      startDate,
      endDate,
      sortBy,
      // userId,
      forBulletin,
      status,
    } = paginateRequestDto;

    const queryBuilder = this.payoutRepository
      .createQueryBuilder('payout')
      .leftJoinAndSelect('payout.merchant', 'merchant')
      .leftJoinAndSelect('payout.user', 'user')
      .leftJoinAndSelect('payout.member', 'member')
      .leftJoinAndSelect('member.identity', 'identity');

    if (userId) queryBuilder.andWhere('merchant.id = :userId', { userId });

    if (status) queryBuilder.andWhere('payout.status = :status', { status });

    if (forBulletin)
      queryBuilder.andWhere('payout.status = :status', {
        status: OrderStatus.SUBMITTED,
      });

    if (search)
      queryBuilder.andWhere(
        `CONCAT(payout.systemOrderId, ' ', user.name, payout.merchantOrderId) ILIKE :search`,
        {
          search: `%${search}%`,
        },
      );

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

    const { rows, meta } = await paginateAndClamp(queryBuilder, {
      pageNumber,
      pageSize,
    });

    const dtos = await Promise.all(
      rows.map(async (row) => {
        const transactionUpdate =
          await this.transactionUpdateRepository.findOne({
            where: {
              systemOrderId: row.systemOrderId,
              user: { id: row.merchant?.identity?.id },
            },
            relations: ['payoutOrder', 'user', 'user.member'],
          });

        return {
          ...plainToInstance(MerchantAllPayoutResponseDto, row),
          member: row?.member
            ? row.member?.firstName + ' ' + row.member?.lastName
            : null,
          serviceFee: row?.merchant?.payoutServiceRate
            ? roundOffAmount(transactionUpdate?.amount)
            : 0,
          balanceDebit:
            row.status === OrderStatus.FAILED
              ? 0
              : roundOffAmount(row?.amount + transactionUpdate?.amount, true),
          channelDetails: parseUserChannelDetails(row?.user),
        };
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

  async paginateMerchantUsers(
    paginateRequestDto: PaginateRequestDto,
    userId: number,
  ) {
    const { search, pageSize, pageNumber, startDate, endDate, sortBy } =
      paginateRequestDto;

    const queryBuilder = this.endUserRepository
      .createQueryBuilder('endUser')
      .leftJoinAndSelect('endUser.merchant', 'merchant');

    if (userId) queryBuilder.andWhere('merchant.id = :userId', { userId });

    if (search)
      queryBuilder.andWhere(`CONCAT(endUser.name) ILIKE :search`, {
        search: `%${search}%`,
      });

    if (startDate && endDate) {
      const parsedStartDate = parseStartDate(startDate);
      const parsedEndDate = parseEndDate(endDate);

      queryBuilder.andWhere(
        'endUser.created_at BETWEEN :startDate AND :endDate',
        {
          startDate: parsedStartDate,
          endDate: parsedEndDate,
        },
      );
    }

    if (sortBy)
      sortBy === 'latest'
        ? queryBuilder.orderBy('endUser.createdAt', 'DESC')
        : queryBuilder.orderBy('endUser.createdAt', 'ASC');

    const { rows, meta } = await paginateAndClamp(queryBuilder, {
      pageNumber,
      pageSize,
    });

    const dtos = await Promise.all(
      rows.map(async (row) => {
        return {
          userId: row.id,
          name: row.name,
          channelDetails: parseUserChannelDetails(row),
          email: row.email,
          mobile: row.mobile,
          totalPayinAmount: row.totalPayinAmount,
          totalPayoutAmount: row.totalPayoutAmount,
        };
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
    const orderDetails = await this.payoutRepository.findOne({
      where: { systemOrderId: id },
      relations: ['user', 'merchant', 'member', 'merchant.identity'],
    });
    if (!orderDetails) throw new NotFoundException('Order not found.');

    const transactionUpdateMerchant =
      await this.transactionUpdateRepository.findOne({
        where: {
          systemOrderId: id,
          userType: UserTypeForTransactionUpdates.MERCHANT_BALANCE,
          user: { id: orderDetails.merchant?.identity?.id },
        },
        relations: ['payinOrder', 'user', 'user.merchant'],
      });

    const res = {
      ...orderDetails,
      transactionDetails: {
        gatewayError: orderDetails.gatewayError,
        transactionId: orderDetails.transactionId,
        receipt: orderDetails.transactionReceipt,
        member: orderDetails.member
          ? JSON.parse(orderDetails.transactionDetails)
          : null,
        gateway: orderDetails.gatewayName
          ? JSON.parse(orderDetails.transactionDetails)
          : null,
      },
      balanceDetails: {
        serviceRate: getServicerRateForMerchant(
          transactionUpdateMerchant?.absoluteAmount,
          transactionUpdateMerchant?.rate,
        ),
        serviceFee: roundOffAmount(transactionUpdateMerchant?.amount),
        balanceDeducted:
          orderDetails.status === OrderStatus.FAILED
            ? 0
            : roundOffAmount(
                orderDetails?.amount + transactionUpdateMerchant?.amount,
                true,
              ),
      },
      channelDetails: parseUserChannelDetails(orderDetails?.user),
    };

    const details = plainToInstance(MerchantPayoutDetailsResponseDto, res);

    return details;
  }

  async confirmAndGetEndUserDetails(userId) {
    const endUser = await this.endUserRepository.findOne({
      where: {
        userId,
      },
    });
    if (!endUser) throw new NotFoundException('User with this ID not found!');

    return {
      name: endUser.name,
      mobile: endUser.mobile,
      email: endUser.email,
      channelDetails: {
        UPI: endUser.upiDetails,
        NET_BANKING: endUser.netBankingDetails,
        E_WALLET: endUser.eWalletDetails,
      },
    };
  }

  async exportRecords(startDate: string, endDate: string, user) {
    startDate = parseStartDate(startDate);
    endDate = parseEndDate(endDate);

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    const whereClause: any = {
      createdAt: Between(parsedStartDate, parsedEndDate),
    };

    if (user.type === 'MERCHANT') whereClause.merchant = { id: user.id };

    const [rows, total] = await this.payoutRepository.findAndCount({
      relations: ['user', 'merchant'],
      where: whereClause,
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
          transactionId: payoutDetails?.transactionId,
        };

        return plainToInstance(MerchantAllPayoutResponseDto, response);
      }),
    );

    return {
      total,
      data: dtos,
    };
  }
}
