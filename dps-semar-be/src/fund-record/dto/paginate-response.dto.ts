import { Exclude, Expose, Transform } from 'class-transformer';
import { roundOffAmount } from 'src/utils/utils';

@Exclude()
export class FundRecordAdminResponseDto {
  @Expose()
  id: number;

  @Expose()
  merchantOrderId: string;

  @Expose()
  systemOrderId: string;

  @Expose()
  orderType: string;

  @Expose()
  name: string;

  @Expose()
  @Transform(({ value }) => roundOffAmount(value), { toClassOnly: true })
  amount: number;

  @Expose()
  @Transform(({ value }) => roundOffAmount(value), { toClassOnly: true })
  netAmount: number;

  @Expose()
  @Transform(({ value }) => roundOffAmount(value), { toClassOnly: true })
  orderAmount: number;

  @Expose()
  @Transform(({ value }) => roundOffAmount(value), { toClassOnly: true })
  before: number;

  @Expose()
  @Transform(({ value }) => roundOffAmount(value), { toClassOnly: true })
  after: number;

  @Expose()
  description: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Transform(({ value }) => value?.toUpperCase(), { toClassOnly: true })
  balanceType: string;

  @Expose()
  serviceFee: number;

  @Expose()
  systemProfit: number;
}
