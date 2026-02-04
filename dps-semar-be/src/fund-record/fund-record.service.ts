import {
  HttpStatus,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateSettlementDto,
  MemberSettlementDto,
} from './dto/create-fund-record.dto';
import { TransactionUpdate } from 'src/transaction-updates/entities/transaction-update.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository, Not } from 'typeorm';
import { Identity } from 'src/identity/entities/identity.entity';
import { Merchant } from 'src/merchant/entities/merchant.entity';
import { Member } from 'src/member/entities/member.entity';
import { Agent } from 'src/agent/entities/agent.entity';
import { MemberService } from 'src/member/member.service';
import { MerchantService } from 'src/merchant/merchant.service';
import { AgentService } from 'src/agent/agent.service';
import { FundRecord, FundRecordType } from './entities/fund-record.entity';
import { OrderType, UserTypeForTransactionUpdates } from 'src/utils/enum/enum';
import { getDescription } from './find-record.utils';
import { roundOffAmount } from 'src/utils/utils';
import {
  PaginateRequestDto,
  parseEndDate,
  parseStartDate,
} from 'src/utils/dtos/paginate.dto';
import { plainToInstance } from 'class-transformer';
import { FundRecordAdminResponseDto } from './dto/paginate-response.dto';
import uniqid from 'uniqid';
import { SystemConfigService } from 'src/system-config/system-config.service';
import { WithdrawalOrderStatus, OrderStatus } from 'src/utils/enum/enum';
import { Withdrawal } from 'src/withdrawal/entities/withdrawal.entity';
import { Payout } from 'src/payout/entities/payout.entity';
import { paginateAndClamp } from 'src/utils/pagination.util';

@Injectable()
export class FundRecordService {
  constructor(
    @InjectRepository(TransactionUpdate)
    private readonly transactionUpdateRepository: Repository<TransactionUpdate>,
    @InjectRepository(FundRecord)
    private readonly fundRecordRepository: Repository<FundRecord>,
    @InjectRepository(Identity)
    private readonly identityRepository: Repository<Identity>,
    @InjectRepository(Merchant)
    private readonly merchantRepository: Repository<Merchant>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
    @InjectRepository(Withdrawal)
    private readonly withdrawalRepository: Repository<Withdrawal>,
    @InjectRepository(Payout)
    private readonly payoutRepository: Repository<Payout>,

    private readonly memberService: MemberService,
    private readonly merchantService: MerchantService,
    private readonly agentService: AgentService,
    private readonly systemConfigService: SystemConfigService,
  ) {}

  async paginateFundRecords(
    paginateRequestDto: PaginateRequestDto,
    userEmail = null,
  ) {
    const {
      search,
      pageSize,
      pageNumber,
      startDate,
      endDate,
      sortBy,
      balanceType,
    } = paginateRequestDto;

    const queryBuilder = this.fundRecordRepository
      .createQueryBuilder('fundRecord')
      .leftJoinAndSelect('fundRecord.user', 'user');

    if (userEmail)
      queryBuilder.andWhere('user.email = :userEmail', { userEmail });

    if (search)
      queryBuilder.andWhere(
        `CONCAT(fundRecord.systemOrderId, ' ', fundRecord.name, ' ', fundRecord.merchantOrderId) ILIKE :search`,
        {
          search: `%${search}%`,
        },
      );

    if (startDate && endDate) {
      const parsedStartDate = parseStartDate(startDate);
      const parsedEndDate = parseEndDate(endDate);

      queryBuilder.andWhere(
        'fundRecord.created_at BETWEEN :startDate AND :endDate',
        {
          startDate: parsedStartDate,
          endDate: parsedEndDate,
        },
      );
    }

    if (sortBy)
      sortBy === 'latest'
        ? queryBuilder.orderBy('fundRecord.createdAt', 'DESC')
        : queryBuilder.orderBy('fundRecord.createdAt', 'ASC');

    if (balanceType)
      queryBuilder.andWhere('fundRecord.balanceType = :balanceType', {
        balanceType: balanceType,
      });

    const { rows, meta } = await paginateAndClamp(queryBuilder, {
      pageNumber,
      pageSize,
    });

    return {
      total: meta.total,
      page: meta.page,
      pageSize: meta.pageSize,
      totalPages: meta.totalPages,
      startRecord: meta.startRecord,
      endRecord: meta.endRecord,
      data: plainToInstance(FundRecordAdminResponseDto, rows),
    };
  }

