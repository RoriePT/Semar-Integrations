import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IsNull,
  LessThan,
  Not,
  Repository,
  In,
  InsertValuesMissingError,
} from 'typeorm';
import uniqid from 'uniqid';
import { Payin } from './entities/payin.entity';
import {
  AlertType,
  CallBackStatus,
  GatewayName,
  NotificationType,
  OrderStatus,
  OrderType,
  PaymentMadeOn,
  Users,
  UserTypeForTransactionUpdates,
} from 'src/utils/enum/enum';
import { TransactionUpdatesPayinService } from 'src/transaction-updates/transaction-updates-payin.service';
import { EndUserService } from 'src/end-user/end-user.service';
import { Merchant } from 'src/merchant/entities/merchant.entity';
import { SystemConfigService } from 'src/system-config/system-config.service';
import { Member } from 'src/member/entities/member.entity';
import { TransactionUpdate } from 'src/transaction-updates/entities/transaction-update.entity';
import { MemberService } from 'src/member/member.service';
import { MerchantService } from 'src/merchant/merchant.service';
import { AgentService } from 'src/agent/agent.service';
import {
  CreatePaymentOrderDto,
  CreatePaymentOrderDtoAdmin,
  CreatePaymentOrderSandboxDto,
} from 'src/payment-system/dto/createPaymentOrder.dto';
import { EndUser } from 'src/end-user/entities/end-user.entity';
import { FundRecordService } from 'src/fund-record/fund-record.service';
import { NotificationService } from 'src/notification/notification.service';
import { AlertService } from 'src/alert/alert.service';
import { PayinSandbox } from './entities/payin-sandbox.entity';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { JwtService } from 'src/services/jwt/jwt.service';
import { ReceiptService } from 'src/receipt/receipt.service';
import { UpiVendor } from 'src/upi-vendor/entities/upi-vendor.entity';
import { UpiVendorQueueService } from 'src/upi-vendor/upi-vendor-queue.service';
import { Upi } from 'src/channel/entity/upi.entity';
import { roundOffAmount } from 'src/utils/utils';

@Injectable()
export class PayinService {
  constructor(
    @InjectRepository(Payin)
    private readonly payinRepository: Repository<Payin>,
    @InjectRepository(PayinSandbox)
    private readonly payinSandboxRepository: Repository<PayinSandbox>,
    @InjectRepository(Merchant)
    private readonly merchantRepository: Repository<Merchant>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(EndUser)
    private readonly endUserRepository: Repository<EndUser>,
    @InjectRepository(TransactionUpdate)
    private readonly transactionUpdateRepository: Repository<TransactionUpdate>,
    @InjectRepository(UpiVendor)
    private readonly upiVendorRepository: Repository<UpiVendor>,
    @InjectRepository(Upi)
    private readonly upiRepository: Repository<Upi>,

    private readonly transactionUpdateService: TransactionUpdatesPayinService,
    private readonly upiVendorQueueService: UpiVendorQueueService,
    private readonly endUserService: EndUserService,
    private readonly systemConfigService: SystemConfigService,
    private readonly memberService: MemberService,
    private readonly merchantService: MerchantService,
    private readonly agentService: AgentService,
    private readonly fundRecordService: FundRecordService,
    private readonly notificationService: NotificationService,
    private readonly alertService: AlertService,
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    private readonly receiptService: ReceiptService,
  ) {}

  async create(payinDetails: CreatePaymentOrderDto) {
    const {
      userId,
      userName,
      channel,
      integrationId,
      orderId,
      amount,
      userEmail,
      userMobileNumber,
      successUrl,
      failureUrl,
      webhookUrl,
      mode,
    } = payinDetails;

    const merchant = await this.merchantRepository.findOne({
      where: {
        integrationId,
      },
      relations: ['identity'],
    });
    if (!merchant)
      throw new InternalServerErrorException('Merchant not found!');

    // Get UPI vendor if enabled for this merchant
    let upiVendorToAssign = null;
    if (merchant.enableUpiVendorGateway) {
      const upiData = await this.upiVendorQueueService.getCurrentUpi();

      if (upiData?.vendorId) {
        upiVendorToAssign = await this.upiVendorRepository.findOne({
          where: { id: upiData.vendorId },
        });
      }
    }

    let endUser = await this.endUserRepository.findOne({
      where: { userId, merchant: { id: merchant.id } },
      relations: ['merchant'],
    });

    if (endUser?.isBlacklisted)
      throw new NotAcceptableException('This user is currently blacklisted!');

    if (!endUser) {
      endUser = await this.endUserService.create({
        name: userName,
        userId,
        merchant,
        email: userEmail || null,
        mobile: userMobileNumber || null,
      });
    } else {
      let shouldUpdate = false;

      if (userName && endUser.name !== userName) {
        endUser.name = userName;
        shouldUpdate = true;
      }

      if (userEmail && endUser.email !== userEmail) {
        endUser.email = userEmail;
        shouldUpdate = true;
      }

      if (userMobileNumber && endUser.mobile !== userMobileNumber) {
        endUser.mobile = userMobileNumber;
        shouldUpdate = true;
      }

      if (shouldUpdate) endUser = await this.endUserRepository.save(endUser);
    }

    const payin = await this.payinRepository.save({
      merchantOrderId: orderId,
      user: endUser,
      systemOrderId: `PAYIN-${uniqid()}`.toUpperCase(),
      merchant,
      amount,
      channel,
      successUrl: successUrl ? `${successUrl}?orderId=${orderId}` : null,
      failureUrl: failureUrl ? `${failureUrl}?orderId=${orderId}` : null,
      webhookUrl: webhookUrl || null,
      mode: mode || null,
      upiVendor: upiVendorToAssign,
    });

    if (payin)
      await this.transactionUpdateService.create({
        orderDetails: payin,
        orderType: OrderType.PAYIN,
        systemOrderId: payin.systemOrderId,
        userId: merchant.identity.id,
      });

    return payin;
  }

