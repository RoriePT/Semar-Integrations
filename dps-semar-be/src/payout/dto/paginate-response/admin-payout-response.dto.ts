import { Exclude, Expose, Transform } from 'class-transformer';
import { roundOffAmount } from 'src/utils/utils';

@Exclude()
export class AdminAllPayoutResponseDto {
  @Expose()
  id: number;

  @Expose()
  systemOrderId: string;

  @Expose()
  merchantOrderId: string;

  @Expose()
  @Transform(({ value }) => roundOffAmount(value), { toClassOnly: true })
  amount: string;

  @Expose()
  @Transform(({ value }) => value.toLowerCase())
  status: string;

  @Expose()
  channel: string;

  @Expose()
  @Transform(({ value }) => (value ? value.name : null), { toClassOnly: true })
  user: string;

  @Expose()
  @Transform(
    ({ value }) => (value ? `${value.firstName} ${value.lastName}` : null),
    { toClassOnly: true },
  )
  merchant: string;

  @Expose()
  @Transform(({ value }) => (value ? value.toLowerCase() : null))
  payoutMadeVia: string;

  @Expose()
  @Transform(
    ({ value }) => (value ? `${value.firstName} ${value.lastName}` : null),
    { toClassOnly: true },
  )
  member: string;

  @Expose()
  gatewayName: string;

  @Expose()
  merchantCharge: number;

  @Expose()
  systemProfit: number;

  @Expose()
  @Transform(({ value }) => value?.toLowerCase())
  callbackStatus: string;

  @Expose()
  transactionId: string;

  @Expose()
  receipt: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
