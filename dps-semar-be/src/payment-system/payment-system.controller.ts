import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  BadRequestException,
  NotFoundException,
  HttpStatus,
  UseGuards,
  Request,
  Query,
  Res,
} from '@nestjs/common';
import { PaymentSystemService } from './payment-system.service';
import QRCode from 'qrcode';
import { CreatePaymentOrderDto } from './dto/createPaymentOrder.dto';
import { SubmitPaymentOrderDto } from './dto/submitPayment.dto';
import { SubmitUtrDto } from './dto/submit-utr.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Merchant } from 'src/merchant/entities/merchant.entity';
import { Repository } from 'typeorm';
import { Payin } from 'src/payin/entities/payin.entity';
import { ChannelName, Role } from 'src/utils/enum/enum';
import { Config } from 'src/channel/entity/config.entity';
import { AssignPaymentGatewayDto, GetPayPageDto } from './dto/getPayPage.dto';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { RolesGuard } from 'src/utils/guard/roles.guard';
import { UserInReq } from 'src/utils/decorators/user-in-req.decorator';
import { Response } from 'express';

@Controller('payment-system')
export class PaymentSystemController {
  constructor(
    @InjectRepository(Merchant)
    private readonly merchantRepository: Repository<Merchant>,
    @InjectRepository(Payin)
    private readonly payinRepository: Repository<Payin>,
    @InjectRepository(Config)
    private readonly configRepository: Repository<Config>,
    private readonly service: PaymentSystemService,
  ) {}

  @Post('checkout/:integrationId')
  @Roles(Role.ALL)
  @UseGuards(RolesGuard)
  async getCheckout(
    @Param('integrationId') integrationId: string,
    @Body() body: { requestOrigin: string },
  ) {
    const merchant = await this.merchantRepository.findOneBy({ integrationId });
    const { requestOrigin } = body;

    if (!merchant)
      throw new NotFoundException(
        'Merchant not found or invalid integration ID!',
      );

    if (!merchant.enabled)
      throw new BadRequestException(
        'Integration Error. Merchant profile is disabled.',
      );

    // if (merchant.businessUrl && !requestOrigin?.includes(merchant.businessUrl))
    //   throw new UnauthorizedException(
    //     'Authorization Error. Business Url validation failed.',
    //   );

    let enabledChannels;
    if (merchant.payinChannels) {
      enabledChannels = (
        await this.configRepository.findBy({
          incoming: true,
        })
      ).map((ch) => ch.name);

      if (enabledChannels.length <= 0)
        throw new BadRequestException('All channels are disabled!');
    }

    let merchantChannels;
    if (merchant.payinChannels) {
      merchantChannels = JSON.parse(merchant.payinChannels).map(
        (item) => item?.channel,
      );
    }

    return {
      businessName: merchant.businessName,
      channels: merchantChannels.filter((ch) => enabledChannels?.includes(ch)),
    };
  }

  @Post('create-payment-order')
  @Roles(Role.ALL)
  @UseGuards(RolesGuard)
  async createPaymentOrder(
    @Body() createPaymentOrderDto: CreatePaymentOrderDto,
  ) {
    return this.service.createPaymentOrder(createPaymentOrderDto);
  }

  @Get('create-payment-order-sdk')
  @Roles(Role.ALL)
  @UseGuards(RolesGuard)
  async createPaymentOrderSdk(
    @Query('payload') req: string,
    @Res() response: Response,
  ) {
    const createPaymentOrderDto: CreatePaymentOrderDto = JSON.parse(
      decodeURIComponent(req),
    );

    return this.service.createPaymentOrder(createPaymentOrderDto, response);
  }

  @Post('assign-payment-gateway')
  async assignPaymentGateway(
    @Body() assignPaymentGatewayDto: AssignPaymentGatewayDto,
    @Res() response: Response,
  ) {
    return this.service.assignPaymentGateway(assignPaymentGatewayDto, response);
  }

