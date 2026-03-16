import { HttpService } from '@nestjs/axios';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { EndUser } from 'src/end-user/entities/end-user.entity';
import { Midtrans } from 'src/gateway/entities/midtrans.entity';
import { Identity } from 'src/identity/entities/identity.entity';
import { Payin } from 'src/payin/entities/payin.entity';
import { Payout } from 'src/payout/entities/payout.entity';
import { JwtService } from 'src/services/jwt/jwt.service';
import { ChannelName, GatewayName } from 'src/utils/enum/enum';
import { Repository } from 'typeorm';
import { GetPayPageDto } from '../dto/getPayPage.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class MidtransService {
  constructor(
    @InjectRepository(Midtrans)
    private readonly midtransRepository: Repository<Midtrans>,
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

  private async getCredentials(environment: 'live' | 'sandbox') {
    const midtrans = (await this.midtransRepository.find())[0];
    if (!midtrans) throw new NotFoundException('Midtrans record not found!');

    const keys =
      environment === 'live'
        ? {
            serverKey: midtrans.server_key,
            clientKey: midtrans.client_key,
          }
        : {
            serverKey: midtrans.sandbox_server_key,
            clientKey: midtrans.sandbox_client_key,
          };

    return {
      serverKey: this.jwtService.decryptValue(keys.serverKey),
      clientKey: this.jwtService.decryptValue(keys.clientKey),
    };
  }

  private buildBasicAuth(serverKey: string) {
    return `Basic ${Buffer.from(`${serverKey}:`).toString('base64')}`;
  }

  private getSnapUrl(environment: 'live' | 'sandbox') {
    return environment === 'live'
      ? 'https://app.midtrans.com/snap/v1/transactions'
      : 'https://app.sandbox.midtrans.com/snap/v1/transactions';
  }

  private getApiBase(environment: 'live' | 'sandbox') {
    return environment === 'live'
      ? 'https://api.midtrans.com'
      : 'https://api.sandbox.midtrans.com';
  }

  private getEnabledPayments(channelName: ChannelName): string[] {
    if (channelName === ChannelName.UPI || channelName === ChannelName.QRIS)
      return ['qris'];
    if (channelName === ChannelName.BANKING) return ['bank_transfer'];
    if (channelName === ChannelName.E_WALLET) return ['gopay'];
    return ['qris'];
  }

  async getPayPage(getPayPageDto: GetPayPageDto) {
    const { userId, amount, orderId, environment, channelName } = getPayPageDto;
    const { serverKey } = await this.getCredentials(environment);

    const endUser = await this.endUserRepository.findOneBy({ userId });

    const payload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: Number(parseFloat(amount).toFixed(2)),
      },
      customer_details: {
        first_name: endUser?.name || 'SEMAR USER',
        email: endUser?.email || 'user@semar.local',
        phone: endUser?.mobile || '08123456789',
      },
      enabled_payments: this.getEnabledPayments(channelName),
      callbacks: {
        finish:
          process.env.MIDTRANS_FINISH_URL ||
          `${process.env.PAYMENT_PAGE_BASE_URL}/gateway-callback?orderId=${orderId}&environment=${environment}`,
      },
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(this.getSnapUrl(environment), payload, {
          headers: {
            Authorization: this.buildBasicAuth(serverKey),
            'Content-Type': 'application/json',
          },
        }),
      );

      return {
        url: response.data?.redirect_url,
        trackingId: response.data?.token || orderId,
      };
    } catch (error) {
      await this.payinRepository.update(
        { systemOrderId: orderId },
        { gatewayError: error?.response?.data || error?.toString() },
      );

      throw new ConflictException(error?.response?.data || error?.toString());
    }
  }

  async getPaymentStatus(orderId: string, environment: 'live' | 'sandbox') {
    const { serverKey } = await this.getCredentials(environment);

    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.getApiBase(environment)}/v2/${orderId}/status`, {
          headers: {
            Authorization: this.buildBasicAuth(serverKey),
          },
        }),
      );

      const transactionStatus = String(
        response.data?.transaction_status || 'pending',
      ).toLowerCase();

      let status = 'PENDING';
      if (['settlement', 'capture', 'success'].includes(transactionStatus))
        status = 'SUCCESS';
      if (
        ['deny', 'expire', 'cancel', 'failure', 'failed'].includes(
          transactionStatus,
        )
      )
        status = 'FAILED';

      return {
        status,
        details: {
          transactionId: response.data?.transaction_id,
          transactionReceipt: 'MIDTRANS',
          otherPaymentDetails: response.data,
        },
      };
    } catch (error) {
      console.log({ error: error?.response?.data || error?.toString() });
    }
  }

  private async createPayout(payload: any, orderId: string) {
    const { serverKey } = await this.getCredentials('live');

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.getApiBase('live')}/iris/api/v1/payouts`,
          payload,
          {
            headers: {
              Authorization: this.buildBasicAuth(serverKey),
              'Content-Type': 'application/json',
            },
          },
        ),
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

  async makePayoutPaymentForEndUsers({ userId, amount, orderId, mode }) {
    const endUser = await this.endUserRepository.findOneBy({ userId });
    if (!endUser) throw new NotFoundException('End user not found!');

    const transferId = `MIDTRANS-${randomUUID()}`;

    const beneficiaryName = endUser?.name || 'SEMAR USER';
    const beneficiaryBankCode =
      endUser?.netBankingDetails?.bankCode ||
      endUser?.netBankingDetails?.bankName ||
      endUser?.netBankingDetails?.ifscCode;
    const beneficiaryAccount =
      mode === 'imps'
        ? endUser?.netBankingDetails?.accountNumber
        : endUser?.eWalletDetails?.mobileNumber || endUser?.mobile;

    const payload = {
      reference_no: transferId,
      beneficiary_name: beneficiaryName,
      beneficiary_bank_code: beneficiaryBankCode,
      beneficiary_account: beneficiaryAccount,
      amount: Number(parseFloat(String(amount)).toFixed(2)),
      notes: `SEMAR payout ${orderId}`,
    };

    const response: any = await this.createPayout(payload, orderId);

    return {
      gatewayName: GatewayName.MIDTRANS,
      transactionId:
        response?.reference_no || response?.id || response?.payouts?.[0]?.id,
      transactionReceipt: 'MIDTRANS',
      paymentStatus: response?.status || response?.transaction_status || 'PENDING',
      transactionDetails: response,
    };
  }

  async makePayoutPaymentForInternalUsers({
    identityId,
    amount,
    orderId,
    mode,
  }) {
    const identity = await this.identityRepository.findOne({
      where: { id: identityId },
      relations: ['netBanking', 'eWallet'],
    });
    if (!identity) throw new NotFoundException('Identity not found!');

    const transferId = `MIDTRANS-${randomUUID()}`;
    const beneficiaryBankCode =
      identity?.netBanking?.[0]?.bankName || identity?.netBanking?.[0]?.ifsc;

    const beneficiaryAccount =
      mode === 'imps'
        ? identity?.netBanking?.[0]?.accountNumber
        : identity?.eWallet?.[0]?.mobile || '08123456789';

    const payload = {
      reference_no: transferId,
      beneficiary_name: identity.email || 'SEMAR',
      beneficiary_bank_code: beneficiaryBankCode,
      beneficiary_account: beneficiaryAccount,
      amount: Number(parseFloat(String(amount)).toFixed(2)),
      notes: `SEMAR withdrawal ${orderId}`,
    };

    const response: any = await this.createPayout(payload, orderId);

    return {
      gatewayName: GatewayName.MIDTRANS,
      transactionId:
        response?.reference_no || response?.id || response?.payouts?.[0]?.id,
      transactionReceipt: 'MIDTRANS',
      paymentStatus: response?.status || response?.transaction_status || 'PENDING',
      transactionDetails: response,
    };
  }

  async getPayoutDetails(transferId: string) {
    if (!transferId) return;

    const { serverKey } = await this.getCredentials('live');

    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.getApiBase('live')}/iris/api/v1/payouts/${transferId}`,
          {
            headers: {
              Authorization: this.buildBasicAuth(serverKey),
            },
          },
        ),
      );

      return {
        status:
          response.data?.status ||
          response.data?.transaction_status ||
          response.data?.payout?.status,
        utr:
          response.data?.beneficiary_reference ||
          response.data?.beneficiary_reference_no ||
          null,
        details: response.data,
      };
    } catch (error) {
      console.log({ error: error?.response?.data || error?.toString() });
    }
  }
}
