import {
  UserTypeForTransactionUpdates,
  WithdrawalMadeOn,
} from './../utils/enum/enum';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from 'src/admin/entities/admin.entity';
import { Agent } from 'src/agent/entities/agent.entity';
import { Member } from 'src/member/entities/member.entity';
import { Merchant } from 'src/merchant/entities/merchant.entity';
import { Payin } from 'src/payin/entities/payin.entity';
import { Payout } from 'src/payout/entities/payout.entity';
import { Topup } from 'src/topup/entities/topup.entity';
import {
  ChannelName,
  GatewayName,
  OrderStatus,
  OrderType,
  PaymentMadeOn,
  WithdrawalOrderStatus,
} from 'src/utils/enum/enum';
import { Withdrawal } from 'src/withdrawal/entities/withdrawal.entity';
import { Between, IsNull, Not, Repository } from 'typeorm';
import { parseEndDate, parseStartDate } from 'src/utils/dtos/paginate.dto';
import { FiltersDto } from './dtos/filters-dto';
import { SystemConfigService } from 'src/system-config/system-config.service';
import { TransactionUpdate } from 'src/transaction-updates/entities/transaction-update.entity';
import { monthNames, roundOffAmount } from 'src/utils/utils';
import moment from 'moment';
import { UpiVendor } from 'src/upi-vendor/entities/upi-vendor.entity';
import { Upi } from 'src/channel/entity/upi.entity';
import { Settlement } from 'src/settlement/entities/settlement.entity';

