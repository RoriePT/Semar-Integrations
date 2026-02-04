import { roundOffAmount } from './../utils/utils';
import { Injectable, NotFoundException } from '@nestjs/common';
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
  PayinAdminResponseDto,
  PayinDetailsAdminResDto,
} from './dto/payin-admin-response.dto';
import { TransactionUpdate } from 'src/transaction-updates/entities/transaction-update.entity';
import {
  ChannelName,
  GatewayName,
  OrderStatus,
  PaymentMadeOn,
  UserTypeForTransactionUpdates,
} from 'src/utils/enum/enum';
import { Merchant } from 'src/merchant/entities/merchant.entity';
import { Member } from 'src/member/entities/member.entity';
import { paginateAndClamp } from 'src/utils/pagination.util';

@Injectable()
export class PayinAdminService {
  constructor(
    @InjectRepository(Payin)
    private payinRepository: Repository<Payin>,
    @InjectRepository(Merchant)
    private merchantRepository: Repository<Merchant>,
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    @InjectRepository(TransactionUpdate)
    private transactionUpdateRepository: Repository<TransactionUpdate>,
  ) {}

  async paginatePayins(paginateRequestDto: PaginateRequestDto) {
    const {
      search,
      pageSize,
      pageNumber,
      startDate,
      endDate,
      sortBy,
      filterStatusArray,
      filterChannelArray,
      filterMadeVia,
      filterAmountLower,
      filterAmountUpper,
      filterMemberSearch,
      filterGatewayArray,
      filterMerchantSearch,
    } = paginateRequestDto;

    const queryBuilder = this.payinRepository
      .createQueryBuilder('payin')
      .leftJoinAndSelect('payin.merchant', 'merchant')
      .leftJoinAndSelect('merchant.identity', 'identity')
      .leftJoinAndSelect('payin.user', 'user')
      .leftJoinAndSelect('payin.member', 'member')
      .leftJoinAndSelect('payin.upiVendor', 'upiVendor');

    // Apply search condition FIRST - this creates the WHERE clause
    if (search) {
      queryBuilder.where(
        `(
          payin.systemOrderId ILIKE :mainSearch OR 
          payin.merchantOrderId ILIKE :mainSearch OR 
          payin.trackingId ILIKE :mainSearch OR 
          payin.transactionId ILIKE :mainSearch
        )`,
        {
          mainSearch: `%${search}%`,
        },
      );
    }

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

    // Apply default ordering if sortBy is not provided
    if (sortBy) {
      sortBy === 'latest'
        ? queryBuilder.orderBy('payin.createdAt', 'DESC')
        : queryBuilder.orderBy('payin.createdAt', 'ASC');
    } else {
      // Default to latest if no sortBy is provided
      queryBuilder.orderBy('payin.createdAt', 'DESC');
    }

    // Apply filterStatusArray filter
    if (filterStatusArray && filterStatusArray.length > 0) {
      queryBuilder.andWhere('payin.status IN (:...filterStatusArray)', {
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
        queryBuilder.andWhere('payin.channel IN (:...filterChannelArray)', {
          filterChannelArray: validChannels,
        });
      }
    }

    // Apply filterMadeVia filter
    if (filterMadeVia && filterMadeVia !== 'BOTH') {
      queryBuilder.andWhere('payin.payinMadeOn = :filterMadeVia', {
        filterMadeVia: filterMadeVia,
      });

      if (filterMadeVia === 'MEMBER')
        queryBuilder.andWhere(
          `CONCAT(member.firstName, ' ', member.lastName) ILIKE :memberSearch`,
          {
            memberSearch: `%${filterMemberSearch}%`,
          },
        );

      if (filterMadeVia === 'GATEWAY')
        queryBuilder.andWhere('payin.gatewayName IN (:...filterGatewayArray)', {
          filterGatewayArray: filterGatewayArray,
        });

      if (filterMadeVia === 'UPI_VENDOR')
        queryBuilder.andWhere('payin.payinMadeOn = :paymentMode', {
          paymentMode: PaymentMadeOn.UPI_VENDOR,
        });
    }

    if (filterMerchantSearch) {
      queryBuilder.andWhere(
        `CONCAT(merchant.firstName, ' ', merchant.lastName) ILIKE :merchantSearch`,
        {
          merchantSearch: `%${filterMerchantSearch}%`,
        },
      );
    }

    // Apply filterAmountLower and filterAmountUpper filters
    if (filterAmountLower !== undefined && filterAmountLower !== null) {
      queryBuilder.andWhere('payin.amount >= :filterAmountLower', {
        filterAmountLower,
      });
    }

    if (filterAmountUpper !== undefined && filterAmountUpper !== null) {
      queryBuilder.andWhere('payin.amount <= :filterAmountUpper', {
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

        // Calculate gatewayTransactionId
        let gatewayTransactionId = null;
        if (row?.gatewayName === GatewayName.PAYU && row?.transactionDetails) {
          try {
            gatewayTransactionId =
              JSON.parse(row?.transactionDetails)?.transactionId || null;
          } catch (e) {
            // If parsing fails, fall back to transactionId
            gatewayTransactionId = row?.transactionId || null;
          }
        } else {
          gatewayTransactionId = row?.transactionId || null;
        }

        const response = {
          ...row,
          merchantCharge: roundOffAmount(merchantRow?.amount),
          systemProfit:
            row.status === OrderStatus.COMPLETE
              ? roundOffAmount(systemProfitRow?.amount)
              : 0,
          gatewayTransactionId: gatewayTransactionId || row?.trackingId || null,
          trackingId: row?.trackingId || null,
        };

        return plainToInstance(PayinAdminResponseDto, response);
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

  async paginateMismatchedUtrPayins(paginateRequestDto: PaginateRequestDto) {
    const {
      search,
      pageSize,
      pageNumber,
      startDate,
      endDate,
      sortBy,
      filterStatusArray,
      filterChannelArray,
      filterMadeVia,
      filterAmountLower,
      filterAmountUpper,
      filterMemberSearch,
      filterGatewayArray,
      filterMerchantSearch,
    } = paginateRequestDto;

    const queryBuilder = this.payinRepository
      .createQueryBuilder('payin')
      .leftJoinAndSelect('payin.merchant', 'merchant')
      .leftJoinAndSelect('merchant.identity', 'identity')
      .leftJoinAndSelect('payin.user', 'user')
      .leftJoinAndSelect('payin.member', 'member')
      .leftJoinAndSelect('payin.upiVendor', 'upiVendor')
      .where('payin.hasUtrMismatch = :hasUtrMismatch', { hasUtrMismatch: true })
      .andWhere('payin.status = :status', { status: OrderStatus.SUBMITTED });

    if (search) {
      // Search by systemOrderId, merchantOrderId, trackingId, and transactionId
      queryBuilder.andWhere(
        `(
          payin.systemOrderId ILIKE :mainSearch OR 
          payin.merchantOrderId ILIKE :mainSearch OR 
          payin.trackingId ILIKE :mainSearch OR 
          payin.transactionId ILIKE :mainSearch
        )`,
        {
          mainSearch: `%${search}%`,
        },
      );
    }

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

    // Note: filterStatusArray is ignored for mismatched UTR endpoint
    // We only return SUBMITTED status payins with UTR mismatch

    // Apply filterChannelArray filter
    if (filterChannelArray && filterChannelArray.length > 0) {
      // Filter out invalid channel values
      const validChannels = filterChannelArray.filter((channel) =>
        [ChannelName.UPI, ChannelName.BANKING, ChannelName.E_WALLET].includes(
          channel,
        ),
      );

      if (validChannels.length > 0) {
        queryBuilder.andWhere('payin.channel IN (:...filterChannelArray)', {
          filterChannelArray: validChannels,
        });
      }
    }

    // Apply filterMadeVia filter
    if (filterMadeVia && filterMadeVia !== 'BOTH') {
      queryBuilder.andWhere('payin.payinMadeOn = :filterMadeVia', {
        filterMadeVia: filterMadeVia,
      });

      if (filterMadeVia === 'MEMBER')
        queryBuilder.andWhere(
          `CONCAT(member.firstName, ' ', member.lastName) ILIKE :memberSearch`,
          {
            memberSearch: `%${filterMemberSearch}%`,
          },
        );

      if (filterMadeVia === 'GATEWAY')
        queryBuilder.andWhere('payin.gatewayName IN (:...filterGatewayArray)', {
          filterGatewayArray: filterGatewayArray,
        });

      if (filterMadeVia === 'UPI_VENDOR')
        queryBuilder.andWhere('payin.payinMadeOn = :paymentMode', {
          paymentMode: PaymentMadeOn.UPI_VENDOR,
        });
    }

    if (filterMerchantSearch) {
      queryBuilder.andWhere(
        `CONCAT(merchant.firstName, ' ', merchant.lastName) ILIKE :merchantSearch`,
        {
          merchantSearch: `%${filterMerchantSearch}%`,
        },
      );
    }

    // Apply filterAmountLower and filterAmountUpper filters
    if (filterAmountLower !== undefined && filterAmountLower !== null) {
      queryBuilder.andWhere('payin.amount >= :filterAmountLower', {
        filterAmountLower,
      });
    }

    if (filterAmountUpper !== undefined && filterAmountUpper !== null) {
      queryBuilder.andWhere('payin.amount <= :filterAmountUpper', {
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

        // Calculate gatewayTransactionId
        let gatewayTransactionId = null;
        if (row?.gatewayName === GatewayName.PAYU && row?.transactionDetails) {
          try {
            gatewayTransactionId =
              JSON.parse(row?.transactionDetails)?.transactionId || null;
          } catch (e) {
            // If parsing fails, fall back to transactionId
            gatewayTransactionId = row?.transactionId || null;
          }
        } else {
          gatewayTransactionId = row?.transactionId || null;
        }

        const response = {
          ...row,
          merchantCharge: roundOffAmount(merchantRow?.amount),
          systemProfit:
            row.status === OrderStatus.COMPLETE
              ? roundOffAmount(systemProfitRow?.amount)
              : 0,
          gatewayTransactionId: gatewayTransactionId || row?.trackingId || null,
          trackingId: row?.trackingId || null,
        };

        return plainToInstance(PayinAdminResponseDto, response);
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
    const payin = await this.payinRepository.findOne({
      where: { systemOrderId: id },
      relations: ['user', 'merchant', 'member', 'upiVendor'],
    });
    if (!payin) throw new NotFoundException('Order not found!');

    const transactionUpdateEntries =
      await this.transactionUpdateRepository.find({
        where: {
          systemOrderId: id,
        },
        relations: ['payinOrder', 'user', 'payinOrder.upiVendor'],
      });

    // Calculate commission before and after for UPI vendor if applicable
    if (payin.upiVendor) {
      const upiVendorCommissionEntry = transactionUpdateEntries.find(
        (entry) =>
          entry.userType ===
          UserTypeForTransactionUpdates.UPI_VENDOR_COMMISSION,
      );

      if (upiVendorCommissionEntry) {
        // Calculate commission before: sum of all previous UPI vendor commission transactions for this vendor
        const commissionBeforeResult = await this.transactionUpdateRepository
          .createQueryBuilder('tu')
          .select('COALESCE(SUM(tu.amount), 0)', 'total')
          .leftJoin('tu.payinOrder', 'payin')
          .where('tu.userType = :userType', {
            userType: UserTypeForTransactionUpdates.UPI_VENDOR_COMMISSION,
          })
          .andWhere('payin.upiVendor = :upiVendorId', {
            upiVendorId: payin.upiVendor.id,
          })
          .andWhere('payin.createdAt < :currentPayinCreatedAt', {
            currentPayinCreatedAt: payin.createdAt,
          })
          .andWhere('tu.pending = :pending', { pending: false })
          .getRawOne();

        const commissionBefore = roundOffAmount(
          parseFloat(commissionBeforeResult?.total || '0'),
        );
        const commissionAfter = roundOffAmount(
          commissionBefore + (upiVendorCommissionEntry.amount || 0),
        );

        // Update the transaction update entry with calculated values
        upiVendorCommissionEntry.before = commissionBefore;
        upiVendorCommissionEntry.after = commissionAfter;
      }
    }

    const response = {
      ...payin,
      transactionDetails: {
        gatewayError: payin?.gatewayError,
        transactionId: payin?.transactionId || payin?.trackingId,
        trackingId: payin?.trackingId || null,
        receipt: payin.transactionReceipt,
        member: payin.member ? JSON.parse(payin.transactionDetails) : null,
        gateway: payin.gatewayName
          ? JSON.parse(payin.transactionDetails)
          : null,
        upiVendor:
          payin.upiVendor && payin.transactionDetails
            ? JSON.parse(payin.transactionDetails)
            : null,
      },
      balancesAndProfit: transactionUpdateEntries,
    };

    return plainToInstance(PayinDetailsAdminResDto, response);
  }

  async exportRecords(startDate: string, endDate: string) {
    startDate = parseStartDate(startDate);
    endDate = parseEndDate(endDate);

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    const [rows, total] = await this.payinRepository.findAndCount({
      relations: ['user'],
      where: {
        createdAt: Between(parsedStartDate, parsedEndDate),
      },
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

        return plainToInstance(PayinAdminResponseDto, response);
      }),
    );

    return {
      total,
      data: dtos,
    };
  }

  async getMerchantList() {
    const merchants = await this.merchantRepository.find();
    if (!merchants) return [];

    const data = merchants.map((merchant) => {
      return {
        id: merchant.id,
        name: merchant.firstName + ' ' + merchant.lastName,
        integrationId: merchant.integrationId,
      };
    });

    return data;
  }

  async getMemberList(body) {
    const { amount, channel } = body;

    const members = await this.memberRepository.find({
      relations: [
        'identity',
        'identity.upi',
        'identity.eWallet',
        'identity.netBanking',
      ],
    });
    if (!members) return [];

    const mapChannel = {
      UPI: 'upi',
      NET_BANKING: 'netBanking',
      E_WALLET: 'eWallet',
    };

    let filteredMembers = [];
    if (amount && channel)
      filteredMembers = members.filter(
        (member) =>
          member.quota >= amount && member.identity[mapChannel[channel]].length,
      );

    return filteredMembers.map((member) => {
      return {
        id: member.id,
        name: member.firstName + ' ' + member.lastName,
      };
    });
  }

  async getEndUserIdSuggestions(merchantId: number) {
    const merchant = await this.merchantRepository.findOne({
      where: {
        id: merchantId,
      },
      relations: ['endUser'],
    });
    if (!merchant) throw new NotFoundException('Merchant not found!');
    if (!merchant.endUser.length) return [];

    return merchant.endUser.map((user) => user.userId);
  }
}
