import { systemConfigData } from './../system-config/data/system-config.data';
import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
  Res,
} from '@nestjs/common';

import { PhonepeService } from './phonepe/phonepe.service';
import { RazorpayService } from './razorpay/razorpay.service';
import { CreatePaymentOrderDto } from './dto/createPaymentOrder.dto';
import { Repository } from 'typeorm';
import { Merchant } from 'src/merchant/entities/merchant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PayinService } from 'src/payin/payin.service';
import { PaymentSystemUtilService } from './payment-system.util.service';
import {
  ChannelName,
  GatewayName,
  OrderStatus,
  OrderType,
  PaymentMadeOn,
} from 'src/utils/enum/enum';
import {
  AssignPaymentGatewayDto,
  GetPaymentPageApiModeDto,
  GetPayPageDto,
} from './dto/getPayPage.dto';
import { SystemConfigService } from 'src/system-config/system-config.service';
import { UniqpayService } from './uniqpay/uniqpay.service';
import { Payin } from 'src/payin/entities/payin.entity';
import { MemberChannelService } from './member/member-channel.service';
import { UpiVendorChannelService } from './upi-vendor/upi-vendor-channel.service';
import { PayinSandbox } from 'src/payin/entities/payin-sandbox.entity';
import QRCode from 'qrcode';
import { PayuService } from './payu/payu.service';
import { PayinGateway } from 'src/socket/payin.gateway';
import { CashfreeService } from './cashfree/cashfree.service';
import { Response } from 'express';
import { UpiVendorQueueService } from 'src/upi-vendor/upi-vendor-queue.service';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationType } from 'src/utils/enum/enum';
import { Upi } from 'src/channel/entity/upi.entity';
import { roundOffAmount } from 'src/utils/utils';
import { DokuService } from './doku/doku.service';
import { MidtransService } from './midtrans/midtrans.service';
import { XenditService } from './xendit/xendit.service';

// const paymentPageBaseUrl = 'http://localhost:5174';
@Injectable()
export class PaymentSystemService {
  constructor(
    @InjectRepository(Merchant)
    private readonly merchantRepository: Repository<Merchant>,
    @InjectRepository(Payin)
    private readonly payinRepository: Repository<Payin>,
    @InjectRepository(PayinSandbox)
    private readonly payinSandboxRepository: Repository<PayinSandbox>,
    @InjectRepository(Upi)
    private readonly upiRepository: Repository<Upi>,

    private readonly phonepeService: PhonepeService,
    private readonly razorpayService: RazorpayService,
    private readonly uniqpayService: UniqpayService,
    private readonly payuService: PayuService,
    private readonly payinService: PayinService,
    private readonly utilService: PaymentSystemUtilService,
    private readonly systemConfigService: SystemConfigService,
    private readonly memberChannelService: MemberChannelService,
    private readonly upiVendorChannelService: UpiVendorChannelService,
    private readonly payinGateway: PayinGateway,
    private readonly cashfreeService: CashfreeService,
    private readonly dokuService: DokuService,
    private readonly midtransService: MidtransService,
    private readonly xenditService: XenditService,
    private readonly upiVendorQueueService: UpiVendorQueueService,
    private readonly notificationService: NotificationService,
  ) {}

  private mapPaymentMethodForApi(
    channel: ChannelName,
    gatewayName?: GatewayName,
  ): ChannelName | 'QRIS' {
    if (
      channel === ChannelName.UPI &&
      [GatewayName.DOKU, GatewayName.MIDTRANS, GatewayName.XENDIT].includes(
        gatewayName,
      )
    ) {
      return 'QRIS';
    }
    return channel;
  }

  async getPayPage(getPayPageDto: GetPayPageDto) {
    await this.utilService.getPayPage(getPayPageDto);
  }

