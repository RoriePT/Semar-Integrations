import { HttpService } from '@nestjs/axios';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { GetPayPageDto } from '../dto/getPayPage.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EndUser } from 'src/end-user/entities/end-user.entity';
import { Repository } from 'typeorm';
import { ChannelName, GatewayName } from 'src/utils/enum/enum';
import { v4 as uuid } from 'uuid';
import { JwtService } from 'src/services/jwt/jwt.service';
import { Identity } from 'src/identity/entities/identity.entity';
import { Cashfree } from 'src/gateway/entities/cashfree.entity';
import { firstValueFrom } from 'rxjs';
import { Payout } from 'src/payout/entities/payout.entity';
import { Payin } from 'src/payin/entities/payin.entity';

@Injectable()
export class CashfreeService {
  public constructor(
    @InjectRepository(EndUser)
    private readonly endUserRepository: Repository<EndUser>,
    @InjectRepository(Cashfree)
    private readonly cashfreeRepository: Repository<Cashfree>,
    @InjectRepository(Identity)
    private readonly identityRepository: Repository<Identity>,
    @InjectRepository(Payout)
    private readonly payoutRepository: Repository<Payout>,
    @InjectRepository(Payin)
    private readonly payinRepository: Repository<Payin>,

    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
  ) {}

  generateUniqueKey = () => uuid();

  private async getCredentials(environment, forPayouts = false) {
    const cashfree = (await this.cashfreeRepository.find())[0];
    if (!cashfree) throw new NotFoundException('Cashfree record not found!');

    const keys =
      environment === 'live'
        ? {
            keyId: forPayouts ? cashfree.payouts_client_id : cashfree.client_id,
            keySecret: forPayouts
              ? cashfree.payouts_client_secret
              : cashfree.client_secret,
          }
        : {
            keyId: cashfree.sandbox_client_id,
            keySecret: cashfree.sandbox_client_secret,
          };

    const decryptedKeyId = this.jwtService.decryptValue(keys.keyId);
    const decryptedKeySecret = this.jwtService.decryptValue(keys.keySecret);

    if (!decryptedKeyId || !decryptedKeySecret)
      console.log('Failed to decrypt Razorpay keys');

    return {
      key_id: decryptedKeyId,
      key_secret: decryptedKeySecret,
    };
  }

  async getPayPage(getPayPageDto: GetPayPageDto) {
    const { userId, amount, environment, channelName, orderId } = getPayPageDto;

    const { key_id, key_secret } = await this.getCredentials(environment);

    const endUser = await this.endUserRepository.findOneBy({ userId });

    let paymentMethods;
    if (channelName === ChannelName.UPI) paymentMethods = 'upi';
    if (channelName === ChannelName.BANKING) paymentMethods = 'nb';
    if (channelName === ChannelName.E_WALLET) paymentMethods = 'app';

    const now = new Date();
    const expiryTime = new Date(now.getTime() + 25 * 60 * 60 * 1000); // Add 25 hours
    const isoExpiryTime = expiryTime.toISOString();

    const payload = {
      link_id: this.generateUniqueKey(),
      link_amount: Number(parseFloat(amount).toFixed(2)),
      link_currency: 'INR',
      link_purpose: 'Payin Order',
      customer_details: {
        customer_name: endUser?.name || '',
        customer_email: endUser?.email || '',
        customer_phone: endUser?.mobile || '9876543210',
      },
      link_notify: {
        send_sms: true,
        send_email: true,
      },
      link_meta: {
        payment_methods: paymentMethods,
        return_url: `${process.env.PAYMENT_PAGE_BASE_URL}/gateway-callback?orderId=${orderId}&environment=${environment}`,
      },
      link_expiry_time: isoExpiryTime,
    };

    const headers = {
      'x-api-version': '2025-01-01',
      'x-client-id': key_id,
      'x-client-secret': key_secret,
      'Content-Type': 'application/json',
    };

    try {
      const request_url =
        environment === 'live'
          ? 'https://api.cashfree.com/pg/links'
          : 'https://sandbox.cashfree.com/pg/links';

      const observable = this.httpService.post(request_url, payload, {
        headers,
      });

      const response = await firstValueFrom<any>(observable);

      return {
        url: response.data?.link_url,
        trackingId: response.data?.link_id,
      };
    } catch (error) {
      await this.payinRepository.update(
        { systemOrderId: orderId },
        {
          gatewayError: error.response?.data,
        },
      );
      throw new ConflictException(error.response?.data || error.toString());
    }
  }