  async createAndAssign(payinDetails: CreatePaymentOrderDtoAdmin) {
    const {
      userId,
      userEmail,
      userName,
      userMobileNumber,
      orderId,
      amount,
      merchantId,
      memberId,
      channel,
    } = payinDetails;

    if (!merchantId || !memberId)
      throw new NotFoundException('Merchant ID or Member ID missing!');

    const merchant = await this.merchantRepository.findOne({
      where: {
        id: merchantId,
      },
      relations: ['identity'],
    });
    if (!merchant) throw new NotFoundException('Merchant not found!');

    let endUser = await this.endUserRepository.findOne({
      where: { userId, merchant: { id: merchant.id } },
      relations: ['merchant'],
    });

    if (endUser?.isBlacklisted)
      throw new NotAcceptableException('This user is currently blacklisted!');

    if (!endUser)
      endUser = await this.endUserService.create({
        email: userEmail,
        mobile: userMobileNumber,
        name: userName,
        userId,
        merchant,
      });

    const payin = await this.payinRepository.save({
      merchantOrderId: orderId,
      user: endUser,
      systemOrderId: `PAYIN-${uniqid()}`.toUpperCase(),
      merchant,
      amount,
      channel,
    });

    if (payin)
      await this.transactionUpdateService.create({
        orderDetails: payin,
        orderType: OrderType.PAYIN,
        systemOrderId: payin.systemOrderId,
        userId: merchant.identity.id,
      });

    const member = await this.memberRepository.findOne({
      where: { id: memberId },
      relations: [
        'identity',
        'identity.upi',
        'identity.eWallet',
        'identity.netBanking',
      ],
    });

    const mapChannel = {
      E_WALLET: 'eWallet',
      NET_BANKING: 'netBanking',
      UPI: 'upi',
    };

    await this.updatePayinStatusToAssigned({
      id: payin.systemOrderId,
      userId: endUser.id,
      paymentMode: PaymentMadeOn.MEMBER,
      memberId: memberId,
      memberPaymentDetails: member?.identity?.[mapChannel[channel]][0],
    });

    return payin;
  }