  async assignPaymentGateway(
    assignPaymentGatewayDto: AssignPaymentGatewayDto,
    response: Response,
  ) {
    const { integrationId, systemOrderId, environment, paymentGateway } =
      assignPaymentGatewayDto;

    const merchant = await this.merchantRepository.findOne({
      where: {
        integrationId,
      },
      relations: ['payin'],
    });
    if (!merchant) throw new NotFoundException('Merchant not found!');

    let payin;
    if (environment === 'live') {
      payin = await this.payinRepository.findOne({
        where: {
          systemOrderId,
        },
        relations: ['user'],
      });
      if (!payin) throw new NotFoundException('Payin not found!');

      if (payin.status !== OrderStatus.INITIATED) {
        const url = payin?.gatewayPaymentLink;

        response.redirect(url);
      }

      if (payin.status === OrderStatus.INITIATED) {
        const url = paymentGateway
          ? await this.utilService.processPaymentMethodLive(
              merchant,
              payin,
              paymentGateway,
              payin.user.userId,
              environment,
            )
          : await this.utilService.assignPaymentMethodForPayinOrder(
              merchant,
              payin,
              payin.user.userId,
              environment,
            );

        response.redirect(url);
      }
    }

    if (environment === 'sandbox') {
      payin = await this.payinSandboxRepository.findOne({
        where: {
          systemOrderId,
        },
      });
      if (!payin) throw new NotFoundException('Payin not found!');

      if (!payin?.gatewayPaymentLink) {
        const url = await this.utilService.processPaymentMethodSandbox(
          merchant,
          payin,
          paymentGateway,
          payin.user.userId,
          environment,
        );

        return response.redirect(url);
      }

      if (payin.status !== OrderStatus.INITIATED) {
        const url = payin?.gatewayPaymentLink;

        return response.redirect(url);
      }
    }
  }

  async createPaymentOrder(
    createPaymentOrderDto: CreatePaymentOrderDto,
    response?: Response,
  ) {
    const { environment, orderId } = createPaymentOrderDto;

    const merchant = await this.merchantRepository.findOne({
      where: {
        integrationId: createPaymentOrderDto.integrationId,
      },
      relations: [
        'payin',
        'payin.member',
        'payinModeDetails',
        'payinModeDetails.proportionalRange',
        'payinModeDetails.amountRangeRange',
      ],
    });
    if (!merchant) throw new NotFoundException('Merchant not found!');

    if (!merchant.enablePayins)
      throw new ForbiddenException(
        'Payment links are currently not enabled for your account!',
      );

    let createdPayin;

    if (environment === 'live') {
      const existingPayinWithSameOrderId = await this.payinRepository.findOne({
        where: {
          merchant: {
            id: merchant.id,
          },
          merchantOrderId: orderId,
        },
        relations: ['merchant'],
      });

      if (existingPayinWithSameOrderId)
        throw new BadRequestException(
          'An order with this orderId already exists!',
        );

      createdPayin = await this.payinService.create(createPaymentOrderDto);
    }

    if (environment === 'sandbox') {
      const existingPayinWithSameOrderId = await this.payinSandboxRepository
        .createQueryBuilder('payin')
        .where('payin.merchantOrderId = :orderId', { orderId })
        .andWhere(`payin.merchant->>'id' = :merchantId`, {
          merchantId: merchant.id,
        })
        .getOne();

      if (existingPayinWithSameOrderId)
        throw new BadRequestException(
          'An order with this orderId already exists!',
        );

      if (!createPaymentOrderDto.paymentMethod)
        throw new NotAcceptableException('Payment method missing!');

      createdPayin = await this.payinService.createAndAssignSandbox({
        ...createPaymentOrderDto,
        paymentMethod: createPaymentOrderDto.paymentMethod,
        merchantId: merchant.id,
      });

      this.utilService.processPaymentMethodSandbox(
        merchant,
        createdPayin,
        createPaymentOrderDto.paymentMethod,
        createPaymentOrderDto.userId,
        environment,
      );
    }

    const paymentPageUrlLive = `${process.env.PAYMENT_PAGE_BASE_URL}/checkout/${merchant.integrationId}?orderId=${createdPayin?.systemOrderId}&apiMode=true&environment=${environment}${
      createPaymentOrderDto?.paymentMethod
        ? `&paymentGateway=${createPaymentOrderDto.paymentMethod}`
        : ''
    }`;

    const paymentPageUrlSandbox = `${process.env.PAYMENT_PAGE_BASE_URL}/checkout/${merchant.integrationId}?orderId=${createdPayin?.systemOrderId}&apiMode=true&environment=${environment}&paymentGateway=${
      createPaymentOrderDto?.paymentMethod
    }`;

    const paymentPageUrl =
      environment === 'live' ? paymentPageUrlLive : paymentPageUrlSandbox;

    if (response) response.redirect(paymentPageUrl);

    return {
      status: HttpStatus.CREATED,
      data: {
        url: paymentPageUrl,
      },
    };
  }