  @Get('member-channel/:payinOrderId')
  @Roles(Role.ALL)
  @UseGuards(RolesGuard)
  async getMemberChannelPage(
    @Param('payinOrderId') payinOrderId: string,
    @Query('environment') environment: 'live' | 'sandbox',
  ) {
    if (environment === 'sandbox')
      return await this.service.getMemberChannelPageForSandbox(payinOrderId);

    const payin = await this.payinRepository.findOne({
      where: { systemOrderId: payinOrderId },
      relations: [
        'member',
        'member.identity',
        'member.identity.upi',
        'member.identity.netBanking',
        'member.identity.eWallet',
      ],
    });
    if (!payin) throw new NotFoundException('Payin order not found!');

    const name = payin.member?.firstName + ' ' + payin.member?.lastName;
    const amount = payin.amount;

    switch (payin.channel) {
      case ChannelName.UPI:
        const upiDetails = payin.member.identity.upi[0];
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
        const netBankingDetails = payin.member.identity.netBanking[0];

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
        const eWalletDetails = payin.member.identity.eWallet[0];

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

  @Get('upi-vendor-channel/:payinOrderId')
  @Roles(Role.ALL)
  @UseGuards(RolesGuard)
  async getUpiVendorChannelPage(
    @Param('payinOrderId') payinOrderId: string,
    @Query('environment') environment: 'live' | 'sandbox',
  ) {
    return await this.service.getUpiVendorChannelPage(
      payinOrderId,
      environment,
    );
  }

  @Get('status/:payinOrderId')
  @Roles(Role.ALL)
  @UseGuards(RolesGuard)
  async getPaymentStatus(
    @Param('payinOrderId') payinOrderId: string,
    @Query('environment') environment: 'live' | 'sandbox',
    // @Res() response: Response,
  ) {
    return this.service.getPaymentStatus(payinOrderId, environment);
  }

  @Post('submit-payment/:payinOrderId')
  @Roles(Role.ALL)
  @UseGuards(RolesGuard)
  async submitPayment(
    @Param('payinOrderId') payinOrderId: string,
    @Query('environment') environment: string,
    @Body() submitPaymentOrderDto: SubmitPaymentOrderDto,
  ) {
    return await this.service.handleSubmitPayment(
      payinOrderId,
      submitPaymentOrderDto.txnId,
      environment,
    );
  }

  @Post()
  @Roles(Role.ALL)
  @UseGuards(RolesGuard)
  async getPayPage(@Body() getPayPageDto: GetPayPageDto) {
    return this.service.getPayPage(getPayPageDto);
  }

  @Post('make-gateway-payout')
  @Roles(Role.ALL)
  @UseGuards(RolesGuard)
  async makeGatewayPayout(@Body() body) {
    return this.service.makeGatewayPayout(body);
  }

  @Get('order-details/:orderId')
  @Roles(Role.ALL)
  @UseGuards(RolesGuard)
  async getOrderDetailsForIntegrationKit(
    @Param('orderId') id: string,
    @Query('environment') environment: 'sandbox' | 'live',
  ) {
    return this.service.getOrderDetailsForIntegrationKit(id, environment);
  }

  @Get('order-status/:orderId')
  @Roles(Role.MERCHANT)
  @UseGuards(RolesGuard)
  async getOrderStatusForApiMode(
    @UserInReq() user,
    @Param('orderId') orderId: string,
    @Query('environment') environment: 'sandbox' | 'live',
  ) {
    return this.service.getOrderStatusForApiMode(
      orderId,
      environment,
      +user.id,
    );
  }

  @Post('receive-phonepe-request')
  @Roles(Role.ALL)
  async receivePhonepeRequest(
    @Request() request,
    @Body() body,
    @Query('environment') environment,
  ) {
    return this.service.receivePhonepeRequest(request, body, environment);
  }

  @Post('verify-payment')
  @Roles(Role.UPI_VENDOR)
  @UseGuards(RolesGuard)
  async verifyPayment(@Body() submitUtrDto: SubmitUtrDto, @UserInReq() user) {
    return this.service.verifyPayment(submitUtrDto, user.id);
  }

  @Post('reject-payment')
  @Roles(Role.UPI_VENDOR)
  @UseGuards(RolesGuard)
  async rejectPayment(@Body() submitUtrDto: SubmitUtrDto, @UserInReq() user) {
    return this.service.rejectPayment(submitUtrDto, user.id);
  }
}