  async addFundRecordForSuccessOrder({
    orderType,
    orderAmount,
    systemOrderId,
  }) {
    switch (orderType) {
      case OrderType.PAYIN:
        await this.createFundRecordForPayin({ orderAmount, systemOrderId });
        break;

      case OrderType.PAYOUT:
        await this.createFundRecordForPayout({ orderAmount, systemOrderId });
        break;

      case OrderType.WITHDRAWAL:
        await this.createFundRecordForWithdrawal({
          orderAmount,
          systemOrderId,
        });
        break;

      case OrderType.TOPUP:
        await this.createFundRecordForTopup({ orderAmount, systemOrderId });
        break;
    }
  }

  async createFundRecordForSettlement({
    settlement,
    beforeAmount,
    afterAmount,
  }: {
    settlement: any;
    beforeAmount: number;
    afterAmount: number;
  }) {
    const vendorName =
      settlement.upiVendor?.firstName + ' ' + settlement.upiVendor?.lastName ||
      'UPI Vendor';
    const upiId = settlement.upi?.upiId || 'N/A';

    const fundRecordEntry = {
      orderType: OrderType.SETTLEMENT,
      name: vendorName,
      balanceType: UserTypeForTransactionUpdates.SYSTEM_PROFIT, // Using SYSTEM_PROFIT as balanceType since settlements affect UPI settlement amount
      systemOrderId: settlement.systemOrderId,
      merchantOrderId: null,
      before: roundOffAmount(beforeAmount),
      after: roundOffAmount(afterAmount),
      amount: 0,
      netAmount: roundOffAmount(settlement.paidAmount),
      serviceFee: 0,
      orderAmount: roundOffAmount(settlement.paidAmount),
      user: settlement.upiVendor?.identity || null,
      description: getDescription({
        type: OrderType.SETTLEMENT,
        userType: UserTypeForTransactionUpdates.SYSTEM_PROFIT,
        userAmount: settlement.paidAmount,
        orderAmount: settlement.paidAmount,
        before: beforeAmount,
        after: afterAmount,
        upiId:
          settlement.upi?.upiId ||
          settlement.upiVendor?.settlementUpiId ||
          'N/A',
      }),
    };

    await this.fundRecordRepository.save(fundRecordEntry);
  }

  private async createFundRecordForPayin({ orderAmount, systemOrderId }) {
    const transactionUpdateEntries =
      await this.transactionUpdateRepository.find({
        where: {
          systemOrderId: systemOrderId,
          orderType: OrderType.PAYIN,
        },
        relations: ['user', 'payinOrder', 'payinOrder.upiVendor'],
      });

    for (const row of transactionUpdateEntries) {
      const memberAgentBalance =
        row.isAgentMember &&
        row.userType === UserTypeForTransactionUpdates.MEMBER_BALANCE;

      if (memberAgentBalance) return;

      // For UPI vendor commission entries without user, try to find the identity
      let userForFundRecord = row.user;
      if (
        !userForFundRecord &&
        row.userType === UserTypeForTransactionUpdates.UPI_VENDOR_COMMISSION &&
        row.payinOrder?.upiVendor?.id
      ) {
        // Try to find identity by UPI vendor
        const identity = await this.identityRepository
          .createQueryBuilder('identity')
          .leftJoinAndSelect('identity.upiVendor', 'upiVendor')
          .where('upiVendor.id = :upiVendorId', {
            upiVendorId: row.payinOrder.upiVendor.id,
          })
          .getOne();
        userForFundRecord = identity;
      }

      // For UPI vendor commission, ensure we use the updated before/after values
      // If they're still 0, recalculate them (in case the update didn't complete)
      let beforeValue = row.before;
      let afterValue = row.after;
      if (
        row.userType === UserTypeForTransactionUpdates.UPI_VENDOR_COMMISSION &&
        (row.before === 0 || row.after === 0) &&
        row.payinOrder?.upiVendor?.id &&
        !row.pending
      ) {
        const commissionBeforeResult = await this.transactionUpdateRepository
          .createQueryBuilder('tu')
          .select('COALESCE(SUM(tu.amount), 0)', 'total')
          .leftJoin('tu.payinOrder', 'payin')
          .where('tu.userType = :userType', {
            userType: UserTypeForTransactionUpdates.UPI_VENDOR_COMMISSION,
          })
          .andWhere('payin.upiVendor = :upiVendorId', {
            upiVendorId: row.payinOrder.upiVendor.id,
          })
          .andWhere('tu.systemOrderId != :currentSystemOrderId', {
            currentSystemOrderId: row.systemOrderId,
          })
          .andWhere('tu.pending = :pending', { pending: false })
          .getRawOne();

        beforeValue = roundOffAmount(
          parseFloat(commissionBeforeResult?.total || '0'),
        );
        afterValue = roundOffAmount(beforeValue + (row.amount || 0));
      }

      const fundRecordEntry = {
        orderType: OrderType.PAYIN,
        name: row.name,
        balanceType: row.userType,
        systemOrderId: row.systemOrderId,
        merchantOrderId: row.payinOrder?.merchantOrderId || null,
        before: beforeValue,
        after: afterValue,
        amount: row.amount || 0,
        netAmount: this.getNetAmount({
          orderAmount,
          orderType: OrderType.PAYIN,
          userType: row.userType,
          amount: row.amount,
          isAgent: row.isAgentOf || row.isAgentMember ? true : false,
        }),
        serviceFee: row.amount || 0,
        orderAmount,
        user: userForFundRecord,
        description: getDescription({
          type: OrderType.PAYIN,
          userType: row.userType,
          userAmount: row.amount,
          orderAmount: orderAmount,
          isAgentMember: row.isAgentMember,
          before: beforeValue,
          after: afterValue,
          rate: row.rate,
        }),
      };

      await this.fundRecordRepository.save(fundRecordEntry);
    }
  }

