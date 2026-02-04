import { Exclude, Expose, Transform } from 'class-transformer';
import { ChannelName, OrderStatus } from 'src/utils/enum/enum';
import { TransformTransactionDetails } from './payin-admin-response.dto';

@Exclude()
export class PayinUpiVendorResponseDto {
  @Expose()
  @Transform(({ obj }) => obj.systemOrderId, { toClassOnly: true })
  orderId: string;

  @Expose()
  trackingId: string;

  @Expose()
  amount: number;

  @Expose()
  @Transform(({ obj }) => obj.createdAt, { toClassOnly: true })
  date: Date;

  @Expose()
  channel: ChannelName;

  @Expose()
  @Transform(({ value }) => value?.toLowerCase(), { toClassOnly: true })
  status: string;

  @Expose()
  @Transform(({ obj }) => {
    // Use historical commission from TransactionUpdate if available
    if (obj.upiVendorCommissionEntry?.amount !== undefined) {
      return Math.round(obj.upiVendorCommissionEntry.amount * 100) / 100;
    }
    // Fallback to current rate calculation if TransactionUpdate not found
    const commissionRate = obj.upiVendor?.commissionRate || 0;
    const commissionAmount = (obj.amount * commissionRate) / 100;
    return Math.round(commissionAmount * 100) / 100;
  }, { toClassOnly: true })
  commission: number;

  @Expose()
  @Transform(({ value }) => value?.name || value?.email || 'N/A', {
    toClassOnly: true,
  })
  user: string;

  @Expose()
  hasUtrMismatch: boolean;
}

export class PayinDetailsUpiVendorResDto {
  @Expose()
  @Transform(({ obj }) => obj.systemOrderId, { toClassOnly: true })
  orderId: string;

  @Expose()
  trackingId: string;

  @Expose()
  amount: number;

  @Expose()
  @Transform(({ obj }) => obj.createdAt, { toClassOnly: true })
  date: Date;

  @Expose()
  channel: ChannelName;

  @Expose()
  @Transform(({ value }) => value?.toLowerCase(), { toClassOnly: true })
  status: string;

  @Expose()
  @Transform(({ obj }) => {
    // Use historical commission from TransactionUpdate if available
    if (obj.upiVendorCommissionEntry?.amount !== undefined) {
      return Math.round(obj.upiVendorCommissionEntry.amount * 100) / 100;
    }
    // Fallback to current rate calculation if TransactionUpdate not found
    const commissionRate = obj.upiVendor?.commissionRate || 0;
    const commissionAmount = (obj.amount * commissionRate) / 100;
    return Math.round(commissionAmount * 100) / 100;
  }, { toClassOnly: true })
  commission: number;

  @Expose()
  @Transform(({ value }) => value?.name || value?.email || 'N/A', {
    toClassOnly: true,
  })
  user: string;

  @Expose()
  @Transform(
    ({ value, obj }) => {
      if (!value) return null;

      const result: any = {
        id: value?.id,
        firstName: value?.firstName,
        lastName: value?.lastName,
        phone: value?.phone,
        enabled: value?.enabled,
        commissionRate: value?.commissionRate,
        isOnline: value?.isOnline,
        createdAt: value?.createdAt,
        updatedAt: value?.updatedAt,
      };

      // Include UPI ID details if available in transactionDetails
      if (obj.transactionDetails?.upiVendor) {
        const upiDetails = obj.transactionDetails.upiVendor;
        if (upiDetails.upiId) {
          result.upiId = upiDetails.upiId;
          result.upiTitle = upiDetails.title;
          result.mobile = upiDetails.mobile;
          result.beneficiaryName = upiDetails.beneficiaryName;
        }
      }

      return result;
    },
    { toClassOnly: true },
  )
  upiVendor: {} | null;

  @Expose()
  @TransformTransactionDetails()
  transactionDetails: {};

  @Expose()
  @Transform(({ obj }) => obj.transactionReceipt || null, {
    toClassOnly: true,
  })
  utr: string | null;

  @Expose()
  hasUtrMismatch: boolean;
}
