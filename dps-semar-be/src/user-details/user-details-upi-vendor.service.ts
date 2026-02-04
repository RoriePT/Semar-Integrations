import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpiVendor } from 'src/upi-vendor/entities/upi-vendor.entity';
import { Upi } from 'src/channel/entity/upi.entity';
import { roundOffAmount } from 'src/utils/utils';
import {
  OrderStatus,
  UserTypeForTransactionUpdates,
} from 'src/utils/enum/enum';
import { Payin } from 'src/payin/entities/payin.entity';
import { TransactionUpdate } from 'src/transaction-updates/entities/transaction-update.entity';
import { PaginateRequestDto } from 'src/utils/dtos/paginate.dto';
import { PayinUpiVendorResponseDto } from 'src/payin/dto/payin-upi-vendor-response.dto';
import { plainToInstance } from 'class-transformer';
import { parseEndDate, parseStartDate } from 'src/utils/dtos/paginate.dto';
import { paginateAndClamp } from 'src/utils/pagination.util';

@Injectable()
export class UserDetailsUpiVendorService {
  constructor(
    @InjectRepository(UpiVendor)
    private readonly upiVendorRepository: Repository<UpiVendor>,
    @InjectRepository(Upi)
    private readonly upiRepository: Repository<Upi>,
    @InjectRepository(Payin)
    private readonly payinRepository: Repository<Payin>,
    @InjectRepository(TransactionUpdate)
    private readonly transactionUpdateRepository: Repository<TransactionUpdate>,
  ) {}

  async getUpiVendorDetails(userId: number) {
    const upiVendor = await this.upiVendorRepository.findOne({
      where: { id: userId },
      relations: ['identity', 'identity.upi'],
    });
    if (!upiVendor)
      throw new NotFoundException('Request UPI vendor not found!');

    // Get all UPI IDs for this vendor from identity.upi relation
    const upiIds = upiVendor.identity?.upi?.filter(
      (upi) => upi.isUpiVendor === true,
    ) || [];

    // Get payin orders for this vendor with transaction details
    const payins = await this.payinRepository.find({
      where: { upiVendor: { id: userId } },
    });

    const totalPayins = payins.length;

    // Count completed payins
    const completedPayins = payins.filter(
      (payin) => payin.status === OrderStatus.COMPLETE,
    ).length;

    // Get all commission entries for this vendor
    const commissionEntries = await this.transactionUpdateRepository
      .createQueryBuilder('transactionUpdate')
      .leftJoinAndSelect('transactionUpdate.payinOrder', 'payinOrder')
      .leftJoinAndSelect('payinOrder.upiVendor', 'upiVendor')
      .where('transactionUpdate.userType = :userType', {
        userType: UserTypeForTransactionUpdates.UPI_VENDOR_COMMISSION,
      })
      .andWhere('upiVendor.id = :vendorId', { vendorId: userId })
      .andWhere('transactionUpdate.pending = false')
      .getMany();

    const totalCommission = commissionEntries.reduce(
      (sum, entry) => sum + entry.amount,
      0,
    );

    // Calculate total settlement amount
    const totalSettlementAmount = upiIds.reduce(
      (sum, upi) => sum + (upi.settlementAmount || 0),
      0,
    );

    // Build a map of commission per UPI ID by parsing transactionDetails
    const commissionPerUpi = new Map<number, number>();
    // Track which UPI IDs have ever received a payin order
    const upiIdsWithPayins = new Set<string>();

    // Check all payins to see which UPI IDs have been used
    for (const payin of payins) {
      if (payin && payin.transactionDetails) {
        try {
          const transactionDetails =
            typeof payin.transactionDetails === 'string'
              ? JSON.parse(payin.transactionDetails)
              : payin.transactionDetails;

          const upiIdFromDetails = transactionDetails?.upiId;
          if (upiIdFromDetails) {
            upiIdsWithPayins.add(upiIdFromDetails);
          }
        } catch (error) {
          // If parsing fails, skip this entry
          console.error('Failed to parse transaction details:', error);
        }
      }
    }

    // Calculate commission per UPI ID
    for (const entry of commissionEntries) {
      const payin = entry.payinOrder;
      if (payin && payin.transactionDetails) {
        try {
          const transactionDetails =
            typeof payin.transactionDetails === 'string'
              ? JSON.parse(payin.transactionDetails)
              : payin.transactionDetails;

          // Get the UPI ID value from transaction details
          const upiIdFromDetails = transactionDetails?.upiId;
          
          if (upiIdFromDetails) {
            // Find matching UPI by upiId string
            const matchingUpi = upiIds.find(u => u.upiId === upiIdFromDetails);
            if (matchingUpi) {
              const currentCommission = commissionPerUpi.get(matchingUpi.id) || 0;
              commissionPerUpi.set(matchingUpi.id, currentCommission + entry.amount);
            }
          }
        } catch (error) {
          // If parsing fails, skip this entry
          console.error('Failed to parse transaction details:', error);
        }
      }
    }

    // Build detailed UPI ID breakdown with actual commission per UPI
    const upiIdDetails = upiIds.map((upi) => {
      const commissionEarned = commissionPerUpi.get(upi.id) || 0;
      const hasReceivedPayin = upiIdsWithPayins.has(upi.upiId);

      return {
        upiId: upi.upiId,
        upiIdValue: upi.id,
        title: upi.title || 'N/A',
        settlementAmount: roundOffAmount(upi.settlementAmount || 0),
        commissionEarned: roundOffAmount(commissionEarned),
        enabled: upi.enabled,
        beneficiaryName: upi.beneficiaryName || 'N/A',
        mobile: upi.mobile || 'N/A',
        hasReceivedPayin,
      };
    });

    return {
      name: upiVendor.firstName + ' ' + upiVendor.lastName,
      role: 'UPI_VENDOR',
      email: upiVendor.identity.email,
      phone: upiVendor.phone,
      joinedOn: upiVendor.createdAt,
      status: upiVendor.enabled,
      commissionRate: upiVendor.commissionRate,
      totalSettlementAmount: roundOffAmount(totalSettlementAmount),
      totalPayinOrders: totalPayins,
      completedPayins,
      totalCommissionEarned: roundOffAmount(totalCommission),
      numberOfUpiIds: upiIds.length,
      upiIds: upiIdDetails,
    };
  }

  async paginateUpiVendorPayins(paginateRequestDto: PaginateRequestDto) {
    const {
      search,
      pageSize,
      pageNumber,
      startDate,
      endDate,
      sortBy,
      userId,
      forBulletin,
    } = paginateRequestDto;

    const queryBuilder = this.payinRepository
      .createQueryBuilder('payin')
      .leftJoinAndSelect('payin.merchant', 'merchant')
      .leftJoinAndSelect('payin.user', 'user')
      .leftJoinAndSelect('payin.upiVendor', 'upiVendor')
      .leftJoinAndSelect('payin.member', 'member');

    if (userId)
      queryBuilder.andWhere('upiVendor.id = :userId', { userId });

    if (forBulletin)
      queryBuilder.andWhere('payin.status = :status', {
        status: OrderStatus.SUBMITTED,
      });

    if (search)
      queryBuilder.andWhere(`CONCAT(payin.systemOrderId) ILIKE :search`, {
        search: `%${search}%`,
      });

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

    const dtos = rows.map((row) => plainToInstance(PayinUpiVendorResponseDto, row));

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
}