  async createAndAssignSandbox(payinDetails: CreatePaymentOrderSandboxDto) {
    const {
      userId,
      userName,
      orderId,
      amount,
      channel,
      paymentMethod,
      merchantId,
      userEmail,
      userMobileNumber,
      successUrl,
      failureUrl,
      webhookUrl,
      mode,
    } = payinDetails;

    if (!merchantId) throw new NotFoundException('Merchant ID missing!');

    const merchant = await this.merchantRepository.findOne({
      where: {
        id: merchantId,
      },
      relations: ['identity'],
    });
    if (!merchant) throw new NotFoundException('Merchant not found!');

    const payin = await this.payinSandboxRepository.save({
      merchantOrderId: orderId,
      user: {
        name: userName,
        email: userEmail || null,
        mobile: userMobileNumber || null,
        userId,
      },
      systemOrderId: `PAYIN-SANDBOX-${uniqid()}`.toUpperCase(),
      merchant: {
        id: merchant.id,
        name: merchant.firstName + ' ' + merchant.lastName,
      },
      amount,
      channel,
      successUrl: successUrl ? `${successUrl}?orderId=${orderId}` : null,
      failureUrl: failureUrl ? `${failureUrl}?orderId=${orderId}` : null,
      webhookUrl: webhookUrl || null,
      mode: mode || null,
    });

    switch (paymentMethod) {
      case 'member':
        const memberPaymentDetails = {
          'Upi Id': 'karlpearson@upi',
          mobile: '9876543210',
        };

        await this.payinSandboxRepository.update(payin.id, {
          status: OrderStatus.ASSIGNED,
          member: {
            name: 'Karl Pearson',
          },
          payinMadeOn: PaymentMadeOn.MEMBER,
          transactionId: 'SANDBOX-TRNX-001ABC',
          transactionDetails: JSON.stringify(memberPaymentDetails),
        });
        break;

      case 'phonepe':
        await this.payinSandboxRepository.update(payin.id, {
          status: OrderStatus.ASSIGNED,
          gatewayName: GatewayName.PHONEPE,
        });
        break;

      case 'razorpay':
        await this.payinSandboxRepository.update(payin.id, {
          status: OrderStatus.ASSIGNED,
          gatewayName: GatewayName.RAZORPAY,
        });
        break;

      case 'payu':
        await this.payinSandboxRepository.update(payin.id, {
          status: OrderStatus.ASSIGNED,
          gatewayName: GatewayName.PAYU,
        });
        break;

      case 'cashfree':
        await this.payinSandboxRepository.update(payin.id, {
          status: OrderStatus.ASSIGNED,
          gatewayName: GatewayName.CASHFREE,
        });
        break;

      case 'doku':
        await this.payinSandboxRepository.update(payin.id, {
          status: OrderStatus.ASSIGNED,
          gatewayName: GatewayName.DOKU,
        });
        break;

      case 'midtrans':
        await this.payinSandboxRepository.update(payin.id, {
          status: OrderStatus.ASSIGNED,
          gatewayName: GatewayName.MIDTRANS,
        });
        break;

      case 'xendit':
        await this.payinSandboxRepository.update(payin.id, {
          status: OrderStatus.ASSIGNED,
          gatewayName: GatewayName.XENDIT,
        });
        break;

      default:
        break;
    }

    return payin;
  }

