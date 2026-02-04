import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import qs from 'qs';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getAccessToken(payloadDto) {
    const liveUrl = 'https://accounts.payu.in/oauth/token';

    const { clientId, clientSecret } = payloadDto;

    const payload = {
      client_id: clientId,
      client_secret: clientSecret,
      scope: 'create_payment_links read_payment_links',
      grant_type: 'client_credentials',
    };

    const url = liveUrl;

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, qs.stringify(payload), {
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(clientId + ':' + clientSecret).toString('base64')}`,
          },
        }),
      );

      return response?.data?.access_token;
    } catch (error) {
      console.log({ error: error.response });
    }
  }

  async getPayPage(payloadDto) {
    const { amount, invoiceNumber, merchantId } = payloadDto;

    const liveUrl = 'https://oneapi.payu.in/payment-links';

    const accessToken = await this.getAccessToken(payloadDto);

    const payload = {
      invoiceNumber,
      subAmount: amount,
      description: 'User Payin',
      source: 'API',
      isPartialPaymentAllowed: false,
      currency: 'INR',
      customer: {
        name: 'SANDBOX',
        email: 'sandbox@user.com',
        phone: '9876543210',
      },
      // successURL: `${process.env.PAYMENT_PAGE_BASE_URL}.com/close-razorpay?orderId=${orderId}`,
      // failureURL: `${process.env.PAYMENT_PAGE_BASE_URL}.com/close-razorpay?orderId=${orderId}`,
      enforcePayMethod: '',
      userToken: accessToken,
    };

    const options = {
      method: 'POST',
      url: liveUrl,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        mid: merchantId,
      },
      data: payload,
    };

    try {
      const response = await firstValueFrom(this.httpService.request(options));
      return {
        url: response.data?.result?.paymentLink,
        details: response.data?.result,
        trackingId: response.data?.result?.invoiceNumber,
      };
    } catch (error) {
      console.log({ error: error.response.data });
    }
  }
}
