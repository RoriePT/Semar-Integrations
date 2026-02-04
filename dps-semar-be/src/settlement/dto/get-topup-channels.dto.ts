import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class TopupChannelDto {
  @Expose()
  upiId: number;

  @Expose()
  upiIdValue: string;

  @Expose()
  title: string;

  @Expose()
  settlementAmount: number;

  @Expose()
  pendingSettlementAmount: number;

  @Expose()
  beneficiaryName: string;

  @Expose()
  mobile: string;

  @Expose()
  email: string;
}