  async updatePayinStatusToAssigned(body) {
    const {
      id,
      userId,
      paymentMode,
      memberId,
      gatewayServiceRate,
      memberPaymentDetails,
      gatewayName,
      upiVendorId,
      upiDetails,
      trackingId,
    } = body;

    if (
      paymentMode === PaymentMadeOn.GATEWAY &&
      (gatewayServiceRate < 0 || !gatewayName)
    )
      throw new NotAcceptableException(
        'gateway service rate or gateway payment details missing!',
      );

    if (
      paymentMode === PaymentMadeOn.MEMBER &&
      (!memberId || !memberPaymentDetails)
    )
      throw new NotAcceptableException('memberId or payment details missing!');

    if (paymentMode === PaymentMadeOn.UPI_VENDOR && !upiVendorId)
      throw new NotAcceptableException('UPI vendor ID missing!');

    const payinOrderDetails = await this.payinRepository.findOne({
      where: { systemOrderId: id },
      relations: [
        'merchant',
        'merchant.identity',
        'member',
        'merchant.endUser',
        'merchant.endUser.payin',
        'upiVendor',
        'upiVendor.identity',
      ],
    });
    if (!payinOrderDetails) throw new NotFoundException('Order not found');

    if (
      paymentMode !== PaymentMadeOn.GATEWAY &&
      payinOrderDetails.status !== OrderStatus.INITIATED
    )
      throw new NotAcceptableException('order status is not initiated!');

    if (paymentMode === PaymentMadeOn.GATEWAY) {
      const { endUserPayinLimit } = await this.systemConfigService.findLatest();

      const endUser = payinOrderDetails.merchant.endUser.find(
        (user) => (user.userId = userId),
      );

      if (endUser) {
        const currentTime = new Date();
        const twentyFourHoursAgo = new Date(
          currentTime.getTime() - 24 * 60 * 60 * 1000,
        );

        const totalPayinAmountUsingGateways = endUser.payin.reduce(
          (prev, curr) => {
            if (
              curr?.payinMadeOn === PaymentMadeOn.GATEWAY &&
              new Date(curr.createdAt) >= twentyFourHoursAgo
            )
              prev += curr.amount;
            return prev;
          },
          0,
        );

        if (totalPayinAmountUsingGateways > endUserPayinLimit)
          await this.alertService.create({
            for: null,
            userType: Users.ADMIN,
            type: AlertType.USER_PAYIN_LIMIT,
            data: {
              id: endUser?.id,
              userId: endUser?.userId,
              userName: endUser?.name,
              userEmail: endUser?.email,
              userMobile: endUser?.mobile,
              payinAmount: endUser?.totalPayinAmount,
              payoutAmount: endUser?.totalPayoutAmount,
              merchant:
                payinOrderDetails?.merchant?.firstName +
                ' ' +
                payinOrderDetails?.merchant?.lastName,
              createdAt: payinOrderDetails?.createdAt,
              payinAmountUsingGateways: totalPayinAmountUsingGateways,
              currentPayinOrderAmount: payinOrderDetails.amount,
            },
          });
      }
    }

    let member;
    if (paymentMode === PaymentMadeOn.MEMBER) {
      member = await this.memberRepository.findOne({
        where: { id: memberId },
        relations: ['identity'],
      });

      await this.transactionUpdateService.create({
        orderDetails: payinOrderDetails,
        userId: member.identity?.id,
        forMember: true,
        orderType: OrderType.PAYIN,
        systemOrderId: payinOrderDetails.systemOrderId,
      });
    }

    if (paymentMode === PaymentMadeOn.GATEWAY) {
      await this.transactionUpdateService.create({
        orderDetails: payinOrderDetails,
        userId: payinOrderDetails.merchant.identity.id,
        forGateway: true,
        gatewayServiceRate,
        orderType: OrderType.PAYIN,
        systemOrderId: payinOrderDetails.systemOrderId,
      });
    }

    let upiVendor;
    if (paymentMode === PaymentMadeOn.UPI_VENDOR) {
      upiVendor = await this.upiVendorRepository.findOne({
        where: { id: upiVendorId },
        relations: ['identity'],
      });

      // Attach upiVendor to payinOrderDetails so processForUpiVendor can access commissionRate
      payinOrderDetails.upiVendor = upiVendor;

      await this.transactionUpdateService.create({
        orderDetails: payinOrderDetails,
        userId: payinOrderDetails.merchant.identity.id,
        forUpiVendor: true,
        orderType: OrderType.PAYIN,
        systemOrderId: payinOrderDetails.systemOrderId,
      });
    }

    const updateData: any = {
      status: OrderStatus.ASSIGNED,
      payinMadeOn: paymentMode,
      member: paymentMode === PaymentMadeOn.MEMBER ? member : null,
      upiVendor: paymentMode === PaymentMadeOn.UPI_VENDOR ? upiVendor : null,
      gatewayName: paymentMode === PaymentMadeOn.GATEWAY ? gatewayName : null,
      gatewayServiceRate:
        paymentMode === PaymentMadeOn.GATEWAY ? gatewayServiceRate : null,
      transactionDetails:
        paymentMode === PaymentMadeOn.MEMBER
          ? JSON.stringify(memberPaymentDetails)
          : paymentMode === PaymentMadeOn.UPI_VENDOR && upiDetails
            ? JSON.stringify(upiDetails)
            : null,
    };

    if (paymentMode === PaymentMadeOn.UPI_VENDOR && upiVendorId) {
      updateData.upiVendor = { id: upiVendorId };
    }

    await this.payinRepository.update({ systemOrderId: id }, updateData);
    return HttpStatus.OK;
  }

