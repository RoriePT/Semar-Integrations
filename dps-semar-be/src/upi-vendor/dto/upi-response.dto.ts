import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UpiResponseDto {
  @Expose()
  id: number;

  @Expose()
  upiId: string;

  @Expose()
  title: string;

  @Expose()
  mobile: string;

  @Expose()
  enabled: boolean;

  @Expose()
  isBusinessUpi: boolean;

  @Expose()
  beneficiaryName: string;

  @Expose()
  email: string;

  @Expose()
  channelIndex: number;

  @Expose()
  settlementAmount: number;
}
