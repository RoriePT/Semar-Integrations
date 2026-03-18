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
import { createHash, createHmac, createSign, randomUUID } from 'crypto';

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

  private kirimDokuTokenCache:
    | { environment: 'live' | 'sandbox'; accessToken: string; expiresAt: number }
    | null = null;

  private shouldLogDoku() {
    return process.env.DOKU_DEBUG_LOGS === 'true';
  }

  private toPlainObject(input?: any) {
    if (!input) return {};
    if (typeof input.toJSON === 'function') return input.toJSON();
    return { ...input };
  }

  private sanitizeHeaders(headers?: Record<string, any>) {
    const plain = this.toPlainObject(headers);
    const redactedKeys = [
      'authorization',
      'x-signature',
      'signature',
      'x-client-key',
      'client-id',
      'x-partner-id',
      'x-timestamp',
    ];
    Object.keys(plain).forEach((key) => {
      if (redactedKeys.includes(key.toLowerCase())) {
        plain[key] = '[REDACTED]';
      }
    });
    return plain;
  }

  private logDokuRequest({
    label,
    method,
    url,
    headers,
    payload,
  }: {
    label: string;
    method: string;
    url: string;
    headers?: Record<string, any>;
    payload?: any;
  }) {
    if (!this.shouldLogDoku()) return;
    console.log(
      `\n==================== DOKU REQUEST: ${label} ====================`,
    );
    console.log(`METHOD: ${method}`);
    console.log(`URL: ${url}`);
    console.log('HEADERS:', this.sanitizeHeaders(headers));
    if (payload !== undefined) {
      console.log('PAYLOAD:', payload);
    }
    console.log('===============================================================\n');
  }

  private logDokuResponse({
    label,
    status,
    data,
  }: {
    label: string;
    status?: number;
    data?: any;
  }) {
    if (!this.shouldLogDoku()) return;
    console.log(
      `\n==================== DOKU RESPONSE: ${label} ====================`,
    );
    if (status !== undefined) console.log(`HTTP STATUS: ${status}`);
    console.log('DATA:', data);
    console.log('===============================================================\n');
  }

  private logDokuError({
    label,
    error,
  }: {
    label: string;
    error: any;
  }) {
    if (!this.shouldLogDoku()) return;
    console.log(
      `\n===================== DOKU ERROR: ${label} =====================`,
    );
    console.log('ERROR:', error);
    console.log('===============================================================\n');
  }

  private formatDokuError(error: any) {
    return {
      message: error?.message,
      code: error?.code,
      status: error?.response?.status,
      data: error?.response?.data,
      url: error?.config?.url,
      method: error?.config?.method,
    };
  }

  private parsePayoutTransactionDetails(transactionDetails?: any) {
    if (!transactionDetails) return {};
    if (typeof transactionDetails === 'string') {
      try {
        return JSON.parse(transactionDetails);
      } catch {
        return {};
      }
    }
    return transactionDetails;
  }

  private isRetriableDokuBalanceError(error: any) {
    return (
      error?.response?.status === 504 ||
      error?.response?.data?.responseCode === '5041100'
    );
  }

  private getKirimDokuSenderProfile() {
    const senderFirstName = process.env.DOKU_KD_SENDER_FIRST_NAME?.trim();
    const senderLastName = process.env.DOKU_KD_SENDER_LAST_NAME?.trim();
    const senderPersonalId = process.env.DOKU_KD_SENDER_PERSONAL_ID?.trim();
    const senderPersonalIdType =
      process.env.DOKU_KD_SENDER_PERSONAL_ID_TYPE?.trim();

    if (!senderFirstName) {
      throw new ConflictException('DOKU_KD_SENDER_FIRST_NAME is missing.');
    }

    if (!senderLastName) {
      throw new ConflictException('DOKU_KD_SENDER_LAST_NAME is missing.');
    }

    if (!senderPersonalId) {
      throw new ConflictException('DOKU_KD_SENDER_PERSONAL_ID is missing.');
    }

    if (!senderPersonalIdType) {
      throw new ConflictException(
        'DOKU_KD_SENDER_PERSONAL_ID_TYPE is missing.',
      );
    }

    return {
      senderFirstName,
      senderLastName,
      senderPersonalId,
      senderPersonalIdType,
    };
  }

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
    if (channelName === ChannelName.UPI || channelName === ChannelName.QRIS)
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

  private getSnapTimestamp(date = new Date()) {
    const pad = (value: number) => String(value).padStart(2, '0');
    const tzOffsetMinutes = -date.getTimezoneOffset();
    const sign = tzOffsetMinutes >= 0 ? '+' : '-';
    const absOffset = Math.abs(tzOffsetMinutes);
    const hours = pad(Math.floor(absOffset / 60));
    const minutes = pad(absOffset % 60);

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate(),
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
      date.getSeconds(),
    )}${sign}${hours}:${minutes}`;
  }

  private getUtcTimestamp() {
    return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
  }

  private normalizePrivateKey(key: string) {
    if (!key) return '';
    return key.includes('BEGIN') ? key.replace(/\\n/g, '\n') : key;
  }

  private buildAsymmetricSignature(privateKey: string, stringToSign: string) {
    const signer = createSign('RSA-SHA256');
    signer.update(stringToSign);
    signer.end();
    return signer.sign(privateKey, 'base64');
  }

  private generateExternalId() {
    const rand = Math.floor(Math.random() * 1_000_000)
      .toString()
      .padStart(6, '0');
    return `${Date.now()}${rand}`;
  }

  private formatAmountValue(amount: string | number) {
    const parsed = Number.parseFloat(String(amount));
    if (Number.isNaN(parsed)) return '0.00';
    return parsed.toFixed(2);
  }

  private normalizePhoneNumber(phone?: string) {
    if (!phone) return '628000000000';
    const digits = phone.replace(/[^\d]/g, '');
    if (digits.startsWith('62')) return digits;
    if (digits.startsWith('0')) return `62${digits.slice(1)}`;
    return `62${digits}`;
  }

  private splitName(name?: string) {
    if (!name) return { firstName: 'SEMAR', lastName: 'USER' };
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return { firstName: parts[0], lastName: 'USER' };
    return {
      firstName: parts[0],
      lastName: parts.slice(1).join(' '),
    };
  }

  private async getKirimDokuAccessToken(environment: 'live' | 'sandbox') {
    if (
      this.kirimDokuTokenCache &&
      this.kirimDokuTokenCache.environment === environment &&
      Date.now() < this.kirimDokuTokenCache.expiresAt - 30_000
    ) {
      return this.kirimDokuTokenCache.accessToken;
    }

    const { clientId } = await this.getCredentials(environment);
    const privateKey = this.normalizePrivateKey(
      process.env.DOKU_SNAP_PRIVATE_KEY || '',
    );
    if (!privateKey)
      throw new ConflictException('DOKU_SNAP_PRIVATE_KEY is missing.');

    const timestamp = this.getUtcTimestamp();
    const stringToSign = `${clientId}|${timestamp}`;
    const signature = this.buildAsymmetricSignature(privateKey, stringToSign);

    const requestTarget = '/authorization/v1/access-token/b2b';
    const payload = { grantType: 'client_credentials' };

    this.logDokuRequest({
      label: 'ACCESS_TOKEN',
      method: 'POST',
      url: `${this.buildBaseUrl(environment)}${requestTarget}`,
      headers: {
        'Content-Type': 'application/json',
        'X-CLIENT-KEY': clientId,
        'X-TIMESTAMP': timestamp,
        'X-SIGNATURE': signature,
      },
      payload,
    });

    const response = await firstValueFrom(
      this.httpService.post(
        `${this.buildBaseUrl(environment)}${requestTarget}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CLIENT-KEY': clientId,
            'X-TIMESTAMP': timestamp,
            'X-SIGNATURE': signature,
          },
        },
      ),
    );

    this.logDokuResponse({
      label: 'ACCESS_TOKEN',
      status: response?.status,
      data: response?.data,
    });

    const accessToken =
      response.data?.accessToken || response.data?.access_token;
    if (!accessToken)
      throw new ConflictException('DOKU access token is missing in response.');

    const expiresIn = Number(response.data?.expiresIn || 900);
    this.kirimDokuTokenCache = {
      environment,
      accessToken,
      expiresAt: Date.now() + expiresIn * 1000,
    };

    return accessToken;
  }

  private buildSnapSignature({
    httpMethod,
    requestTarget,
    accessToken,
    body,
    timestamp,
    clientSecret,
  }: {
    httpMethod: string;
    requestTarget: string;
    accessToken: string;
    body: any;
    timestamp: string;
    clientSecret: string;
  }) {
    const minifiedBody = JSON.stringify(body || {});
    const bodyHash = createHash('sha256')
      .update(minifiedBody)
      .digest('hex')
      .toLowerCase();
    const stringToSign = `${httpMethod}:${requestTarget}:${accessToken}:${bodyHash}:${timestamp}`;
    return createHmac('sha512', clientSecret).update(stringToSign).digest('base64');
  }

  private async buildSnapHeaders({
    environment,
    requestTarget,
    body,
    accessToken,
    httpMethod = 'POST',
  }: {
    environment: 'live' | 'sandbox';
    requestTarget: string;
    body: any;
    accessToken: string;
    httpMethod?: string;
  }) {
    const { clientId, secretKey } = await this.getCredentials(environment);
    const timestamp = this.getSnapTimestamp();
    const externalId = this.generateExternalId();
    const signature = this.buildSnapSignature({
      httpMethod,
      requestTarget,
      accessToken,
      body,
      timestamp,
      clientSecret: secretKey,
    });

    return {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'X-PARTNER-ID': clientId,
        'X-EXTERNAL-ID': externalId,
        'X-SIGNATURE': signature,
        'X-TIMESTAMP': timestamp,
        'CHANNEL-ID': process.env.DOKU_SNAP_CHANNEL_ID || 'H2H',
      },
      externalId,
      timestamp,
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
      const requestUrl = `${this.buildBaseUrl(environment)}${requestTarget}`;
      const requestHeaders = this.buildSignedHeaders(
        clientId,
        secretKey,
        requestTarget,
        payload,
      );

      this.logDokuRequest({
        label: 'CHECKOUT_PAYIN',
        method: 'POST',
        url: requestUrl,
        headers: requestHeaders,
        payload,
      });

      const response = await firstValueFrom(
        this.httpService.post(
          requestUrl,
          payload,
          {
            headers: requestHeaders,
          },
        ),
      );

      this.logDokuResponse({
        label: 'CHECKOUT_PAYIN',
        status: response?.status,
        data: response?.data,
      });

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
      this.logDokuError({
        label: 'CHECKOUT_PAYIN',
        error: error?.response?.data || error?.toString(),
      });
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
      const requestUrl = `${this.buildBaseUrl(environment)}${requestTarget}`;

      this.logDokuRequest({
        label: 'PAYIN_STATUS',
        method: 'GET',
        url: requestUrl,
        headers,
      });

      const response = await firstValueFrom(
        this.httpService.get(requestUrl, { headers }),
      );

      this.logDokuResponse({
        label: 'PAYIN_STATUS',
        status: response?.status,
        data: response?.data,
      });

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
      this.logDokuError({
        label: 'PAYIN_STATUS',
        error: error?.response?.data || error?.toString(),
      });
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

  private async kirimDokuAccountInquiry({
    orderId,
    amount,
    beneficiary,
    customerNumber,
    environment,
  }: {
    orderId: string;
    amount: string | number;
    beneficiary: { account_number: string; account_name: string; bank_code: string };
    customerNumber: string;
    environment: 'live' | 'sandbox';
  }) {
    const requestTarget = '/snap/v1.1/emoney/bank-account-inquiry';
    const accessToken = await this.getKirimDokuAccessToken(environment);
    const body = {
      partnerReferenceNo: `${orderId}-INQ`,
      customerNumber,
      beneficiaryAccountNumber: beneficiary.account_number,
      amount: {
        value: this.formatAmountValue(amount),
        currency: 'IDR',
      },
      additionalInfo: {
        beneficiaryBankCode: beneficiary.bank_code,
        beneficiaryAccountName: beneficiary.account_name,
        senderCountryCode: 'ID',
      },
    };

    const { headers, externalId } = await this.buildSnapHeaders({
      environment,
      requestTarget,
      body,
      accessToken,
    });

    this.logDokuRequest({
      label: 'KD_ACCOUNT_INQUIRY',
      method: 'POST',
      url: `${this.buildBaseUrl(environment)}${requestTarget}`,
      headers,
      payload: body,
    });

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.buildBaseUrl(environment)}${requestTarget}`,
          body,
          { headers },
        ),
      );

      this.logDokuResponse({
        label: 'KD_ACCOUNT_INQUIRY',
        status: response?.status,
        data: response?.data,
      });

      return { data: response.data, externalId };
    } catch (error) {
      this.logDokuError({
        label: 'KD_ACCOUNT_INQUIRY',
        error: this.formatDokuError(error),
      });
      throw error;
    }
  }

  private async kirimDokuBalanceInquiry({
    orderId,
    environment,
  }: {
    orderId: string;
    environment: 'live' | 'sandbox';
  }) {
    const requestTarget = '/snap/v1.1/balance-inquiry';
    const accessToken = await this.getKirimDokuAccessToken(environment);
    const accountNo = process.env.DOKU_KD_ACCOUNT_NO;
    if (!accountNo)
      throw new ConflictException('DOKU_KD_ACCOUNT_NO is missing.');

    const body = {
      partnerReferenceNo: `${orderId}-BAL`,
      accountNo,
    };

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const { headers, externalId } = await this.buildSnapHeaders({
          environment,
          requestTarget,
          body,
          accessToken,
        });

        this.logDokuRequest({
          label: `KD_BALANCE_INQUIRY_ATTEMPT_${attempt}`,
          method: 'POST',
          url: `${this.buildBaseUrl(environment)}${requestTarget}`,
          headers,
          payload: body,
        });

        const response = await firstValueFrom(
          this.httpService.post(
            `${this.buildBaseUrl(environment)}${requestTarget}`,
            body,
            { headers },
          ),
        );

        this.logDokuResponse({
          label: `KD_BALANCE_INQUIRY_ATTEMPT_${attempt}`,
          status: response?.status,
          data: response?.data,
        });

        return { data: response.data, externalId };
      } catch (error) {
        this.logDokuError({
          label: `KD_BALANCE_INQUIRY_ATTEMPT_${attempt}`,
          error: this.formatDokuError(error),
        });

        if (attempt === 2 || !this.isRetriableDokuBalanceError(error)) {
          throw error;
        }
      }
    }
  }

  private async kirimDokuTransferBank({
    orderId,
    amount,
    beneficiary,
    customerNumber,
    sessionId,
    environment,
  }: {
    orderId: string;
    amount: string | number;
    beneficiary: { account_number: string; account_name: string; bank_code: string };
    customerNumber: string;
    sessionId: string;
    environment: 'live' | 'sandbox';
  }) {
    const requestTarget = '/snap/v1.1/emoney/transfer-bank';
    const accessToken = await this.getKirimDokuAccessToken(environment);
    const { firstName, lastName } = this.splitName(beneficiary.account_name);
    const channelCode = process.env.DOKU_KD_CHANNEL_CODE || '07';
    const senderProfile = this.getKirimDokuSenderProfile();

    const body = {
      partnerReferenceNo: orderId,
      customerNumber,
      beneficiaryAccountNumber: beneficiary.account_number,
      beneficiaryBankCode: beneficiary.bank_code,
      amount: {
        value: this.formatAmountValue(amount),
        currency: 'IDR',
      },
      sessionId,
      additionalInfo: {
        channelCode,
        beneficiaryAccountName: beneficiary.account_name,
        beneficiaryFirstName: firstName,
        beneficiaryLastName: lastName,
        beneficiaryPhoneNumber: customerNumber,
        senderCountryCode: 'ID',
        senderFirstName: senderProfile.senderFirstName,
        senderLastName: senderProfile.senderLastName,
        senderPersonalId: senderProfile.senderPersonalId,
        senderPersonalIdType: senderProfile.senderPersonalIdType,
      },
    };

    const { headers, externalId } = await this.buildSnapHeaders({
      environment,
      requestTarget,
      body,
      accessToken,
    });

    this.logDokuRequest({
      label: 'KD_TRANSFER_BANK',
      method: 'POST',
      url: `${this.buildBaseUrl(environment)}${requestTarget}`,
      headers,
      payload: body,
    });

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.buildBaseUrl(environment)}${requestTarget}`,
          body,
          { headers },
        ),
      );

      this.logDokuResponse({
        label: 'KD_TRANSFER_BANK',
        status: response?.status,
        data: response?.data,
      });

      return { data: response.data, externalId };
    } catch (error) {
      this.logDokuError({
        label: 'KD_TRANSFER_BANK',
        error: this.formatDokuError(error),
      });
      throw error;
    }
  }

  private async kirimDokuCheckStatus({
    partnerReferenceNo,
    referenceNo,
    originalExternalId,
    environment,
  }: {
    partnerReferenceNo: string;
    referenceNo?: string;
    originalExternalId?: string;
    environment: 'live' | 'sandbox';
  }) {
    const requestTarget = '/snap/v1.1/qr/qr-mpm-status';
    const accessToken = await this.getKirimDokuAccessToken(environment);
    const body: Record<string, string> = {
      originalPartnerReferenceNo: partnerReferenceNo,
      serviceCode: '43',
    };
    if (referenceNo) body.originalReferenceNo = referenceNo;
    if (originalExternalId) body.originalExternalId = originalExternalId;

    const { headers } = await this.buildSnapHeaders({
      environment,
      requestTarget,
      body,
      accessToken,
    });

    this.logDokuRequest({
      label: 'KD_CHECK_STATUS',
      method: 'POST',
      url: `${this.buildBaseUrl(environment)}${requestTarget}`,
      headers,
      payload: body,
    });

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.buildBaseUrl(environment)}${requestTarget}`,
          body,
          { headers },
        ),
      );

      this.logDokuResponse({
        label: 'KD_CHECK_STATUS',
        status: response?.status,
        data: response?.data,
      });

      return response.data;
    } catch (error) {
      this.logDokuError({
        label: 'KD_CHECK_STATUS',
        error: this.formatDokuError(error),
      });
      throw error;
    }
  }

  async makePayoutPaymentForEndUsers({
    userId,
    amount,
    orderId,
    mode,
    environment = 'live',
  }: {
    userId: string;
    amount: number | string;
    orderId: string;
    mode: string;
    environment?: 'live' | 'sandbox';
  }) {
    const endUser = await this.endUserRepository.findOneBy({ userId });
    if (!endUser) throw new NotFoundException('End user not found!');

    try {
      const beneficiary = this.buildPayoutBeneficiaryForEndUser(endUser, mode);
      if (!beneficiary?.account_number || !beneficiary?.bank_code)
        throw new ConflictException('Bank details are missing for payout.');

      const customerNumber = this.normalizePhoneNumber(endUser?.mobile);

      const accountInquiry = await this.kirimDokuAccountInquiry({
        orderId,
        amount,
        beneficiary: {
          account_number: beneficiary.account_number,
          account_name: beneficiary.account_name,
          bank_code: beneficiary.bank_code,
        },
        customerNumber,
        environment,
      });

      const accountInquiryCode = String(
        accountInquiry?.data?.responseCode || '',
      );
      if (accountInquiryCode && !accountInquiryCode.startsWith('200'))
        throw new ConflictException(accountInquiry?.data || 'Account inquiry failed.');

      const sessionId =
        accountInquiry?.data?.sessionId ||
        accountInquiry?.data?.referenceNo ||
        accountInquiry?.data?.reference_no;
      if (!sessionId)
        throw new ConflictException('DOKU account inquiry did not return sessionId.');

      let balanceInquiry = null;
      try {
        balanceInquiry = await this.kirimDokuBalanceInquiry({
          orderId,
          environment,
        });
      } catch (error) {
        if (!this.isRetriableDokuBalanceError(error)) throw error;

        this.logDokuResponse({
          label: 'KD_BALANCE_INQUIRY_SKIPPED',
          data: {
            reason: 'Continuing payout after DOKU balance inquiry timeout.',
            error: this.formatDokuError(error),
          },
        });
      }

      const transfer = await this.kirimDokuTransferBank({
        orderId,
        amount,
        beneficiary: {
          account_number: beneficiary.account_number,
          account_name: beneficiary.account_name,
          bank_code: beneficiary.bank_code,
        },
        customerNumber,
        sessionId,
        environment,
      });

      const responseCode = String(transfer?.data?.responseCode || '');
      const paymentStatus = responseCode.startsWith('200') ? 'PENDING' : 'FAILED';
      const gatewayTransactionId =
        transfer?.data?.additionalInfo?.sessionId || sessionId || orderId;

      return {
        gatewayName: GatewayName.DOKU,
        transactionId: gatewayTransactionId,
        transactionReceipt: 'DOKU',
        paymentStatus,
        transactionDetails: {
          accountInquiry: accountInquiry.data,
          balanceInquiry: balanceInquiry?.data || null,
          transfer: transfer.data,
          partnerReferenceNo: orderId,
          referenceNo:
            transfer?.data?.referenceNo || transfer?.data?.reference_no,
          externalId: transfer.externalId,
          sessionId,
        },
      };
    } catch (error) {
      const err = error?.response?.data || error?.toString() || error;
      await this.payoutRepository.update(
        { systemOrderId: orderId },
        { gatewayError: err },
      );

      return {
        gatewayName: GatewayName.DOKU,
        transactionId: orderId,
        transactionReceipt: 'DOKU',
        paymentStatus: 'FAILED',
        transactionDetails: err,
      };
    }
  }

  async makePayoutPaymentForInternalUsers({
    identityId,
    amount,
    orderId,
    mode,
    environment = 'live',
  }: {
    identityId: number;
    amount: number | string;
    orderId: string;
    mode: string;
    environment?: 'live' | 'sandbox';
  }) {
    const identity = await this.identityRepository.findOne({
      where: { id: identityId },
      relations: ['netBanking', 'eWallet'],
    });
    if (!identity) throw new NotFoundException('Identity not found!');

    try {
      const beneficiary = this.buildPayoutBeneficiaryForIdentity(identity, mode);
      if (!beneficiary?.account_number || !beneficiary?.bank_code)
        throw new ConflictException('Bank details are missing for payout.');

      const customerNumber = this.normalizePhoneNumber(
        identity?.netBanking?.[0]?.mobile ||
          identity?.eWallet?.[0]?.mobile ||
          identity?.email,
      );

      const accountInquiry = await this.kirimDokuAccountInquiry({
        orderId,
        amount,
        beneficiary: {
          account_number: beneficiary.account_number,
          account_name: beneficiary.account_name,
          bank_code: beneficiary.bank_code,
        },
        customerNumber,
        environment,
      });

      const accountInquiryCode = String(
        accountInquiry?.data?.responseCode || '',
      );
      if (accountInquiryCode && !accountInquiryCode.startsWith('200'))
        throw new ConflictException(accountInquiry?.data || 'Account inquiry failed.');

      const sessionId =
        accountInquiry?.data?.sessionId ||
        accountInquiry?.data?.referenceNo ||
        accountInquiry?.data?.reference_no;
      if (!sessionId)
        throw new ConflictException('DOKU account inquiry did not return sessionId.');

      let balanceInquiry = null;
      try {
        balanceInquiry = await this.kirimDokuBalanceInquiry({
          orderId,
          environment,
        });
      } catch (error) {
        if (!this.isRetriableDokuBalanceError(error)) throw error;

        this.logDokuResponse({
          label: 'KD_BALANCE_INQUIRY_SKIPPED',
          data: {
            reason: 'Continuing payout after DOKU balance inquiry timeout.',
            error: this.formatDokuError(error),
          },
        });
      }

      const transfer = await this.kirimDokuTransferBank({
        orderId,
        amount,
        beneficiary: {
          account_number: beneficiary.account_number,
          account_name: beneficiary.account_name,
          bank_code: beneficiary.bank_code,
        },
        customerNumber,
        sessionId,
        environment,
      });

      const responseCode = String(transfer?.data?.responseCode || '');
      const paymentStatus = responseCode.startsWith('200') ? 'PENDING' : 'FAILED';
      const gatewayTransactionId =
        transfer?.data?.additionalInfo?.sessionId || sessionId || orderId;

      return {
        gatewayName: GatewayName.DOKU,
        transactionId: gatewayTransactionId,
        transactionReceipt: 'DOKU',
        paymentStatus,
        transactionDetails: {
          accountInquiry: accountInquiry.data,
          balanceInquiry: balanceInquiry?.data || null,
          transfer: transfer.data,
          partnerReferenceNo: orderId,
          referenceNo:
            transfer?.data?.referenceNo || transfer?.data?.reference_no,
          externalId: transfer.externalId,
          sessionId,
        },
      };
    } catch (error) {
      const err = error?.response?.data || error?.toString() || error;
      await this.payoutRepository.update(
        { systemOrderId: orderId },
        { gatewayError: err },
      );

      return {
        gatewayName: GatewayName.DOKU,
        transactionId: orderId,
        transactionReceipt: 'DOKU',
        paymentStatus: 'FAILED',
        transactionDetails: err,
      };
    }
  }

  async getPayoutDetails(
    orderId: string,
    environment: 'live' | 'sandbox' = 'live',
  ) {
    if (!orderId) return;

    try {
      const payout = await this.payoutRepository.findOne({
        where: [
          { transactionId: orderId },
          { systemOrderId: orderId },
          { merchantOrderId: orderId },
        ],
      });

      const details = this.parsePayoutTransactionDetails(
        payout?.transactionDetails,
      );
      const partnerReferenceNo = details?.partnerReferenceNo || payout?.systemOrderId || orderId;
      const referenceNo =
        details?.referenceNo ||
        details?.transfer?.referenceNo ||
        details?.transfer?.reference_no;
      const originalExternalId = details?.externalId;

      const response = await this.kirimDokuCheckStatus({
        partnerReferenceNo,
        referenceNo,
        originalExternalId,
        environment,
      });

      const latestStatus =
        response?.latestTransactionStatus ||
        response?.transactionStatus ||
        response?.status ||
        'PENDING';

      const normalizedStatus = String(latestStatus).toUpperCase();
      let status = 'PENDING';

      if (['00', 'SUCCESS', 'COMPLETED', 'PAID', 'SETTLEMENT'].includes(normalizedStatus))
        status = 'SUCCESS';

      if (['04', '06', 'FAILED', 'REJECTED', 'EXPIRED', 'CANCELLED'].includes(normalizedStatus))
        status = 'FAILED';

      return {
        status,
        utr: response?.additionalInfo?.beneficiaryReferenceNo || null,
        details: response,
      };
    } catch (error) {
      console.log('❌ DOKU Status Error:', error?.response?.data || error?.toString());
    }
  }
}