  private async createFundRecordForPayout({ orderAmount, systemOrderId }) {
    const transactionUpdateEntries =
      await this.transactionUpdateRepository.find({
        where: {
          systemOrderId: systemOrderId,
          orderType: OrderType.PAYOUT,
        },
        relations: ['user', 'payoutOrder'],
      });

    for (const row of transactionUpdateEntries) {
      const memberAgentBalance =
        row.isAgentMember &&
        row.userType === UserTypeForTransactionUpdates.MEMBER_BALANCE;

      if (memberAgentBalance) return;

      const fundRecordEntry = {
        orderType: OrderType.PAYOUT,
        name: row.name,
        balanceType: row.userType,
        systemOrderId: row.systemOrderId,
        merchantOrderId: row.payoutOrder?.merchantOrderId || null,
        before: row.before,
        after: row.after,
        amount: row.amount || 0,
        netAmount: this.getNetAmount({
          orderAmount,
          orderType: OrderType.PAYOUT,
          userType: row.userType,
          amount: row.amount,
          isAgent: row.isAgentOf || row.isAgentMember ? true : false,
        }),
        serviceFee: row.amount || 0,
        orderAmount,
        user: row.user,
        description: getDescription({
          type: OrderType.PAYOUT,
          userType: row.userType,
          userAmount: row.amount,
          orderAmount: orderAmount,
        }),
      };

      await this.fundRecordRepository.save(fundRecordEntry);
    }
  }

  private async createFundRecordForWithdrawal({ orderAmount, systemOrderId }) {
    const transactionUpdateEntries =
      await this.transactionUpdateRepository.find({
        where: {
          systemOrderId: systemOrderId,
          orderType: OrderType.WITHDRAWAL,
          userType: In([
            UserTypeForTransactionUpdates.MERCHANT_BALANCE,
            UserTypeForTransactionUpdates.AGENT_BALANCE,
          ]),
        },
        relations: ['user'],
      });

    for (const row of transactionUpdateEntries) {
      if (row.userType === UserTypeForTransactionUpdates.SYSTEM_PROFIT) return;

      const fundRecordEntry = {
        orderType: OrderType.WITHDRAWAL,
        name: row.name,
        balanceType: row.userType,
        systemOrderId: row.systemOrderId,
        before: row.before,
        after: row.after,
        amount: row.amount || 0,
        netAmount: this.getNetAmount({
          orderAmount,
          orderType: OrderType.WITHDRAWAL,
          userType: row.userType,
          amount: row.amount,
          isAgent: row.isAgentOf || row.isAgentMember ? true : false,
        }),
        serviceFee: row.amount || 0,
        orderAmount,
        user: row.user,
        description: getDescription({
          type: OrderType.WITHDRAWAL,
          userType: row.userType,
          userAmount: row.amount,
          orderAmount: orderAmount,
        }),
      };

      await this.fundRecordRepository.save(fundRecordEntry);
    }
  }

