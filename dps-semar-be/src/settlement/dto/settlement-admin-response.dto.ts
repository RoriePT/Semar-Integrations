import { Exclude, Expose, Transform } from 'class-transformer';
import { OrderStatus } from 'src/utils/enum/enum';

@Exclude()
export class SettlementAdminResponseDto {
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
  status: OrderStatus;

  @Expose()
  transactionId: string;

  @Expose()
  @Transform(({ obj }) => obj.upi?.upiId, { toClassOnly: true })
  upiId: string;

  @Expose()
  @Transform(({ obj }) => obj.upi?.title, { toClassOnly: true })
  upiTitle: string;

  @Expose()
  @Transform(({ obj }) => {
    if (obj.upiVendor) {
      return `${obj.upiVendor.firstName} ${obj.upiVendor.lastName}`;
    }
    return null;
  }, { toClassOnly: true })
  vendorName: string;

  @Expose()
  @Transform(({ obj }) => obj.upiVendor?.phone, { toClassOnly: true })
  vendorMobile: string;

  @Expose()
  @Transform(({ obj }) => obj.upiVendor?.identity?.email, { toClassOnly: true })
  vendorEmail: string;

  @Expose()
  @Transform(({ obj }) => obj.upiVendor?.id, { toClassOnly: true })
  vendorId: number;

  @Expose()
  @Transform(({ value }) => {
    try {
      return typeof value === 'string' ? JSON.parse(value) : value;
    } catch {
      return value;
    }
  }, { toClassOnly: true })
  topupChannelDetails: any;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