  async updatePayinStatusToSubmitted(body) {
    const { id, transactionId, transactionDetails } = body;

    if (!id) throw new NotAcceptableException('System order ID missing!');
    if (!transactionId)
      throw new NotAcceptableException('Transaction ID missing!');

    const payinOrderDetails = await this.payinRepository.findOne({
      where: {
        systemOrderId: id,
      },
      relations: ['member', 'member.identity', 'upiVendor', 'merchant'],
    });
    if (!payinOrderDetails) throw new NotFoundException('Order not found');

    if (
      payinOrderDetails?.payinMadeOn !== PaymentMadeOn.GATEWAY &&
      payinOrderDetails.status !== OrderStatus.ASSIGNED
    )
      throw new NotAcceptableException('order status is not assigned!');

    let updatedTransactionDetails = payinOrderDetails.transactionDetails;
    if (
      payinOrderDetails?.payinMadeOn === PaymentMadeOn.GATEWAY &&
      transactionDetails
    ) {
      updatedTransactionDetails = JSON.stringify(transactionDetails); // Update only if payment is via gateway
    }

    await this.payinRepository.update(
      { systemOrderId: id },
      {
        status: OrderStatus.SUBMITTED,
        transactionId,
        transactionDetails: updatedTransactionDetails,
      },
    );

    if (payinOrderDetails?.payinMadeOn === PaymentMadeOn.MEMBER) {
      await this.notificationService.create({
        for: payinOrderDetails.member?.id,
        type: NotificationType.PAYIN_FOR_VERIFY,
        data: {
          orderId: payinOrderDetails.systemOrderId,
          amount: payinOrderDetails.amount,
          channel: payinOrderDetails.channel,
        },
      });

      // Withheld
      const deductedQuota = -((payinOrderDetails.amount * 50) / 100);

      await this.memberService.updateQuota(
        payinOrderDetails.member.identity.id,
        payinOrderDetails.systemOrderId,
        deductedQuota,
        false,
        false,
      );
    }

    if (payinOrderDetails?.payinMadeOn === PaymentMadeOn.UPI_VENDOR) {
      if (payinOrderDetails.upiVendor?.id) {
        // Parse UPI details from transactionDetails
        let upiDetails = null;
        if (payinOrderDetails.transactionDetails) {
          try {
            upiDetails = JSON.parse(payinOrderDetails.transactionDetails);
          } catch (error) {
            console.error('Failed to parse UPI details:', error);
          }
        }

        await this.notificationService.create({
          for: payinOrderDetails.upiVendor.id,
          type: NotificationType.PAYIN_FOR_VERIFY,
          data: {
            orderId: payinOrderDetails.systemOrderId,
            trackingId: payinOrderDetails.trackingId,
            amount: payinOrderDetails.amount,
            date: payinOrderDetails.createdAt,
            upiId: upiDetails?.upiId || null,
            upiTitle: upiDetails?.title || null,
            isUpiVendor: true,
          },
        });

        // Auto-verify if order amount is <= threshold
        const merchant = payinOrderDetails.merchant;
        if (
          merchant?.upiVendorAutoVerifyThreshold &&
          payinOrderDetails.amount <= merchant.upiVendorAutoVerifyThreshold
        ) {
          // Automatically complete the order
          await this.updatePayinStatusToComplete({
            id: payinOrderDetails.systemOrderId,
          });

          // Reload payin to get updated status for settlement update
          const updatedPayin = await this.payinRepository.findOne({
            where: { systemOrderId: payinOrderDetails.systemOrderId },
            relations: ['upiVendor'],
          });

          // Update settlement amount for UPI vendor orders
          if (updatedPayin?.upiVendor) {
            await this.updateUpiSettlementAmount(updatedPayin);
          }
        }
      }
    }

    return HttpStatus.OK;
  }

  async updatePayinStatusToFailed(body) {
    const { id, forExpire = false } = body;

    const payinOrderDetails = await this.payinRepository.findOne({
      where: {
        systemOrderId: id,
      },
      relations: ['merchant'],
    });
    if (!payinOrderDetails) throw new NotFoundException('Order not found');

    if (
      !forExpire &&
      payinOrderDetails?.payinMadeOn !== PaymentMadeOn.GATEWAY &&
      payinOrderDetails.status !== OrderStatus.SUBMITTED
    )
      throw new NotAcceptableException(
        'order status is not submitted or already failed or completed!',
      );

    // Fetch ALL transaction updates (including those without user relation like GATEWAY_FEE and UPI_VENDOR_COMMISSION)
    const transactionUpdateEntries = await this.transactionUpdateRepository
      .createQueryBuilder('transactionUpdate')
      .leftJoinAndSelect('transactionUpdate.user', 'user')
      .leftJoinAndSelect('transactionUpdate.payinOrder', 'payinOrder')
      .where('transactionUpdate.systemOrderId = :systemOrderId', {
        systemOrderId: id,
      })
      .andWhere('transactionUpdate.pending = :pending', { pending: true })
      .getMany();

    transactionUpdateEntries.forEach(async (entry) => {
      if (entry.userType === UserTypeForTransactionUpdates.MERCHANT_BALANCE)
        await this.merchantService.updateBalance(
          entry.user.id,
          entry.systemOrderId,
          0,
          true,
        );

      if (entry.userType === UserTypeForTransactionUpdates.MEMBER_BALANCE)
        await this.memberService.updateBalance(
          entry.user.id,
          entry.systemOrderId,
          0,
          true,
        );

      if (entry.userType === UserTypeForTransactionUpdates.MEMBER_QUOTA) {
        // Release Withheld
        const addedQuota = (payinOrderDetails.amount * 50) / 100;
        await this.memberService.updateQuota(
          entry.user.id,
          entry.systemOrderId,
          addedQuota,
          false,
          false,
        );

        await this.memberService.updateQuota(
          entry.user.id,
          entry.systemOrderId,
          0,
          true,
        );
      }

      if (entry.userType === UserTypeForTransactionUpdates.AGENT_BALANCE)
        await this.agentService.updateBalance(
          entry.user.id,
          entry.systemOrderId,
          0,
          true,
        );

      if (entry.userType === UserTypeForTransactionUpdates.SYSTEM_PROFIT)
        await this.systemConfigService.updateSystemProfit(
          0,
          payinOrderDetails.systemOrderId,
          true,
        );

      // Update ALL transaction entries to pending: false (including GATEWAY_FEE and UPI_VENDOR_COMMISSION)
      await this.transactionUpdateRepository.update(entry.id, {
        pending: false,
      });
    });

    await this.payinRepository.update(
      { systemOrderId: id },
      { status: OrderStatus.FAILED },
    );

    this.callPayinWebhooksForApiMode(
      id,
      'live',
      payinOrderDetails.merchant?.id,
    );

    return HttpStatus.OK;
  }