  private async createFundRecordForTopup({ orderAmount, systemOrderId }) {
    const transactionUpdateEntries =
      await this.transactionUpdateRepository.find({
        where: {
          systemOrderId: systemOrderId,
          orderType: OrderType.TOPUP,
          // pending: false,
        },
        relations: ['user'],
      });

    for (const row of transactionUpdateEntries) {
      const memberAgentBalance =
        row.isAgentMember &&
        row.userType === UserTypeForTransactionUpdates.MEMBER_BALANCE;

      if (memberAgentBalance) return;

      const fundRecordEntry = {
        orderType: OrderType.TOPUP,
        name: row.name,
        balanceType: row.userType,
        systemOrderId: row.systemOrderId,
        before: row.before,
        after: row.after,
        amount: row.amount || 0,
        netAmount: this.getNetAmount({
          orderAmount,
          orderType: OrderType.TOPUP,
          userType: row.userType,
          amount: row.amount,
          isAgent: row.isAgentOf || row.isAgentMember ? true : false,
        }),
        serviceFee: row.amount || 0,
        orderAmount,
        user: row.user,
        description: getDescription({
          type: OrderType.TOPUP,
          userType: row.userType,
          userAmount: row.amount,
          orderAmount: orderAmount,
        }),
      };

      await this.fundRecordRepository.save(fundRecordEntry);
    }
  }

  async adminAdjustment(createSettlementDto: CreateSettlementDto) {
    const { amount, description, userId, operation, balanceType } =
      createSettlementDto;

    let amountAfterOperation = 0;
    if (operation === 'INCREMENT') amountAfterOperation = amount;
    if (operation === 'DECREMENT') amountAfterOperation = -amount;

    let before, after;
    let user;

    switch (balanceType) {
      case UserTypeForTransactionUpdates.MERCHANT_BALANCE:
        const merchant = await this.merchantRepository.findOne({
          where: { id: userId },
          relations: ['identity'],
        });
        if (!merchant) throw new NotFoundException('User not found!');

        user = await this.merchantRepository.findOne({
          where: {
            id: merchant.id,
          },
          relations: ['identity'],
        });

        before = user.balance;
        after = operation === 'DECREMENT' ? before - amount : before + amount;

        await this.merchantService.updateBalance(
          merchant.identity.id,
          '0',
          amountAfterOperation,
          false,
        );

        break;

        // case UserTypeForTransactionUpdates.MEMBER_BALANCE:
        const memberBal = await this.memberRepository.findOne({
          where: { id: userId },
          relations: ['identity'],
        });
        if (!memberBal) throw new NotFoundException('User not found!');

        user = await this.memberRepository.findOneBy({
          id: memberBal.id,
        });

        before = user.balance;
        after = operation === 'DECREMENT' ? before - amount : before + amount;

        await this.memberService.updateBalance(
          memberBal.identity.id,
          '0',
          amountAfterOperation,
          false,
        );

        break;

      case UserTypeForTransactionUpdates.MEMBER_QUOTA:
        const memberQuota = await this.memberRepository.findOne({
          where: { id: userId },
          relations: ['identity'],
        });
        if (!memberQuota) throw new NotFoundException('User not found!');

        user = await this.memberRepository.findOne({
          where: {
            id: memberQuota.id,
          },
          relations: ['identity'],
        });

        before = user.quota;
        after = operation === 'DECREMENT' ? before - amount : before + amount;

        await this.memberService.updateQuota(
          memberQuota.identity.id,
          '0',
          amountAfterOperation,
          false,
        );

        break;

      case UserTypeForTransactionUpdates.AGENT_BALANCE:
        const agent = await this.agentRepository.findOne({
          where: { id: userId },
          relations: ['identity'],
        });
        if (!agent) throw new NotFoundException('User not found!');

        user = await this.agentRepository.findOne({
          where: {
            id: agent.id,
          },
          relations: ['identity'],
        });

        before = user.balance;
        after = operation === 'DECREMENT' ? before - amount : before + amount;

        await this.agentService.updateBalance(
          agent.identity.id,
          '0',
          amountAfterOperation,
          false,
        );

        break;

      default:
        throw new NotAcceptableException('Invalid user type!');
    }

    const fundRecordEntry = {
      orderType: OrderType.ADMIN_ADJUSTMENT,
      name: user?.firstName + ' ' + user?.lastName,
      balanceType: balanceType,
      systemOrderId: uniqid(),
      before,
      after,
      amount: 0,
      netAmount: amount,
      serviceFee: 0,
      orderAmount: amount,
      user: user?.identity,
      description:
        description ||
        getDescription({
          type: OrderType.ADMIN_ADJUSTMENT,
          userType: balanceType,
          orderAmount: amount,
          userAmount: amount,
        }),
    };

    await this.fundRecordRepository.save(fundRecordEntry);
  }

