import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

import { Member } from 'src/member/entities/member.entity';
import { Phonepe } from './../gateway/entities/phonepe.entity';
import { Razorpay } from 'src/gateway/entities/razorpay.entity';
import { Merchant } from 'src/merchant/entities/merchant.entity';
import { ChannelSettings } from 'src/gateway/entities/channel-settings.entity';
import { AmountRangePayinMode } from 'src/merchant/entities/amountRangePayinMode.entity';
import { ProportionalPayinMode } from 'src/merchant/entities/proportionalPayinMode.entity';

import { SystemConfigService } from 'src/system-config/system-config.service';
import {
  ChannelName,
  GatewayName,
  OrderStatus,
  PaymentMadeOn,
  PaymentType,
} from 'src/utils/enum/enum';
import { Payin } from 'src/payin/entities/payin.entity';
import { PayinService } from 'src/payin/payin.service';
import { GetPayPageDto } from './dto/getPayPage.dto';
import { MemberChannelService } from './member/member-channel.service';
import { PhonepeService } from './phonepe/phonepe.service';
import { RazorpayService } from './razorpay/razorpay.service';
import { PayinGateway } from 'src/socket/payin.gateway';
import { PayinSandbox } from 'src/payin/entities/payin-sandbox.entity';
import { Uniqpay } from 'src/gateway/entities/uniqpay.entity';
import { PayuService } from './payu/payu.service';
import { Payu } from 'src/gateway/entities/payu.entity';
import { CashfreeService } from './cashfree/cashfree.service';
import { Cashfree } from 'src/gateway/entities/cashfree.entity';
import { getPreferredGatewayForDefaultMode } from 'src/utils/utils';
import { UpiVendorChannelService } from './upi-vendor/upi-vendor-channel.service';
import { Doku } from 'src/gateway/entities/doku.entity';
import { Midtrans } from 'src/gateway/entities/midtrans.entity';
import { Xendit } from 'src/gateway/entities/xendit.entity';
import { DokuService } from './doku/doku.service';
import { MidtransService } from './midtrans/midtrans.service';
import { XenditService } from './xendit/xendit.service';

