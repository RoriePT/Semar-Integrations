import { HttpService } from '@nestjs/axios';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { EndUser } from 'src/end-user/entities/end-user.entity';
import { Doku } from 'src/gateway/entities/doku.entity';
import { Identity } from 'src/identity/entities/identity.entity';
import { Payin } from 'src/payin/entities/payin.entity';
import { Payout } from 'src/payout/entities/payout.entity';
import { JwtService } from 'src/services/jwt/jwt.service';
import { ChannelName, GatewayName } from 'src/utils/enum/enum';
import { Repository } from 'typeorm';
import { GetPayPageDto } from '../dto/getPayPage.dto';
import { createHash, createHmac, randomUUID } from 'crypto';

@Injectable()
export class DokuService {
  constructor(
    @InjectRepository(Doku)
    private readonly dokuRepository: Repository<Doku>,
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
    const doku = (await this.dokuRepository.find())[0];
    if (!doku) throw new NotFoundException('Doku record not found!');

    const credentials =
      environment === 'live'
        ? {
            merchantId: doku.merchant_id,
            clientId: doku.client_id,
            secretKey: doku.secret_key,
          }
        : {
            merchantId: doku.sandbox_merchant_id,
            clientId: doku.sandbox_client_id,
            secretKey: doku.sandbox_secret_key,
          };

    return {
      merchantId: this.jwtService.decryptValue(credentials.merchantId),
      clientId: this.jwtService.decryptValue(credentials.clientId),
      secretKey: this.jwtService.decryptValue(credentials.secretKey),
    };
  }

  private buildBaseUrl(environment: 'live' | 'sandbox') {
    return environment === 'live'
      ? process.env.DOKU_BASE_URL || 'https://api.doku.com'
      : process.env.DOKU_SANDBOX_BASE_URL || 'https://api-sandbox.doku.com';
  }

  private getChannelCode(channelName: ChannelName) {
    if (channelName === ChannelName.UPI)
      return process.env.DOKU_QRIS_CHANNEL_CODE || 'EMONEY_QRIS';

    if (channelName === ChannelName.BANKING)
      return process.env.DOKU_VA_CHANNEL_CODE || 'VIRTUAL_ACCOUNT_BCA';

    if (channelName === ChannelName.E_WALLET)
      return process.env.DOKU_EWALLET_CHANNEL_CODE || 'EMONEY_OVO';

    return 'EMONEY_QRIS';
  }

  private buildSignedHeaders(
    clientId: string,
    secretKey: string,
    requestTarget: string,
    body: any,
  ) {
    const requestId = randomUUID();
    // DOKU examples use UTC ISO8601 without milliseconds.
    const requestTimestamp = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
    const minifiedBody = JSON.stringify(body || {});
    const digest = createHash('sha256').update(minifiedBody).digest('base64');

    // DOKU canonical signature format
    const stringToSign =
      `Client-Id:${clientId}\n` +
      `Request-Id:${requestId}\n` +
      `Request-Timestamp:${requestTimestamp}\n` +
      `Request-Target:${requestTarget}\n` +
      `Digest:${digest}`;

    const signatureRaw = createHmac('sha256', secretKey)
      .update(stringToSign)
      .digest('base64');
    const signature = `HMACSHA256=${signatureRaw}`;

    return {
      'Content-Type': 'application/json',
      'Client-Id': clientId,
      'Request-Id': requestId,
      'Request-Timestamp': requestTimestamp,
      Signature: signature,
    };
  }

  private buildSignedHeadersForGet(
    clientId: string,
    secretKey: string,
    requestTarget: string,
  ) {
    const requestId = randomUUID();
    const requestTimestamp = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');

    // For DOKU Non-SNAP GET, signature does not include Digest.
    const stringToSign =
      `Client-Id:${clientId}\n` +
      `Request-Id:${requestId}\n` +
      `Request-Timestamp:${requestTimestamp}\n` +
      `Request-Target:${requestTarget}`;

    const signatureRaw = createHmac('sha256', secretKey)
      .update(stringToSign)
      .digest('base64');
    const signature = `HMACSHA256=${signatureRaw}`;

    return {
      'Client-Id': clientId,
      'Request-Id': requestId,
      'Request-Timestamp': requestTimestamp,
      Signature: signature,
    };
  }