  async updatePayinStatusToComplete(body) {
    const { id } = body;

    const payinOrderDetails = await this.payinRepository.findOne({
      where: {
        systemOrderId: id,
      },
      relations: ['member', 'user', 'member.team', 'merchant', 'upiVendor'],
    });
    if (!payinOrderDetails) throw new NotFoundException('Order not found');

    if (
      payinOrderDetails?.payinMadeOn !== PaymentMadeOn.GATEWAY &&
      payinOrderDetails.status !== OrderStatus.SUBMITTED
    )
      throw new NotAcceptableException(
        'order status is not submitted or already failed or completed!',
      );

    // Fetch ALL transaction updates (including those without user relation like GATEWAY_FEE and UPI_VENDOR_COMMISSION)
    const transactionUpdateEntries = await this.transactionUpdateRepository
      .createQueryBuilder('transactionUpdate')
      .leftJoinAndSelect('transactionUpdate.user', 'user')
      .where('transactionUpdate.systemOrderId = :systemOrderId', {
        systemOrderId: id,
      })
      .andWhere('transactionUpdate.pending = :pending', { pending: true })
      .getMany();

    // Process all entries sequentially to ensure updates complete before fund records are created
    for (const entry of transactionUpdateEntries) {
      if (entry.userType === UserTypeForTransactionUpdates.MERCHANT_BALANCE) {
        const afterBalance = entry.after - entry.before;

        await this.merchantService.updateBalance(
          entry.user.id,
          entry.systemOrderId,
          afterBalance,
          false,
        );
      }

      if (entry.userType === UserTypeForTransactionUpdates.MEMBER_BALANCE) {
        const afterBalance = entry.after - entry.before;

        await this.memberService.updateBalance(
          entry.user.id,
          entry.systemOrderId,
          afterBalance,
          false,
        );
      }

      if (entry.userType === UserTypeForTransactionUpdates.MEMBER_QUOTA) {
        // Release Withheld
        const addedQuota = (payinOrderDetails.amount * 50) / 100;
        await this.memberService.updateQuota(
          entry.user.id,
          entry.systemOrderId,
          addedQuota,
          false,
          false,
        );

        const afterAmount = -(entry.before - entry.after);

        await this.memberService.updateQuota(
          entry.user.id,
          entry.systemOrderId,
          afterAmount,
          false,
        );
      }

      if (entry.userType === UserTypeForTransactionUpdates.AGENT_BALANCE) {
        const afterBalance = entry.after - entry.before;

        await this.agentService.updateBalance(
          entry.user.id,
          entry.systemOrderId,
          afterBalance,
          false,
        );
      }

      if (entry.userType === UserTypeForTransactionUpdates.SYSTEM_PROFIT)
        await this.systemConfigService.updateSystemProfit(
          entry.amount,
          entry.systemOrderId,
          false,
        );

      // For UPI vendor commission, recalculate before and after when order is completed
      if (
        entry.userType ===
          UserTypeForTransactionUpdates.UPI_VENDOR_COMMISSION &&
        payinOrderDetails.upiVendor
      ) {
        const commissionBeforeResult = await this.transactionUpdateRepository
          .createQueryBuilder('tu')
          .select('COALESCE(SUM(tu.amount), 0)', 'total')
          .leftJoin('tu.payinOrder', 'payin')
          .where('tu.userType = :userType', {
            userType: UserTypeForTransactionUpdates.UPI_VENDOR_COMMISSION,
          })
          .andWhere('payin.upiVendor = :upiVendorId', {
            upiVendorId: payinOrderDetails.upiVendor.id,
          })
          .andWhere('tu.systemOrderId != :currentSystemOrderId', {
            currentSystemOrderId: entry.systemOrderId,
          })
          .andWhere('tu.pending = :pending', { pending: false })
          .getRawOne();

        const commissionBefore = roundOffAmount(
          parseFloat(commissionBeforeResult?.total || '0'),
        );
        const commissionAfter = roundOffAmount(
          commissionBefore + (entry.amount || 0),
        );

        await this.transactionUpdateRepository.update(entry.id, {
          pending: false,
          before: commissionBefore,
          after: commissionAfter,
        });
      } else {
        // Update ALL transaction entries to pending: false (including GATEWAY_FEE)
        await this.transactionUpdateRepository.update(entry.id, {
          pending: false,
        });
      }
    }

    await this.fundRecordService.addFundRecordForSuccessOrder({
      orderAmount: payinOrderDetails.amount,
      systemOrderId: payinOrderDetails.systemOrderId,
      orderType: OrderType.PAYIN,
    });

    await this.payinRepository.update(
      { systemOrderId: id },
      {
        status: OrderStatus.COMPLETE,
      },
    );

    this.callPayinWebhooksForApiMode(
      id,
      'live',
      payinOrderDetails.merchant?.id,
    );

    const endUser = await this.endUserRepository.findOne({
      where: {
        id: payinOrderDetails.user.id,
      },
    });

    await this.endUserRepository.update(endUser.id, {
      totalPayinAmount: endUser.totalPayinAmount + payinOrderDetails.amount,
    });

    this.receiptService.createAndMailReceipt(
      payinOrderDetails.systemOrderId,
      payinOrderDetails.user?.email,
    );

    return HttpStatus.OK;
  }