  async getPaymentPageForApiMode(
    merchantId: number,
    getPaymentPageDto: GetPaymentPageApiModeDto,
    ip: string,
  ) {
    const merchant = await this.merchantRepository.findOne({
      where: { id: merchantId },
    });
    if (!merchant) throw new NotFoundException('Merchant not found!');

    if (!merchant.enablePayins)
      throw new ForbiddenException(
        'Payment links are currently not enabled for your account!',
      );

    if (merchant.identity?.ips?.length) {
      let whiteListedIps = [];
      merchant.identity.ips.forEach((item) => whiteListedIps.push(item.value));
      if (!whiteListedIps.includes(ip))
        throw new ForbiddenException('IP restricted!');
    }

    const {
      orderId,
      amount,
      user,
      environment,
      successUrl,
      failureUrl,
      webhookUrl,
      paymentGateway,
      paymentMethod,
    } = getPaymentPageDto;

    const createPaymentOrderDto = {
      amount,
      orderId,
      userId: user.id,
      userName: user.name,
      userEmail: user?.email,
      userMobileNumber: user?.mobileNumber,
      integrationId: merchant.integrationId,
      channel: paymentMethod,
      environment,
      paymentMethod:
        (paymentGateway?.toLowerCase() as
          | 'member'
          | 'razorpay'
          | 'phonepe'
          | 'payu'
          | 'cashfree'
          | 'doku'
          | 'midtrans'
          | 'xendit'
          | 'upi-vendor') || null,
      successUrl,
      failureUrl,
      webhookUrl,
      mode: 'api' as 'api',
    };

    return await this.createPaymentOrder(createPaymentOrderDto);
  }

  async makeGatewayPayout(body): Promise<any> {
    const { orderType } = body;

    if (!orderType) throw new BadRequestException('Order Type Required!');

    const { defaultPayoutGateway, defaultWithdrawalGateway } =
      await this.systemConfigService.findLatest();

    let defaultEnabledGateway;
    if (orderType === OrderType.WITHDRAWAL)
      defaultEnabledGateway = await this.utilService.getFirstEnabledGateway(
        defaultWithdrawalGateway,
      );

    if (orderType === OrderType.PAYOUT)
      defaultEnabledGateway =
        await this.utilService.getFirstEnabledGateway(defaultPayoutGateway);

    return await this.processPaymentWithGateway(defaultEnabledGateway, body);
  }

  private async processPaymentWithGateway(gatewayName: GatewayName, body: any) {
    switch (gatewayName) {
      case GatewayName.RAZORPAY:
        return body?.forInternalUsers
          ? await this.razorpayService.makePayoutPaymentForInternalUsers(body)
          : await this.razorpayService.makePayoutPaymentForEndUsers(body);

      case GatewayName.UNIQPAY:
        return body?.forInternalUsers
          ? await this.uniqpayService.makePayoutPaymentForInternalUsers(body)
          : await this.uniqpayService.makePayoutPaymentForEndUsers(body);

      case GatewayName.CASHFREE:
        return body?.forInternalUsers
          ? await this.cashfreeService.makePayoutPaymentForInternalUsers(body)
          : await this.cashfreeService.makePayoutPaymentForEndUsers(body);

      case GatewayName.DOKU:
        return body?.forInternalUsers
          ? await this.dokuService.makePayoutPaymentForInternalUsers(body)
          : await this.dokuService.makePayoutPaymentForEndUsers(body);

      case GatewayName.MIDTRANS:
        return body?.forInternalUsers
          ? await this.midtransService.makePayoutPaymentForInternalUsers(body)
          : await this.midtransService.makePayoutPaymentForEndUsers(body);

      case GatewayName.XENDIT:
        return body?.forInternalUsers
          ? await this.xenditService.makePayoutPaymentForInternalUsers(body)
          : await this.xenditService.makePayoutPaymentForEndUsers(body);

      default:
        return;
    }
  }

