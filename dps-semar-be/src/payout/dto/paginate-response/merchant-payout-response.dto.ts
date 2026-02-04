import { Exclude, Expose, Transform } from 'class-transformer';
import { roundOffAmount } from 'src/utils/utils';

@Exclude()
export class MerchantAllPayoutResponseDto {
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
  @Transform(({ value }) => (value ? value.toLowerCase() : null))
  payoutMadeVia: string;

  @Expose()
  @Transform(({ value }) => (value ? 'gateway api' : null), {
    toClassOnly: true,
  })
  gatewayName: string;

  @Expose()
  member: string;

  @Expose()
  serviceFee: number;

  @Expose()
  balanceDebit: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
