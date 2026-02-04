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
import { In, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import {
  PayinDetailsUpiVendorResDto,
  PayinUpiVendorResponseDto,
} from './dto/payin-upi-vendor-response.dto';
import { OrderStatus, UserTypeForTransactionUpdates } from 'src/utils/enum/enum';
import { TransactionUpdate } from 'src/transaction-updates/entities/transaction-update.entity';
import { paginateAndClamp } from 'src/utils/pagination.util';

@Injectable()
export class PayinUpiVendorService {
  constructor(
    @InjectRepository(Payin)
    private payinRepository: Repository<Payin>,
    @InjectRepository(TransactionUpdate)
    private transactionUpdateRepository: Repository<TransactionUpdate>,
  ) {}

  async paginatePayins(userId, paginateRequestDto: PaginateRequestDto) {
    const {
      search,
      pageSize,
      pageNumber,
      startDate,
      endDate,
      sortBy,
      forBulletin,
    } = paginateRequestDto;

    const queryBuilder = this.payinRepository
      .createQueryBuilder('payin')
      .leftJoinAndSelect('payin.merchant', 'merchant')
      .leftJoinAndSelect('payin.user', 'user')
      .leftJoinAndSelect('payin.member', 'member')
      .leftJoinAndSelect('member.identity', 'identity')
      .leftJoinAndSelect('payin.upiVendor', 'upiVendor');

    if (userId) queryBuilder.andWhere('upiVendor.id = :userId', { userId });

    if (forBulletin)
      queryBuilder.andWhere('payin.status = :status', {
        status: OrderStatus.SUBMITTED,
      });

    if (search)
      queryBuilder.andWhere(
        `(payin.systemOrderId ILIKE :search OR payin.trackingId ILIKE :search)`,
        { search: `%${search}%` },
      );

    if (sortBy)
      sortBy === 'latest'
        ? queryBuilder.orderBy('payin.createdAt', 'DESC')
        : queryBuilder.orderBy('payin.createdAt', 'ASC');

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

    const { rows, meta } = await paginateAndClamp(queryBuilder, {
      pageNumber,
      pageSize,
    });

    // Fetch TransactionUpdate entries for UPI vendor commissions
    const systemOrderIds = rows.map((row) => row.systemOrderId);
    const transactionUpdates =
      systemOrderIds.length > 0
        ? await this.transactionUpdateRepository.find({
            where: {
              systemOrderId: In(systemOrderIds),
              userType: UserTypeForTransactionUpdates.UPI_VENDOR_COMMISSION,
            },
          })
        : [];

    // Create a map of systemOrderId -> TransactionUpdate for quick lookup
    const commissionMap = new Map<string, TransactionUpdate>();
    transactionUpdates.forEach((tu) => {
      commissionMap.set(tu.systemOrderId, tu);
    });

    const dtos = rows.map((row) => {
      const commissionEntry = commissionMap.get(row.systemOrderId);
      return plainToInstance(PayinUpiVendorResponseDto, {
        ...row,
        upiVendorCommissionEntry: commissionEntry,
      });
    });

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
        relations: [
          'user',
          'member',
          'member.identity',
          'upiVendor',
        ],
      });
      if (!orderDetails) throw new NotFoundException('Order not found.');

      // Fetch TransactionUpdate entry for UPI vendor commission
      const upiVendorCommissionEntry =
        await this.transactionUpdateRepository.findOne({
          where: {
            systemOrderId: id,
            userType: UserTypeForTransactionUpdates.UPI_VENDOR_COMMISSION,
          },
        });

      const res = {
        ...orderDetails,
        transactionDetails: {
          transactionId: orderDetails.transactionId,
          receipt: orderDetails.transactionReceipt,
          member: orderDetails.member
            ? JSON.parse(orderDetails.transactionDetails)
            : null,
          gateway: orderDetails.gatewayName
            ? JSON.parse(orderDetails.transactionDetails)
            : null,
          upiVendor: orderDetails.upiVendor && orderDetails.transactionDetails
            ? JSON.parse(orderDetails.transactionDetails)
            : null,
        },
        upiVendorCommissionEntry: upiVendorCommissionEntry,
      };

      const details = plainToInstance(PayinDetailsUpiVendorResDto, res);

      return details;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