  async findAll() {
    const payins = await this.payinRepository.find();

    return payins;
  }

  async handleCallbackStatusSuccess(systemOrderId, environment = 'live') {
    let payinOrderDetails;

    if (environment === 'live')
      payinOrderDetails = await this.payinRepository.findOneBy({
        systemOrderId,
      });

    if (environment === 'sandbox')
      payinOrderDetails = await this.payinSandboxRepository.findOneBy({
        systemOrderId,
      });

    if (!payinOrderDetails)
      throw new NotFoundException('Payin order not found.');

    if (payinOrderDetails.callbackStatus === CallBackStatus.SUCCESS)
      throw new NotAcceptableException(
        'Callback status is aready set to SUCCESS',
      );

    await this.payinRepository.update(payinOrderDetails.id, {
      callbackStatus: CallBackStatus.SUCCESS,
    });

    return HttpStatus.OK;
  }

  async removeOneDayOldSandboxPayins() {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    try {
      const oldPayins = await this.payinSandboxRepository.find({
        where: {
          createdAt: LessThan(oneDayAgo),
        },
      });

      if (oldPayins.length) await this.payinSandboxRepository.remove(oldPayins);
    } catch (error) {
      console.log(error);
    }
  }

  async callPayinWebhooksForApiMode(
    orderId: string,
    mode: 'sandbox' | 'live',
    merchantId: number,
  ) {
    let payin;

    if (mode === 'live')
      payin = await this.payinRepository.findOne({
        where: {
          systemOrderId: orderId,
        },
        relations: ['user'],
      });
    else
      payin = await this.payinSandboxRepository.findOne({
        where: {
          systemOrderId: orderId,
        },
      });
    if (!payin) return;

    const merchant = await this.merchantRepository.findOne({
      where: { id: merchantId },
    });
    if (!merchant) return;

    const webhookUrl = payin?.webhookUrl;
    if (!webhookUrl) return;

    const tokenPayload = {
      iss: process.env.BASE_URL,
      sub: merchant.integrationId,
      order: payin.merchantOrderId,
      kgOrder: payin.systemOrderId,
    };

    const token = await this.jwtService.createTokenForWebhookVerification(
      tokenPayload,
      merchant.apiKey,
    );

    const response = {
      signature: token,
      orderId: payin.merchantOrderId,
      kgOrderId: payin.systemOrderId,
      status: payin.status,
      user: {
        id: payin.user?.userId,
        name: payin.user?.name,
        mobile: payin.user?.mobile,
        email: payin.user?.email,
      },
      transactionDetails: {
        id: payin.transactionId,
        amount: payin.amount,
        paymentMethod: payin.channel,
        time: payin.updatedAt,
      },
    };

    try {
      const res = await firstValueFrom(
        this.httpService.post(webhookUrl, response),
      );
      if (res)
        await this.handleCallbackStatusSuccess(payin.systemOrderId, mode);
    } catch (error) {
      console.error(`Error calling webhook URL ${webhookUrl}`, error.message);
    }
  }