@Injectable()
export class OverviewAdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(Merchant)
    private readonly merchantRepository: Repository<Merchant>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
    @InjectRepository(UpiVendor)
    private readonly upiVendorRepository: Repository<UpiVendor>,
    @InjectRepository(Upi)
    private readonly upiRepository: Repository<Upi>,

    @InjectRepository(Payin)
    private readonly payinRepository: Repository<Payin>,
    @InjectRepository(Payout)
    private readonly payoutRepository: Repository<Payout>,
    @InjectRepository(Withdrawal)
    private readonly withdrawalRepository: Repository<Withdrawal>,
    @InjectRepository(Topup)
    private readonly topupRepository: Repository<Topup>,
    @InjectRepository(Settlement)
    private readonly settlementRepository: Repository<Settlement>,

    @InjectRepository(TransactionUpdate)
    private readonly transactionUpdateRepository: Repository<TransactionUpdate>,

    private readonly systemConfigService: SystemConfigService,
  ) {}

  async getGatewayCount(
    order: OrderType,
    gatewayName = null,
    startDate = '01/01/2024',
    endDate = '31/12/2027',
  ) {
    startDate = parseStartDate(startDate);
    endDate = parseEndDate(endDate);

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (order === OrderType.PAYIN)
      if (gatewayName) {
        return await this.payinRepository.count({
          where: {
            gatewayName,
            createdAt: Between(parsedStartDate, parsedEndDate),
          },
        });
      } else {
        return await this.payinRepository.count({
          where: {
            member: { id: Not(IsNull()) },
            createdAt: Between(parsedStartDate, parsedEndDate),
          },
          relations: ['member'],
        });
      }

    if (order === OrderType.PAYOUT)
      if (gatewayName) {
        return await this.payoutRepository.count({
          where: {
            gatewayName,
            createdAt: Between(parsedStartDate, parsedEndDate),
          },
        });
      } else {
        return await this.payoutRepository.count({
          where: {
            member: { id: Not(IsNull()) },
            createdAt: Between(parsedStartDate, parsedEndDate),
          },
          relations: ['member'],
        });
      }
  }

  async getMemberChannelNameCount(
    order: OrderType,
    channelName: ChannelName,
    startDate = '01/01/2024',
    endDate = '31/12/2027',
  ) {
    startDate = parseStartDate(startDate);
    endDate = parseEndDate(endDate);

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (order === OrderType.PAYIN)
      return await this.payinRepository.count({
        where: {
          member: { id: Not(IsNull()) },
          channel: channelName,
          createdAt: Between(parsedStartDate, parsedEndDate),
        },
        relations: ['member'],
      });

    if (order === OrderType.PAYOUT)
      return await this.payoutRepository.count({
        where: {
          member: { id: Not(IsNull()) },
          channel: channelName,
          createdAt: Between(parsedStartDate, parsedEndDate),
        },
        relations: ['member'],
      });
  }

  async getGatewayChannelNameCount(
    order: OrderType,
    gatewayName,
    channelName,
    startDate = '01/01/2024',
    endDate = '31/12/2027',
  ) {
    startDate = parseStartDate(startDate);
    endDate = parseEndDate(endDate);

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (order === OrderType.PAYIN)
      return await this.payinRepository.count({
        where: {
          gatewayName,
          channel: channelName,
          createdAt: Between(parsedStartDate, parsedEndDate),
        },
      });

    if (order === OrderType.PAYOUT)
      return await this.payoutRepository.count({
        where: {
          gatewayName,
          channel: channelName,
          createdAt: Between(parsedStartDate, parsedEndDate),
        },
      });
  }

  async getUserAnalytics() {
    const adminCount = await this.adminRepository.count();
    const merchantCount = await this.merchantRepository.count();
    const memberCount = await this.memberRepository.count();
    const agentCount = await this.agentRepository.count();

    const memberAgentsCount = await this.memberRepository.count({
      where: {
        referredMember: {
          id: Not(IsNull()),
        },
      },
      relations: ['referredMember'],
    });

    const selfRegisteredMembersCount = await this.memberRepository.count({
      where: {
        selfRegistered: true,
      },
    });

    const latestSelfRegisteredMembers = await this.memberRepository.find({
      where: {
        selfRegistered: true,
      },
      order: {
        createdAt: 'DESC',
      },
      take: 10,
      relations: ['identity'],
    });

    return {
      userInfo: {
        admins: adminCount,
        merchants: merchantCount,
        agents: agentCount + memberAgentsCount,
        members: memberCount,
      },
      memberData: {
        self: selfRegisteredMembersCount,
        admin: Math.abs(memberCount - selfRegisteredMembersCount),
      },
      members: latestSelfRegisteredMembers.map((row) => {
        return {
          name: row.firstName + ' ' + row.lastName,
          gmail: row.identity.email,
          onboardingDate: row.createdAt,
        };
      }),
    };
  }

  async getAllGatewayAnalytics(body: FiltersDto) {
    const { startDate, endDate, mode } = body;

    //PAYINS
    const payinsPhonePeCount = await this.getGatewayCount(
      OrderType.PAYIN,
      GatewayName.PHONEPE,
      startDate,
      endDate,
    );
    const payinsRazorPayCount = await this.getGatewayCount(
      OrderType.PAYIN,
      GatewayName.RAZORPAY,
      startDate,
      endDate,
    );
    const payinsMemberChannelCount = await this.getGatewayCount(
      OrderType.PAYIN,
      null,
      startDate,
      endDate,
    );
    const payinsUniqpayCount = await this.getGatewayCount(
      OrderType.PAYIN,
      GatewayName.UNIQPAY,
      startDate,
      endDate,
    );
    const payinsPayuCount = await this.getGatewayCount(
      OrderType.PAYIN,
      GatewayName.PAYU,
      startDate,
      endDate,
    );
    const payinsCashfreeCount = await this.getGatewayCount(
      OrderType.PAYIN,
      GatewayName.CASHFREE,
      startDate,
      endDate,
    );

    const payinsMemberChannelUpiCount = await this.getMemberChannelNameCount(
      OrderType.PAYIN,
      ChannelName.UPI,
      startDate,
      endDate,
    );
    const payinsMemberChannelNetBankingCount =
      await this.getMemberChannelNameCount(
        OrderType.PAYIN,
        ChannelName.BANKING,
        startDate,
        endDate,
      );
    const payinsMemberChannelEWalletCount =
      await this.getMemberChannelNameCount(
        OrderType.PAYIN,
        ChannelName.E_WALLET,
        startDate,
        endDate,
      );

    const payinsRazorpayUpiCount = await this.getGatewayChannelNameCount(
      OrderType.PAYIN,
      GatewayName.RAZORPAY,
      ChannelName.UPI,
      startDate,
      endDate,
    );
    const payinsRazorpayNetBankingCount = await this.getGatewayChannelNameCount(
      OrderType.PAYIN,
      GatewayName.RAZORPAY,
      ChannelName.BANKING,
      startDate,
      endDate,
    );
    const payinsRazorpayEWalletCount = await this.getGatewayChannelNameCount(
      OrderType.PAYIN,
      GatewayName.RAZORPAY,
      ChannelName.E_WALLET,
      startDate,
      endDate,
    );
    const payinsPhonePeUpiCount = await this.getGatewayChannelNameCount(
      OrderType.PAYIN,
      GatewayName.PHONEPE,
      ChannelName.UPI,
      startDate,
      endDate,
    );
    const payinsPhonePeNetBankingCount = await this.getGatewayChannelNameCount(
      OrderType.PAYIN,
      GatewayName.PHONEPE,
      ChannelName.BANKING,
      startDate,
      endDate,
    );
    const payinsPhonePeEWalletCount = await this.getGatewayChannelNameCount(
      OrderType.PAYIN,
      GatewayName.PHONEPE,
      ChannelName.E_WALLET,
      startDate,
      endDate,
    );

    const payinsUniqpayUpiCount = await this.getGatewayChannelNameCount(
      OrderType.PAYIN,
      GatewayName.UNIQPAY,
      ChannelName.UPI,
      startDate,
      endDate,
    );
    const payinsUniqpayNetBankingCount = await this.getGatewayChannelNameCount(
      OrderType.PAYIN,
      GatewayName.UNIQPAY,
      ChannelName.BANKING,
      startDate,
      endDate,
    );
    const payinsUniqpayEWalletCount = await this.getGatewayChannelNameCount(
      OrderType.PAYIN,
      GatewayName.UNIQPAY,
      ChannelName.E_WALLET,
      startDate,
      endDate,
    );
    const payinsPayuUpiCount = await this.getGatewayChannelNameCount(
      OrderType.PAYIN,
      GatewayName.PAYU,
      ChannelName.UPI,
      startDate,
      endDate,
    );
    const payinsPayuNetBankingCount = await this.getGatewayChannelNameCount(
      OrderType.PAYIN,
      GatewayName.PAYU,
      ChannelName.BANKING,
      startDate,
      endDate,
    );
    const payinsPayuEWalletCount = await this.getGatewayChannelNameCount(
      OrderType.PAYIN,
      GatewayName.PAYU,
      ChannelName.E_WALLET,
      startDate,
      endDate,
    );
    const payinsCashfreeUpiCount = await this.getGatewayChannelNameCount(
      OrderType.PAYIN,
      GatewayName.CASHFREE,
      ChannelName.UPI,
      startDate,
      endDate,
    );
    const payinsCashfreeNetBankingCount = await this.getGatewayChannelNameCount(
      OrderType.PAYIN,
      GatewayName.CASHFREE,
      ChannelName.BANKING,
      startDate,
      endDate,
    );
    const payinsCashfreeEWalletCount = await this.getGatewayChannelNameCount(
      OrderType.PAYIN,
      GatewayName.CASHFREE,
      ChannelName.E_WALLET,
      startDate,
      endDate,
    );

    //PAYOUTS
    const payoutsPhonePeCount = await this.getGatewayCount(
      OrderType.PAYOUT,
      GatewayName.PHONEPE,
      startDate,
      endDate,
    );
    const payoutsRazorPayCount = await this.getGatewayCount(
      OrderType.PAYOUT,
      GatewayName.RAZORPAY,
      startDate,
      endDate,
    );
    const payoutsUniqpayCount = await this.getGatewayCount(
      OrderType.PAYOUT,
      GatewayName.UNIQPAY,
      startDate,
      endDate,
    );
    const payoutsPayuCount = await this.getGatewayCount(
      OrderType.PAYOUT,
      GatewayName.PAYU,
      startDate,
      endDate,
    );
    const payoutsCashfreeCount = await this.getGatewayCount(
      OrderType.PAYOUT,
      GatewayName.CASHFREE,
      startDate,
      endDate,
    );
    const payoutsMemberChannelCount = await this.getGatewayCount(
      OrderType.PAYOUT,
      null,
      startDate,
      endDate,
    );

    const payoutsMemberChannelUpiCount = await this.getMemberChannelNameCount(
      OrderType.PAYOUT,
      ChannelName.UPI,
      startDate,
      endDate,
    );
    const payoutsMemberChannelNetBankingCount =
      await this.getMemberChannelNameCount(
        OrderType.PAYOUT,
        ChannelName.BANKING,
        startDate,
        endDate,
      );
    const payoutsMemberChannelEWalletCount =
      await this.getMemberChannelNameCount(
        OrderType.PAYOUT,
        ChannelName.E_WALLET,
        startDate,
        endDate,
      );

    const payoutsRazorpayUpiCount = await this.getGatewayChannelNameCount(
      OrderType.PAYOUT,
      GatewayName.RAZORPAY,
      ChannelName.UPI,
      startDate,
      endDate,
    );
    const payoutsRazorpayNetBankingCount =
      await this.getGatewayChannelNameCount(
        OrderType.PAYOUT,
        GatewayName.RAZORPAY,
        ChannelName.BANKING,
        startDate,
        endDate,
      );
    const payoutsRazorpayEWalletCount = await this.getGatewayChannelNameCount(
      OrderType.PAYOUT,
      GatewayName.RAZORPAY,
      ChannelName.E_WALLET,
      startDate,
      endDate,
    );

    const payoutsPhonePeUpiCount = await this.getGatewayChannelNameCount(
      OrderType.PAYOUT,
      GatewayName.PHONEPE,
      ChannelName.UPI,
      startDate,
      endDate,
    );
    const payoutsPhonePeNetBankingCount = await this.getGatewayChannelNameCount(
      OrderType.PAYOUT,
      GatewayName.PHONEPE,
      ChannelName.BANKING,
      startDate,
      endDate,
    );
    const payoutsPhonePeEWalletCount = await this.getGatewayChannelNameCount(
      OrderType.PAYOUT,
      GatewayName.PHONEPE,
      ChannelName.E_WALLET,
      startDate,
      endDate,
    );
    const payoutsUniqpayUpiCount = await this.getGatewayChannelNameCount(
      OrderType.PAYOUT,
      GatewayName.UNIQPAY,
      ChannelName.UPI,
      startDate,
      endDate,
    );
    const payoutsUniqpayNetBankingCount = await this.getGatewayChannelNameCount(
      OrderType.PAYOUT,
      GatewayName.UNIQPAY,
      ChannelName.BANKING,
      startDate,
      endDate,
    );
    const payoutsUniqpayEWalletCount = await this.getGatewayChannelNameCount(
      OrderType.PAYOUT,
      GatewayName.UNIQPAY,
      ChannelName.E_WALLET,
      startDate,
      endDate,
    );
    const payoutsPayuUpiCount = await this.getGatewayChannelNameCount(
      OrderType.PAYOUT,
      GatewayName.PAYU,
      ChannelName.UPI,
      startDate,
      endDate,
    );
    const payoutsPayuNetBankingCount = await this.getGatewayChannelNameCount(
      OrderType.PAYOUT,
      GatewayName.PAYU,
      ChannelName.BANKING,
      startDate,
      endDate,
    );
    const payoutsPayuEWalletCount = await this.getGatewayChannelNameCount(
      OrderType.PAYOUT,
      GatewayName.PAYU,
      ChannelName.E_WALLET,
      startDate,
      endDate,
    );
    const payoutsCashfreeUpiCount = await this.getGatewayChannelNameCount(
      OrderType.PAYOUT,
      GatewayName.CASHFREE,
      ChannelName.UPI,
      startDate,
      endDate,
    );
    const payoutsCashfreeNetBankingCount =
      await this.getGatewayChannelNameCount(
        OrderType.PAYOUT,
        GatewayName.CASHFREE,
        ChannelName.BANKING,
        startDate,
        endDate,
      );
    const payoutsCashfreeEWalletCount = await this.getGatewayChannelNameCount(
      OrderType.PAYOUT,
      GatewayName.CASHFREE,
      ChannelName.E_WALLET,
      startDate,
      endDate,
    );

    return {
      payins:
        mode === 'PAYINS' || !mode
          ? {
              orders: {
                memberChannel: payinsMemberChannelCount,
                phonepe: payinsPhonePeCount,
                razorpay: payinsRazorPayCount,
                uniqpay: payinsUniqpayCount,
                payU: payinsPayuCount,
                cashfree: payinsCashfreeCount,
              },
              distribution: {
                memberChannel: {
                  upi: payinsMemberChannelUpiCount,
                  netBanking: payinsMemberChannelNetBankingCount,
                  eWallet: payinsMemberChannelEWalletCount,
                },
                razorpay: {
                  upi: payinsRazorpayUpiCount,
                  netBanking: payinsRazorpayNetBankingCount,
                  eWallet: payinsRazorpayEWalletCount,
                },
                phonepe: {
                  upi: payinsPhonePeUpiCount,
                  netBanking: payinsPhonePeNetBankingCount,
                  eWallet: payinsPhonePeEWalletCount,
                },
                uniqpay: {
                  upi: payinsUniqpayUpiCount,
                  netBanking: payinsUniqpayNetBankingCount,
                  eWallet: payinsUniqpayEWalletCount,
                },
                payU: {
                  upi: payinsPayuUpiCount,
                  netBanking: payinsPayuNetBankingCount,
                  eWallet: payinsPayuEWalletCount,
                },
                cashfree: {
                  upi: payinsCashfreeUpiCount,
                  netBanking: payinsCashfreeNetBankingCount,
                  eWallet: payinsCashfreeEWalletCount,
                },
              },
            }
          : null,
      payouts:
        mode === 'PAYOUTS' || !mode
          ? {
              orders: {
                memberChannel: payoutsMemberChannelCount,
                phonepe: payoutsPhonePeCount,
                razorpay: payoutsRazorPayCount,
                uniqpay: payoutsUniqpayCount,
                payU: payoutsPayuCount,
                cashfree: payoutsCashfreeCount,
              },
              distribution: {
                memberChannel: {
                  upi: payoutsMemberChannelUpiCount,
                  netBanking: payoutsMemberChannelNetBankingCount,
                  eWallet: payoutsMemberChannelEWalletCount,
                },
                razorpay: {
                  upi: payoutsRazorpayUpiCount,
                  netBanking: payoutsRazorpayNetBankingCount,
                  eWallet: payoutsRazorpayEWalletCount,
                },
                phonepe: {
                  upi: payoutsPhonePeUpiCount,
                  netBanking: payoutsPhonePeNetBankingCount,
                  eWallet: payoutsPhonePeEWalletCount,
                },
                uniqpay: {
                  upi: payoutsUniqpayUpiCount,
                  netBanking: payoutsUniqpayNetBankingCount,
                  eWallet: payoutsUniqpayEWalletCount,
                },
                payU: {
                  upi: payoutsPayuUpiCount,
                  netBanking: payoutsPayuNetBankingCount,
                  eWallet: payoutsPayuEWalletCount,
                },
                cashfree: {
                  upi: payoutsCashfreeUpiCount,
                  netBanking: payoutsCashfreeNetBankingCount,
                  eWallet: payoutsCashfreeEWalletCount,
                },
              },
            }
          : null,
    };
  }

  async getGatewayMemberChannelAnalytics(body: FiltersDto) {
    const { startDate, endDate, mode } = body;

    const parsedStartDate = new Date(parseStartDate(startDate));
    const parsedEndDate = new Date(parseEndDate(endDate));

    const [payinRows, payinsCount] = await this.payinRepository.findAndCount({
      where: {
        payinMadeOn: PaymentMadeOn.MEMBER,
        createdAt: Between(parsedStartDate, parsedEndDate),
      },
    });

    const [payoutRows, payoutsCount] = await this.payoutRepository.findAndCount(
      {
        where: {
          payoutMadeVia: PaymentMadeOn.MEMBER,
          createdAt: Between(parsedStartDate, parsedEndDate),
        },
      },
    );

    const [withdrawalRows, withdrawalsCount] =
      await this.withdrawalRepository.findAndCount({
        where: {
          withdrawalMadeOn: WithdrawalMadeOn.ADMIN,
          createdAt: Between(parsedStartDate, parsedEndDate),
        },
      });

    const payins = payinRows.reduce(
      (prev, curr) => {
        if (curr.status === OrderStatus.COMPLETE) {
          prev.completedAmount += curr.amount;
          prev.completed++;
        }
        if (curr.status === OrderStatus.FAILED) {
          prev.failedAmount += curr.amount;
          prev.failed++;
        }
        if (curr.status === OrderStatus.ASSIGNED) {
          prev.pendingAmount += curr.amount;
          prev.assigned++;
        }

        if (curr.status === OrderStatus.SUBMITTED) {
          prev.pendingAmount += curr.amount;
          prev.submitted++;
        }

        return prev;
      },
      {
        completedAmount: 0,
        failedAmount: 0,
        pendingAmount: 0,
        assigned: 0,
        submitted: 0,
        completed: 0,
        failed: 0,
      },
    );

    const payouts = payoutRows.reduce(
      (prev, curr) => {
        if (curr.status === OrderStatus.COMPLETE) {
          prev.completedAmount += curr.amount;
          prev.completed++;
        }
        if (curr.status === OrderStatus.FAILED) {
          prev.failedAmount += curr.amount;
          prev.failed++;
        }
        if (curr.status === OrderStatus.ASSIGNED) {
          prev.pendingAmount += curr.amount;
          prev.assigned++;
        }

        if (curr.status === OrderStatus.SUBMITTED) {
          prev.pendingAmount += curr.amount;
          prev.submitted++;
        }

        return prev;
      },
      {
        completedAmount: 0,
        failedAmount: 0,
        pendingAmount: 0,
        assigned: 0,
        submitted: 0,
        completed: 0,
        failed: 0,
      },
    );

    const withdrawals = withdrawalRows.reduce(
      (prev, curr) => {
        if (curr.status === WithdrawalOrderStatus.COMPLETE) {
          prev.completedAmount += curr.amount;
          prev.completed++;
        }
        if (curr.status === WithdrawalOrderStatus.FAILED) {
          prev.failedAmount += curr.amount;
          prev.failed++;
        }
        if (curr.status === WithdrawalOrderStatus.PENDING) {
          prev.pendingAmount += curr.amount;
          prev.pending++;
        }

        return prev;
      },
      {
        completedAmount: 0,
        failedAmount: 0,
        pendingAmount: 0,
        pending: 0,
        completed: 0,
        failed: 0,
      },
    );

    return {
      payins:
        mode === 'PAYINS' || !mode
          ? {
              orders: {
                total: payinsCount,
                totalCompleted: payins.completedAmount,
                totalFailed: payins.failedAmount,
                totalPending: payins.pendingAmount,
              },
              distribution: {
                assigned: payins.assigned,
                submitted: payins.submitted,
                completed: payins.completed,
                failed: payins.failed,
              },
            }
          : null,
      payouts:
        mode === 'PAYOUTS' || !mode
          ? {
              orders: {
                total: payoutsCount,
                totalCompleted: payouts.completedAmount,
                totalFailed: payouts.failedAmount,
                totalPending: payouts.pendingAmount,
              },
              distribution: {
                assigned: payouts.assigned,
                submitted: payouts.submitted,
                completed: payouts.completed,
                failed: payouts.failed,
              },
            }
          : null,
      withdrawals:
        mode === 'WITHDRAWALS' || !mode
          ? {
              orders: {
                total: withdrawalsCount,
                totalCompleted: withdrawals.completedAmount,
                totalFailed: withdrawals.failedAmount,
                totalPending: withdrawals.pendingAmount,
              },
              distribution: {
                pending: withdrawals.pending,
                completed: withdrawals.completed,
                failed: withdrawals.failed,
              },
            }
          : null,
    };
  }

  async getPhonePeAnalytics(body: FiltersDto) {
    const { startDate, endDate, mode } = body;

    const parsedStartDate = new Date(parseStartDate(startDate));
    const parsedEndDate = new Date(parseEndDate(endDate));

    const [payinRows, payinsCount] = await this.payinRepository.findAndCount({
      where: {
        payinMadeOn: PaymentMadeOn.GATEWAY,
        gatewayName: GatewayName.PHONEPE,
        createdAt: Between(parsedStartDate, parsedEndDate),
      },
    });

    const [payoutRows, payoutsCount] = await this.payoutRepository.findAndCount(
      {
        where: {
          gatewayName: GatewayName.PHONEPE,
          payoutMadeVia: PaymentMadeOn.GATEWAY,
          createdAt: Between(parsedStartDate, parsedEndDate),
        },
      },
    );

    const [withdrawalRows, withdrawalsCount] =
      await this.withdrawalRepository.findAndCount({
        where: {
          gatewayName: GatewayName.PHONEPE,
          withdrawalMadeOn: WithdrawalMadeOn.GATEWAY,
          createdAt: Between(parsedStartDate, parsedEndDate),
        },
      });

    const payins = payinRows.reduce(
      (prev, curr) => {
        if (curr.status === OrderStatus.COMPLETE) {
          prev.completedAmount += curr.amount;
          prev.completed++;
        }
        if (curr.status === OrderStatus.FAILED) {
          prev.failedAmount += curr.amount;
          prev.failed++;
        }
        if (curr.status === OrderStatus.ASSIGNED) {
          prev.pendingAmount += curr.amount;
          prev.assigned++;
        }

        if (curr.status === OrderStatus.SUBMITTED) {
          prev.pendingAmount += curr.amount;
          prev.submitted++;
        }

        return prev;
      },
      {
        completedAmount: 0,
        failedAmount: 0,
        pendingAmount: 0,
        assigned: 0,
        submitted: 0,
        completed: 0,
        failed: 0,
      },
    );

    const payouts = payoutRows.reduce(
      (prev, curr) => {
        if (curr.status === OrderStatus.COMPLETE) {
          prev.completedAmount += curr.amount;
          prev.completed++;
        }
        if (curr.status === OrderStatus.FAILED) {
          prev.failedAmount += curr.amount;
          prev.failed++;
        }
        if (curr.status === OrderStatus.ASSIGNED) {
          prev.pendingAmount += curr.amount;
          prev.assigned++;
        }

        if (curr.status === OrderStatus.SUBMITTED) {
          prev.pendingAmount += curr.amount;
          prev.submitted++;
        }

        return prev;
      },
      {
        completedAmount: 0,
        failedAmount: 0,
        pendingAmount: 0,
        assigned: 0,
        submitted: 0,
        completed: 0,
        failed: 0,
      },
    );

    const withdrawals = withdrawalRows.reduce(
      (prev, curr) => {
        if (curr.status === WithdrawalOrderStatus.COMPLETE) {
          prev.completedAmount += curr.amount;
          prev.completed++;
        }
        if (curr.status === WithdrawalOrderStatus.FAILED) {
          prev.failedAmount += curr.amount;
          prev.failed++;
        }
        if (curr.status === WithdrawalOrderStatus.PENDING) {
          prev.pendingAmount += curr.amount;
          prev.pending++;
        }

        return prev;
      },
      {
        completedAmount: 0,
        failedAmount: 0,
        pendingAmount: 0,
        pending: 0,
        completed: 0,
        failed: 0,
      },
    );

    return {
      payins:
        mode === 'PAYINS' || !mode
          ? {
              orders: {
                total: payinsCount,
                totalCompleted: payins.completedAmount,
                totalFailed: payins.failedAmount,
                totalPending: payins.pendingAmount,
              },
              distribution: {
                assigned: payins.assigned,
                submitted: payins.submitted,
                completed: payins.completed,
                failed: payins.failed,
              },
            }
          : null,
      payouts:
        mode === 'PAYOUTS' || !mode
          ? {
              orders: {
                total: payoutsCount,
                totalCompleted: payouts.completedAmount,
                totalFailed: payouts.failedAmount,
                totalPending: payouts.pendingAmount,
              },
              distribution: {
                assigned: payouts.assigned,
                submitted: payouts.submitted,
                completed: payouts.completed,
                failed: payouts.failed,
              },
            }
          : null,
      withdrawals:
        mode === 'WITHDRAWALS' || !mode
          ? {
              orders: {
                total: withdrawalsCount,
                totalCompleted: withdrawals.completedAmount,
                totalFailed: withdrawals.failedAmount,
                totalPending: withdrawals.pendingAmount,
              },
              distribution: {
                pending: withdrawals.pending,
                completed: withdrawals.completed,
                failed: withdrawals.failed,
              },
            }
          : null,
    };
  }

  async getRazorPayAnalytics(body: FiltersDto) {
    const { startDate, endDate, mode } = body;

    const parsedStartDate = new Date(parseStartDate(startDate));
    const parsedEndDate = new Date(parseEndDate(endDate));

    const [payinRows, payinsCount] = await this.payinRepository.findAndCount({
      where: {
        payinMadeOn: PaymentMadeOn.GATEWAY,
        gatewayName: GatewayName.RAZORPAY,
        createdAt: Between(parsedStartDate, parsedEndDate),
      },
    });

    const [payoutRows, payoutsCount] = await this.payoutRepository.findAndCount(
      {
        where: {
          gatewayName: GatewayName.RAZORPAY,
          payoutMadeVia: PaymentMadeOn.GATEWAY,
          createdAt: Between(parsedStartDate, parsedEndDate),
        },
      },
    );

    const [withdrawalRows, withdrawalsCount] =
      await this.withdrawalRepository.findAndCount({
        where: {
          gatewayName: GatewayName.RAZORPAY,
          withdrawalMadeOn: WithdrawalMadeOn.GATEWAY,
          createdAt: Between(parsedStartDate, parsedEndDate),
        },
      });

    const payins = payinRows.reduce(
      (prev, curr) => {
        if (curr.status === OrderStatus.COMPLETE) {
          prev.completedAmount += curr.amount;
          prev.completed++;
        }
        if (curr.status === OrderStatus.FAILED) {
          prev.failedAmount += curr.amount;
          prev.failed++;
        }
        if (curr.status === OrderStatus.ASSIGNED) {
          prev.pendingAmount += curr.amount;
          prev.assigned++;
        }

        if (curr.status === OrderStatus.SUBMITTED) {
          prev.pendingAmount += curr.amount;
          prev.submitted++;
        }

        return prev;
      },
      {
        completedAmount: 0,
        failedAmount: 0,
        pendingAmount: 0,
        assigned: 0,
        submitted: 0,
        completed: 0,
        failed: 0,
      },
    );

    const payouts = payoutRows.reduce(
      (prev, curr) => {
        if (curr.status === OrderStatus.COMPLETE) {
          prev.completedAmount += curr.amount;
          prev.completed++;
        }
        if (curr.status === OrderStatus.FAILED) {
          prev.failedAmount += curr.amount;
          prev.failed++;
        }
        if (curr.status === OrderStatus.ASSIGNED) {
          prev.pendingAmount += curr.amount;
          prev.assigned++;
        }

        if (curr.status === OrderStatus.SUBMITTED) {
          prev.pendingAmount += curr.amount;
          prev.submitted++;
        }

        return prev;
      },
      {
        completedAmount: 0,
        failedAmount: 0,
        pendingAmount: 0,
        assigned: 0,
        submitted: 0,
        completed: 0,
        failed: 0,
      },
    );

    const withdrawals = withdrawalRows.reduce(
      (prev, curr) => {
        if (curr.status === WithdrawalOrderStatus.COMPLETE) {
          prev.completedAmount += curr.amount;
          prev.completed++;
        }
        if (curr.status === WithdrawalOrderStatus.FAILED) {
          prev.failedAmount += curr.amount;
          prev.failed++;
        }
        if (curr.status === WithdrawalOrderStatus.PENDING) {
          prev.pendingAmount += curr.amount;
          prev.pending++;
        }

        return prev;
      },
      {
        completedAmount: 0,
        failedAmount: 0,
        pendingAmount: 0,
        pending: 0,
        completed: 0,
        failed: 0,
      },
    );

    return {
      payins:
        mode === 'PAYINS' || !mode
          ? {
              orders: {
                total: payinsCount,
                totalCompleted: payins.completedAmount,
                totalFailed: payins.failedAmount,
                totalPending: payins.pendingAmount,
              },
              distribution: {
                assigned: payins.assigned,
                submitted: payins.submitted,
                completed: payins.completed,
                failed: payins.failed,
              },
            }
          : null,
      payouts:
        mode === 'PAYOUTS' || !mode
          ? {
              orders: {
                total: payoutsCount,
                totalCompleted: payouts.completedAmount,
                totalFailed: payouts.failedAmount,
                totalPending: payouts.pendingAmount,
              },
              distribution: {
                assigned: payouts.assigned,
                submitted: payouts.submitted,
                completed: payouts.completed,
                failed: payouts.failed,
              },
            }
          : null,
      withdrawals:
        mode === 'WITHDRAWALS' || !mode
          ? {
              orders: {
                total: withdrawalsCount,
                totalCompleted: withdrawals.completedAmount,
                totalFailed: withdrawals.failedAmount,
                totalPending: withdrawals.pendingAmount,
              },
              distribution: {
                pending: withdrawals.pending,
                completed: withdrawals.completed,
                failed: withdrawals.failed,
              },
            }
          : null,
    };
  }

  async getUniqpayAnalytics(body: FiltersDto) {
    const { startDate, endDate, mode } = body;

    const parsedStartDate = new Date(parseStartDate(startDate));
    const parsedEndDate = new Date(parseEndDate(endDate));

    const [payinRows, payinsCount] = await this.payinRepository.findAndCount({
      where: {
        payinMadeOn: PaymentMadeOn.GATEWAY,
        gatewayName: GatewayName.UNIQPAY,
        createdAt: Between(parsedStartDate, parsedEndDate),
      },
    });

    const [payoutRows, payoutsCount] = await this.payoutRepository.findAndCount(
      {
        where: {
          gatewayName: GatewayName.UNIQPAY,
          payoutMadeVia: PaymentMadeOn.GATEWAY,
          createdAt: Between(parsedStartDate, parsedEndDate),
        },
      },
    );

    const [withdrawalRows, withdrawalsCount] =
      await this.withdrawalRepository.findAndCount({
        where: {
          gatewayName: GatewayName.UNIQPAY,
          withdrawalMadeOn: WithdrawalMadeOn.GATEWAY,
          createdAt: Between(parsedStartDate, parsedEndDate),
        },
      });

    const payins = payinRows.reduce(
      (prev, curr) => {
        if (curr.status === OrderStatus.COMPLETE) {
          prev.completedAmount += curr.amount;
          prev.completed++;
        }
        if (curr.status === OrderStatus.FAILED) {
          prev.failedAmount += curr.amount;
          prev.failed++;
        }
        if (curr.status === OrderStatus.ASSIGNED) {
          prev.pendingAmount += curr.amount;
          prev.assigned++;
        }

        if (curr.status === OrderStatus.SUBMITTED) {
          prev.pendingAmount += curr.amount;
          prev.submitted++;
        }

        return prev;
      },
      {
        completedAmount: 0,
        failedAmount: 0,
        pendingAmount: 0,
        assigned: 0,
        submitted: 0,
        completed: 0,
        failed: 0,
      },
    );

    const payouts = payoutRows.reduce(
      (prev, curr) => {
        if (curr.status === OrderStatus.COMPLETE) {
          prev.completedAmount += curr.amount;
          prev.completed++;
        }
        if (curr.status === OrderStatus.FAILED) {
          prev.failedAmount += curr.amount;
          prev.failed++;
        }
        if (curr.status === OrderStatus.ASSIGNED) {
          prev.pendingAmount += curr.amount;
          prev.assigned++;
        }

        if (curr.status === OrderStatus.SUBMITTED) {
          prev.pendingAmount += curr.amount;
          prev.submitted++;
        }

        return prev;
      },
      {
        completedAmount: 0,
        failedAmount: 0,
        pendingAmount: 0,
        assigned: 0,
        submitted: 0,
        completed: 0,
        failed: 0,
      },
    );

    const withdrawals = withdrawalRows.reduce(
      (prev, curr) => {
        if (curr.status === WithdrawalOrderStatus.COMPLETE) {
          prev.completedAmount += curr.amount;
          prev.completed++;
        }
        if (curr.status === WithdrawalOrderStatus.FAILED) {
          prev.failedAmount += curr.amount;
          prev.failed++;
        }
        if (curr.status === WithdrawalOrderStatus.PENDING) {
          prev.pendingAmount += curr.amount;
          prev.pending++;
        }

        return prev;
      },
      {
        completedAmount: 0,
        failedAmount: 0,
        pendingAmount: 0,
        pending: 0,
        completed: 0,
        failed: 0,
      },
    );

    return {
      payins:
        mode === 'PAYINS' || !mode
          ? {
              orders: {
                total: payinsCount,
                totalCompleted: payins.completedAmount,
                totalFailed: payins.failedAmount,
                totalPending: payins.pendingAmount,
              },
              distribution: {
                assigned: payins.assigned,
                submitted: payins.submitted,
                completed: payins.completed,
                failed: payins.failed,
              },
            }
          : null,
      payouts:
        mode === 'PAYOUTS' || !mode
          ? {
              orders: {
                total: payoutsCount,
                totalCompleted: payouts.completedAmount,
                totalFailed: payouts.failedAmount,
                totalPending: payouts.pendingAmount,
              },
              distribution: {
                assigned: payouts.assigned,
                submitted: payouts.submitted,
                completed: payouts.completed,
                failed: payouts.failed,
              },
            }
          : null,
      withdrawals:
        mode === 'WITHDRAWALS' || !mode
          ? {
              orders: {
                total: withdrawalsCount,
                totalCompleted: withdrawals.completedAmount,
                totalFailed: withdrawals.failedAmount,
                totalPending: withdrawals.pendingAmount,
              },
              distribution: {
                pending: withdrawals.pending,
                completed: withdrawals.completed,
                failed: withdrawals.failed,
              },
            }
          : null,
    };
  }

  async getPayuAnalytics(body: FiltersDto) {
    const { startDate, endDate, mode } = body;

    const parsedStartDate = new Date(parseStartDate(startDate));
    const parsedEndDate = new Date(parseEndDate(endDate));

    const [payinRows, payinsCount] = await this.payinRepository.findAndCount({
      where: {
        payinMadeOn: PaymentMadeOn.GATEWAY,
        gatewayName: GatewayName.PAYU,
        createdAt: Between(parsedStartDate, parsedEndDate),
      },
    });

    const [payoutRows, payoutsCount] = await this.payoutRepository.findAndCount(
      {
        where: {
          gatewayName: GatewayName.PAYU,
          payoutMadeVia: PaymentMadeOn.GATEWAY,
          createdAt: Between(parsedStartDate, parsedEndDate),
        },
      },
    );

    const [withdrawalRows, withdrawalsCount] =
      await this.withdrawalRepository.findAndCount({
        where: {
          gatewayName: GatewayName.PAYU,
          withdrawalMadeOn: WithdrawalMadeOn.GATEWAY,
          createdAt: Between(parsedStartDate, parsedEndDate),
        },
      });

    const payins = payinRows.reduce(
      (prev, curr) => {
        if (curr.status === OrderStatus.COMPLETE) {
          prev.completedAmount += curr.amount;
          prev.completed++;
        }
        if (curr.status === OrderStatus.FAILED) {
          prev.failedAmount += curr.amount;
          prev.failed++;
        }
        if (curr.status === OrderStatus.ASSIGNED) {
          prev.pendingAmount += curr.amount;
          prev.assigned++;
        }

        if (curr.status === OrderStatus.SUBMITTED) {
          prev.pendingAmount += curr.amount;
          prev.submitted++;
        }

        return prev;
      },
      {
        completedAmount: 0,
        failedAmount: 0,
        pendingAmount: 0,
        assigned: 0,
        submitted: 0,
        completed: 0,
        failed: 0,
      },
    );

    const payouts = payoutRows.reduce(
      (prev, curr) => {
        if (curr.status === OrderStatus.COMPLETE) {
          prev.completedAmount += curr.amount;
          prev.completed++;
        }
        if (curr.status === OrderStatus.FAILED) {
          prev.failedAmount += curr.amount;
          prev.failed++;
        }
        if (curr.status === OrderStatus.ASSIGNED) {
          prev.pendingAmount += curr.amount;
          prev.assigned++;
        }

        if (curr.status === OrderStatus.SUBMITTED) {
          prev.pendingAmount += curr.amount;
          prev.submitted++;
        }

        return prev;
      },
      {
        completedAmount: 0,
        failedAmount: 0,
        pendingAmount: 0,
        assigned: 0,
        submitted: 0,
        completed: 0,
        failed: 0,
      },
    );

    const withdrawals = withdrawalRows.reduce(
      (prev, curr) => {
        if (curr.status === WithdrawalOrderStatus.COMPLETE) {
          prev.completedAmount += curr.amount;
          prev.completed++;
        }
        if (curr.status === WithdrawalOrderStatus.FAILED) {
          prev.failedAmount += curr.amount;
          prev.failed++;
        }
        if (curr.status === WithdrawalOrderStatus.PENDING) {
          prev.pendingAmount += curr.amount;
          prev.pending++;
        }

        return prev;
      },
      {
        completedAmount: 0,
        failedAmount: 0,
        pendingAmount: 0,
        pending: 0,
        completed: 0,
        failed: 0,
      },
    );

    return {
      payins:
        mode === 'PAYINS' || !mode
          ? {
              orders: {
                total: payinsCount,
                totalCompleted: payins.completedAmount,
                totalFailed: payins.failedAmount,
                totalPending: payins.pendingAmount,
              },
              distribution: {
                assigned: payins.assigned,
                submitted: payins.submitted,
                completed: payins.completed,
                failed: payins.failed,
              },
            }
          : null,
      payouts:
        mode === 'PAYOUTS' || !mode
          ? {
              orders: {
                total: payoutsCount,
                totalCompleted: payouts.completedAmount,
                totalFailed: payouts.failedAmount,
                totalPending: payouts.pendingAmount,
              },
              distribution: {
                assigned: payouts.assigned,
                submitted: payouts.submitted,
                completed: payouts.completed,
                failed: payouts.failed,
              },
            }
          : null,
      withdrawals:
        mode === 'WITHDRAWALS' || !mode
          ? {
              orders: {
                total: withdrawalsCount,
                totalCompleted: withdrawals.completedAmount,
                totalFailed: withdrawals.failedAmount,
                totalPending: withdrawals.pendingAmount,
              },
              distribution: {
                pending: withdrawals.pending,
                completed: withdrawals.completed,
                failed: withdrawals.failed,
              },
            }
          : null,
    };
  }

  async getCashfreeAnalytics(body: FiltersDto) {
    const { startDate, endDate, mode } = body;

    const parsedStartDate = new Date(parseStartDate(startDate));
    const parsedEndDate = new Date(parseEndDate(endDate));

    const [payinRows, payinsCount] = await this.payinRepository.findAndCount({
      where: {
        payinMadeOn: PaymentMadeOn.GATEWAY,
        gatewayName: GatewayName.CASHFREE,
        createdAt: Between(parsedStartDate, parsedEndDate),
      },
    });

    const [payoutRows, payoutsCount] = await this.payoutRepository.findAndCount(
      {
        where: {
          gatewayName: GatewayName.CASHFREE,
          payoutMadeVia: PaymentMadeOn.GATEWAY,
          createdAt: Between(parsedStartDate, parsedEndDate),
        },
      },
    );

    const [withdrawalRows, withdrawalsCount] =
      await this.withdrawalRepository.findAndCount({
        where: {
          gatewayName: GatewayName.CASHFREE,
          withdrawalMadeOn: WithdrawalMadeOn.GATEWAY,
          createdAt: Between(parsedStartDate, parsedEndDate),
        },
      });

    const payins = payinRows.reduce(
      (prev, curr) => {
        if (curr.status === OrderStatus.COMPLETE) {
          prev.completedAmount += curr.amount;
          prev.completed++;
        }
        if (curr.status === OrderStatus.FAILED) {
          prev.failedAmount += curr.amount;
          prev.failed++;
        }
        if (curr.status === OrderStatus.ASSIGNED) {
          prev.pendingAmount += curr.amount;
          prev.assigned++;
        }

        if (curr.status === OrderStatus.SUBMITTED) {
          prev.pendingAmount += curr.amount;
          prev.submitted++;
        }

        return prev;
      },
      {
        completedAmount: 0,
        failedAmount: 0,
        pendingAmount: 0,
        assigned: 0,
        submitted: 0,
        completed: 0,
        failed: 0,
      },
    );

    const payouts = payoutRows.reduce(
      (prev, curr) => {
        if (curr.status === OrderStatus.COMPLETE) {
          prev.completedAmount += curr.amount;
          prev.completed++;
        }
        if (curr.status === OrderStatus.FAILED) {
          prev.failedAmount += curr.amount;
          prev.failed++;
        }
        if (curr.status === OrderStatus.ASSIGNED) {
          prev.pendingAmount += curr.amount;
          prev.assigned++;
        }

        if (curr.status === OrderStatus.SUBMITTED) {
          prev.pendingAmount += curr.amount;
          prev.submitted++;
        }

        return prev;
      },
      {
        completedAmount: 0,
        failedAmount: 0,
        pendingAmount: 0,
        assigned: 0,
        submitted: 0,
        completed: 0,
        failed: 0,
      },
    );

    const withdrawals = withdrawalRows.reduce(
      (prev, curr) => {
        if (curr.status === WithdrawalOrderStatus.COMPLETE) {
          prev.completedAmount += curr.amount;
          prev.completed++;
        }
        if (curr.status === WithdrawalOrderStatus.FAILED) {
          prev.failedAmount += curr.amount;
          prev.failed++;
        }
        if (curr.status === WithdrawalOrderStatus.PENDING) {
          prev.pendingAmount += curr.amount;
          prev.pending++;
        }

        return prev;
      },
      {
        completedAmount: 0,
        failedAmount: 0,
        pendingAmount: 0,
        pending: 0,
        completed: 0,
        failed: 0,
      },
    );

    return {
      payins:
        mode === 'PAYINS' || !mode
          ? {
              orders: {
                total: payinsCount,
                totalCompleted: payins.completedAmount,
                totalFailed: payins.failedAmount,
                totalPending: payins.pendingAmount,
              },
              distribution: {
                assigned: payins.assigned,
                submitted: payins.submitted,
                completed: payins.completed,
                failed: payins.failed,
              },
            }
          : null,
      payouts:
        mode === 'PAYOUTS' || !mode
          ? {
              orders: {
                total: payoutsCount,
                totalCompleted: payouts.completedAmount,
                totalFailed: payouts.failedAmount,
                totalPending: payouts.pendingAmount,
              },
              distribution: {
                assigned: payouts.assigned,
                submitted: payouts.submitted,
                completed: payouts.completed,
                failed: payouts.failed,
              },
            }
          : null,
      withdrawals:
        mode === 'WITHDRAWALS' || !mode
          ? {
              orders: {
                total: withdrawalsCount,
                totalCompleted: withdrawals.completedAmount,
                totalFailed: withdrawals.failedAmount,
                totalPending: withdrawals.pendingAmount,
              },
              distribution: {
                pending: withdrawals.pending,
                completed: withdrawals.completed,
                failed: withdrawals.failed,
              },
            }
          : null,
    };
  }

  async getAllChannelAnalytics(body: FiltersDto) {
    const { startDate, endDate, mode } = body;

    const parsedStartDate = new Date(parseStartDate(startDate));
    const parsedEndDate = new Date(parseEndDate(endDate));

    const [payinRows, payinsCount] = await this.payinRepository.findAndCount({
      where: {
        createdAt: Between(parsedStartDate, parsedEndDate),
      },
    });

    const [payoutRows, payoutsCount] = await this.payoutRepository.findAndCount(
      {
        where: {
          createdAt: Between(parsedStartDate, parsedEndDate),
        },
      },
    );

    const payins = payinRows.reduce(
      (prev, curr) => {
        if (curr.channel === ChannelName.UPI) {
          prev.upi++;
          if (curr?.payinMadeOn === PaymentMadeOn.MEMBER)
            prev.memberChannelUpi++;
          if (curr?.gatewayName === GatewayName.PHONEPE) prev.phonepeUpi++;
          if (curr?.gatewayName === GatewayName.RAZORPAY) prev.razorpayUpi++;
          if (curr?.gatewayName === GatewayName.UNIQPAY) prev.uniqpayUpi++;
          if (curr?.gatewayName === GatewayName.PAYU) prev.payuUpi++;
        }
        if (curr.channel === ChannelName.BANKING) {
          prev.netBanking++;
          if (curr?.payinMadeOn === PaymentMadeOn.MEMBER)
            prev.memberChannelBanking++;
          if (curr.gatewayName === GatewayName.PHONEPE) prev.phonepeBanking++;
          if (curr.gatewayName === GatewayName.RAZORPAY) prev.razorpayBanking++;
          if (curr.gatewayName === GatewayName.UNIQPAY) prev.uniqpayBanking++;
          if (curr.gatewayName === GatewayName.PAYU) prev.payuBanking++;
          if (curr.gatewayName === GatewayName.CASHFREE) prev.cashfreeBanking++;
        }
        if (curr.channel === ChannelName.BANKING) {
          prev.eWallet++;
          if (curr?.payinMadeOn === PaymentMadeOn.MEMBER)
            prev.memberChannelEWallet++;
          if (curr.gatewayName === GatewayName.PHONEPE) prev.phonepeEWallet++;
          if (curr.gatewayName === GatewayName.RAZORPAY) prev.razorpayEWallet++;
          if (curr.gatewayName === GatewayName.UNIQPAY) prev.uniqpayEwallet++;
          if (curr.gatewayName === GatewayName.PAYU) prev.payuEwallet++;
          if (curr.gatewayName === GatewayName.CASHFREE) prev.cashfreeEwallet++;
        }
        return prev;
      },
      {
        upi: 0,
        netBanking: 0,
        eWallet: 0,
        memberChannelUpi: 0,
        phonepeUpi: 0,
        razorpayUpi: 0,
        uniqpayUpi: 0,
        payuUpi: 0,
        cashfreeUpi: 0,
        memberChannelBanking: 0,
        phonepeBanking: 0,
        razorpayBanking: 0,
        uniqpayBanking: 0,
        payuBanking: 0,
        cashfreeBanking: 0,
        memberChannelEWallet: 0,
        phonepeEWallet: 0,
        razorpayEWallet: 0,
        uniqpayEwallet: 0,
        payuEwallet: 0,
        cashfreeEwallet: 0,
      },
    );

    const payouts = payoutRows.reduce(
      (prev, curr) => {
        if (curr.channel === ChannelName.UPI) {
          prev.upi++;
          if (curr?.payoutMadeVia === PaymentMadeOn.MEMBER)
            prev.memberChannelUpi++;
          if (curr.gatewayName === GatewayName.PHONEPE) prev.phonepeUpi++;
          if (curr.gatewayName === GatewayName.RAZORPAY) prev.razorpayUpi++;
          if (curr.gatewayName === GatewayName.UNIQPAY) prev.uniqpayUpi++;
          if (curr.gatewayName === GatewayName.PAYU) prev.payuUpi++;
          if (curr.gatewayName === GatewayName.PAYU) prev.cashfreeUpi++;
        }
        if (curr.channel === ChannelName.BANKING) {
          prev.netBanking++;
          if (curr?.payoutMadeVia === PaymentMadeOn.MEMBER)
            prev.memberChannelBanking++;
          if (curr.gatewayName === GatewayName.PHONEPE) prev.phonepeBanking++;
          if (curr.gatewayName === GatewayName.RAZORPAY) prev.razorpayBanking++;
          if (curr.gatewayName === GatewayName.UNIQPAY) prev.uniqpayBanking++;
          if (curr.gatewayName === GatewayName.CASHFREE) prev.cashfreeBanking++;
        }
        if (curr.channel === ChannelName.BANKING) {
          prev.eWallet++;
          if (curr?.payoutMadeVia === PaymentMadeOn.MEMBER)
            prev.memberChannelEWallet++;
          if (curr.gatewayName === GatewayName.PHONEPE) prev.phonepeEWallet++;
          if (curr.gatewayName === GatewayName.RAZORPAY) prev.razorpayEWallet++;
          if (curr.gatewayName === GatewayName.UNIQPAY) prev.uniqpayEwallet++;
          if (curr.gatewayName === GatewayName.PAYU) prev.payuEwallet++;
          if (curr.gatewayName === GatewayName.CASHFREE) prev.cashfreeEwallet++;
        }
        return prev;
      },
      {
        upi: 0,
        netBanking: 0,
        eWallet: 0,
        memberChannelUpi: 0,
        phonepeUpi: 0,
        razorpayUpi: 0,
        uniqpayUpi: 0,
        payuUpi: 0,
        cashfreeUpi: 0,
        memberChannelBanking: 0,
        phonepeBanking: 0,
        razorpayBanking: 0,
        uniqpayBanking: 0,
        payuBanking: 0,
        cashfreeBanking: 0,
        memberChannelEWallet: 0,
        phonepeEWallet: 0,
        razorpayEWallet: 0,
        uniqpayEwallet: 0,
        payuEwallet: 0,
        cashfreeEwallet: 0,
      },
    );

    return {
      payins: {
        orders: {
          upi: payins.upi,
          netBanking: payins.netBanking,
          eWallet: payins.eWallet,
        },
        distribution: {
          upi: {
            memberChannel: payins.memberChannelUpi,
            phonepe: payins.phonepeUpi,
            razorpay: payins.razorpayUpi,
            uniqpay: payins.uniqpayUpi,
            payU: payins.payuUpi,
            cashfree: payins.cashfreeUpi,
          },
          netBanking: {
            memberChannel: payins.memberChannelBanking,
            phonepe: payins.phonepeBanking,
            razorpay: payins.razorpayBanking,
            uniqpay: payins.uniqpayBanking,
            payU: payins.payuBanking,
            cashfree: payins.cashfreeBanking,
          },
          eWallet: {
            memberChannel: payins.memberChannelEWallet,
            phonepe: payins.phonepeEWallet,
            razorpay: payins.razorpayEWallet,
            uniqpay: payins.uniqpayEwallet,
            payU: payins.payuEwallet,
            cashfree: payins.cashfreeEwallet,
          },
        },
      },
      payouts: {
        orders: {
          upi: payouts.upi,
          netBanking: payouts.netBanking,
          eWallet: payouts.eWallet,
        },
        distribution: {
          upi: {
            memberChannel: payouts.memberChannelUpi,
            phonepe: payouts.phonepeUpi,
            razorpay: payouts.razorpayUpi,
            uniqpay: payouts.uniqpayUpi,
            payU: payouts.payuUpi,
            cashfree: payins.cashfreeUpi,
          },
          netBanking: {
            memberChannel: payouts.memberChannelBanking,
            phonepe: payouts.phonepeBanking,
            razorpay: payouts.razorpayBanking,
            uniqpay: payouts.uniqpayBanking,
            payU: payouts.payuBanking,
            cashfree: payins.cashfreeBanking,
          },
          eWallet: {
            memberChannel: payouts.memberChannelEWallet,
            phonepe: payouts.phonepeEWallet,
            razorpay: payouts.razorpayEWallet,
            uniqpay: payouts.uniqpayEwallet,
            payU: payouts.payuEwallet,
            cashfree: payins.cashfreeEwallet,
          },
        },
      },
    };
  }

  async getUpiAnalytics(body: FiltersDto) {
    const { startDate, endDate, mode } = body;

    const parsedStartDate = new Date(parseStartDate(startDate));
    const parsedEndDate = new Date(parseEndDate(endDate));

    const [payinRows, payinsCount] = await this.payinRepository.findAndCount({
      where: {
        channel: ChannelName.UPI,
        createdAt: Between(parsedStartDate, parsedEndDate),
      },
    });

    const [payoutRows, payoutsCount] = await this.payoutRepository.findAndCount(
      {
        where: {
          channel: ChannelName.UPI,
          createdAt: Between(parsedStartDate, parsedEndDate),
        },
      },
    );

    const [withdrawalRows, withdrawalsCount] =
      await this.withdrawalRepository.findAndCount({
        where: {
          channel: ChannelName.UPI,
          createdAt: Between(parsedStartDate, parsedEndDate),
        },
      });

    const payins = payinRows.reduce(
      (prev, curr) => {
        if (curr.status === OrderStatus.COMPLETE) {
          prev.completed++;
          prev.totalCompleted += curr.amount;
        }
        if (curr.status === OrderStatus.FAILED) {
          prev.failed++;
          prev.totalFailed += curr.amount;
        }
        if (curr.status === OrderStatus.ASSIGNED) {
          prev.assigned++;
          prev.totalPending += curr.amount;
        }
        if (curr.status === OrderStatus.SUBMITTED) {
          prev.submitted++;
          prev.totalPending += curr.amount;
        }
        if (curr.status === OrderStatus.INITIATED) {
          prev.initiated++;
          prev.totalPending += curr.amount;
        }
        return prev;
      },
      {
        totalCompleted: 0,
        totalFailed: 0,
        totalPending: 0,
        initiated: 0,
        assigned: 0,
        submitted: 0,
        completed: 0,
        failed: 0,
      },
    );

    const payouts = payoutRows.reduce(
      (prev, curr) => {
        if (curr.status === OrderStatus.COMPLETE) {
          prev.completed++;
          prev.totalCompleted += curr.amount;
        }
        if (curr.status === OrderStatus.FAILED) {
          prev.failed++;
          prev.totalFailed += curr.amount;
        }
        if (curr.status === OrderStatus.ASSIGNED) {
          prev.assigned++;
          prev.totalPending += curr.amount;
        }
        if (curr.status === OrderStatus.SUBMITTED) {
          prev.submitted++;
          prev.totalPending += curr.amount;
        }
        if (curr.status === OrderStatus.INITIATED) {
          prev.initiated++;
          prev.totalPending += curr.amount;
        }
        return prev;
      },
      {
        totalCompleted: 0,
        totalFailed: 0,
        totalPending: 0,
        initiated: 0,
        assigned: 0,
        submitted: 0,
        completed: 0,
        failed: 0,
      },
    );

    const withdrawals = withdrawalRows.reduce(
      (prev, curr) => {
        if (curr.status === WithdrawalOrderStatus.COMPLETE) {
          prev.completed++;
          prev.totalCompleted += curr.amount;
        }
        if (curr.status === WithdrawalOrderStatus.FAILED) {
          prev.failed++;
          prev.totalFailed += curr.amount;
        }
        if (curr.status === WithdrawalOrderStatus.REJECTED) {
          prev.rejected++;
        }
        if (curr.status === WithdrawalOrderStatus.PENDING) {
          prev.pending++;
          prev.totalPending += curr.amount;
        }

        return prev;
      },
      {
        totalCompleted: 0,
        totalFailed: 0,
        totalPending: 0,
        pending: 0,
        rejected: 0,
        completed: 0,
        failed: 0,
      },
    );

    return {
      payins: {
        orders: {
          total: payinsCount,
          totalCompleted: payins.totalCompleted,
          totalFailed: payins.totalFailed,
          totalPending: payins.totalPending,
        },
        distribution: {
          initiated: payins.initiated,
          assigned: payins.assigned,
          submitted: payins.submitted,
          completed: payins.completed,
          failed: payins.failed,
        },
      },
      payouts: {
        orders: {
          total: payoutsCount,
          totalCompleted: payouts.totalCompleted,
          totalFailed: payouts.totalFailed,
          totalPending: payouts.totalPending,
        },
        distribution: {
          initiated: payouts.initiated,
          assigned: payouts.assigned,
          submitted: payouts.assigned,
          completed: payouts.completed,
          failed: payouts.failed,
        },
      },
      withdrawals: {
        orders: {
          total: withdrawalsCount,
          totalCompleted: withdrawals.totalCompleted,
          totalFailed: withdrawals.totalFailed,
          totalPending: withdrawals.totalPending,
        },
        distribution: {
          pending: withdrawals.pending,
          rejected: withdrawals.rejected,
          completed: withdrawals.completed,
          failed: withdrawals.failed,
        },
      },
    };
  }

  async getNetBankingAnalytics(body: FiltersDto) {
    const { startDate, endDate, mode } = body;

    const parsedStartDate = new Date(parseStartDate(startDate));
    const parsedEndDate = new Date(parseEndDate(endDate));

    const [payinRows, payinsCount] = await this.payinRepository.findAndCount({
      where: {
        channel: ChannelName.BANKING,
        createdAt: Between(parsedStartDate, parsedEndDate),
      },
    });

    const [payoutRows, payoutsCount] = await this.payoutRepository.findAndCount(
      {
        where: {
          channel: ChannelName.BANKING,
          createdAt: Between(parsedStartDate, parsedEndDate),
        },
      },
    );

    const [withdrawalRows, withdrawalsCount] =
      await this.withdrawalRepository.findAndCount({
        where: {
          channel: ChannelName.BANKING,
          createdAt: Between(parsedStartDate, parsedEndDate),
        },
      });

    const payins = payinRows.reduce(
      (prev, curr) => {
        if (curr.status === OrderStatus.COMPLETE) {
          prev.completed++;
          prev.totalCompleted += curr.amount;
        }
        if (curr.status === OrderStatus.FAILED) {
          prev.failed++;
          prev.totalFailed += curr.amount;
        }
        if (curr.status === OrderStatus.ASSIGNED) {
          prev.assigned++;
          prev.totalPending += curr.amount;
        }
        if (curr.status === OrderStatus.SUBMITTED) {
          prev.submitted++;
          prev.totalPending += curr.amount;
        }
        if (curr.status === OrderStatus.INITIATED) {
          prev.initiated++;
          prev.totalPending += curr.amount;
        }
        return prev;
      },
      {
        totalCompleted: 0,
        totalFailed: 0,
        totalPending: 0,
        initiated: 0,
        assigned: 0,
        submitted: 0,
        completed: 0,
        failed: 0,
      },
    );

    const payouts = payoutRows.reduce(
      (prev, curr) => {
        if (curr.status === OrderStatus.COMPLETE) {
          prev.completed++;
          prev.totalCompleted += curr.amount;
        }
        if (curr.status === OrderStatus.FAILED) {
          prev.failed++;
          prev.totalFailed += curr.amount;
        }
        if (curr.status === OrderStatus.ASSIGNED) {
          prev.assigned++;
          prev.totalPending += curr.amount;
        }
        if (curr.status === OrderStatus.SUBMITTED) {
          prev.submitted++;
          prev.totalPending += curr.amount;
        }
        if (curr.status === OrderStatus.INITIATED) {
          prev.initiated++;
          prev.totalPending += curr.amount;
        }
        return prev;
      },
      {
        totalCompleted: 0,
        totalFailed: 0,
        totalPending: 0,
        initiated: 0,
        assigned: 0,
        submitted: 0,
        completed: 0,
        failed: 0,
      },
    );

    const withdrawals = withdrawalRows.reduce(
      (prev, curr) => {
        if (curr.status === WithdrawalOrderStatus.COMPLETE) {
          prev.completed++;
          prev.totalCompleted += curr.amount;
        }
        if (curr.status === WithdrawalOrderStatus.FAILED) {
          prev.failed++;
          prev.totalFailed += curr.amount;
        }
        if (curr.status === WithdrawalOrderStatus.REJECTED) {
          prev.rejected++;
        }
        if (curr.status === WithdrawalOrderStatus.PENDING) {
          prev.pending++;
          prev.totalPending += curr.amount;
        }

        return prev;
      },
      {
        totalCompleted: 0,
        totalFailed: 0,
        totalPending: 0,
        pending: 0,
        rejected: 0,
        completed: 0,
        failed: 0,
      },
    );

    return {
      payins: {
        orders: {
          total: payinsCount,
          totalCompleted: payins.totalCompleted,
          totalFailed: payins.totalFailed,
          totalPending: payins.totalPending,
        },
        distribution: {
          initiated: payins.initiated,
          assigned: payins.assigned,
          submitted: payins.submitted,
          completed: payins.completed,
          failed: payins.failed,
        },
      },
      payouts: {
        orders: {
          total: payoutsCount,
          totalCompleted: payouts.totalCompleted,
          totalFailed: payouts.totalFailed,
          totalPending: payouts.totalPending,
        },
        distribution: {
          initiated: payouts.initiated,
          assigned: payouts.assigned,
          submitted: payouts.assigned,
          completed: payouts.completed,
          failed: payouts.failed,
        },
      },
      withdrawals: {
        orders: {
          total: withdrawalsCount,
          totalCompleted: withdrawals.totalCompleted,
          totalFailed: withdrawals.totalFailed,
          totalPending: withdrawals.totalPending,
        },
        distribution: {
          pending: withdrawals.pending,
          rejected: withdrawals.rejected,
          completed: withdrawals.completed,
          failed: withdrawals.failed,
        },
      },
    };
  }

  async getEWalletAnalytics(body: FiltersDto) {
    const { startDate, endDate, mode } = body;

    const parsedStartDate = new Date(parseStartDate(startDate));
    const parsedEndDate = new Date(parseEndDate(endDate));

    const [payinRows, payinsCount] = await this.payinRepository.findAndCount({
      where: {
        channel: ChannelName.E_WALLET,
        createdAt: Between(parsedStartDate, parsedEndDate),
      },
    });

    const [payoutRows, payoutsCount] = await this.payoutRepository.findAndCount(
      {
        where: {
          channel: ChannelName.E_WALLET,
          createdAt: Between(parsedStartDate, parsedEndDate),
        },
      },
    );

    const [withdrawalRows, withdrawalsCount] =
      await this.withdrawalRepository.findAndCount({
        where: {
          channel: ChannelName.E_WALLET,
          createdAt: Between(parsedStartDate, parsedEndDate),
        },
      });

    const payins = payinRows.reduce(
      (prev, curr) => {
        if (curr.status === OrderStatus.COMPLETE) {
          prev.completed++;
          prev.totalCompleted += curr.amount;
        }
        if (curr.status === OrderStatus.FAILED) {
          prev.failed++;
          prev.totalFailed += curr.amount;
        }
        if (curr.status === OrderStatus.ASSIGNED) {
          prev.assigned++;
          prev.totalPending += curr.amount;
        }
        if (curr.status === OrderStatus.SUBMITTED) {
          prev.submitted++;
          prev.totalPending += curr.amount;
        }
        if (curr.status === OrderStatus.INITIATED) {
          prev.initiated++;
          prev.totalPending += curr.amount;
        }
        return prev;
      },
      {
        totalCompleted: 0,
        totalFailed: 0,
        totalPending: 0,
        initiated: 0,
        assigned: 0,
        submitted: 0,
        completed: 0,
        failed: 0,
      },
    );

    const payouts = payoutRows.reduce(
      (prev, curr) => {
        if (curr.status === OrderStatus.COMPLETE) {
          prev.completed++;
          prev.totalCompleted += curr.amount;
        }
        if (curr.status === OrderStatus.FAILED) {
          prev.failed++;
          prev.totalFailed += curr.amount;
        }
        if (curr.status === OrderStatus.ASSIGNED) {
          prev.assigned++;
          prev.totalPending += curr.amount;
        }
        if (curr.status === OrderStatus.SUBMITTED) {
          prev.submitted++;
          prev.totalPending += curr.amount;
        }
        if (curr.status === OrderStatus.INITIATED) {
          prev.initiated++;
          prev.totalPending += curr.amount;
        }
        return prev;
      },
      {
        totalCompleted: 0,
        totalFailed: 0,
        totalPending: 0,
        initiated: 0,
        assigned: 0,
        submitted: 0,
        completed: 0,
        failed: 0,
      },
    );

    const withdrawals = withdrawalRows.reduce(
      (prev, curr) => {
        if (curr.status === WithdrawalOrderStatus.COMPLETE) {
          prev.completed++;
          prev.totalCompleted += curr.amount;
        }
        if (curr.status === WithdrawalOrderStatus.FAILED) {
          prev.failed++;
          prev.totalFailed += curr.amount;
        }
        if (curr.status === WithdrawalOrderStatus.REJECTED) {
          prev.rejected++;
        }
        if (curr.status === WithdrawalOrderStatus.PENDING) {
          prev.pending++;
          prev.totalPending += curr.amount;
        }

        return prev;
      },
      {
        totalCompleted: 0,
        totalFailed: 0,
        totalPending: 0,
        pending: 0,
        rejected: 0,
        completed: 0,
        failed: 0,
      },
    );

    return {
      payins: {
        orders: {
          total: payinsCount,
          totalCompleted: payins.totalCompleted,
          totalFailed: payins.totalFailed,
          totalPending: payins.totalPending,
        },
        distribution: {
          initiated: payins.initiated,
          assigned: payins.assigned,
          submitted: payins.submitted,
          completed: payins.completed,
          failed: payins.failed,
        },
      },
      payouts: {
        orders: {
          total: payoutsCount,
          totalCompleted: payouts.totalCompleted,
          totalFailed: payouts.totalFailed,
          totalPending: payouts.totalPending,
        },
        distribution: {
          initiated: payouts.initiated,
          assigned: payouts.assigned,
          submitted: payouts.assigned,
          completed: payouts.completed,
          failed: payouts.failed,
        },
      },
      withdrawals: {
        orders: {
          total: withdrawalsCount,
          totalCompleted: withdrawals.totalCompleted,
          totalFailed: withdrawals.totalFailed,
          totalPending: withdrawals.totalPending,
        },
        distribution: {
          pending: withdrawals.pending,
          rejected: withdrawals.rejected,
          completed: withdrawals.completed,
          failed: withdrawals.failed,
        },
      },
    };
  }

  async getBalancesCommissionsAndProfit(body: FiltersDto) {
    const { startDate, endDate, mode } = body;

    const parsedStartDate = new Date(parseStartDate(startDate));
    const parsedEndDate = new Date(parseEndDate(endDate));

    const merchant = await this.merchantRepository.find();
    const merchantBalance = merchant.reduce((prev, curr) => {
      return (prev += curr.balance);
    }, 0);

    const member = await this.memberRepository.find();
    const memberData = member.reduce(
      (prev, curr) => {
        prev.quota += curr.quota;
        prev.balance += curr.balance;
        return prev;
      },
      { balance: 0, quota: 0 },
    );

    const agent = await this.agentRepository.find();
    const agentBalance = agent.reduce((prev, curr) => {
      return (prev += curr.balance);
    }, 0);

    const { systemProfit } = await this.systemConfigService.findLatest();

    const transactionUpdates = await this.transactionUpdateRepository
      .createQueryBuilder('transactionUpdate')
      .where(
        '(transactionUpdate.before != transactionUpdate.after OR transactionUpdate.userType = :gatewayFeeType OR transactionUpdate.userType = :upiVendorCommissionType)',
        {
          gatewayFeeType: UserTypeForTransactionUpdates.GATEWAY_FEE,
          upiVendorCommissionType: UserTypeForTransactionUpdates.UPI_VENDOR_COMMISSION,
        },
      )
      .andWhere('transactionUpdate.pending = false')
      .andWhere('transactionUpdate.createdAt BETWEEN :startDate AND :endDate', {
        startDate: parsedStartDate,
        endDate: parsedEndDate,
      })
      .leftJoinAndSelect('transactionUpdate.payinOrder', 'payinOrder')
      .getMany();

    const transactions = transactionUpdates.reduce(
      (prev, curr) => {
        if (
          curr.userType === UserTypeForTransactionUpdates.MERCHANT_BALANCE &&
          curr.orderType === OrderType.PAYIN
        ) {
          prev.merchantIncome += curr.payinOrder?.amount;
        }

        if (curr.userType === UserTypeForTransactionUpdates.MERCHANT_BALANCE) {
          prev.merchantFees += curr.amount;
        }

        if (curr.userType === UserTypeForTransactionUpdates.MEMBER_QUOTA)
          prev.memberCommissions += curr.amount;

        if (
          curr.userType === UserTypeForTransactionUpdates.MEMBER_BALANCE ||
          curr.userType === UserTypeForTransactionUpdates.AGENT_BALANCE
        )
          prev.agentCommissions += curr.amount;

        if (curr.userType === UserTypeForTransactionUpdates.GATEWAY_FEE)
          prev.gatewayCharge += curr.amount;

        if (curr.userType === UserTypeForTransactionUpdates.UPI_VENDOR_COMMISSION)
          prev.upiVendorCommissions += curr.amount || 0;

        if (curr.userType === UserTypeForTransactionUpdates.SYSTEM_PROFIT)
          prev.systemIncome += curr.amount;

        return prev;
      },
      {
        merchantIncome: 0,
        merchantFees: 0,
        memberCommissions: 0,
        agentCommissions: 0,
        gatewayCharge: 0,
        upiVendorCommissions: 0,
        systemIncome: 0,
      },
    );

    const transactionUpdatesDistinct = await this.transactionUpdateRepository
      .createQueryBuilder('transactionUpdate')
      .leftJoinAndSelect('transactionUpdate.payinOrder', 'payinOrder')
      .leftJoinAndSelect('transactionUpdate.payoutOrder', 'payoutOrder')
      .leftJoinAndSelect('transactionUpdate.withdrawalOrder', 'withdrawalOrder')
      .leftJoinAndSelect('transactionUpdate.topupOrder', 'topupOrder')
      .where('transactionUpdate.before != transactionUpdate.after')
      .andWhere('transactionUpdate.pending = false')
      .andWhere('transactionUpdate.createdAt BETWEEN :startDate AND :endDate', {
        startDate: parsedStartDate,
        endDate: parsedEndDate,
      })
      .distinctOn(['transactionUpdate.systemOrderId'])
      .getMany();

    const graphData = transactionUpdatesDistinct.reduce(
      (prev, curr) => {
        if (curr.orderType === OrderType.PAYIN) {
          if (curr.payinOrder?.payinMadeOn === PaymentMadeOn.MEMBER) {
            switch (curr.payinOrder.channel) {
              case ChannelName.UPI:
                prev.memberChannelUpi++;
                break;
              case ChannelName.BANKING:
                prev.memberChannelBanking++;
                break;
              case ChannelName.E_WALLET:
                prev.memberChannelEWallet++;
                break;
            }
          } else if (curr.payinOrder?.payinMadeOn === PaymentMadeOn.UPI_VENDOR) {
            switch (curr.payinOrder.channel) {
              case ChannelName.UPI:
                prev.upiVendorChannelUpi++;
                break;
              case ChannelName.BANKING:
                prev.upiVendorChannelBanking++;
                break;
              case ChannelName.E_WALLET:
                prev.upiVendorChannelEWallet++;
                break;
            }
          } else {
            if (curr.payinOrder?.gatewayName === GatewayName.RAZORPAY) {
              switch (curr.payinOrder.channel) {
                case ChannelName.UPI:
                  prev.razorpayUpi++;
                  break;
                case ChannelName.BANKING:
                  prev.razorpayBanking++;
                  break;
                case ChannelName.E_WALLET:
                  prev.razorpayEwallet++;
                  break;
              }
            } else if (curr.payinOrder?.gatewayName === GatewayName.PHONEPE) {
              switch (curr.payinOrder.channel) {
                case ChannelName.UPI:
                  prev.phonepeUpi++;
                  break;
                case ChannelName.BANKING:
                  prev.phonepeBanking++;
                  break;
                case ChannelName.E_WALLET:
                  prev.phonepeEwallet++;
                  break;
              }
            } else if (curr.payinOrder?.gatewayName === GatewayName.UNIQPAY) {
              switch (curr.payinOrder.channel) {
                case ChannelName.UPI:
                  prev.uniqpayUpi++;
                  break;
                case ChannelName.BANKING:
                  prev.uniqpayBanking++;
                  break;
                case ChannelName.E_WALLET:
                  prev.uniqpayEwallet++;
                  break;
              }
            } else if (curr.payinOrder?.gatewayName === GatewayName.PAYU) {
              switch (curr.payinOrder.channel) {
                case ChannelName.UPI:
                  prev.payuUpi++;
                  break;
                case ChannelName.BANKING:
                  prev.payuBanking++;
                  break;
                case ChannelName.E_WALLET:
                  prev.payuEwallet++;
                  break;
              }
            } else if (curr.payinOrder?.gatewayName === GatewayName.CASHFREE) {
              switch (curr.payinOrder.channel) {
                case ChannelName.UPI:
                  prev.cashfreeUpi++;
                  break;
                case ChannelName.BANKING:
                  prev.cashfreeBanking++;
                  break;
                case ChannelName.E_WALLET:
                  prev.cashfreeEwallet++;
                  break;
              }
            }
          }
        }

        if (curr.orderType === OrderType.PAYOUT) {
          if (curr.payoutOrder?.payoutMadeVia === PaymentMadeOn.MEMBER) {
            switch (curr.payoutOrder.channel) {
              case ChannelName.UPI:
                prev.memberChannelUpi++;
                break;
              case ChannelName.BANKING:
                prev.memberChannelBanking++;
                break;
              case ChannelName.E_WALLET:
                prev.memberChannelEWallet++;
                break;
            }
          } else {
            if (curr.payoutOrder?.gatewayName === GatewayName.RAZORPAY) {
              switch (curr.payoutOrder.channel) {
                case ChannelName.UPI:
                  prev.razorpayUpi++;
                  break;
                case ChannelName.BANKING:
                  prev.razorpayBanking++;
                  break;
                case ChannelName.E_WALLET:
                  prev.razorpayEwallet++;
                  break;
              }
            } else if (curr.payoutOrder?.gatewayName === GatewayName.PHONEPE) {
              switch (curr.payoutOrder.channel) {
                case ChannelName.UPI:
                  prev.phonepeUpi++;
                  break;
                case ChannelName.BANKING:
                  prev.phonepeBanking++;
                  break;
                case ChannelName.E_WALLET:
                  prev.phonepeEwallet++;
                  break;
              }
            } else if (curr.payoutOrder?.gatewayName === GatewayName.UNIQPAY) {
              switch (curr.payoutOrder.channel) {
                case ChannelName.UPI:
                  prev.uniqpayUpi++;
                  break;
                case ChannelName.BANKING:
                  prev.uniqpayBanking++;
                  break;
                case ChannelName.E_WALLET:
                  prev.uniqpayEwallet++;
                  break;
              }
            } else if (curr.payoutOrder?.gatewayName === GatewayName.PAYU) {
              switch (curr.payoutOrder.channel) {
                case ChannelName.UPI:
                  prev.payuUpi++;
                  break;
                case ChannelName.BANKING:
                  prev.payuBanking++;
                  break;
                case ChannelName.E_WALLET:
                  prev.payuEwallet++;
                  break;
              }
            } else if (curr.payoutOrder?.gatewayName === GatewayName.CASHFREE) {
              switch (curr.payoutOrder.channel) {
                case ChannelName.UPI:
                  prev.cashfreeUpi++;
                  break;
                case ChannelName.BANKING:
                  prev.cashfreeBanking++;
                  break;
                case ChannelName.E_WALLET:
                  prev.cashfreeEwallet++;
                  break;
              }
            }
          }
        }

        if (curr.orderType === OrderType.WITHDRAWAL) {
          if (
            curr.withdrawalOrder.withdrawalMadeOn === WithdrawalMadeOn.ADMIN
          ) {
            switch (curr.withdrawalOrder.channel) {
              case ChannelName.UPI:
                prev.memberChannelUpi++;
                break;
              case ChannelName.BANKING:
                prev.memberChannelBanking++;
                break;
              case ChannelName.E_WALLET:
                prev.memberChannelEWallet++;
                break;
            }
          } else {
            if (curr.withdrawalOrder?.gatewayName === GatewayName.RAZORPAY) {
              switch (curr.withdrawalOrder.channel) {
                case ChannelName.UPI:
                  prev.razorpayUpi++;
                  break;
                case ChannelName.BANKING:
                  prev.razorpayBanking++;
                  break;
                case ChannelName.E_WALLET:
                  prev.razorpayEwallet++;
                  break;
              }
            } else if (
              curr.withdrawalOrder?.gatewayName === GatewayName.PHONEPE
            ) {
              switch (curr.withdrawalOrder.channel) {
                case ChannelName.UPI:
                  prev.phonepeUpi++;
                  break;
                case ChannelName.BANKING:
                  prev.phonepeBanking++;
                  break;
                case ChannelName.E_WALLET:
                  prev.phonepeEwallet++;
                  break;
              }
            } else if (
              curr.withdrawalOrder?.gatewayName === GatewayName.UNIQPAY
            ) {
              switch (curr.withdrawalOrder.channel) {
                case ChannelName.UPI:
                  prev.uniqpayUpi++;
                  break;
                case ChannelName.BANKING:
                  prev.uniqpayBanking++;
                  break;
                case ChannelName.E_WALLET:
                  prev.uniqpayEwallet++;
                  break;
              }
            } else if (curr.withdrawalOrder?.gatewayName === GatewayName.PAYU) {
              switch (curr.withdrawalOrder.channel) {
                case ChannelName.UPI:
                  prev.payuUpi++;
                  break;
                case ChannelName.BANKING:
                  prev.payuBanking++;
                  break;
                case ChannelName.E_WALLET:
                  prev.payuEwallet++;
                  break;
              }
            }
          }
        }

        // if (curr.orderType === OrderType.TOPUP) {
        //   switch (curr.topupOrder.channel) {
        //     case ChannelName.UPI:
        //       prev.razorpayUpi++;
        //       break;
        //     case ChannelName.BANKING:
        //       prev.razorpayBanking++;
        //       break;
        //     case ChannelName.E_WALLET:
        //       prev.razorpayEwallet++;
        //       break;
        //   }
        // }

        return prev;
      },
      {
        memberChannelUpi: 0,
        memberChannelBanking: 0,
        memberChannelEWallet: 0,
        upiVendorChannelUpi: 0,
        upiVendorChannelBanking: 0,
        upiVendorChannelEWallet: 0,
        razorpayUpi: 0,
        razorpayBanking: 0,
        razorpayEwallet: 0,
        phonepeUpi: 0,
        phonepeBanking: 0,
        phonepeEwallet: 0,
        uniqpayUpi: 0,
        uniqpayBanking: 0,
        uniqpayEwallet: 0,
        payuUpi: 0,
        payuBanking: 0,
        payuEwallet: 0,
        cashfreeUpi: 0,
        cashfreeBanking: 0,
        cashfreeEwallet: 0,
      },
    );

    return {
      balances: {
        merchantBalance: roundOffAmount(merchantBalance),
        memberQuota: roundOffAmount(memberData.quota),
        agentBalance: roundOffAmount(agentBalance + memberData.balance),
        systemBalance: roundOffAmount(systemProfit),
      },
      commissions: {
        merchantIncome: roundOffAmount(
          transactions.merchantIncome - transactions.merchantFees,
        ),
        merchantFees: roundOffAmount(transactions.merchantFees),
        memberCommissions: roundOffAmount(transactions.memberCommissions),
        agentCommissions: roundOffAmount(transactions.agentCommissions),
        gatewayCharge: roundOffAmount(transactions.gatewayCharge),
        upiVendorCommissions: roundOffAmount(transactions.upiVendorCommissions),
        systemIncome: roundOffAmount(transactions.systemIncome),
      },
      graphData: {
        memberChannel: {
          upi: graphData.memberChannelUpi,
          netBanking: graphData.memberChannelBanking,
          eWallet: graphData.memberChannelEWallet,
        },
        upiVendorChannel: {
          upi: graphData.upiVendorChannelUpi,
          netBanking: graphData.upiVendorChannelBanking,
          eWallet: graphData.upiVendorChannelEWallet,
        },
        razorpay: {
          upi: graphData.razorpayUpi,
          netBanking: graphData.razorpayBanking,
          eWallet: graphData.razorpayEwallet,
        },
        phonepe: {
          upi: graphData.phonepeUpi,
          netBanking: graphData.phonepeBanking,
          eWallet: graphData.phonepeEwallet,
        },
        uniqpay: {
          upi: graphData.uniqpayUpi,
          netBanking: graphData.uniqpayBanking,
          eWallet: graphData.payuEwallet,
        },
        payU: {
          upi: graphData.payuUpi,
          netBanking: graphData.payuBanking,
          eWallet: graphData.payuEwallet,
        },
        cashfree: {
          upi: graphData.cashfreeUpi,
          netBanking: graphData.cashfreeBanking,
          eWallet: graphData.cashfreeEwallet,
        },
      },
    };
  }

  async getPayinAnalytics(body: FiltersDto) {
    const { startDate, endDate, mode, merchantId } = body;

    const parsedStartDate = new Date(parseStartDate(startDate));
    const parsedEndDate = new Date(parseEndDate(endDate));

    const whereConditions: any = {};

    if (parsedStartDate && parsedEndDate)
      whereConditions.createdAt = Between(parsedStartDate, parsedEndDate);

    if (merchantId) whereConditions.merchant = { id: merchantId };

    const [payinRows, payinsCount] = await this.payinRepository.findAndCount({
      where: whereConditions,
      relations: ['merchant', 'transactionUpdate'],
    });

    const payins = payinRows.reduce(
      (prev, curr) => {
        if (curr.status === OrderStatus.COMPLETE) {
          prev.completed++;
          prev.totalCompleted += curr.amount;

          curr.transactionUpdate
            .filter(
              (el) =>
                el.userType === UserTypeForTransactionUpdates.MERCHANT_BALANCE,
            )
            .forEach((row) => {
              prev.serviceFee += row.amount;
            });
        }
        if (curr.status === OrderStatus.FAILED) {
          prev.failed++;
          prev.totalFailed += curr.amount;
        }
        if (curr.status === OrderStatus.ASSIGNED) {
          prev.assigned++;
          prev.totalPending += curr.amount;
        }
        if (curr.status === OrderStatus.SUBMITTED) {
          prev.submitted++;
          prev.totalPending += curr.amount;
        }
        if (curr.status === OrderStatus.INITIATED) {
          prev.initiated++;
          prev.totalPending += curr.amount;
        }
        return prev;
      },
      {
        totalCompleted: 0,
        totalFailed: 0,
        totalPending: 0,
        initiated: 0,
        assigned: 0,
        submitted: 0,
        completed: 0,
        failed: 0,
        serviceFee: 0,
      },
    );

    const currentMonthIndex = moment().month();
    const monthsOfYear = monthNames();
    const monthlyCommissions = [];

    // Initialize the monthly commissions for the last 5 months including the current month
    for (let i = 0; i < 5; i++) {
      const monthIndex = (currentMonthIndex - i + 12) % 12;
      monthlyCommissions.push({
        date: monthsOfYear[monthIndex],
        Orders: 0,
      });
    }

    payinRows.forEach((transaction) => {
      const month = moment(transaction.createdAt).month();

      if (
        month >= (currentMonthIndex - 4 + 12) % 12 &&
        month <= currentMonthIndex
      ) {
        const indexInCommissions = (currentMonthIndex - month + 12) % 12;

        if (
          indexInCommissions >= 0 &&
          indexInCommissions < monthlyCommissions.length
        ) {
          monthlyCommissions[indexInCommissions].Orders += 1;
        }
      }
    });

    return {
      orders: {
        total: payinsCount,
        totalFailed: roundOffAmount(payins.totalFailed),
        totalPending: roundOffAmount(payins.totalPending),
        totalCompleted: roundOffAmount(payins.totalCompleted),
        totalServiceFee: roundOffAmount(payins.serviceFee),
        successRate: roundOffAmount((payins.completed / payinsCount) * 100),
      },
      pieChartData: {
        initiated: payins.initiated,
        assigned: payins.assigned,
        submitted: payins.submitted,
        completed: payins.completed,
        failed: payins.failed,
      },
      lineChartData: monthlyCommissions.reverse(),
    };
  }

  async getPayoutAnalytics(body: FiltersDto) {
    const { startDate, endDate, mode, merchantId } = body;

    const parsedStartDate = new Date(parseStartDate(startDate));
    const parsedEndDate = new Date(parseEndDate(endDate));

    const whereConditions: any = {};

    if (parsedStartDate && parsedEndDate)
      whereConditions.createdAt = Between(parsedStartDate, parsedEndDate);

    if (merchantId) whereConditions.merchant = { id: merchantId };

    const [payoutRows, payoutsCount] = await this.payoutRepository.findAndCount(
      {
        where: whereConditions,
        relations: ['merchant', 'transactionUpdate'],
      },
    );

    const payouts = payoutRows.reduce(
      (prev, curr) => {
        if (curr.status === OrderStatus.COMPLETE) {
          prev.completed++;
          prev.totalCompleted += curr.amount;

          curr.transactionUpdate
            .filter(
              (el) =>
                el.userType === UserTypeForTransactionUpdates.MERCHANT_BALANCE,
            )
            .forEach((row) => {
              prev.serviceFee += row.amount;
            });
        }
        if (curr.status === OrderStatus.FAILED) {
          prev.failed++;
          prev.totalFailed += curr.amount;
        }
        if (curr.status === OrderStatus.ASSIGNED) {
          prev.assigned++;
          prev.totalPending += curr.amount;
        }
        if (curr.status === OrderStatus.SUBMITTED) {
          prev.submitted++;
          prev.totalPending += curr.amount;
        }
        if (curr.status === OrderStatus.INITIATED) {
          prev.initiated++;
          prev.totalPending += curr.amount;
        }

        return prev;
      },
      {
        totalCompleted: 0,
        totalFailed: 0,
        totalPending: 0,
        initiated: 0,
        assigned: 0,
        submitted: 0,
        completed: 0,
        failed: 0,
        serviceFee: 0,
      },
    );

    const currentMonthIndex = moment().month();
    const monthsOfYear = monthNames();
    const monthlyCommissions = [];

    // Initialize the monthly commissions for the last 5 months including the current month
    for (let i = 0; i < 5; i++) {
      const monthIndex = (currentMonthIndex - i + 12) % 12;
      monthlyCommissions.push({
        date: monthsOfYear[monthIndex],
        Orders: 0,
      });
    }

    payoutRows.forEach((transaction) => {
      const month = moment(transaction.createdAt).month();

      if (
        month >= (currentMonthIndex - 4 + 12) % 12 &&
        month <= currentMonthIndex
      ) {
        const indexInCommissions = (currentMonthIndex - month + 12) % 12;

        if (
          indexInCommissions >= 0 &&
          indexInCommissions < monthlyCommissions.length
        ) {
          monthlyCommissions[indexInCommissions].Orders += 1;
        }
      }
    });

    return {
      orders: {
        total: payoutsCount,
        totalFailed: roundOffAmount(payouts.totalFailed),
        totalPending: roundOffAmount(payouts.totalPending),
        totalCompleted: roundOffAmount(payouts.totalCompleted),
        totalServiceFee: roundOffAmount(payouts.serviceFee),
        successRate: roundOffAmount((payouts.completed / payoutsCount) * 100),
      },
      pieChartData: {
        initiated: payouts.initiated,
        assigned: payouts.assigned,
        submitted: payouts.submitted,
        completed: payouts.completed,
        failed: payouts.failed,
      },
      lineChartData: monthlyCommissions.reverse(),
    };
  }

  async getWithdrawalAnalytics(body: FiltersDto) {
    const { startDate, endDate, mode } = body;

    const parsedStartDate = new Date(parseStartDate(startDate));
    const parsedEndDate = new Date(parseEndDate(endDate));

    const [withdrawalRows, withdrawalsCount] =
      await this.withdrawalRepository.findAndCount({
        where: {
          createdAt: Between(parsedStartDate, parsedEndDate),
        },
      });

    const withdrawals = withdrawalRows.reduce(
      (prev, curr) => {
        if (curr.status === WithdrawalOrderStatus.COMPLETE) {
          prev.completed++;
          prev.totalCompleted += curr.amount;
        }
        if (curr.status === WithdrawalOrderStatus.FAILED) {
          prev.failed++;
          prev.totalFailed += curr.amount;
        }
        if (curr.status === WithdrawalOrderStatus.REJECTED) prev.rejected++;

        if (curr.status === WithdrawalOrderStatus.PENDING) {
          prev.pending++;
          prev.totalPending += curr.amount;
        }
        return prev;
      },
      {
        totalCompleted: 0,
        totalFailed: 0,
        totalPending: 0,
        pending: 0,
        rejected: 0,
        completed: 0,
        failed: 0,
      },
    );

    const currentMonthIndex = moment().month();
    const monthsOfYear = monthNames();
    const monthlyCommissions = [];

    // Initialize the monthly commissions for the last 5 months including the current month
    for (let i = 0; i < 5; i++) {
      const monthIndex = (currentMonthIndex - i + 12) % 12;
      monthlyCommissions.push({
        date: monthsOfYear[monthIndex],
        Orders: 0,
      });
    }

    withdrawalRows.forEach((transaction) => {
      const month = moment(transaction.createdAt).month();

      if (
        month >= (currentMonthIndex - 4 + 12) % 12 &&
        month <= currentMonthIndex
      ) {
        const indexInCommissions = (currentMonthIndex - month + 12) % 12;

        if (
          indexInCommissions >= 0 &&
          indexInCommissions < monthlyCommissions.length
        ) {
          monthlyCommissions[indexInCommissions].Orders += 1;
        }
      }
    });

    return {
      orders: {
        total: withdrawalsCount,
        totalFailed: roundOffAmount(withdrawals.totalFailed),
        totalPending: roundOffAmount(withdrawals.totalPending),
        totalCompleted: roundOffAmount(withdrawals.totalCompleted),
      },
      pieChartData: {
        pending: withdrawals.pending,
        rejected: withdrawals.rejected,
        completed: withdrawals.completed,
        failed: withdrawals.failed,
      },
      lineChartData: monthlyCommissions.reverse(),
    };
  }

  async getTopupAnalytics(body: FiltersDto) {
    const { startDate, endDate, mode } = body;

    const parsedStartDate = new Date(parseStartDate(startDate));
    const parsedEndDate = new Date(parseEndDate(endDate));

    const [topupRows, topupsCount] = await this.topupRepository.findAndCount({
      where: {
        createdAt: Between(parsedStartDate, parsedEndDate),
      },
    });

    const topups = topupRows.reduce(
      (prev, curr) => {
        if (curr.status === OrderStatus.COMPLETE) {
          prev.totalCompleted += curr.amount;
          ++prev.total;
        }

        if (curr.status === OrderStatus.FAILED) prev.totalFailed += curr.amount;

        if (
          curr.status !== OrderStatus.COMPLETE &&
          curr.status !== OrderStatus.FAILED
        )
          prev.totalPending += curr.amount;

        return prev;
      },
      {
        total: 0,
        totalCompleted: 0,
        totalFailed: 0,
        totalPending: 0,
      },
    );

    const currentMonthIndex = moment().month();
    const monthsOfYear = monthNames();
    const monthlyCommissions = [];

    // Initialize the monthly commissions for the last 5 months including the current month
    for (let i = 0; i < 5; i++) {
      const monthIndex = (currentMonthIndex - i + 12) % 12;
      monthlyCommissions.push({
        date: monthsOfYear[monthIndex],
        Orders: 0,
      });
    }

    topupRows.forEach((transaction) => {
      const month = moment(transaction.createdAt).month();

      if (
        month >= (currentMonthIndex - 4 + 12) % 12 &&
        month <= currentMonthIndex
      ) {
        const indexInCommissions = (currentMonthIndex - month + 12) % 12;

        if (
          indexInCommissions >= 0 &&
          indexInCommissions < monthlyCommissions.length
        ) {
          monthlyCommissions[indexInCommissions].Orders += 1;
        }
      }
    });

    return {
      orders: {
        total: topups.total,
        totalFailed: roundOffAmount(topups.totalFailed),
        totalPending: roundOffAmount(topups.totalPending),
        totalCompleted: roundOffAmount(topups.totalCompleted),
      },

      lineChartData: monthlyCommissions.reverse(),
    };
  }

  async getGatewayUpiVendorChannelAnalytics(body: FiltersDto) {
    const { startDate, endDate } = body;

    const parsedStartDate = new Date(parseStartDate(startDate));
    const parsedEndDate = new Date(parseEndDate(endDate));

    // Get all payin orders for UPI vendor gateway
    const [payinRows, payinsCount] = await this.payinRepository.findAndCount({
      where: {
        payinMadeOn: PaymentMadeOn.UPI_VENDOR,
        createdAt: Between(parsedStartDate, parsedEndDate),
      },
      relations: ['upiVendor'],
    });

    // Calculate payin statistics
    const payins = payinRows.reduce(
      (prev, curr) => {
        if (curr.status === OrderStatus.COMPLETE) {
          prev.completedAmount += curr.amount;
          prev.completed++;
        }
        if (curr.status === OrderStatus.FAILED) {
          prev.failedAmount += curr.amount;
          prev.failed++;
        }
        if (curr.status === OrderStatus.ASSIGNED) {
          prev.pendingAmount += curr.amount;
          prev.assigned++;
        }
        if (curr.status === OrderStatus.SUBMITTED) {
          prev.pendingAmount += curr.amount;
          prev.submitted++;
        }

        return prev;
      },
      {
        completedAmount: 0,
        failedAmount: 0,
        pendingAmount: 0,
        assigned: 0,
        submitted: 0,
        completed: 0,
        failed: 0,
      },
    );

    // Get commission data from transaction updates
    const commissionRows = await this.transactionUpdateRepository.find({
      where: {
        userType: UserTypeForTransactionUpdates.UPI_VENDOR_COMMISSION,
        createdAt: Between(parsedStartDate, parsedEndDate),
      },
    });

    const totalCommission = commissionRows.reduce((sum, curr) => {
      return sum + curr.amount;
    }, 0);

    // Get all UPI vendors with their UPI IDs
    const upiVendors = await this.upiVendorRepository.find({
      relations: ['identity', 'identity.upi'],
    });

    const upiVendorStats = upiVendors.map((vendor) => {
      const upiIds = vendor.identity.upi.filter((upi) => upi.isUpiVendor);
      const totalSettlement = upiIds.reduce(
        (sum, upi) => sum + (upi.settlementAmount || 0),
        0,
      );

      // Count payin orders for this vendor
      const vendorPayins = payinRows.filter(
        (payin) => payin.upiVendor?.id === vendor.id,
      );

      return {
        vendorId: vendor.id,
        vendorName: `${vendor.firstName} ${vendor.lastName}`,
        upiCount: upiIds.length,
        settlementAmount: roundOffAmount(totalSettlement),
        ordersCount: vendorPayins.length,
        enabled: vendor.enabled,
      };
    });

    return {
      payins: {
        orders: {
          total: payinsCount,
          totalCompleted: roundOffAmount(payins.completedAmount),
          totalFailed: roundOffAmount(payins.failedAmount),
          totalPending: roundOffAmount(payins.pendingAmount),
        },
        distribution: {
          assigned: payins.assigned,
          submitted: payins.submitted,
          completed: payins.completed,
          failed: payins.failed,
        },
      },
      commission: {
        total: roundOffAmount(totalCommission),
      },
      vendors: upiVendorStats,
      summary: {
        totalVendors: upiVendors.length,
        activeVendors: upiVendors.filter((v) => v.enabled).length,
        totalUpiIds: upiVendorStats.reduce((sum, v) => sum + v.upiCount, 0),
        totalSettlement: roundOffAmount(
          upiVendorStats.reduce((sum, v) => sum + v.settlementAmount, 0),
        ),
      },
    };
  }

  async getUpiVendorAnalytics(body: FiltersDto) {
    const { startDate, endDate } = body;

    const parsedStartDate = new Date(parseStartDate(startDate));
    const parsedEndDate = new Date(parseEndDate(endDate));

    // Get payin orders for UPI vendor
    const [payinRows, payinsCount] = await this.payinRepository.findAndCount({
      where: {
        payinMadeOn: PaymentMadeOn.UPI_VENDOR,
        createdAt: Between(parsedStartDate, parsedEndDate),
      },
      relations: ['upiVendor'],
    });

    // Calculate payin statistics
    const payins = payinRows.reduce(
      (prev, curr) => {
        if (curr.status === OrderStatus.COMPLETE) {
          prev.completed++;
          prev.totalCompleted += curr.amount;
        }
        if (curr.status === OrderStatus.FAILED) {
          prev.failed++;
          prev.totalFailed += curr.amount;
        }
        if (curr.status === OrderStatus.ASSIGNED) {
          prev.assigned++;
          prev.totalPending += curr.amount;
        }
        if (curr.status === OrderStatus.SUBMITTED) {
          prev.submitted++;
          prev.totalPending += curr.amount;
        }
        prev.total++;

        return prev;
      },
      {
        totalCompleted: 0,
        totalFailed: 0,
        totalPending: 0,
        assigned: 0,
        submitted: 0,
        completed: 0,
        failed: 0,
        total: 0,
      },
    );

    // Get commission data from transaction updates
    const commissionRows = await this.transactionUpdateRepository.find({
      where: {
        userType: UserTypeForTransactionUpdates.UPI_VENDOR_COMMISSION,
        createdAt: Between(parsedStartDate, parsedEndDate),
      },
    });

    const totalCommission = commissionRows.reduce((sum, curr) => {
      return sum + curr.amount;
    }, 0);

    // Monthly data for commissions and orders (last 5 months)
    const currentMonthIndex = moment().month();
    const monthsOfYear = monthNames();
    const monthlyData = [];

    for (let i = 4; i >= 0; i--) {
      const monthIndex = (currentMonthIndex - i + 12) % 12;
      monthlyData.push({
        month: monthsOfYear[monthIndex],
        Orders: 0,
        Commission: 0,
      });
    }

    payinRows.forEach((payin) => {
      const month = moment(payin.createdAt).month();

      for (let i = 0; i < 5; i++) {
        const monthIndex = (currentMonthIndex - i + 12) % 12;
        if (month === monthIndex) {
          monthlyData[4 - i].Orders += 1;
          break;
        }
      }
    });

    commissionRows.forEach((commission) => {
      const month = moment(commission.createdAt).month();

      for (let i = 0; i < 5; i++) {
        const monthIndex = (currentMonthIndex - i + 12) % 12;
        if (month === monthIndex) {
          monthlyData[4 - i].Commission += commission.amount;
          break;
        }
      }
    });

    // Round commission values
    monthlyData.forEach((data) => {
      data.Commission = roundOffAmount(data.Commission);
    });

    // Get all UPI vendors stats
    const upiVendors = await this.upiVendorRepository.find({
      relations: ['identity', 'identity.upi'],
    });

    const vendorStats = upiVendors.map((vendor) => {
      const upiIds = vendor.identity.upi.filter((upi) => upi.isUpiVendor);
      const totalSettlement = upiIds.reduce(
        (sum, upi) => sum + (upi.settlementAmount || 0),
        0,
      );

      const vendorPayins = payinRows.filter(
        (payin) => payin.upiVendor?.id === vendor.id,
      );
      const vendorCommissions = commissionRows.filter((comm) => {
        // Check if commission belongs to this vendor's orders
        const payin = payinRows.find(
          (p) => p.systemOrderId === comm.systemOrderId,
        );
        return payin?.upiVendor?.id === vendor.id;
      });

      const vendorTotalCommission = vendorCommissions.reduce(
        (sum, comm) => sum + comm.amount,
        0,
      );

      return {
        vendorId: vendor.id,
        vendorName: `${vendor.firstName} ${vendor.lastName}`,
        upiCount: upiIds.length,
        settlementAmount: roundOffAmount(totalSettlement),
        ordersCount: vendorPayins.length,
        totalCommission: roundOffAmount(vendorTotalCommission),
        enabled: vendor.enabled,
      };
    });

    return {
      orders: {
        total: payins.total,
        totalFailed: roundOffAmount(payins.totalFailed),
        totalPending: roundOffAmount(payins.totalPending),
        totalCompleted: roundOffAmount(payins.totalCompleted),
      },
      distribution: {
        assigned: payins.assigned,
        submitted: payins.submitted,
        completed: payins.completed,
        failed: payins.failed,
      },
      commission: {
        total: roundOffAmount(totalCommission),
      },
      vendors: vendorStats,
      summary: {
        totalVendors: upiVendors.length,
        activeVendors: upiVendors.filter((v) => v.enabled).length,
        totalUpiIds: vendorStats.reduce((sum, v) => sum + v.upiCount, 0),
        totalSettlement: roundOffAmount(
          vendorStats.reduce((sum, v) => sum + v.settlementAmount, 0),
        ),
      },
      lineChartData: monthlyData,
    };
  }

  async getSettlementAnalytics(body: FiltersDto) {
    const { startDate, endDate, upiVendorId } = body;

    const parsedStartDate = new Date(parseStartDate(startDate));
    const parsedEndDate = new Date(parseEndDate(endDate));

    const whereConditions: any = {};

    if (parsedStartDate && parsedEndDate)
      whereConditions.createdAt = Between(parsedStartDate, parsedEndDate);

    if (upiVendorId) whereConditions.upiVendor = { id: upiVendorId };

    const [settlementRows, settlementsCount] =
      await this.settlementRepository.findAndCount({
        where: whereConditions,
        relations: ['upiVendor', 'upi'],
      });

    const settlements = settlementRows.reduce(
      (prev, curr) => {
        if (curr.status === OrderStatus.COMPLETE) {
          prev.completed++;
          prev.totalCompleted += curr.paidAmount;
        }
        if (curr.status === OrderStatus.FAILED) {
          prev.failed++;
          prev.totalFailed += curr.paidAmount;
        }
        if (curr.status === OrderStatus.SUBMITTED) {
          prev.submitted++;
          prev.totalPending += curr.paidAmount;
        }
        if (curr.status === OrderStatus.INITIATED) {
          prev.initiated++;
          prev.totalPending += curr.paidAmount;
        }
        return prev;
      },
      {
        totalCompleted: 0,
        totalFailed: 0,
        totalPending: 0,
        initiated: 0,
        submitted: 0,
        completed: 0,
        failed: 0,
      },
    );

    const currentMonthIndex = moment().month();
    const monthsOfYear = monthNames();
    const monthlySettlements = [];

    // Initialize the monthly settlements for the last 5 months including the current month
    for (let i = 0; i < 5; i++) {
      const monthIndex = (currentMonthIndex - i + 12) % 12;
      monthlySettlements.push({
        date: monthsOfYear[monthIndex],
        Orders: 0,
      });
    }

    settlementRows.forEach((transaction) => {
      const month = moment(transaction.createdAt).month();

      if (
        month >= (currentMonthIndex - 4 + 12) % 12 &&
        month <= currentMonthIndex
      ) {
        const indexInCommissions = (currentMonthIndex - month + 12) % 12;

        if (
          indexInCommissions >= 0 &&
          indexInCommissions < monthlySettlements.length
        ) {
          monthlySettlements[indexInCommissions].Orders += 1;
        }
      }
    });

    return {
      orders: {
        total: settlementsCount,
        totalFailed: roundOffAmount(settlements.totalFailed),
        totalPending: roundOffAmount(settlements.totalPending),
        totalCompleted: roundOffAmount(settlements.totalCompleted),
        successRate:
          settlementsCount > 0
            ? roundOffAmount((settlements.completed / settlementsCount) * 100)
            : 0,
      },
      pieChartData: {
        initiated: settlements.initiated,
        submitted: settlements.submitted,
        completed: settlements.completed,
        failed: settlements.failed,
      },
      lineChartData: monthlySettlements.reverse(),
    };
  }
}