@Injectable()
export class PaymentSystemUtilService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(Phonepe)
    private readonly phonePeRepository: Repository<Phonepe>,
    @InjectRepository(Razorpay)
    private readonly razorpayRepository: Repository<Razorpay>,
    @InjectRepository(Uniqpay)
    private readonly uniqpayRepository: Repository<Uniqpay>,
    @InjectRepository(Cashfree)
    private readonly cashfreeRepository: Repository<Cashfree>,
    @InjectRepository(Payu)
    private readonly payuRepository: Repository<Payu>,
    @InjectRepository(Doku)
    private readonly dokuRepository: Repository<Doku>,
    @InjectRepository(Midtrans)
    private readonly midtransRepository: Repository<Midtrans>,
    @InjectRepository(Xendit)
    private readonly xenditRepository: Repository<Xendit>,
    @InjectRepository(Payin)
    private readonly payinRepository: Repository<Payin>,
    @InjectRepository(PayinSandbox)
    private readonly payinSandboxRepository: Repository<PayinSandbox>,
    @InjectRepository(ChannelSettings)
    private readonly channelSettingsRepository: Repository<ChannelSettings>,
    @InjectRepository(AmountRangePayinMode)
    private readonly amountRangeRepository: Repository<AmountRangePayinMode>,
    @InjectRepository(ProportionalPayinMode)
    private readonly proportionalRepository: Repository<ProportionalPayinMode>,

    private readonly systemConfigService: SystemConfigService,
    private readonly payinService: PayinService,
    private readonly memberChannelService: MemberChannelService,
    private readonly phonepeService: PhonepeService,
    private readonly razorpayService: RazorpayService,
    private readonly payuService: PayuService,
    private readonly payinGateway: PayinGateway,
    private readonly cashfreeService: CashfreeService,
    private readonly upiVendorChannelService: UpiVendorChannelService,
    private readonly dokuService: DokuService,
    private readonly midtransService: MidtransService,
    private readonly xenditService: XenditService,
  ) {}

  private isIndonesianGateway(gateway: GatewayName) {
    return [GatewayName.DOKU, GatewayName.MIDTRANS, GatewayName.XENDIT].includes(
      gateway,
    );
  }

  private resolveChannelForGateway(
    channelName: ChannelName | string,
    gateway: GatewayName,
  ): ChannelName | null {
    const normalized = (() => {
      if (channelName === ChannelName.UPI || channelName === 'upi')
        return ChannelName.UPI;
      if (channelName === ChannelName.QRIS || channelName === 'qris')
        return ChannelName.QRIS;
      if (channelName === ChannelName.BANKING || channelName === 'netBanking')
        return ChannelName.BANKING;
      if (channelName === ChannelName.E_WALLET || channelName === 'eWallet')
        return ChannelName.E_WALLET;

      return channelName as ChannelName;
    })();

    // Indonesian PGs must use QRIS; Indian flows remain on UPI.
    if (this.isIndonesianGateway(gateway)) {
      if (normalized === ChannelName.UPI || normalized === ChannelName.QRIS)
        return ChannelName.QRIS;
      return normalized;
    }

    // Prevent routing QRIS to non-Indonesian gateways.
    if (normalized === ChannelName.QRIS) return null;
    return normalized;
  }

  async fetchForDefault(
    merchant: Merchant,
    channelName,
    amount,
    disableMember = false,
  ) {
    // Default preferred gateway
    if (merchant.allowPgBackupForPayin && merchant.payinChannels) {
      const preferredGateway = getPreferredGatewayForDefaultMode(
        merchant.payinChannels,
        channelName,
      );

      if (preferredGateway) {
        const assignedGateway = await this.getGatewayForPayin(
          channelName,
          amount,
          preferredGateway,
        );

        if (assignedGateway) return assignedGateway;
      }
    }

    // If both member and gateway are enabled by the merchant
    if (merchant.allowMemberChannelsPayin && merchant.allowPgBackupForPayin) {
      let selectedMember =
        !disableMember &&
        (await this.getMemberWithIntervalCalls({
          channelName,
          amount,
        }));

      if (!selectedMember)
        selectedMember = await this.getGatewayForPayin(channelName, amount);

      return selectedMember;
    }

    // If gateway/3rd party payment is disabled by the merchant
    else if (!merchant.allowPgBackupForPayin) {
      // Keep finding eligible member with an interval of 0.5 sec indefinitely until found.
      return new Promise((resolve, reject) => {
        const intervalId = setInterval(async () => {
          const selectedMember = await this.getMemberForPayin(
            channelName,
            amount,
          );

          if (selectedMember) {
            clearInterval(intervalId);
            resolve(selectedMember);
          }
        }, 500);
      });
    }

    // If member channels are disabled by the merchant
    else if (!merchant.allowMemberChannelsPayin) {
      return await this.getGatewayForPayin(channelName, amount);
    }
  }

  async fetchForAmountRange(merchant: Merchant, channelName, payinAmount) {
    const amountRanges = await this.amountRangeRepository.find({
      where: {
        payinMode: {
          merchant: {
            id: merchant.id,
          },
        },
      },
      relations: ['payinMode', 'payinMode.merchant'],
    });

    let selectedGateway;
    for (const range of amountRanges)
      if (payinAmount >= range.lower && payinAmount <= range.upper)
        selectedGateway = range.gateway;

    if (selectedGateway?.toUpperCase() === GatewayName.MEMBER) {
      const selectedMember = await this.getMemberWithIntervalCalls({
        channelName,
        amount: payinAmount,
      });
      if (selectedMember) return selectedMember;
    }

    if (selectedGateway?.toUpperCase() === GatewayName.RAZORPAY) {
      const selectedGateway = await this.getGatewayForPayin(
        channelName,
        payinAmount,
        GatewayName.RAZORPAY,
      );

      if (selectedGateway) return selectedGateway;
    }

    if (selectedGateway?.toUpperCase() === GatewayName.PHONEPE) {
      const selectedGateway = await this.getGatewayForPayin(
        channelName,
        payinAmount,
        GatewayName.PHONEPE,
      );

      if (selectedGateway) return selectedGateway;
    }

    if (selectedGateway?.toUpperCase() === GatewayName.PAYU) {
      const selectedGateway = await this.getGatewayForPayin(
        channelName,
        payinAmount,
        GatewayName.PAYU,
      );

      if (selectedGateway) return selectedGateway;
    }

    if (selectedGateway?.toUpperCase() === GatewayName.CASHFREE) {
      const selectedGateway = await this.getGatewayForPayin(
        channelName,
        payinAmount,
        GatewayName.CASHFREE,
      );

      if (selectedGateway) return selectedGateway;
    }

    if (selectedGateway?.toUpperCase() === GatewayName.DOKU) {
      const selectedGateway = await this.getGatewayForPayin(
        channelName,
        payinAmount,
        GatewayName.DOKU,
      );

      if (selectedGateway) return selectedGateway;
    }

    if (selectedGateway?.toUpperCase() === GatewayName.MIDTRANS) {
      const selectedGateway = await this.getGatewayForPayin(
        channelName,
        payinAmount,
        GatewayName.MIDTRANS,
      );

      if (selectedGateway) return selectedGateway;
    }

    if (selectedGateway?.toUpperCase() === GatewayName.XENDIT) {
      const selectedGateway = await this.getGatewayForPayin(
        channelName,
        payinAmount,
        GatewayName.XENDIT,
      );

      if (selectedGateway) return selectedGateway;
    }

    // Fallbacks
    let selectedFallbackGateway;
    selectedFallbackGateway = await this.getGatewayForPayin(
      channelName,
      payinAmount,
      GatewayName.RAZORPAY,
    );
    if (selectedFallbackGateway) return selectedFallbackGateway;

    selectedFallbackGateway = await this.getGatewayForPayin(
      channelName,
      payinAmount,
      GatewayName.PHONEPE,
    );
    if (selectedFallbackGateway) return selectedFallbackGateway;

    selectedFallbackGateway = await this.getGatewayForPayin(
      channelName,
      payinAmount,
      GatewayName.PAYU,
    );
    if (selectedFallbackGateway) return selectedFallbackGateway;

    selectedFallbackGateway = await this.getGatewayForPayin(
      channelName,
      payinAmount,
      GatewayName.CASHFREE,
    );
    if (selectedFallbackGateway) return selectedFallbackGateway;

    selectedFallbackGateway = await this.getGatewayForPayin(
      channelName,
      payinAmount,
      GatewayName.DOKU,
    );
    if (selectedFallbackGateway) return selectedFallbackGateway;

    selectedFallbackGateway = await this.getGatewayForPayin(
      channelName,
      payinAmount,
      GatewayName.MIDTRANS,
    );
    if (selectedFallbackGateway) return selectedFallbackGateway;

    selectedFallbackGateway = await this.getGatewayForPayin(
      channelName,
      payinAmount,
      GatewayName.XENDIT,
    );
    if (selectedFallbackGateway) return selectedFallbackGateway;
  }

  async fetchForProportional(merchant: Merchant, channelName, amount) {
    const ratios = await this.proportionalRepository.find({
      where: {
        payinMode: {
          merchant: {
            id: merchant.id,
          },
        },
      },
      relations: ['payinMode', 'payinMode.merchant'],
    });

    // Get ratios
    const razorpayRatio =
      ratios.find((ratio) => ratio.gateway === 'razorpay')?.ratio || 0;
    const phonepayRatio =
      ratios.find((ratio) => ratio.gateway === 'phonepe')?.ratio || 0;
    const payuRatio =
      ratios.find((ratio) => ratio.gateway === 'payu')?.ratio || 0;
    const cashfreeRatio =
      ratios.find((ratio) => ratio.gateway === 'cashfree')?.ratio || 0;
    const dokuRatio =
      ratios.find((ratio) => ratio.gateway === 'doku')?.ratio || 0;
    const midtransRatio =
      ratios.find((ratio) => ratio.gateway === 'midtrans')?.ratio || 0;
    const xenditRatio =
      ratios.find((ratio) => ratio.gateway === 'xendit')?.ratio || 0;
    const memberRatio =
      ratios.find((ratio) => ratio.gateway === 'member')?.ratio || 0;

    const baseRatio = ratios.reduce((sum, ratio) => sum + ratio.ratio, 0);
    const totalPayins = merchant.payin?.length;
    const totalMemberPayins = merchant.payin.filter(
      (payin) => payin.member,
    ).length;
    const totalRazorpayPayins = merchant.payin.filter(
      (payin) => payin.gatewayName === GatewayName.RAZORPAY,
    ).length;
    const totalPhonepePayins = merchant.payin.filter(
      (payin) => payin.gatewayName === GatewayName.PHONEPE,
    ).length;
    const totalPayuPayins = merchant.payin.filter(
      (payin) => payin.gatewayName === GatewayName.PAYU,
    ).length;
    const totalCashfreePayins = merchant.payin.filter(
      (payin) => payin.gatewayName === GatewayName.CASHFREE,
    ).length;
    const totalDokuPayins = merchant.payin.filter(
      (payin) => payin.gatewayName === GatewayName.DOKU,
    ).length;
    const totalMidtransPayins = merchant.payin.filter(
      (payin) => payin.gatewayName === GatewayName.MIDTRANS,
    ).length;
    const totalXenditPayins = merchant.payin.filter(
      (payin) => payin.gatewayName === GatewayName.XENDIT,
    ).length;

    const desiredMemberOrders = Math.round(
      memberRatio * (totalPayins / baseRatio),
    );
    const desiredRazorpayOrders = Math.round(
      razorpayRatio * (totalPayins / baseRatio),
    );
    const desiredPhonepeOrders = Math.round(
      phonepayRatio * (totalPayins / baseRatio),
    );
    const desiredPayuOrders = Math.round(payuRatio * (totalPayins / baseRatio));
    const desiredCashfreeOrders = Math.round(
      cashfreeRatio * (totalPayins / baseRatio),
    );
    const desiredDokuOrders = Math.round(dokuRatio * (totalPayins / baseRatio));
    const desiredMidtransOrders = Math.round(
      midtransRatio * (totalPayins / baseRatio),
    );
    const desiredXenditOrders = Math.round(
      xenditRatio * (totalPayins / baseRatio),
    );

    const memberDiff = desiredMemberOrders - totalMemberPayins;
    const razorpayDiff = desiredRazorpayOrders - totalRazorpayPayins;
    const phonepeDiff = desiredPhonepeOrders - totalPhonepePayins;
    const payuDiff = desiredPayuOrders - totalPayuPayins;
    const cashfreeDiff = desiredCashfreeOrders - totalCashfreePayins;
    const dokuDiff = desiredDokuOrders - totalDokuPayins;
    const midtransDiff = desiredMidtransOrders - totalMidtransPayins;
    const xenditDiff = desiredXenditOrders - totalXenditPayins;

    const diffs = [
      { name: 'member', diff: memberDiff, total: totalMemberPayins },
      { name: 'razorpay', diff: razorpayDiff, total: totalRazorpayPayins },
      { name: 'phonepe', diff: phonepeDiff, total: totalPhonepePayins },
      { name: 'payu', diff: payuDiff, total: totalPayuPayins },
      { name: 'cashfree', diff: cashfreeDiff, total: totalCashfreePayins },
      { name: 'doku', diff: dokuDiff, total: totalDokuPayins },
      { name: 'midtrans', diff: midtransDiff, total: totalMidtransPayins },
      { name: 'xendit', diff: xenditDiff, total: totalXenditPayins },
    ];

    diffs.sort((a, b) => {
      if (b.diff !== a.diff) return b.diff - a.diff;

      return b.total - a.total;
    });

    for (const element of diffs) {
      if (element.name === 'member') {
        const selectedMember = await this.getMemberWithIntervalCalls({
          channelName,
          amount,
        });

        if (selectedMember) return selectedMember;
      }

      if (element.name === 'razorpay') {
        const selectedGateway = await this.getGatewayForPayin(
          channelName,
          amount,
          GatewayName.RAZORPAY,
        );

        if (selectedGateway) return selectedGateway;
      }

      if (element.name === 'phonepe') {
        const selectedGateway = await this.getGatewayForPayin(
          channelName,
          amount,
          GatewayName.PHONEPE,
        );

        if (selectedGateway) return selectedGateway;
      }

      if (element.name === 'payu') {
        const selectedGateway = await this.getGatewayForPayin(
          channelName,
          amount,
          GatewayName.PAYU,
        );

        if (selectedGateway) return selectedGateway;
      }

      if (element.name === 'cashfree') {
        const selectedGateway = await this.getGatewayForPayin(
          channelName,
          amount,
          GatewayName.CASHFREE,
        );

        if (selectedGateway) return selectedGateway;
      }

      if (element.name === 'doku') {
        const selectedGateway = await this.getGatewayForPayin(
          channelName,
          amount,
          GatewayName.DOKU,
        );

        if (selectedGateway) return selectedGateway;
      }

      if (element.name === 'midtrans') {
        const selectedGateway = await this.getGatewayForPayin(
          channelName,
          amount,
          GatewayName.MIDTRANS,
        );

        if (selectedGateway) return selectedGateway;
      }

      if (element.name === 'xendit') {
        const selectedGateway = await this.getGatewayForPayin(
          channelName,
          amount,
          GatewayName.XENDIT,
        );

        if (selectedGateway) return selectedGateway;
      }
    }
  }

  async getMemberForPayin(channelName, amount) {
    // Eligible members - must have the required channel, must be online and must have quota greater than or equal to the payin order amount.
    const eligibleMembers = await this.memberRepository
      .createQueryBuilder('member')
      .leftJoinAndSelect('member.identity', 'identity')
      .leftJoinAndSelect('identity.netBanking', 'netBanking')
      .leftJoinAndSelect('identity.eWallet', 'eWallet')
      .leftJoinAndSelect('identity.upi', 'upi')
      .leftJoinAndSelect('member.payin', 'payin')
      .where('member.isOnline = :isOnline', { isOnline: true })
      .andWhere('member.quota >= :amount', { amount })
      .andWhere(`${channelName}.id IS NOT NULL`)
      .getMany();

    if (!eligibleMembers || !eligibleMembers.length) return null;

    // If more than one members are eligible then find the member with least payin orders.
    const memberWithLeastPayinCount = eligibleMembers.reduce((prev, curr) => {
      if (!prev) return curr;
      return prev.payin.length <= curr.payin.length ? prev : curr;
    }, null);

    return memberWithLeastPayinCount;
  }

  async getGatewayForPayin(
    channelName: ChannelName,
    amount,
    priority: GatewayName | null = null,
  ) {
    // Priority gateway is assigned if that is passed.
    // If priority gateway is not passed, fetch the gateways priority chain from system config.
    let gatewayPriorityChain = (await this.systemConfigService.findLatest())
      .defaultPayinGateway;

    let selectedGateway = null;
    if (priority) {
      selectedGateway = await this.checkForGatewayAndChannelEnabled(
        priority,
        channelName,
        amount,
        true,
      );
      if (!selectedGateway) return null;
    } else {
      // getFirstEnableGateway will return gateway name which is enabled for incoming transactions + the requested/passed channel is also enabled on that gateway.
      selectedGateway = await this.getFirstEnabledGateway(
        gatewayPriorityChain,
        true, // for incoming transactions / payins
        channelName,
        amount,
      );
    }

    return selectedGateway;
  }

  async checkForGatewayAndChannelEnabled(
    gateway: GatewayName,
    channelName: ChannelName,
    amount,
    forIncoming: boolean,
  ) {
    let isGatewayEnabled;
    let whereConditions;

    if (forIncoming)
      whereConditions = {
        incoming: true,
      };
    else
      whereConditions = {
        outgoing: true,
      };

    switch (gateway) {
      case GatewayName.PHONEPE:
        isGatewayEnabled = await this.phonePeRepository.findOne({
          where: whereConditions,
        });
        break;

      case GatewayName.RAZORPAY:
        isGatewayEnabled = await this.razorpayRepository.findOne({
          where: whereConditions,
        });
        break;

      case GatewayName.UNIQPAY:
        isGatewayEnabled = false;
        break;

      case GatewayName.PAYU:
        isGatewayEnabled = await this.payuRepository.findOne({
          where: whereConditions,
        });
        break;

      case GatewayName.CASHFREE:
        isGatewayEnabled = await this.cashfreeRepository.findOne({
          where: whereConditions,
        });
        break;

      case GatewayName.DOKU:
        isGatewayEnabled = await this.dokuRepository.findOne({
          where: whereConditions,
        });
        break;

      case GatewayName.MIDTRANS:
        isGatewayEnabled = await this.midtransRepository.findOne({
          where: whereConditions,
        });
        break;

      case GatewayName.XENDIT:
        isGatewayEnabled = await this.xenditRepository.findOne({
          where: whereConditions,
        });
        break;

      default:
        break;
    }

    let channelEnabled = null;
    if (forIncoming) {
      const resolvedChannel = this.resolveChannelForGateway(channelName, gateway);
      if (!resolvedChannel) return null;

      channelEnabled = await this.channelSettingsRepository.findOne({
        where: {
          gatewayName: gateway,
          enabled: true,
          channelName: resolvedChannel,
          type: PaymentType.INCOMING,
          minAmount: LessThanOrEqual(amount),
          maxAmount: MoreThanOrEqual(amount),
        },
      });

      if (channelEnabled && isGatewayEnabled) return gateway;
    }

    if (isGatewayEnabled && !forIncoming) return gateway;

    return null;
  }

  async getFirstEnabledGateway(
    gatewayObject: Record<string, GatewayName>,
    forIncoming: boolean = false, // For payins
    channelName: ChannelName = ChannelName.UPI, // If passed then it will return the gateway name where the passed channel is also enabled.
    amount = 0,
  ): Promise<GatewayName | null> {
    // Iterates through the gateway priority chain and returns the first gateway name found which is enabled

    for (const key in gatewayObject) {
      const gateway = gatewayObject[key];
      let isGatewayEnabled;
      let whereConditions;

      if (forIncoming) {
        whereConditions = {
          incoming: true,
        };
      } else {
        whereConditions = {
          outgoing: true,
        };
      }

      switch (gateway) {
        case GatewayName.PHONEPE:
          isGatewayEnabled = await this.phonePeRepository.findOne({
            where: whereConditions,
          });
          break;

        case GatewayName.RAZORPAY:
          isGatewayEnabled = await this.razorpayRepository.findOne({
            where: whereConditions,
          });
          break;

        case GatewayName.UNIQPAY:
          isGatewayEnabled = await this.uniqpayRepository.findOne({
            where: whereConditions,
          });
          break;

        case GatewayName.PAYU:
          isGatewayEnabled = await this.payuRepository.findOne({
            where: whereConditions,
          });
          break;

        case GatewayName.CASHFREE:
          isGatewayEnabled = await this.cashfreeRepository.findOne({
            where: whereConditions,
          });
          break;

        case GatewayName.DOKU:
          isGatewayEnabled = await this.dokuRepository.findOne({
            where: whereConditions,
          });
          break;

        case GatewayName.MIDTRANS:
          isGatewayEnabled = await this.midtransRepository.findOne({
            where: whereConditions,
          });
          break;

        case GatewayName.XENDIT:
          isGatewayEnabled = await this.xenditRepository.findOne({
            where: whereConditions,
          });
          break;

        default:
          break;
      }

      let channelEnabled = null;
      if (forIncoming) {
        const resolvedChannel = this.resolveChannelForGateway(channelName, gateway);
        if (!resolvedChannel) continue;

        channelEnabled = await this.channelSettingsRepository.findOne({
          where: {
            gatewayName: gateway,
            enabled: true,
            channelName: resolvedChannel,
            type: PaymentType.INCOMING,
            minAmount: LessThanOrEqual(amount),
            maxAmount: MoreThanOrEqual(amount),
          },
        });

        if (channelEnabled && isGatewayEnabled) return gateway;
      }

      if (isGatewayEnabled && !forIncoming) return gateway;
    }

    return null;
  }

  private generateTrackingId(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'KG-';
    for (let i = 0; i < 5; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  }

  async assignUpiVendorGateway(
    createdPayin: Payin,
    userId: string,
    environment: 'live' | 'sandbox',
  ) {
    const res: any = await this.getPayPage({
      orderId: createdPayin.systemOrderId,
      gateway: GatewayName.UPI_VENDOR,
      environment,
    });

    const trackingId = this.generateTrackingId();

    const body = {
      id: createdPayin.systemOrderId,
      paymentMode: PaymentMadeOn.UPI_VENDOR,
      upiVendorId: res.upiDetails?.vendorId,
      gatewayServiceRate: res.upiDetails?.commissionRate || 0,
      gatewayName: GatewayName.UPI_VENDOR,
      userId: userId,
      upiDetails: res.upiDetails,
      trackingId: trackingId,
    };

    await this.payinService.updatePayinStatusToAssigned(body);

    await this.payinRepository.update(createdPayin.id, {
      gatewayPaymentLink: res.url,
      trackingId: trackingId,
    });

    return res.url;
  }

  async assignPaymentMethodForPayinOrder(
    merchant: Merchant,
    createdPayin: Payin,
    userId,
    environment,
  ) {
    if (merchant.enableUpiVendorGateway) {
      return await this.assignUpiVendorGateway(
        createdPayin,
        userId,
        environment,
      );
    }

    let channelNameMap = {
      UPI: 'upi',
      QRIS: 'upi',
      NET_BANKING: 'netBanking',
      E_WALLET: 'eWallet',
    };
    let channelName = channelNameMap[createdPayin.channel];

    let selectedPaymentMode;

    switch (merchant.payinMode) {
      case 'DEFAULT':
        selectedPaymentMode = await this.fetchForDefault(
          merchant,
          channelName,
          createdPayin.amount,
        );
        break;

      case 'AMOUNT RANGE':
        selectedPaymentMode = await this.fetchForAmountRange(
          merchant,
          channelName,
          createdPayin.amount,
        );
        break;

      case 'PROPORTIONAL':
        selectedPaymentMode = await this.fetchForProportional(
          merchant,
          channelName,
          createdPayin.amount,
        );
        break;

      default:
        break;
    }

    if (!selectedPaymentMode)
      throw new NotFoundException(
        'No payment gateway available at the moment!',
      );

    const isMember = !!selectedPaymentMode?.id;
    const gatewayChannel = !isMember
      ? this.resolveChannelForGateway(createdPayin.channel, selectedPaymentMode)
      : createdPayin.channel;
    let paymentDetails;

    if (isMember) {
      paymentDetails = selectedPaymentMode.identity[channelName];
    } else {
      paymentDetails = await this.channelSettingsRepository.findOne({
        where: {
          gatewayName: selectedPaymentMode,
          type: PaymentType.INCOMING,
          channelName: gatewayChannel,
        },
      });
    }

    const body = {
      id: createdPayin.systemOrderId,
      paymentMode: isMember ? PaymentMadeOn.MEMBER : PaymentMadeOn.GATEWAY,
      memberId: isMember && selectedPaymentMode.id,
      gatewayServiceRate: !isMember ? paymentDetails.upstreamFee : null,
      memberPaymentDetails: isMember ? paymentDetails[0] : null,
      gatewayName: !isMember ? selectedPaymentMode : null,
      userId: userId,
    };

    await this.payinService.updatePayinStatusToAssigned(body);

    if (
      !isMember &&
      gatewayChannel &&
      gatewayChannel !== createdPayin.channel
    ) {
      await this.payinRepository.update(createdPayin.id, {
        channel: gatewayChannel,
      });
      createdPayin.channel = gatewayChannel;
    }

    let res = null;
    if (isMember)
      res = await this.getPayPage({
        orderId: createdPayin.systemOrderId,
        gateway: GatewayName.MEMBER,
      });

    if (selectedPaymentMode === GatewayName.PHONEPE)
      res = await this.getPayPage({
        userId: createdPayin.user?.userId,
        amount: createdPayin.amount.toString(),
        orderId: createdPayin.systemOrderId,
        gateway: GatewayName.PHONEPE,
        integrationId: merchant.integrationId,
        channelName: createdPayin.channel,
        environment,
      });

    if (selectedPaymentMode === GatewayName.RAZORPAY)
      res = await this.getPayPage({
        userId: createdPayin.user?.userId,
        amount: createdPayin.amount.toString(),
        orderId: createdPayin.systemOrderId,
        gateway: GatewayName.RAZORPAY,
        integrationId: merchant.integrationId,
        channelName: createdPayin.channel,
        environment,
      });

    if (selectedPaymentMode === GatewayName.PAYU)
      res = await this.getPayPage({
        userId: createdPayin.user?.userId,
        amount: createdPayin.amount.toString(),
        orderId: createdPayin.systemOrderId,
        gateway: GatewayName.PAYU,
        integrationId: merchant.integrationId,
        channelName: createdPayin.channel,
        environment,
      });

    if (selectedPaymentMode === GatewayName.CASHFREE)
      res = await this.getPayPage({
        userId: createdPayin.user?.userId,
        amount: createdPayin.amount.toString(),
        orderId: createdPayin.systemOrderId,
        gateway: GatewayName.CASHFREE,
        integrationId: merchant.integrationId,
        channelName: createdPayin.channel,
        environment,
      });

    if (selectedPaymentMode === GatewayName.DOKU)
      res = await this.getPayPage({
        userId: createdPayin.user?.userId,
        amount: createdPayin.amount.toString(),
        orderId: createdPayin.systemOrderId,
        gateway: GatewayName.DOKU,
        integrationId: merchant.integrationId,
        channelName: createdPayin.channel,
        environment,
      });

    if (selectedPaymentMode === GatewayName.MIDTRANS)
      res = await this.getPayPage({
        userId: createdPayin.user?.userId,
        amount: createdPayin.amount.toString(),
        orderId: createdPayin.systemOrderId,
        gateway: GatewayName.MIDTRANS,
        integrationId: merchant.integrationId,
        channelName: createdPayin.channel,
        environment,
      });

    if (selectedPaymentMode === GatewayName.XENDIT)
      res = await this.getPayPage({
        userId: createdPayin.user?.userId,
        amount: createdPayin.amount.toString(),
        orderId: createdPayin.systemOrderId,
        gateway: GatewayName.XENDIT,
        integrationId: merchant.integrationId,
        channelName: createdPayin.channel,
        environment,
      });

    await this.payinRepository.update(createdPayin.id, {
      trackingId: res.trackingId,
      gatewayPaymentLink: res.url,
    });

    return res.url;
  }

  async getPayPage(getPayPageDto: GetPayPageDto) {
    const { gateway, orderId, environment } = getPayPageDto;

    if (gateway === GatewayName.MEMBER)
      return await this.memberChannelService.getPayPage(orderId, environment);

    if (gateway === GatewayName.PHONEPE)
      return await this.phonepeService.getPayPage(getPayPageDto);

    if (gateway === GatewayName.RAZORPAY)
      return await this.razorpayService.getPayPage(getPayPageDto);

    if (gateway === GatewayName.PAYU)
      return await this.payuService.getPayPage(getPayPageDto);

    if (gateway === GatewayName.CASHFREE)
      return await this.cashfreeService.getPayPage(getPayPageDto);

    if (gateway === GatewayName.DOKU)
      return await this.dokuService.getPayPage(getPayPageDto);

    if (gateway === GatewayName.MIDTRANS)
      return await this.midtransService.getPayPage(getPayPageDto);

    if (gateway === GatewayName.XENDIT)
      return await this.xenditService.getPayPage(getPayPageDto);

    if (gateway === GatewayName.UPI_VENDOR)
      return await this.upiVendorChannelService.getPayPage(
        orderId,
        environment,
      );
  }

  async processPaymentMethodSandbox(
    merchant: Merchant,
    createdPayin: PayinSandbox,
    paymentMethod:
      | 'member'
      | 'phonepe'
      | 'razorpay'
      | 'payu'
      | 'cashfree'
      | 'doku'
      | 'midtrans'
      | 'xendit'
      | 'upi-vendor',
    userId: string,
    environment: 'live' | 'sandbox',
  ) {
    let gatewayName;
    if (paymentMethod === 'member') gatewayName = GatewayName.MEMBER;
    if (paymentMethod === 'phonepe') gatewayName = GatewayName.PHONEPE;
    if (paymentMethod === 'razorpay') gatewayName = GatewayName.RAZORPAY;
    if (paymentMethod === 'payu') gatewayName = GatewayName.PAYU;
    if (paymentMethod === 'cashfree') gatewayName = GatewayName.CASHFREE;
    if (paymentMethod === 'doku') gatewayName = GatewayName.DOKU;
    if (paymentMethod === 'midtrans') gatewayName = GatewayName.MIDTRANS;
    if (paymentMethod === 'xendit') gatewayName = GatewayName.XENDIT;
    if (paymentMethod === 'upi-vendor') gatewayName = GatewayName.UPI_VENDOR;

    try {
      const sandboxChannel = this.resolveChannelForGateway(
        createdPayin.channel,
        gatewayName,
      );

      if (!sandboxChannel) {
        throw new NotFoundException(
          `Requested channel ${createdPayin.channel} is not supported for ${gatewayName}.`,
        );
      }

      if (sandboxChannel !== createdPayin.channel) {
        await this.payinSandboxRepository.update(createdPayin.id, {
          channel: sandboxChannel,
        });
        createdPayin.channel = sandboxChannel;
      }

      const res: any = await this.getPayPage({
        orderId: createdPayin.systemOrderId,
        userId: userId,
        amount: createdPayin.amount.toString(),
        gateway: gatewayName,
        channelName: sandboxChannel,
        integrationId: merchant.integrationId,
        environment,
      });

      if (gatewayName !== GatewayName.MEMBER)
        await this.payinSandboxRepository.update(createdPayin.id, {
          trackingId: res?.trackingId,
          gatewayPaymentLink: res?.url,
        });

      return res?.url;
    } catch (e) {
      console.log(e);
    }
  }

  async getMemberWithIntervalCalls({ channelName, amount }) {
    let selectedMember;
    const startTime = Date.now();
    const payinTimeout =
      (await this.systemConfigService.findLatest()).payinTimeout * 1000;

    // Find an eligible online member with the interval of 0.5 sec until payin timeout
    const findMemberPromise = new Promise((resolve, reject) => {
      const intervalId = setInterval(async () => {
        if (Date.now() - startTime >= payinTimeout) {
          clearInterval(intervalId);
          resolve(null); // No member found within the timeout
        }

        selectedMember = await this.getMemberForPayin(channelName, amount);
        // If an eligible online member is found, clear interval and resolve the promise
        if (selectedMember) {
          clearInterval(intervalId);
          resolve(selectedMember);
        }
      }, 500);
    });

    // Await the result of finding a member
    selectedMember = await findMemberPromise;
    return selectedMember;
  }
}
