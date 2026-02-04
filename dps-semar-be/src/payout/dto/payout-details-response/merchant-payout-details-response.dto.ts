import { Exclude, Expose, Transform } from 'class-transformer';
import {
  ChannelName,
  GatewayName,
  OrderStatus,
  PaymentMadeOn,
} from 'src/utils/enum/enum';
import { roundOffAmount } from 'src/utils/utils';

@Exclude()
export class MerchantPayoutDetailsResponseDto {
  @Expose()
  id: number;

  @Expose()
  systemOrderId: number;

  @Expose()
  merchantOrderId: string;

  @Expose()
  @Transform(({ value }) => roundOffAmount(value), { toClassOnly: true })
  amount: number;

  @Expose()
  @Transform(({ value }) => value?.toLowerCase(), { toClassOnly: true })
  status: OrderStatus;

  @Expose()
  channel: ChannelName;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

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
  paymentDetails: any;

  @Expose()
  transactionDetails: any;

  @Expose()
  quotaDetails: any;

  @Expose()
  notificationStatus: string;
  @Expose()
  @Transform(({ value }) => (value ? value.toLowerCase() : null), {
    toClassOnly: true,
  })
  payoutMadeVia: PaymentMadeOn;

  @Expose()
  @Transform(
    ({ value }) => ({
      id: value?.id,
      name: value?.firstName + ' ' + value?.lastName,
    }),
    { toClassOnly: true },
  )
  merchant: {};

  @Expose()
  @Transform(({ value }) => (value ? 'gateway api' : null), {
    toClassOnly: true,
  })
  gatewayName: GatewayName | null;

  @Expose()
  balanceDetails: any;

  @Expose()
  channelDetails: string;
}