  async getPaymentStatus(
    payinOrderId: string,
    environment: 'live' | 'sandbox',
  ) {
    let payinOrder;

    if (environment === 'live')
      payinOrder = await this.payinRepository.findOneBy({
        systemOrderId: payinOrderId,
      });

    if (environment === 'sandbox')
      payinOrder = await this.payinSandboxRepository.findOneBy({
        systemOrderId: payinOrderId,
      });

    if (!payinOrder) return;

    const paymentMethod = payinOrder.payinMadeOn;

    let res = null;

    if (paymentMethod === PaymentMadeOn.MEMBER) {
      res = await this.memberChannelService.getPaymentStatus(payinOrder);
    } else if (paymentMethod === PaymentMadeOn.UPI_VENDOR) {
      res = await this.upiVendorChannelService.getPaymentStatus(payinOrder);
    } else {
      if (payinOrder.gatewayName === GatewayName.RAZORPAY) {
        if (!payinOrder || !payinOrder.trackingId) return;

        res = await this.razorpayService.getPaymentStatus(
          payinOrder.trackingId,
          environment,
        );
      }

      if (payinOrder.gatewayName === GatewayName.PHONEPE) {
        if (!payinOrder || !payinOrder.systemOrderId) return;

        res = await this.phonepeService.getPaymentStatus(
          payinOrder.systemOrderId,
          environment,
        );
      }

      if (payinOrder.gatewayName === GatewayName.PAYU) {
        if (!payinOrder || !payinOrder.trackingId) return;

        res = await this.payuService.getPaymentStatus(
          payinOrder.trackingId,
          environment,
        );
      }

      if (payinOrder.gatewayName === GatewayName.CASHFREE) {
        if (!payinOrder || !payinOrder.trackingId) return;

        res = await this.cashfreeService.getPaymentStatus(
          payinOrder.trackingId,
          environment,
        );
      }

      if (payinOrder.gatewayName === GatewayName.DOKU) {
        if (!payinOrder) return;

        res = await this.dokuService.getPaymentStatus(
          payinOrder.trackingId || payinOrder.systemOrderId,
          environment,
        );
      }

      if (payinOrder.gatewayName === GatewayName.MIDTRANS) {
        if (!payinOrder || !payinOrder.systemOrderId) return;

        res = await this.midtransService.getPaymentStatus(
          payinOrder.systemOrderId,
          environment,
        );
      }

      if (payinOrder.gatewayName === GatewayName.XENDIT) {
        if (!payinOrder || !payinOrder.trackingId) return;

        res = await this.xenditService.getPaymentStatus(
          payinOrder.trackingId,
          environment,
        );
      }

      if (res && (res?.status === 'SUCCESS' || res?.status === 'FAILED')) {
        if (environment === 'sandbox') {
          await this.payinSandboxRepository.update(
            { systemOrderId: payinOrderId },
            {
              transactionId: res.details?.transactionId || 'trnx001',
              transactionDetails: res.details?.otherPaymentDetails,
            },
          );

          if (res?.status === 'SUCCESS') {
            await this.payinSandboxRepository.update(
              { systemOrderId: payinOrderId },
              {
                status: OrderStatus.COMPLETE,
              },
            );
            this.payinService.callPayinWebhooksForApiMode(
              payinOrderId,
              'sandbox',
              payinOrder.merchant?.id,
            );
          }

          if (res?.status === 'FAILED') {
            await this.payinSandboxRepository.update(
              { systemOrderId: payinOrderId },
              {
                status: OrderStatus.FAILED,
              },
            );
            this.payinService.callPayinWebhooksForApiMode(
              payinOrderId,
              'sandbox',
              payinOrder.merchant?.id,
            );
          }
        }

        if (environment === 'live') {
          await this.payinService.updatePayinStatusToSubmitted({
            id: payinOrderId,
            transactionId: res.details?.transactionId || 'trnx001',
            transactionDetails: res.details?.otherPaymentDetails,
          });

          if (res?.status === 'SUCCESS') {
            await this.payinService.updatePayinStatusToComplete({
              id: payinOrderId,
            });
          }

          if (res?.status === 'FAILED') {
            await this.payinService.updatePayinStatusToFailed({
              id: payinOrderId,
            });
          }
        }
      }
    }
    if (payinOrder?.successUrl || payinOrder?.failureUrl) {
      if (res && res?.status === 'SUCCESS')
        return { status: res?.status, redirectUrl: payinOrder.successUrl };

      if (res && res?.status === 'FAILED')
        return { status: res?.status, redirectUrl: payinOrder.failureUrl };
    } else if (res) {
      return { status: res?.status };
    }

    // Never return an empty object from this endpoint.
    return { status: 'PENDING' };
  }