  async getPaymentStatus(linkId: string, environment = 'live') {
    const { key_id, key_secret } = await this.getCredentials(environment);

    const headers = {
      'x-api-version': '2025-01-01',
      'x-client-id': key_id,
      'x-client-secret': key_secret,
      'Content-Type': 'application/json',
    };

    try {
      const request_url =
        environment === 'live'
          ? `https://api.cashfree.com/pg/links/${linkId}`
          : `https://sandbox.cashfree.com/pg/links/${linkId}`;

      const order_request_url =
        environment === 'live'
          ? `https://api.cashfree.com/pg/links/${linkId}/orders`
          : `https://sandbox.cashfree.com/pg/links/${linkId}/orders`;

      const observable = this.httpService.get(request_url, { headers });
      const orderObservable = this.httpService.get(order_request_url, {
        headers,
      });

      const response = await firstValueFrom<any>(observable);
      const orderResponse = await firstValueFrom<any>(orderObservable);

      const linkStatus = response.data?.link_status;

      let status = 'PENDING';
      if (linkStatus === 'PAID') status = 'SUCCESS';
      if (linkStatus === 'CANCELLED') status = 'FAILED';

      return {
        status,
        details: {
          transactionId: orderResponse?.data[0]?.order_id,
          transactionReceipt: 'RECEIPT',
          otherPaymentDetails: response.data,
        },
      };
    } catch (error) {
      console.log({ error });
    }
  }

  async createPayout(payoutDetails) {
    const {
      orderId,
      transfer_id,
      transfer_amount,
      transfer_mode,
      beneficiary_details,
    } = payoutDetails;

    const { key_id, key_secret } = await this.getCredentials('live', true);

    const headers = {
      'x-api-version': '2024-01-01',
      'x-client-id': key_id,
      'x-client-secret': key_secret,
      'Content-Type': 'application/json',
    };

    const payload = {
      transfer_id,
      transfer_amount,
      beneficiary_details,
      transfer_mode,
    };

    const apiEndpoint = 'https://api.cashfree.com/payout/transfers';

    try {
      const response = await firstValueFrom(
        this.httpService.post(apiEndpoint, payload, {
          headers,
        }),
      );

      return response.data;
    } catch (error) {
      await this.payoutRepository.update(
        { systemOrderId: orderId },
        {
          gatewayError: error.response.data,
        },
      );
      console.log({ error: JSON.stringify(error.response.data) });
    }
  }

  async makePayoutPaymentForEndUsers({ userId, amount, orderId, mode }) {
    if (!(mode === 'imps' || mode === 'upi')) return;

    const cashfree = (await this.cashfreeRepository.find())[0];
    if (!cashfree) throw new NotFoundException('Cashfree record not found!');

    const endUser = await this.endUserRepository.findOneBy({ userId });
    if (!endUser) throw new NotFoundException('End user not found!');

    let beneficiary_details;
    if (endUser?.beneficiaryId) {
      const res = await this.deleteBeneficiary(endUser.beneficiaryId);
      if (res)
        await this.endUserRepository.update(
          { userId },
          { beneficiaryId: null },
        );
    }

    const beneficiaryId = await this.createBeneficiary(userId);

    if (!beneficiaryId) {
      let beneficiary_instrument_details;
      if (endUser.netBankingDetails && endUser.upiDetails) {
        beneficiary_instrument_details = {
          bank_account_number: endUser.netBankingDetails.accountNumber,
          bank_ifsc: endUser.netBankingDetails.ifscCode,
          vpa: endUser.upiDetails.upiId,
        };
      } else if (endUser.netBankingDetails) {
        beneficiary_instrument_details = {
          bank_account_number: endUser.netBankingDetails.accountNumber,
          bank_ifsc: endUser.netBankingDetails.ifscCode,
        };
      } else if (endUser.upiDetails) {
        beneficiary_instrument_details = {
          vpa: endUser.upiDetails.upiId,
        };
      }
      beneficiary_details = {
        beneficiary_name: endUser.name,
        beneficiary_instrument_details,
      };
    } else {
      beneficiary_details = {
        beneficiary_id: beneficiaryId,
      };
    }

    const payoutPayload = {
      orderId,
      transfer_id: this.generateUniqueKey(),
      transfer_amount: amount,
      transfer_mode: mode,
      beneficiary_details,
    };

    const response: any = await this.createPayout(payoutPayload);

    return {
      gatewayName: GatewayName.CASHFREE,
      transactionId: response?.transfer_id,
      transactionReceipt: 'CASHFREE',
      paymentStatus: response?.status,
      transactionDetails: response,
    };
  }

