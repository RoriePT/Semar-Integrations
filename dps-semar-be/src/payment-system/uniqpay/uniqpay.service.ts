import { HttpService } from '@nestjs/axios';
import { Uniqpay } from './../../gateway/entities/uniqpay.entity';
import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EndUser } from 'src/end-user/entities/end-user.entity';
import { JwtService } from 'src/services/jwt/jwt.service';
import { GatewayName } from 'src/utils/enum/enum';
import { InsertValuesMissingError, Repository } from 'typeorm';
import uniqid from 'uniqid';
import { Identity } from 'src/identity/entities/identity.entity';
import { IdentityService } from 'src/identity/identity.service';
import { firstValueFrom } from 'rxjs';
import { Payout } from 'src/payout/entities/payout.entity';

@Injectable()
export class UniqpayService {
  constructor(
    @InjectRepository(Uniqpay)
    private readonly uniqpayRepository: Repository<Uniqpay>,
    @InjectRepository(EndUser)
    private readonly endUserRepository: Repository<EndUser>,
    @InjectRepository(Identity)
    private readonly identityRepository: Repository<Identity>,
    @InjectRepository(Payout)
    private readonly payoutRepository: Repository<Payout>,

    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly identityService: IdentityService,
  ) {}

  generateUniqueKey = () => uniqid();

  private async getCredentials() {
    const uniqpay = (await this.uniqpayRepository.find())[0];
    if (!uniqpay) throw new NotFoundException('Uniqpay record not found!');

    const keys = {
      uniqpayId: uniqpay.uniqpay_id,
      clientId: uniqpay.client_id,
      clientSecret: uniqpay.client_secret,
    };

    const decryptedUniqpayId = this.jwtService.decryptValue(keys.uniqpayId);
    const decryptedClientId = this.jwtService.decryptValue(keys.clientId);
    const decryptedClientSecret = this.jwtService.decryptValue(
      keys.clientSecret,
    );

    if (!decryptedUniqpayId || !decryptedClientId || !decryptedClientSecret) {
      console.log('Failed to decrypt Uniqpay keys');
      return;
    }

    return {
      uniqpayId: decryptedUniqpayId,
      clientId: decryptedClientId,
      clientSecret: decryptedClientSecret,
    };
  }

  async createPayout(payoutDetails) {
    const {
      name,
      email,
      phone,
      address,
      bankAccount,
      ifsc,
      transferMode,
      transferId,
      amount,
      remarks,
      orderId,
    } = payoutDetails;

    const { uniqpayId, clientId, clientSecret } = await this.getCredentials();

    // Benakpay API headers
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Client-Id': clientId,
      'Client-SecretId': clientSecret,
    };

    // Benakpay API payload
    const payload = {
      name,
      email,
      phone,
      bankAccount,
      ifsc,
      address,
      amount: Number(amount),
      transferId,
      remarks,
      clientId: uniqpayId,
      transferMode: 'IMPS',
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'https://api.benakpay.com/client/ms-payment-imps',
          payload,
          {
            headers,
          },
        ),
      );

      return response.data;
    } catch (error) {
      await this.payoutRepository.update(
        { systemOrderId: orderId },
        {
          gatewayError: error.response?.data,
        },
      );
      console.log({ error });
      console.log({ error: JSON.stringify(error.response?.data) });
    }
  }

  async makePayoutPaymentForEndUsers({ userId, amount, orderId, mode }) {
    if (mode !== 'imps') return;

    const uniqpay = (await this.uniqpayRepository.find())[0];
    if (!uniqpay) throw new NotFoundException('Uniqpay record not found!');

    const endUser = await this.endUserRepository.findOneBy({ userId });
    if (!endUser) throw new NotFoundException('End user not found!');

    if (!endUser.netBankingDetails)
      throw new NotAcceptableException('EndUser NET_BANKING details missing!');

    const payoutPayload = {
      name: endUser.name,
      email: endUser.email,
      phone: endUser.mobile,
      address: 'INDIA',
      bankAccount: endUser.netBankingDetails.accountNumber,
      ifsc: endUser.netBankingDetails.ifscCode,
      transferMode: 'IMPS',
      transferId: this.generateUniqueKey(),
      amount: amount,
      remarks: `USER PAYOUT - ${orderId}`,
      orderId,
    };

    const response: any = await this.createPayout(payoutPayload);

    if (!response || !response?.transferId) return;

    return {
      gatewayName: GatewayName.UNIQPAY,
      transactionId: response?.transferId,
      transactionReceipt: 'UNIQPAY',
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
    if (mode?.toUpperCase() !== 'IMPS') return;

    const uniqpay = (await this.uniqpayRepository.find())[0];
    if (!uniqpay) throw new NotFoundException('Uniqpay record not found!');

    const identity = await this.identityRepository.findOne({
      where: {
        id: identityId,
      },
      relations: ['netBanking'],
    });
    if (!identity) throw new NotFoundException('Identity not found!');

    const userBankingDetails = identity.netBanking[0];
    if (!userBankingDetails)
      throw new NotAcceptableException('User NET_BANKING details missing!');

    const user = await this.identityService.getUser(
      identityId,
      identity.userType,
    );

    const payoutPayload = {
      name: userBankingDetails.beneficiaryName,
      email: userBankingDetails?.email || identity.email,
      phone: userBankingDetails?.mobile || user?.phone,
      address: 'INDIA',
      bankAccount: userBankingDetails.accountNumber,
      ifsc: userBankingDetails.ifsc,
      transferMode: 'IMPS',
      transferId: this.generateUniqueKey(),
      amount: amount,
      remarks: `USER WITHDRAWAL - ${orderId}`,
      orderId,
    };

    const response: any = await this.createPayout(payoutPayload);

    return {
      gatewayName: GatewayName.UNIQPAY,
      transactionId: response?.transferId,
      transactionReceipt: 'UNIQPAY',
      paymentStatus: response?.status,
      transactionDetails: response,
    };
  }

  async getPayoutDetails(transferId: string) {
    const { uniqpayId, clientId, clientSecret } = await this.getCredentials();

    // Benakpay API headers
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Client-Id': clientId,
      'Client-SecretId': clientSecret,
    };

    // Benakpay status check payload
    const payload = {
      transferId,
      clientId: uniqpayId,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'https://api.benakpay.com/client/ms-status-check',
          payload,
          {
            headers,
          },
        ),
      );

      // Map Benakpay response to our expected format
      const benakpayResponse = response.data;

      return {
        status: benakpayResponse?.STATUS || benakpayResponse?.status,
        utr: benakpayResponse?.utr,
        statusCode: benakpayResponse?.statusCode,
        refundStatus: benakpayResponse?.refundStatus,
        details: benakpayResponse,
      };
    } catch (error) {
      console.log({ error: JSON.stringify(error.response?.data) });
    }
  }
}