  async getPayPage(getPayPageDto: GetPayPageDto) {
    const { userId, amount, orderId, environment, channelName } = getPayPageDto;

    const endUser = await this.endUserRepository.findOneBy({ userId });
    const { merchantId, clientId, secretKey } = await this.getCredentials(
      environment,
    );

    const payload = {
      order: {
        amount: Number(parseFloat(amount).toFixed(2)),
        invoice_number: orderId,
        currency: 'IDR',
      },
      payment: {
        payment_due_date: 25,
      },
      customer: {
        id: userId,
        name: endUser?.name || 'SEMAR USER',
        email: endUser?.email || 'user@semar.local',
        phone: endUser?.mobile || '08123456789',
      },
      additional_info: {
        channel_code: this.getChannelCode(channelName),
      },
      callback: {
        url:
          process.env.DOKU_PAYIN_CALLBACK_URL ||
          `${process.env.PAYMENT_PAGE_BASE_URL}/gateway-callback?orderId=${orderId}&environment=${environment}`,
      },
    };
    const resolvedMerchantId = merchantId || clientId;
    if (resolvedMerchantId) {
      payload['merchant'] = {
        merchant_id: resolvedMerchantId,
      };
    }

    try {
      const requestTarget = '/checkout/v1/payment';
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.buildBaseUrl(environment)}${requestTarget}`,
          payload,
          {
            headers: this.buildSignedHeaders(
              clientId,
              secretKey,
              requestTarget,
              payload,
            ),
          },
        ),
      );

      return {
        url:
          response.data?.response?.payment?.url ||
          response.data?.payment?.url ||
          response.data?.checkout_url,
        trackingId:
          response.data?.response?.order?.invoice_number ||
          response.data?.order?.invoice_number ||
          orderId,
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
    const { clientId, secretKey } = await this.getCredentials(environment);
    const requestTarget = `/orders/v1/status/${invoiceId}`;

    try {
      const headers = this.buildSignedHeadersForGet(
        clientId,
        secretKey,
        requestTarget,
      );

      const response = await firstValueFrom(
        this.httpService.get(`${this.buildBaseUrl(environment)}${requestTarget}`, {
          headers,
        }),
      );

      const gatewayStatus =
        response.data?.transaction?.status ||
        response.data?.status ||
        response.data?.order?.status ||
        'PENDING';

      const normalizedStatus = String(gatewayStatus).toUpperCase();

      let status = 'PENDING';
      if (['SUCCESS', 'PAID', 'COMPLETED', 'SETTLEMENT'].includes(normalizedStatus))
        status = 'SUCCESS';
      if (['FAILED', 'EXPIRED', 'CANCELLED'].includes(normalizedStatus))
        status = 'FAILED';

      return {
        status,
        details: {
          transactionId:
            response.data?.transaction?.id || response.data?.transaction_id,
          transactionReceipt: 'DOKU',
          otherPaymentDetails: response.data,
        },
      };
    } catch (error) {
      console.log({
        error: error?.response?.data || error?.toString(),
        httpStatus: error?.response?.status,
        requestTarget,
        invoiceId,
        environment,
      });

      return {
        status: 'PENDING',
        details: {
          transactionId: null,
          transactionReceipt: 'DOKU',
          otherPaymentDetails: error?.response?.data || error?.toString(),
        },
      };
    }
  }

  private buildPayoutBeneficiaryForEndUser(endUser: EndUser, mode: string) {
    if (mode === 'imps' && endUser?.netBankingDetails) {
      return {
        account_number: endUser.netBankingDetails.accountNumber,
        bank_code:
          endUser.netBankingDetails.bankCode ||
          endUser.netBankingDetails.ifscCode ||
          endUser.netBankingDetails.bankName,
        account_name:
          endUser.netBankingDetails.beneficiaryName || endUser.name || 'SEMAR USER',
      };
    }

    return {
      account_number:
        endUser?.eWalletDetails?.mobileNumber || endUser?.mobile || '08123456789',
      account_name: endUser?.name || 'SEMAR USER',
      wallet_type: endUser?.eWalletDetails?.appName || 'EWALLET',
    };
  }

  private buildPayoutBeneficiaryForIdentity(identity: Identity, mode: string) {
    if (mode === 'imps' && identity?.netBanking?.length) {
      return {
        account_number: identity.netBanking[0].accountNumber,
        bank_code: identity.netBanking[0].ifsc || identity.netBanking[0].bankName,
        account_name:
          identity.netBanking[0].beneficiaryName || identity.email || 'SEMAR',
      };
    }

    return {
      account_number:
        identity?.eWallet?.[0]?.mobile || '08123456789',
      account_name: identity?.email || 'SEMAR',
      wallet_type: identity?.eWallet?.[0]?.app || 'EWALLET',
    };
  }

  private async createPayout(
    payoutPayload: any,
    orderId: string,
    environment: 'live' | 'sandbox' = 'live',
  ) {
    const { clientId, secretKey } = await this.getCredentials(environment);

    try {
      const requestTarget = '/disbursement/v1/transfers';
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.buildBaseUrl(environment)}${requestTarget}`,
          payoutPayload,
          {
            headers: this.buildSignedHeaders(
              clientId,
              secretKey,
              requestTarget,
              payoutPayload,
            ),
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

    const transferId = `DOKU-${randomUUID()}`;
    const payoutPayload = {
      partner_reference_no: transferId,
      amount: Number(parseFloat(String(amount)).toFixed(2)),
      beneficiary: this.buildPayoutBeneficiaryForEndUser(endUser, mode),
      description: `SEMAR payout ${orderId}`,
    };

    const response: any = await this.createPayout(payoutPayload, orderId);

    return {
      gatewayName: GatewayName.DOKU,
      transactionId:
        response?.transfer_id || response?.partner_reference_no || transferId,
      transactionReceipt: 'DOKU',
      paymentStatus:
        response?.status || response?.transaction_status || 'PENDING',
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

    const transferId = `DOKU-${randomUUID()}`;
    const payoutPayload = {
      partner_reference_no: transferId,
      amount: Number(parseFloat(String(amount)).toFixed(2)),
      beneficiary: this.buildPayoutBeneficiaryForIdentity(identity, mode),
      description: `SEMAR withdrawal ${orderId}`,
    };

    const response: any = await this.createPayout(payoutPayload, orderId);

    return {
      gatewayName: GatewayName.DOKU,
      transactionId:
        response?.transfer_id || response?.partner_reference_no || transferId,
      transactionReceipt: 'DOKU',
      paymentStatus:
        response?.status || response?.transaction_status || 'PENDING',
      transactionDetails: response,
    };
  }

  async getPayoutDetails(transferId: string) {
    if (!transferId) return;

    const payload = { partner_reference_no: transferId };
    const { clientId, secretKey } = await this.getCredentials('live');

    try {
      const requestTarget = '/disbursement/v1/status';
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.buildBaseUrl('live')}${requestTarget}`,
          payload,
          {
            headers: this.buildSignedHeaders(
              clientId,
              secretKey,
              requestTarget,
              payload,
            ),
          },
        ),
      );

      return {
        status:
          response.data?.status ||
          response.data?.transaction_status ||
          response.data?.latest_status,
        utr:
          response.data?.beneficiary_reference_no ||
          response.data?.reference_no ||
          null,
        details: response.data,
      };
    } catch (error) {
      console.log({ error: error?.response?.data || error?.toString() });
    }
  }
}