  async makePayoutPaymentForInternalUsers({
    identityId,
    amount,
    orderId,
    mode,
  }) {
    if (!(mode === 'imps' || mode === 'upi')) return;

    const cashfree = (await this.cashfreeRepository.find())[0];
    if (!cashfree) throw new NotFoundException('Cashfree record not found!');

    const identity = await this.identityRepository.findOne({
      where: {
        id: identityId,
      },
      relations: ['netBanking'],
    });
    if (!identity) throw new NotFoundException('Identity not found!');

    let beneficiary_details;
    if (identity.beneficiaryId) {
      const res = await this.deleteBeneficiary(identity.beneficiaryId);
      if (res)
        await this.identityRepository.update(
          { id: identityId },
          { beneficiaryId: null },
        );
    }

    const beneficiaryId = await this.createBeneficiaryForInternalUsers(
      identity.id,
    );
    beneficiary_details = {
      beneficiary_id: beneficiaryId,
    };

    const payoutPayload = {
      orderId,
      transfer_id: this.generateUniqueKey(),
      transfer_amount: amount,
      transfer_mode: mode,
      beneficiary_details,
    };

    const response: any = await this.createPayout(payoutPayload);

    return {
      gatewayName: GatewayName.CASHFREE,
      transactionId: response?.transfer_id,
      transactionReceipt: 'CASHFREE',
      paymentStatus: response?.status,
      transactionDetails: response,
    };
  }

  async getPayoutDetails(transferId: string) {
    if (!transferId) return;
    const { key_id, key_secret } = await this.getCredentials('live', true);

    const headers = {
      'x-api-version': '2024-01-01',
      'x-client-id': key_id,
      'x-client-secret': key_secret,
    };

    const apiEndpoint = `https://api.cashfree.com/payout/transfers?transfer_id=${transferId}`;

    try {
      const response = await firstValueFrom(
        this.httpService.get(apiEndpoint, {
          headers,
        }),
      );

      return {
        status: response.data?.status,
        utr: response?.data?.transfer_utr,
        details: response.data,
      };
    } catch (error) {
      console.log({ error });
    }
  }

  async createBeneficiary(userId: string) {
    const endUser = await this.endUserRepository.findOneBy({ userId });
    if (!endUser) throw new NotFoundException('End user not found!');

    if (endUser.beneficiaryId) return endUser.beneficiaryId;

    const { key_id, key_secret } = await this.getCredentials('live', true);

    const headers = {
      'x-api-version': '2024-01-01',
      'x-client-id': key_id,
      'x-client-secret': key_secret,
      'Content-Type': 'application/json',
    };

    const beneficiaryId = `BENENDUSER${endUser.id}`;

    let beneficiary_instrument_details = {};
    let beneficiary_contact_details = {};

    if (endUser.netBankingDetails && endUser.upiDetails) {
      beneficiary_instrument_details = {
        bank_account_number: endUser.netBankingDetails.accountNumber,
        bank_ifsc: endUser.netBankingDetails.ifscCode,
        vpa: endUser.upiDetails.upiId,
      };
    } else if (endUser.netBankingDetails) {
      beneficiary_instrument_details = {
        bank_account_number: endUser.netBankingDetails.accountNumber,
        bank_ifsc: endUser.netBankingDetails.ifscCode,
      };
    } else if (endUser.upiDetails) {
      beneficiary_instrument_details = {
        vpa: endUser.upiDetails.upiId,
      };
    }

    beneficiary_contact_details = {
      beneficiary_email: endUser.email || 'sample@cashfree.com',
      beneficiary_phone: endUser.mobile || '9876543210',
      beneficiary_country_code: '+91',
      beneficiary_address: '177A Bleecker Street',
      beneficiary_city: 'New York City',
      beneficiary_state: 'New York',
      beneficiary_postal_code: '560011',
    };

    const payload = {
      beneficiary_id: beneficiaryId,
      beneficiary_name: endUser.name,
      beneficiary_instrument_details,
      beneficiary_contact_details,
    };

    const apiEndpoint = 'https://api.cashfree.com/payout/beneficiary';

    try {
      const response = await firstValueFrom(
        this.httpService.post(apiEndpoint, payload, {
          headers,
        }),
      );

      if (response)
        await this.endUserRepository.update(
          { userId },
          { beneficiaryId: beneficiaryId },
        );

      return beneficiaryId;
    } catch (error) {
      console.log({ error: error.response?.data || error.toString() });
    }
  }

