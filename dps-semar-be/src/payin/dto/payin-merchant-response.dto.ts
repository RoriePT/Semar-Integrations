import { Exclude, Expose, Transform } from 'class-transformer';

import {
  CallBackStatus,
  ChannelName,
  GatewayName,
  OrderStatus,
  PaymentMadeOn,
} from 'src/utils/enum/enum';
import { TransformTransactionDetails } from './payin-admin-response.dto';
import { roundOffAmount } from 'src/utils/utils';

const INDONESIAN_GATEWAYS = ['DOKU', 'MIDTRANS', 'XENDIT'];

@Exclude()
export class PayinMerchantResponseDto {
  @Expose()
  id: number;

  @Expose()
  systemOrderId: string;

  @Expose()
  merchantOrderId: string;

  @Expose()
  @Transform(({ value }) => roundOffAmount(value), { toClassOnly: true })
  amount: number;

  @Expose()
  @Transform(({ value }) => value?.toLowerCase(), { toClassOnly: true })
  status: string;

  @Expose()
  @Transform(
    ({ value, obj }) =>
      value === ChannelName.UPI &&
      INDONESIAN_GATEWAYS.includes(obj?.gatewayName)
        ? 'QRIS'
        : value,
    { toClassOnly: true },
  )
  channel: ChannelName;

  @Expose()
  @Transform(({ value }) => value?.toLowerCase(), { toClassOnly: true })
  callbackStatus: CallBackStatus;

  @Expose()
  @Transform(({ value }) => value?.name, { toClassOnly: true })
  user: string;

  @Expose()
  @Transform(({ value }) => value?.toLowerCase(), { toClassOnly: true })
  payinMadeOn: PaymentMadeOn;

  @Expose()
  @Transform(({ value }) => (value ? 'gateway' : null), {
    toClassOnly: true,
  })
  gatewayName: GatewayName | null;

  @Exclude()
  member: string;

  @Exclude()
  merchant: string;

  @Expose()
  serviceCharge: number;

  @Expose()
  balanceCredit: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

@Exclude()
export class PayinMerchantOrderResDto {
  @Expose()
  id: number;

  @Expose()
  systemOrderId: string;

  @Expose()
  merchantOrderId: string;

  @Expose()
  @Transform(({ value }) => roundOffAmount(value), { toClassOnly: true })
  amount: number;

  @Expose()
  @Transform(({ value }) => value?.toLowerCase(), { toClassOnly: true })
  status: OrderStatus;

  @Expose()
  @Transform(
    ({ value, obj }) =>
      value === ChannelName.UPI &&
      INDONESIAN_GATEWAYS.includes(obj?.gatewayName)
        ? 'QRIS'
        : value,
    { toClassOnly: true },
  )
  channel: ChannelName;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Transform(({ value }) => value?.toLowerCase(), { toClassOnly: true })
  callbackStatus: CallBackStatus;

  @Expose()
  @Transform(
    ({ value }) => ({
      name: value?.name,
      mobile: value?.mobile,
      email: value?.email,
    }),
    { toClassOnly: true },
  )
  user: {};

  @Expose()
  @Transform(
    ({ value }) => ({
      id: value?.id,
      name: value?.firstName + value?.lastName,
    }),
    { toClassOnly: true },
  )
  merchant: {};

  @Expose()
  @Transform(({ value }) => (value ? value.toLowerCase() : null), {
    toClassOnly: true,
  })
  payinMadeOn: PaymentMadeOn;

  @Expose()
  @Transform(({ value }) => (value ? 'gateway' : null), { toClassOnly: true })
  gatewayName: GatewayName | null;

  @Expose()
  @TransformTransactionDetails()
  transactionDetails: {};

  @Expose()
  balanceDetails: {};
}
