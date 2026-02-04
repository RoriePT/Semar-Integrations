import { Exclude, Expose, Transform } from 'class-transformer';
import { OrderStatus } from 'src/utils/enum/enum';

@Exclude()
export class SettlementResponseDto {
  @Expose()
  id: number;

  @Expose()
  systemOrderId: string;

  @Expose()
  settlementAmount: number;

  @Expose()
  paidAmount: number;

  @Expose()
  remainingAmount: number;

  @Expose()
  @Transform(({ value }) => value?.toLowerCase(), { toClassOnly: true })
  status: string;

  @Expose()
  transactionId: string;

  @Expose()
  @Transform(({ obj }) => obj?.upi?.upiId, { toClassOnly: true })
  upiId: string;

  @Expose()
  @Transform(({ obj }) => obj?.upi?.title, { toClassOnly: true })
  upiTitle: string;

  @Expose()
  topupChannelDetails: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