  async createBeneficiaryForInternalUsers(identityId: number) {
    const identity = await this.identityRepository.findOne({
      where: {
        id: identityId,
      },
      relations: ['netBanking', 'upi'],
    });
    if (!identity) throw new NotFoundException('Identity not found!');

    if (identity.beneficiaryId) return identity.beneficiaryId;

    const { key_id, key_secret } = await this.getCredentials('live', true);

    const headers = {
      'x-api-version': '2024-01-01',
      'x-client-id': key_id,
      'x-client-secret': key_secret,
      'Content-Type': 'application/json',
    };

    const beneficiaryId = `BENINTERNAL${identity.id}`;

    let beneficiary_instrument_details = {};
    let beneficiary_contact_details = {};

    if (identity.netBanking.length && identity.upi.length) {
      beneficiary_instrument_details = {
        bank_account_number: identity.netBanking[0].accountNumber,
        bank_ifsc: identity.netBanking[0].ifsc,
        vpa: identity.upi[0].upiId,
      };
    } else if (identity.netBanking.length) {
      beneficiary_instrument_details = {
        bank_account_number: identity.netBanking[0].accountNumber,
        bank_ifsc: identity.netBanking[0].ifsc,
      };
    } else if (identity.upi.length) {
      beneficiary_instrument_details = {
        vpa: identity.upi[0].upiId,
      };
    }

    beneficiary_contact_details = {
      beneficiary_email: identity.email || 'sample@cashfree.com',
      beneficiary_phone: '9876543210',
      beneficiary_country_code: '+91',
      beneficiary_address: '177A Bleecker Street',
      beneficiary_city: 'New York City',
      beneficiary_state: 'New York',
      beneficiary_postal_code: '560011',
    };

    const payload = {
      beneficiary_id: beneficiaryId,
      beneficiary_name: 'KG Merchant',
      beneficiary_instrument_details,
      beneficiary_contact_details,
    };

    const apiEndpoint = 'https://api.cashfree.com/payout/beneficiary';

    try {
      const response = await firstValueFrom(
        this.httpService.post(apiEndpoint, payload, {
          headers,
        }),
      );

      if (response)
        await this.identityRepository.update(
          { id: identityId },
          { beneficiaryId: beneficiaryId },
        );

      return beneficiaryId;
    } catch (error) {
      console.log({ error: error.response?.data || error.toString() });
    }
  }

  async deleteBeneficiary(beneficiaryId: string) {
    const { key_id, key_secret } = await this.getCredentials('live', true);

    const headers = {
      'x-api-version': '2024-01-01',
      'x-client-id': key_id,
      'x-client-secret': key_secret,
    };

    const apiEndpoint = 'https://api.cashfree.com/payout/beneficiary';
    const urlWithParams = `${apiEndpoint}?beneficiary_id=${beneficiaryId}`;

    try {
      const response = await firstValueFrom(
        this.httpService.delete(urlWithParams, { headers }),
      );

      return response.data;
    } catch (error) {
      console.log({ error: error.response?.data || error.toString() });
    }
  }
}
