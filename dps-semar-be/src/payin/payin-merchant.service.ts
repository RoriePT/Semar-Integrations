import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PaginateRequestDto,
  parseEndDate,
  parseStartDate,
} from 'src/utils/dtos/paginate.dto';
import { Payin } from './entities/payin.entity';
import { Between, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import {
  PayinMerchantOrderResDto,
  PayinMerchantResponseDto,
} from './dto/payin-merchant-response.dto';
import { TransactionUpdate } from 'src/transaction-updates/entities/transaction-update.entity';
import { UserTypeForTransactionUpdates } from 'src/utils/enum/enum';
import { getServicerRateForMerchant, roundOffAmount } from 'src/utils/utils';
import { paginateAndClamp } from 'src/utils/pagination.util';

@Injectable()
export class PayinMerchantService {
  constructor(
    @InjectRepository(Payin)
    private payinRepository: Repository<Payin>,
    @InjectRepository(TransactionUpdate)
    private transactionUpdateRepository: Repository<TransactionUpdate>,
  ) {}

  async paginatePayins(userId, paginateRequestDto: PaginateRequestDto) {
    const { search, pageSize, pageNumber, startDate, endDate, sortBy, status } =
      paginateRequestDto;

    const queryBuilder = this.payinRepository
      .createQueryBuilder('payin')
      .leftJoinAndSelect('payin.merchant', 'merchant')
      .leftJoinAndSelect('merchant.identity', 'identity')
      .leftJoinAndSelect('payin.user', 'user')
      .leftJoinAndSelect('payin.member', 'member');

    if (userId) queryBuilder.andWhere('merchant.id = :userId', { userId });

    if (status) queryBuilder.andWhere('payin.status = :status', { status });

    if (search)
      queryBuilder.andWhere(
        `(payin.merchantOrderId ILIKE :search OR payin.systemOrderId ILIKE :search)`,
        { search: `%${search}%` },
      );

    if (startDate && endDate) {
      const parsedStartDate = parseStartDate(startDate);
      const parsedEndDate = parseEndDate(endDate);

      queryBuilder.andWhere(
        'payin.created_at BETWEEN :startDate AND :endDate',
        {
          startDate: parsedStartDate,
          endDate: parsedEndDate,
        },
      );
    }

    if (sortBy)
      sortBy === 'latest'
        ? queryBuilder.orderBy('payin.createdAt', 'DESC')
        : queryBuilder.orderBy('payin.createdAt', 'ASC');

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
            relations: ['payinOrder', 'user', 'user.merchant'],
          });

        const response = {
          ...row,
          serviceCharge: roundOffAmount(transactionUpdate?.amount),
          balanceCredit: roundOffAmount(
            transactionUpdate.after - transactionUpdate.before,
          ),
        };

        return plainToInstance(PayinMerchantResponseDto, response);
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

  async getPayinDetails(id: string) {
    try {
      const orderDetails = await this.payinRepository.findOne({
        where: { systemOrderId: id },
        relations: ['user', 'merchant', 'member'],
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
          balanceEarned: roundOffAmount(
            transactionUpdateMerchant.after - transactionUpdateMerchant.before,
          ),
        },
      };

      const details = plainToInstance(PayinMerchantOrderResDto, res);

      return details;
    } catch (error) {
      throw new InternalServerErrorException();
    }
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

    const [rows, total] = await this.payinRepository.findAndCount({
      where: whereClause,
      relations: ['user', 'merchant'],
    });

    const dtos = await Promise.all(
      rows.map(async (row) => {
        const merchantRow = await this.transactionUpdateRepository.findOne({
          where: {
            systemOrderId: row.systemOrderId,
            user: { id: row.merchant?.identity?.id },
            userType: UserTypeForTransactionUpdates.MERCHANT_BALANCE,
          },
          relations: ['payinOrder', 'user', 'user.merchant'],
        });

        const systemProfitRow = await this.transactionUpdateRepository.findOne({
          where: {
            systemOrderId: row.systemOrderId,
            userType: UserTypeForTransactionUpdates.SYSTEM_PROFIT,
          },
          relations: ['payinOrder'],
        });

        const response = {
          ...row,
          merchantCharge: merchantRow?.amount,
          systemProfit: systemProfitRow?.after,
        };

        return plainToInstance(PayinMerchantResponseDto, response);
      }),
    );

    return {
      total,
      data: dtos,
    };
  }
}