  async memberAdjustment(createSettlementDto: MemberSettlementDto) {
    const { amount, sendingMemberId, receivingMemberEmail } =
      createSettlementDto;

    const sendingMember = await this.memberRepository.findOne({
      where: {
        id: sendingMemberId,
      },
      relations: ['identity'],
    });
    if (!sendingMember)
      throw new NotFoundException('Sending member not found!');

    const receivingMember = await this.memberRepository.findOne({
      where: {
        identity: { email: receivingMemberEmail },
      },
      relations: ['identity'],
    });
    if (!receivingMember)
      throw new NotFoundException('Receiving member not found!');

    // Deduct from sending member
    await this.memberService.updateQuota(
      sendingMember.identity.id,
      '0',
      -amount,
      false,
    );

    await this.fundRecordRepository.save({
      orderType: OrderType.MEMBER_adjustment,
      name: sendingMember?.firstName + ' ' + sendingMember?.lastName,
      balanceType: UserTypeForTransactionUpdates.MEMBER_QUOTA,
      systemOrderId: uniqid(),
      before: sendingMember.quota,
      after: sendingMember.quota - amount,
      amount: 0,
      netAmount: amount,
      serviceFee: 0,
      orderAmount: amount,
      user: sendingMember.identity,
      description: getDescription({
        type: OrderType.MEMBER_adjustment,
        userType: UserTypeForTransactionUpdates.MEMBER_QUOTA,
        userAmount: amount,
        orderAmount: amount,
        isSendingMember: true,
      }),
    });

    // Add in receiving member
    await this.memberService.updateQuota(
      receivingMember.identity.id,
      '0',
      amount,
      false,
    );

    await this.fundRecordRepository.save({
      orderType: OrderType.MEMBER_adjustment,
      name: receivingMember?.firstName + ' ' + receivingMember?.lastName,
      balanceType: UserTypeForTransactionUpdates.MEMBER_QUOTA,
      systemOrderId: uniqid(),
      before: receivingMember.quota,
      after: receivingMember.quota + amount,
      amount: 0,
      netAmount: amount,
      serviceFee: 0,
      orderAmount: amount,
      user: receivingMember.identity,
      description: getDescription({
        type: OrderType.MEMBER_adjustment,
        userType: UserTypeForTransactionUpdates.MEMBER_QUOTA,
        userAmount: amount,
        orderAmount: amount,
      }),
    });

    return HttpStatus.OK;
  }

  async exportRecords(startDate: string, endDate: string) {
    startDate = parseStartDate(startDate);
    endDate = parseEndDate(endDate);

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    const [rows, total] = await this.fundRecordRepository.findAndCount({
      relations: ['user'],
      where: {
        createdAt: Between(parsedStartDate, parsedEndDate),
      },
    });

    return {
      total,
      data: plainToInstance(FundRecordAdminResponseDto, rows),
    };
  }

  async exportRecordsMerchant(startDate: string, endDate: string, user) {
    const parsedStartDate = new Date(parseStartDate(startDate));
    const parsedEndDate = new Date(parseEndDate(endDate));

    const queryBuilder = this.fundRecordRepository
      .createQueryBuilder('fundRecord')
      .leftJoinAndSelect('fundRecord.user', 'user')
      .where('fundRecord.createdAt BETWEEN :startDate AND :endDate', {
        startDate: parsedStartDate,
        endDate: parsedEndDate,
      });

    queryBuilder.andWhere('user.email = :userEmail', {
      userEmail: user.email,
    });

    const [rows, total] = await queryBuilder.getManyAndCount();

    return {
      total,
      data: plainToInstance(FundRecordAdminResponseDto, rows),
    };
  }

