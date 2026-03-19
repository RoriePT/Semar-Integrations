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
import { inspect } from 'util';

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

  private decryptIfPresent(value?: string | null) {
    if (!value) return null;

    try {
      return this.jwtService.decryptValue(value);
    } catch {
      return value;
    }
  }

  private async getPayoutCredentials(environment: 'live' | 'sandbox') {
    const midtrans = (await this.midtransRepository.find())[0];
    if (!midtrans) throw new NotFoundException('Midtrans record not found!');

    const values =
      environment === 'live'
        ? {
            fallbackServerKey: midtrans.server_key,
            disbursementMerchantId: midtrans.disbursement_merchant_id,
            creatorApiKey: midtrans.disbursement_creator_api_key,
            creatorMerchantKey: midtrans.disbursement_creator_merchant_key,
            approverApiKey: midtrans.disbursement_approver_api_key,
            approverMerchantKey: midtrans.disbursement_approver_merchant_key,
          }
        : {
            fallbackServerKey: midtrans.sandbox_server_key,
            disbursementMerchantId: midtrans.sandbox_disbursement_merchant_id,
            creatorApiKey: midtrans.sandbox_disbursement_creator_api_key,
            creatorMerchantKey:
              midtrans.sandbox_disbursement_creator_merchant_key,
            approverApiKey: midtrans.sandbox_disbursement_approver_api_key,
            approverMerchantKey:
              midtrans.sandbox_disbursement_approver_merchant_key,
          };

    const fallbackServerKey = this.decryptIfPresent(values.fallbackServerKey);
    const creatorApiKey = this.decryptIfPresent(values.creatorApiKey);
    const creatorMerchantKey = this.decryptIfPresent(values.creatorMerchantKey);
    const approverApiKey = this.decryptIfPresent(values.approverApiKey);
    const approverMerchantKey = this.decryptIfPresent(
      values.approverMerchantKey,
    );

    return {
      disbursementMerchantId: this.decryptIfPresent(
        values.disbursementMerchantId,
      ),
      creatorApiKey: creatorApiKey || fallbackServerKey,
      creatorMerchantKey: creatorMerchantKey || '',
      approverApiKey: approverApiKey || creatorApiKey || fallbackServerKey,
      approverMerchantKey:
        approverMerchantKey || creatorMerchantKey || '',
    };
  }

  private buildBasicAuth(username: string, password = '') {
    return `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
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

  private getIrisBase(environment: 'live' | 'sandbox') {
    const defaultBase =
      environment === 'live'
        ? 'https://app.midtrans.com/iris/api/v1'
        : 'https://app.sandbox.midtrans.com/iris/api/v1';

    const configuredBase =
      environment === 'live'
        ? process.env.MIDTRANS_IRIS_BASE_URL
        : process.env.MIDTRANS_IRIS_SANDBOX_BASE_URL;

    const rawBase = (configuredBase || defaultBase).trim();

    try {
      const url = new URL(rawBase);

      if (
        url.hostname === 'api.midtrans.com' ||
        url.hostname === 'api.sandbox.midtrans.com'
      ) {
        url.hostname = url.hostname.replace(/^api\./, 'app.');
      }

      if (!url.pathname || url.pathname === '/' || !url.pathname.includes('/iris/api/v1')) {
        url.pathname = '/iris/api/v1';
      }

      return url.toString().replace(/\/+$/, '');
    } catch {
      return defaultBase;
    }
  }

  private logMidtransRequest(label: string, url: string, payload?: any) {
    console.log(`\n==================== MIDTRANS REQUEST: ${label} ====================`);
    console.log('URL:', url);
    if (payload) console.log('PAYLOAD:', payload);
    console.log('===============================================================\n');
  }

  private logMidtransResponse(label: string, data: any) {
    console.log(`\n==================== MIDTRANS RESPONSE: ${label} ====================`);
    console.log(
      'DATA:',
      inspect(data, { depth: null, maxArrayLength: null, compact: false }),
    );
    console.log('===============================================================\n');
  }

  private logMidtransError(label: string, error: any) {
    console.log(`\n===================== MIDTRANS ERROR: ${label} =====================`);
    const errorObject = {
      message: error?.message,
      code: error?.code,
      status: error?.response?.status,
      data: error?.response?.data || error?.toString(),
      url: error?.config?.url,
      method: error?.config?.method,
    };
    console.log(
      inspect(errorObject, {
        depth: null,
        maxArrayLength: null,
        compact: false,
      }),
    );
    console.log('===============================================================\n');
  }

  private mapBankToIrisBankCode(bankCodeOrName?: string) {
    const input = String(bankCodeOrName || '').trim().toLowerCase();
    if (!input) return '';

    const normalized = input.replace(/[^a-z0-9]/g, '');
    const map: Record<string, string> = {
      '014': 'bca',
      bca: 'bca',
      bankcentralasia: 'bca',
      '009': 'bni',
      bni: 'bni',
      banknegaraindonesia: 'bni',
      '002': 'bri',
      bri: 'bri',
      bankrakyatindonesia: 'bri',
      '008': 'mandiri',
      mandiri: 'mandiri',
      bankmandiri: 'mandiri',
      '013': 'permata',
      permata: 'permata',
      bankpermata: 'permata',
      '022': 'cimb',
      cimb: 'cimb',
      cimbniaga: 'cimb',
      '451': 'syariahmandiri',
      syariahmandiri: 'syariahmandiri',
      '427': 'bsi',
      bsi: 'bsi',
    };

    return map[normalized] || input;
  }

  private sanitizeIrisText(input: string, fallback: string) {
    const sanitized = String(input || '')
      .replace(/[^a-zA-Z0-9 ]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return sanitized || fallback;
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
    const { creatorApiKey, disbursementMerchantId } =
      await this.getPayoutCredentials('live');
    const url = `${this.getIrisBase('live')}/payouts`;

    try {
      this.logMidtransRequest('CREATE_PAYOUT', url, payload);
      const response = await firstValueFrom(
        this.httpService.post(url, payload, {
          headers: {
            Accept: 'application/json',
            Authorization: this.buildBasicAuth(
              creatorApiKey,
              // Midtrans IRIS docs/Postman use API key as Basic username and blank password.
              // Keep merchant key optional in DB, but do not send it as Basic password.
              '',
            ),
            'Content-Type': 'application/json',
            ...(disbursementMerchantId
              ? { 'X-Merchant-ID': disbursementMerchantId }
              : {}),
          },
        }),
      );

      this.logMidtransResponse('CREATE_PAYOUT', response.data);
      return response.data;
    } catch (error) {
      const isHtml404 =
        error?.response?.status === 404 &&
        typeof error?.response?.data === 'string' &&
        String(error?.response?.data).includes("<!DOCTYPE html>");

      if (isHtml404) {
        const fallbackUrl = `${this.getIrisBase('live')}/payouts/`;
        try {
          this.logMidtransRequest('CREATE_PAYOUT_FALLBACK', fallbackUrl, payload);
          const fallbackResponse = await firstValueFrom(
            this.httpService.post(fallbackUrl, payload, {
              headers: {
                Accept: 'application/json',
                Authorization: this.buildBasicAuth(creatorApiKey, ''),
                'Content-Type': 'application/json',
                ...(disbursementMerchantId
                  ? { 'X-Merchant-ID': disbursementMerchantId }
                  : {}),
              },
            }),
          );
          this.logMidtransResponse(
            'CREATE_PAYOUT_FALLBACK',
            fallbackResponse.data,
          );
          return fallbackResponse.data;
        } catch (fallbackError) {
          this.logMidtransError('CREATE_PAYOUT_FALLBACK', fallbackError);
          await this.payoutRepository.update(
            { systemOrderId: orderId },
            {
              gatewayError:
                fallbackError?.response?.data || fallbackError?.toString(),
            },
          );
          return;
        }
      }

      this.logMidtransError('CREATE_PAYOUT', error);
      await this.payoutRepository.update(
        { systemOrderId: orderId },
        { gatewayError: error?.response?.data || error?.toString() },
      );
    }
  }

  private async approvePayouts(referenceNos: string[]) {
    if (!referenceNos?.length) return null;

    const { approverApiKey, disbursementMerchantId } =
      await this.getPayoutCredentials('live');
    const url = `${this.getIrisBase('live')}/payouts/approve`;
    const payload = { reference_nos: referenceNos };

    try {
      this.logMidtransRequest('APPROVE_PAYOUTS', url, payload);
      const response = await firstValueFrom(
        this.httpService.post(url, payload, {
          headers: {
            Accept: 'application/json',
            Authorization: this.buildBasicAuth(approverApiKey, ''),
            'Content-Type': 'application/json',
            ...(disbursementMerchantId
              ? { 'X-Merchant-ID': disbursementMerchantId }
              : {}),
          },
        }),
      );

      this.logMidtransResponse('APPROVE_PAYOUTS', response.data);
      return response.data;
    } catch (error) {
      this.logMidtransError('APPROVE_PAYOUTS', error);
      return {
        status: 'FAILED',
        error: error?.response?.data || error?.toString(),
      };
    }
  }

  async makePayoutPaymentForEndUsers({ userId, amount, orderId, mode }) {
    const endUser = await this.endUserRepository.findOneBy({ userId });
    if (!endUser) throw new NotFoundException('End user not found!');

    const transferId = `MIDTRANS-${randomUUID()}`;

    const beneficiaryName = endUser?.name || 'SEMAR USER';
    const beneficiaryBankCodeRaw =
      endUser?.netBankingDetails?.bankCode ||
      endUser?.netBankingDetails?.bankName ||
      endUser?.netBankingDetails?.ifscCode;
    const beneficiaryBankCode = this.mapBankToIrisBankCode(
      beneficiaryBankCodeRaw,
    );
    const beneficiaryAccount =
      mode === 'imps'
        ? endUser?.netBankingDetails?.accountNumber
        : endUser?.eWalletDetails?.mobileNumber || endUser?.mobile;

    const payload = {
      payouts: [
        {
          beneficiary_name: beneficiaryName,
          beneficiary_account: beneficiaryAccount,
          beneficiary_bank: beneficiaryBankCode,
          beneficiary_email: endUser?.email || '',
          amount: Number(parseFloat(String(amount)).toFixed(2)).toFixed(2),
          notes: this.sanitizeIrisText(
            `SEMAR payout ${orderId} ${transferId}`,
            'SEMAR payout',
          ),
        },
      ],
    };

    const response: any = await this.createPayout(payload, orderId);
    if (!response) {
      return {
        gatewayName: GatewayName.MIDTRANS,
        transactionId: null,
        transactionReceipt: 'MIDTRANS',
        paymentStatus: 'FAILED',
        transactionDetails: {
          error:
            'Midtrans create payout failed. Check gateway_error / Midtrans logs for details.',
        },
      };
    }
    const payoutResponse = response?.payouts?.[0];
    const referenceNo =
      payoutResponse?.reference_no || response?.reference_no || transferId;
    const createStatus = String(
      payoutResponse?.status || response?.status || '',
    ).toLowerCase();

    let approveResponse: any = {
      status: 'SKIPPED',
      reason: 'Create payout status does not require approve step.',
    };
    if (
      referenceNo &&
      ['pending', 'queued', 'requires_approval', 'need_approval'].includes(
        createStatus,
      )
    ) {
      approveResponse = await this.approvePayouts([referenceNo]);
      if (!approveResponse) {
        approveResponse = {
          status: 'FAILED',
          error: 'Approve payout API failed with empty response.',
        };
      }
    }

    return {
      gatewayName: GatewayName.MIDTRANS,
      transactionId:
        referenceNo || response?.id || response?.payouts?.[0]?.id,
      transactionReceipt: 'MIDTRANS',
      paymentStatus:
        approveResponse?.payouts?.[0]?.status ||
        approveResponse?.status ||
        payoutResponse?.status ||
        response?.status ||
        response?.transaction_status ||
        'PENDING',
      transactionDetails: {
        create: response,
        approve: approveResponse,
      },
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
    const beneficiaryBankCodeRaw =
      identity?.netBanking?.[0]?.bankName || identity?.netBanking?.[0]?.ifsc;
    const beneficiaryBankCode = this.mapBankToIrisBankCode(
      beneficiaryBankCodeRaw,
    );

    const beneficiaryAccount =
      mode === 'imps'
        ? identity?.netBanking?.[0]?.accountNumber
        : identity?.eWallet?.[0]?.mobile || '08123456789';

    const payload = {
      payouts: [
        {
          beneficiary_name: identity.email || 'SEMAR',
          beneficiary_account: beneficiaryAccount,
          beneficiary_bank: beneficiaryBankCode,
          beneficiary_email: identity?.email || '',
          amount: Number(parseFloat(String(amount)).toFixed(2)).toFixed(2),
          notes: this.sanitizeIrisText(
            `SEMAR withdrawal ${orderId} ${transferId}`,
            'SEMAR withdrawal',
          ),
        },
      ],
    };

    const response: any = await this.createPayout(payload, orderId);
    if (!response) {
      return {
        gatewayName: GatewayName.MIDTRANS,
        transactionId: null,
        transactionReceipt: 'MIDTRANS',
        paymentStatus: 'FAILED',
        transactionDetails: {
          error:
            'Midtrans create payout failed. Check gateway_error / Midtrans logs for details.',
        },
      };
    }
    const payoutResponse = response?.payouts?.[0];
    const referenceNo =
      payoutResponse?.reference_no || response?.reference_no || transferId;
    const createStatus = String(
      payoutResponse?.status || response?.status || '',
    ).toLowerCase();

    let approveResponse: any = {
      status: 'SKIPPED',
      reason: 'Create payout status does not require approve step.',
    };
    if (
      referenceNo &&
      ['pending', 'queued', 'requires_approval', 'need_approval'].includes(
        createStatus,
      )
    ) {
      approveResponse = await this.approvePayouts([referenceNo]);
      if (!approveResponse) {
        approveResponse = {
          status: 'FAILED',
          error: 'Approve payout API failed with empty response.',
        };
      }
    }

    return {
      gatewayName: GatewayName.MIDTRANS,
      transactionId:
        referenceNo || response?.id || response?.payouts?.[0]?.id,
      transactionReceipt: 'MIDTRANS',
      paymentStatus:
        approveResponse?.payouts?.[0]?.status ||
        approveResponse?.status ||
        payoutResponse?.status ||
        response?.status ||
        response?.transaction_status ||
        'PENDING',
      transactionDetails: {
        create: response,
        approve: approveResponse,
      },
    };
  }

  async getPayoutDetails(transferId: string) {
    if (!transferId) return;

    const { creatorApiKey, disbursementMerchantId } =
      await this.getPayoutCredentials('live');
    const url = `${this.getIrisBase('live')}/payouts/${transferId}`;

    try {
      this.logMidtransRequest('PAYOUT_STATUS', url);
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            Accept: 'application/json',
            Authorization: this.buildBasicAuth(
              creatorApiKey,
              '',
            ),
            ...(disbursementMerchantId
              ? { 'X-Merchant-ID': disbursementMerchantId }
              : {}),
          },
        }),
      );
      this.logMidtransResponse('PAYOUT_STATUS', response.data);

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
      this.logMidtransError('PAYOUT_STATUS', error);
    }
  }
}