  async getOrderDetailsForIntegrationKit(
    id: string,
    environment: 'sandbox' | 'live',
  ) {
    if (!id || !environment) return;

    let payin;

    if (environment === 'live')
      payin = await this.payinRepository.findOne({
        where: { systemOrderId: id },
        relations: ['user'],
      });

    if (environment === 'sandbox') {
      payin = await this.payinSandboxRepository.findOne({
        where: { systemOrderId: id },
      });
    }

    if (!payin) throw new NotFoundException('Payin order not found!');

    return {
      kingsgateOrderId: payin.systemOrderId,
      orderId: payin.merchantOrderId,
      status: payin.status === OrderStatus.FAILED ? 'FAILED' : 'SUCCESS',
      user: {
        id: payin.user?.userId,
        name: payin.user?.name,
        mobile: payin.user?.mobile,
        email: payin.user?.email,
      },
      transactionDetails: {
        id: payin.transactionId,
        amount: payin.amount,
        paymentMethod: this.mapPaymentMethodForApi(
          payin.channel,
          payin.gatewayName,
        ),
        time: payin.updatedAt,
      },
    };
  }

  async getOrderStatusForApiMode(
    orderId: string,
    environment: 'sandbox' | 'live',
    merchantId: number,
  ) {
    if (!orderId) throw new BadRequestException('Order Id missing!');

    if (!environment)
      throw new BadRequestException('Query param - environment missing!');

    if (environment !== 'live' && environment !== 'sandbox')
      throw new BadRequestException(
        'environment must be either sandbox or live!',
      );

    let payin;
    if (environment === 'live')
      payin = await this.payinRepository.findOne({
        where: [
          { merchantOrderId: orderId, merchant: { id: merchantId } },
          { systemOrderId: orderId, merchant: { id: merchantId } },
        ],
        relations: ['user', 'merchant'],
      });

    if (environment === 'sandbox')
      payin = await this.payinSandboxRepository
        .createQueryBuilder('payin')
        .where(
          `(payin.merchantOrderId = :orderId OR payin.systemOrderId = :orderId)`,
          { orderId },
        )
        .andWhere(`payin.merchant->>'id' = :merchantId`, {
          merchantId: merchantId,
        })
        .getOne();

    if (!payin)
      throw new NotFoundException(`Order not found by order ID - ${orderId}`);

    return {
      httpStatus: HttpStatus.OK,
      data: {
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
          paymentMethod: this.mapPaymentMethodForApi(
            payin.channel,
            payin.gatewayName,
          ),
          time: payin.updatedAt,
        },
      },
    };
  }

  async receivePhonepeRequest(request, body, environment) {
    const res = await this.phonepeService.receivePhonepeRequest(
      request,
      body,
      environment,
    );

    if (
      res &&
      (res?.code === 'PAYMENT_SUCCESS' || res?.code === 'PAYMENT_FAILED')
    ) {
      const payinOrder = await this.payinRepository.findOneBy({
        systemOrderId: res?.data?.merchantTransactionId,
      });
      if (!payinOrder) throw new NotFoundException('Payin order not found!');

      await this.payinService.updatePayinStatusToSubmitted({
        id: payinOrder.id,
        transactionReceipt: 'receipt',
        transactionId: res?.data?.transactionId || 'trnx001',
        transactionDetails: res?.data,
      });

      if (res.code === 'PAYMENT_SUCCESS')
        await this.payinService.updatePayinStatusToComplete({
          id: payinOrder.id,
        });

      if (res.code === 'PAYMENT_FAILED')
        await this.payinService.updatePayinStatusToFailed({
          id: payinOrder.id,
        });
    }
  }

  async getMemberChannelPageForSandbox(payinOrderId) {
    const payin = await this.payinSandboxRepository.findOne({
      where: { systemOrderId: payinOrderId },
    });
    if (!payin) throw new NotFoundException('Payin order not found!');

    const name = payin.member.name;
    const amount = payin.amount;

    switch (payin.channel) {
      case ChannelName.UPI:
        const upiDetails = {
          upiId: 'karlpearson@upi',
          mobile: '9876543210',
          isBusinessUpi: true,
        };
        const upiIntentURI = `upi://pay?pa=${upiDetails.upiId}&pn=${name}&am=${amount}&cu=INR`;

        return {
          channel: 'upi',
          amount: amount,
          memberDetails: {
            upiId: upiDetails.upiId,
            isBusiness: upiDetails.isBusinessUpi,
            name: name,
            qrCode: await QRCode.toDataURL(upiIntentURI),
          },
        };

      case ChannelName.BANKING:
        const netBankingDetails = {
          beneficiaryName: 'Karl Pearson',
          name: name,
          accountNumber: '1234 1234 1234 1234',
          ifsc: 'SBI002900',
          bankName: 'SBI',
        };

        return {
          channel: 'netbanking',
          amount: amount,
          memberDetails: {
            beneficiaryName: netBankingDetails.beneficiaryName,
            name: name,
            accountNumber: netBankingDetails.accountNumber,
            ifsc: netBankingDetails.ifsc,
            bank: netBankingDetails.bankName,
          },
        };

      case ChannelName.E_WALLET:
        const eWalletDetails = {
          app: 'Dummy App',
          name: name,
          mobile: '9876543210',
        };

        return {
          channel: 'e-wallet',
          amount: amount,
          memberDetails: {
            appName: eWalletDetails.app,
            name: name,
            mobile: eWalletDetails.mobile,
          },
        };
    }
  }

  async updatePendingPayinOrdersStatus() {
    // All assigned payin orders with tracking or transaction Id saved
    const assignedPayins =
      await this.payinService.getAllAssignedOrdersWithTrackingId();
    if (!assignedPayins) return;

    for (const payin of assignedPayins) {
      await this.getPaymentStatus(payin.systemOrderId, 'live');
    }
  }

  async getUpiVendorChannelPage(
    payinOrderId: string,
    environment: 'live' | 'sandbox',
  ) {
    if (environment === 'sandbox') {
      // Return mock UPI vendor data for sandbox
      const upiDetails = {
        upiId: 'vendor@upi',
        beneficiaryName: 'Vendor Name',
        mobile: '9876543210',
        isBusinessUpi: true,
      };
      const amount = 1000;
      const upiIntentURI = `upi://pay?pa=${upiDetails.upiId}&pn=${upiDetails.beneficiaryName}&am=${amount}&cu=INR`;

      return {
        channel: 'upi',
        amount: amount,
        upiDetails: {
          upiId: upiDetails.upiId,
          beneficiaryName: upiDetails.beneficiaryName,
          mobile: upiDetails.mobile,
          isBusiness: upiDetails.isBusinessUpi,
          qrCode: await QRCode.toDataURL(upiIntentURI),
        },
      };
    }

    // For live environment
    const payin = await this.payinRepository.findOne({
      where: { systemOrderId: payinOrderId },
      relations: ['upiVendor', 'upiVendor.identity', 'upiVendor.identity.upi'],
    });

    if (!payin) throw new NotFoundException('Payin order not found');

    if (payin.payinMadeOn !== PaymentMadeOn.UPI_VENDOR)
      throw new BadRequestException(
        'This order is not assigned to UPI vendor gateway',
      );

    // Parse UPI details from transactionDetails
    let upiDetails;
    if (payin.transactionDetails) {
      try {
        upiDetails =
          typeof payin.transactionDetails === 'string'
            ? JSON.parse(payin.transactionDetails)
            : payin.transactionDetails;
      } catch (error) {
        throw new Error('Failed to parse UPI details');
      }
    }

    if (!upiDetails) throw new NotFoundException('UPI details not found');

    const amount = payin.amount;
    const beneficiaryName = upiDetails.beneficiaryName || upiDetails.vendorName;
    const trackingId = payin.trackingId;

    // Get tr (transaction reference) from UPI table if upiEntityId is available
    let tr = trackingId; // Default to trackingId if tr not found in UPI table
    if (upiDetails.upiEntityId) {
      const upiRecord = await this.upiRepository.findOne({
        where: { id: upiDetails.upiEntityId },
      });
      if (upiRecord?.tr) tr = upiRecord.tr;
    }

    // Add tracking ID and tr to UPI intent URI
    const upiIntentURI = `upi://pay?am=${amount}&cu=INR&pa=${upiDetails.upiId}&pn=${beneficiaryName}&tn=${trackingId}&tr=${tr}`;

    return {
      channel: 'upi',
      amount: amount,
      upiDetails: {
        upiId: upiDetails.upiId,
        beneficiaryName: beneficiaryName,
        mobile: upiDetails.mobile,
        isBusiness: upiDetails.isBusinessUpi,
        title: upiDetails.title,
        trackingId: trackingId,
        tr: tr,
        qrCode: await QRCode.toDataURL(upiIntentURI),
      },
    };
  }

  async handleSubmitPayment(
    payinOrderId: string,
    txnId: string,
    environment: string,
  ) {
    // Handle sandbox environment
    if (environment === 'sandbox') {
      await this.payinSandboxRepository.update(
        {
          systemOrderId: payinOrderId,
        },
        {
          transactionId: txnId,
          status: OrderStatus.COMPLETE,
        },
      );

      return HttpStatus.OK;
    }

    // Fetch payin details with upiVendor relation
    const payin = await this.payinRepository.findOne({
      where: { systemOrderId: payinOrderId },
      relations: ['upiVendor'],
    });

    if (!payin) {
      throw new NotFoundException('Payin order not found');
    }

    // Update payin status to submitted
    await this.payinService.updatePayinStatusToSubmitted({
      transactionId: txnId,
      id: payinOrderId,
    });

    // Increment pointer ONLY after successful submission for UPI vendor payments
    if (payin.payinMadeOn === PaymentMadeOn.UPI_VENDOR) {
      await this.upiVendorQueueService.incrementPointer();
    }

    return HttpStatus.OK;
  }

  async verifyPayment(
    submitUtrDto: { payinOrderId: string; utr?: string },
    vendorId: number,
  ) {
    const { payinOrderId } = submitUtrDto;

    // Fetch payin details with upiVendor relation
    const payin = await this.payinRepository.findOne({
      where: { systemOrderId: payinOrderId },
      relations: ['upiVendor'],
    });

    if (!payin) throw new NotFoundException('Payin order not found!');

    if (payin.upiVendor?.id !== vendorId)
      throw new BadRequestException('This order does not belong to you!');

    if (payin.status !== OrderStatus.SUBMITTED)
      throw new BadRequestException('Order is not in submitted status!');

    // Complete the order without UTR verification (vendor confirms at FE)
    await this.payinService.updatePayinStatusToComplete({
      id: payin.systemOrderId,
    });

    // Update settlement amount for the UPI ID
    await this.updateUpiSettlementAmount(payin);

    return {
      success: true,
      message: 'Payment confirmed and order completed successfully',
      orderId: payinOrderId,
      status: 'COMPLETE',
    };
  }

  async rejectPayment(
    rejectPaymentDto: { payinOrderId: string },
    vendorId: number,
  ) {
    const { payinOrderId } = rejectPaymentDto;

    // Fetch payin details with upiVendor relation
    const payin = await this.payinRepository.findOne({
      where: { systemOrderId: payinOrderId },
      relations: ['upiVendor'],
    });

    if (!payin) throw new NotFoundException('Payin order not found!');

    if (payin.upiVendor?.id !== vendorId)
      throw new BadRequestException('This order does not belong to you!');

    if (payin.status !== OrderStatus.SUBMITTED)
      throw new BadRequestException('Order is not in submitted status!');

    // Set hasUtrMismatch to true instead of failing the order
    await this.payinRepository.update(
      { systemOrderId: payinOrderId },
      { hasUtrMismatch: true },
    );

    return {
      success: true,
      message: 'Payment rejected and marked with UTR mismatch',
      orderId: payinOrderId,
      status: 'SUBMITTED',
      hasUtrMismatch: true,
    };
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

      if (!upiDetails?.upiId) {
        console.error('UPI entity ID not found in transaction details');
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
}