  private getNetAmount({
    orderType,
    orderAmount,
    amount,
    userType,
    isAgent,
  }: {
    orderType: OrderType;
    orderAmount: number;
    amount: number;
    userType: UserTypeForTransactionUpdates;
    isAgent?: boolean;
  }) {
    if (isAgent) return amount;

    switch (userType) {
      case UserTypeForTransactionUpdates.MERCHANT_BALANCE:
        if (orderType === OrderType.PAYIN) return orderAmount - amount;
        if (orderType === OrderType.PAYOUT) return orderAmount + amount;
        if (orderType === OrderType.WITHDRAWAL) return orderAmount + amount;

      case UserTypeForTransactionUpdates.MEMBER_QUOTA:
        if (orderType === OrderType.PAYIN) return orderAmount - amount;
        if (orderType === OrderType.PAYOUT) return orderAmount + amount;
        if (orderType === OrderType.TOPUP) return orderAmount + amount;

      default:
        return orderAmount;
    }
  }

  async createFrozenAmountRecords() {
    try {
      const { frozenAmountThreshold } =
        await this.systemConfigService.findLatest();
      const currentDate = new Date();

      // Get all pending withdrawals
      const pendingWithdrawals = await this.withdrawalRepository.find({
        where: { status: WithdrawalOrderStatus.PENDING },
        relations: ['user', 'user.merchant'],
      });

      // Get all pending payouts
      const pendingPayouts = await this.payoutRepository.find({
        where: {
          status: Not(
            In([
              OrderStatus.INITIATED,
              OrderStatus.COMPLETE,
              OrderStatus.FAILED,
            ]),
          ),
        },
        relations: ['merchant'],
      });

      // Process withdrawals
      for (const withdrawal of pendingWithdrawals) {
        // Check if frozen record already exists for this withdrawal
        const existingFrozenRecord = await this.fundRecordRepository.findOne({
          where: {
            systemOrderId: withdrawal.systemOrderId,
            type: FundRecordType.FROZEN,
            orderType: OrderType.WITHDRAWAL,
          },
        });

        if (existingFrozenRecord) continue;

        const withdrawalDate = new Date(withdrawal.createdAt);
        const diffInTime = currentDate.getTime() - withdrawalDate.getTime();
        const diffInDays = diffInTime / (1000 * 3600 * 24);

        if (diffInDays > frozenAmountThreshold) {
          await this.fundRecordRepository.save({
            user: withdrawal.user,
            amount: withdrawal.amount,
            type: FundRecordType.FROZEN,
            description: `Frozen amount from pending withdrawal ${withdrawal.systemOrderId}`,
            systemOrderId: withdrawal.systemOrderId,
            orderType: OrderType.WITHDRAWAL,
            balanceType: UserTypeForTransactionUpdates.MERCHANT_BALANCE,
          });
        }
      }

      // Process payouts
      for (const payout of pendingPayouts) {
        // Check if frozen record already exists for this payout
        const existingFrozenRecord = await this.fundRecordRepository.findOne({
          where: {
            systemOrderId: payout.systemOrderId,
            type: FundRecordType.FROZEN,
            orderType: OrderType.PAYOUT,
          },
        });

        if (existingFrozenRecord) continue;

        const payoutDate = new Date(payout.createdAt);
        const diffInTime = currentDate.getTime() - payoutDate.getTime();
        const diffInDays = diffInTime / (1000 * 3600 * 24);

        if (diffInDays > frozenAmountThreshold) {
          await this.fundRecordRepository.save({
            user: payout.merchant.identity,
            amount: payout.amount,
            type: FundRecordType.FROZEN,
            description: `Frozen amount from pending payout ${payout.systemOrderId}`,
            systemOrderId: payout.systemOrderId,
            orderType: OrderType.PAYOUT,
            balanceType: UserTypeForTransactionUpdates.MERCHANT_BALANCE,
          });
        }
      }
    } catch (error) {
      console.error('Error creating frozen amount records:', error);
    }
  }
}
