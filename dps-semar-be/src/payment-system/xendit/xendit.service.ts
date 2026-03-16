import { HttpService } from '@nestjs/axios';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { EndUser } from 'src/end-user/entities/end-user.entity';
import { Xendit } from 'src/gateway/entities/xendit.entity';
import { Identity } from 'src/identity/entities/identity.entity';
import { Payin } from 'src/payin/entities/payin.entity';
import { Payout } from 'src/payout/entities/payout.entity';
import { JwtService } from 'src/services/jwt/jwt.service';
import { ChannelName, GatewayName } from 'src/utils/enum/enum';
import { Repository } from 'typeorm';
import { GetPayPageDto } from '../dto/getPayPage.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class XenditService {
  constructor(
    @InjectRepository(Xendit)
    private readonly xenditRepository: Repository<Xendit>,
    @InjectRepository(EndUser)
    private readonly endUserRepository: Repository<EndUser>,
    @InjectRepository(Identity)
    private readonly identityRepository: Repository<Identity>,
    @InjectRepository(Payout)
    private readonly payoutRepository: Repository<Payout>,
    @InjectRepository(Payin)
    private readonly payinRepository: Repository<Payin>,

    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
  ) {}

  private async getSecretKey(environment: 'live' | 'sandbox') {
    const xendit = (await this.xenditRepository.find())[0];
    if (!xendit) throw new NotFoundException('Xendit record not found!');

    const encryptedKey =
      environment === 'live' ? xendit.secret_key : xendit.sandbox_secret_key;

    return this.jwtService.decryptValue(encryptedKey);
  }

  private buildBasicAuth(secretKey: string) {
    return `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`;
  }

  private getAllowedMethods(channelName: ChannelName): string[] {
    if (channelName === ChannelName.UPI || channelName === ChannelName.QRIS)
      return ['QRIS'];
    if (channelName === ChannelName.BANKING)
      return ['BCA', 'BNI', 'MANDIRI', 'PERMATA'];
    if (channelName === ChannelName.E_WALLET)
      return ['OVO', 'DANA', 'LINKAJA', 'SHOPEEPAY'];

    return ['QRIS'];
  }

  async getPayPage(getPayPageDto: GetPayPageDto) {
    const { userId, amount, orderId, environment, channelName } = getPayPageDto;
    const secretKey = await this.getSecretKey(environment);

    const endUser = await this.endUserRepository.findOneBy({ userId });

    const payload = {
      external_id: orderId,
      amount: Number(parseFloat(amount).toFixed(2)),
      currency: 'IDR',
      description: `SEMAR payin ${orderId}`,
      payer_email: endUser?.email || 'user@semar.local',
      customer: {
        given_names: endUser?.name || 'SEMAR USER',
        email: endUser?.email || 'user@semar.local',
        mobile_number: endUser?.mobile || '08123456789',
      },
      success_redirect_url:
        process.env.XENDIT_SUCCESS_URL ||
        `${process.env.PAYMENT_PAGE_BASE_URL}/gateway-callback?orderId=${orderId}&environment=${environment}`,
      failure_redirect_url:
        process.env.XENDIT_FAILURE_URL ||
        `${process.env.PAYMENT_PAGE_BASE_URL}/gateway-callback?orderId=${orderId}&environment=${environment}`,
      payment_methods: this.getAllowedMethods(channelName),
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post('https://api.xendit.co/v2/invoices', payload, {
          headers: {
            Authorization: this.buildBasicAuth(secretKey),
            'Content-Type': 'application/json',
          },
        }),
      );

      return {
        url: response.data?.invoice_url,
        trackingId: response.data?.id || orderId,
      };
    } catch (error) {
      await this.payinRepository.update(
        { systemOrderId: orderId },
        { gatewayError: error?.response?.data || error?.toString() },
      );

      throw new ConflictException(error?.response?.data || error?.toString());
    }
  }

  async getPaymentStatus(invoiceId: string, environment: 'live' | 'sandbox') {
    const secretKey = await this.getSecretKey(environment);

    try {
      const response = await firstValueFrom(
        this.httpService.get(`https://api.xendit.co/v2/invoices/${invoiceId}`, {
          headers: {
            Authorization: this.buildBasicAuth(secretKey),
          },
        }),
      );

      const invoiceStatus = String(response.data?.status || 'PENDING').toUpperCase();

      let status = 'PENDING';
      if (['PAID', 'SETTLED', 'SUCCESS'].includes(invoiceStatus)) status = 'SUCCESS';
      if (['EXPIRED', 'FAILED'].includes(invoiceStatus)) status = 'FAILED';

      return {
        status,
        details: {
          transactionId: response.data?.payment_id || response.data?.id,
          transactionReceipt: 'XENDIT',
          otherPaymentDetails: response.data,
        },
      };
    } catch (error) {
      console.log({ error: error?.response?.data || error?.toString() });
    }
  }

  private buildDisbursementPayloadForEndUser(endUser: EndUser, amount: number, orderId: string) {
    return {
      external_id: `XENDIT-${randomUUID()}`,
      amount: Number(parseFloat(String(amount)).toFixed(2)),
      bank_code:
        endUser?.netBankingDetails?.bankCode ||
        endUser?.netBankingDetails?.bankName ||
        endUser?.netBankingDetails?.ifscCode ||
        'BCA',
      account_holder_name:
        endUser?.netBankingDetails?.beneficiaryName || endUser?.name || 'SEMAR USER',
      account_number:
        endUser?.netBankingDetails?.accountNumber ||
        endUser?.eWalletDetails?.mobileNumber ||
        endUser?.mobile,
      description: `SEMAR payout ${orderId}`,
    };
  }

  private buildDisbursementPayloadForIdentity(identity: Identity, amount: number, orderId: string) {
    return {
      external_id: `XENDIT-${randomUUID()}`,
      amount: Number(parseFloat(String(amount)).toFixed(2)),
      bank_code:
        identity?.netBanking?.[0]?.bankName ||
        identity?.netBanking?.[0]?.ifsc ||
        'BCA',
      account_holder_name:
        identity?.netBanking?.[0]?.beneficiaryName || identity?.email || 'SEMAR',
      account_number:
        identity?.netBanking?.[0]?.accountNumber ||
        identity?.eWallet?.[0]?.mobile ||
        '08123456789',
      description: `SEMAR withdrawal ${orderId}`,
    };
  }

  private async createPayout(payload: any, orderId: string) {
    const secretKey = await this.getSecretKey('live');

    try {
      const response = await firstValueFrom(
        this.httpService.post('https://api.xendit.co/disbursements', payload, {
          headers: {
            Authorization: this.buildBasicAuth(secretKey),
            'Content-Type': 'application/json',
          },
        }),
      );

      return response.data;
    } catch (error) {
      await this.payoutRepository.update(
        { systemOrderId: orderId },
        { gatewayError: error?.response?.data || error?.toString() },
      );
      console.log({ error: error?.response?.data || error?.toString() });
    }
  }

  async makePayoutPaymentForEndUsers({ userId, amount, orderId }) {
    const endUser = await this.endUserRepository.findOneBy({ userId });
    if (!endUser) throw new NotFoundException('End user not found!');

    const response: any = await this.createPayout(
      this.buildDisbursementPayloadForEndUser(endUser, amount, orderId),
      orderId,
    );

    return {
      gatewayName: GatewayName.XENDIT,
      transactionId: response?.id || response?.external_id,
      transactionReceipt: 'XENDIT',
      paymentStatus: response?.status || 'PENDING',
      transactionDetails: response,
    };
  }

  async makePayoutPaymentForInternalUsers({ identityId, amount, orderId }) {
    const identity = await this.identityRepository.findOne({
      where: { id: identityId },
      relations: ['netBanking', 'eWallet'],
    });
    if (!identity) throw new NotFoundException('Identity not found!');

    const response: any = await this.createPayout(
      this.buildDisbursementPayloadForIdentity(identity, amount, orderId),
      orderId,
    );

    return {
      gatewayName: GatewayName.XENDIT,
      transactionId: response?.id || response?.external_id,
      transactionReceipt: 'XENDIT',
      paymentStatus: response?.status || 'PENDING',
      transactionDetails: response,
    };
  }

  async getPayoutDetails(disbursementId: string) {
    if (!disbursementId) return;

    const secretKey = await this.getSecretKey('live');

    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `https://api.xendit.co/disbursements/${disbursementId}`,
          {
            headers: {
              Authorization: this.buildBasicAuth(secretKey),
            },
          },
        ),
      );

      return {
        status: response.data?.status,
        utr:
          response.data?.disbursement_channel_properties?.receipt ||
          response.data?.reference,
        details: response.data,
      };
    } catch (error) {
      console.log({ error: error?.response?.data || error?.toString() });
    }
  }
}