  async updatePayinStatusManual(
    systemOrderId: string,
    status: OrderStatus.COMPLETE | OrderStatus.FAILED,
  ) {
    let payin = await this.payinRepository.findOne({
      where: { systemOrderId },
      relations: ['user', 'upiVendor'],
    });
    if (!payin) throw new NotFoundException('Payin not found!');

    // Require ASSIGNED status minimum to manually change status to complete/failed
    if (payin.status === OrderStatus.INITIATED) {
      throw new NotAcceptableException(
        'Order must be in ASSIGNED or SUBMITTED status to manually change status to complete or failed.',
      );
    }

    // Allow admin to mark orders as complete/failed from ASSIGNED or SUBMITTED status
    // Ensure proper status flow: ASSIGNED -> SUBMITTED -> COMPLETE/FAILED

    // Step 1: If ASSIGNED, transition to SUBMITTED first
    if (payin.status === OrderStatus.ASSIGNED) {
      await this.updatePayinStatusToSubmitted({
        id: payin.systemOrderId,
        transactionId: payin.transactionId || `ADMIN MANUAL ADJUSTMENT`,
      });
      // Reload payin to get updated status
      payin = await this.payinRepository.findOne({
        where: { systemOrderId },
        relations: ['user', 'upiVendor'],
      });
    }

    // Step 2: Now proceed to COMPLETE or FAILED (order should be SUBMITTED at this point)
    if (status === OrderStatus.COMPLETE) {
      await this.updatePayinStatusToComplete({ id: payin.systemOrderId });

      // Reload payin for settlement update
      payin = await this.payinRepository.findOne({
        where: { systemOrderId },
        relations: ['user', 'upiVendor'],
      });

      // Update settlement amount for UPI vendor orders
      if (payin.payinMadeOn === PaymentMadeOn.UPI_VENDOR && payin.upiVendor) {
        await this.updateUpiSettlementAmount(payin);
      }
    }

    if (status === OrderStatus.FAILED) {
      await this.updatePayinStatusToFailed({ id: payin.systemOrderId });
    }

    return HttpStatus.OK;
  }

  private async updateUpiSettlementAmount(payin: Payin) {
    try {
      // Get the UPI details from transactionDetails
      let upiDetails;
      if (payin.transactionDetails) {
        try {
          upiDetails =
            typeof payin.transactionDetails === 'string'
              ? JSON.parse(payin.transactionDetails)
              : payin.transactionDetails;
        } catch (error) {
          console.error('Failed to parse UPI details:', error);
          return;
        }
      }

      // If upiDetails is nested in upiVendor, extract it
      if (upiDetails?.upiVendor) {
        upiDetails = upiDetails.upiVendor;
      }

      if (!upiDetails?.upiId) {
        console.error('UPI ID not found in transaction details');
        return;
      }

      // Calculate settlement amount
      // Settlement = Payin Amount - Commission
      const commissionAmount =
        (payin.amount * payin.upiVendor?.commissionRate) / 100;
      const settlementForThisOrder = payin.amount - commissionAmount;

      // Find the UPI entity and update settlement amount
      const upiEntity = await this.upiRepository.findOne({
        where: { upiId: upiDetails?.upiId },
      });

      if (upiEntity) {
        const currentSettlement = upiEntity.settlementAmount || 0;
        const newSettlement = currentSettlement + settlementForThisOrder;

        // Round to 2 decimal places
        const roundedSettlement = roundOffAmount((newSettlement * 100) / 100);

        await this.upiRepository.update(
          { upiId: upiDetails?.upiId },
          { settlementAmount: roundedSettlement },
        );
      }
    } catch (error) {
      console.error('Error updating UPI settlement amount:', error);
    }
  }

  async getAllAssignedOrdersWithTrackingId() {
    return await this.payinRepository.find({
      where: [
        {
          status: OrderStatus.ASSIGNED,
          trackingId: Not(IsNull()),
        },
        {
          status: OrderStatus.ASSIGNED,
          transactionId: Not(IsNull()),
        },
      ],
    });
  }

  async getOldIncompletedOrders() {
    const expiryTime = new Date(Date.now() - 25 * 60 * 60 * 1000); // 25 hours

    return await this.payinRepository.find({
      where: {
        status: In([OrderStatus.INITIATED, OrderStatus.ASSIGNED]),
        createdAt: LessThan(expiryTime),
      },
    });
  }

  async expireOldOrders() {
    const oldOrders = await this.getOldIncompletedOrders();
    if (!oldOrders || !oldOrders.length) return;

    for (const order of oldOrders) {
      try {
        await this.updatePayinStatusToFailed({
          id: order.systemOrderId,
          forExpire: true,
        });
      } catch (error) {
        console.error(`Failed to expire order ${order.systemOrderId}:`, error);
      }
    }
  }

  async getPayinDetailsFromMerchantOrderId(
    merchantOrderId: string,
    integrationId: string,
  ) {
    const payin = await this.payinRepository.findOne({
      where: {
        merchantOrderId: merchantOrderId,
        merchant: {
          integrationId,
        },
      },
      relations: ['merchant'],
    });
    if (!payin) throw new NotFoundException('Payin not found!');

    return {
      orderId: payin.systemOrderId,
    };
  }
}
