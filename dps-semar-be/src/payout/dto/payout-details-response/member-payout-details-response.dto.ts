import { Exclude, Expose, Transform } from 'class-transformer';
import { ChannelName } from 'src/utils/enum/enum';
import { roundOffAmount } from 'src/utils/utils';

@Exclude()
export class MemberPayoutDetailsResponseDto {
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
  status: string;

  @Expose()
  channel: ChannelName;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Transform(({ value }) => {
    return value;
  })
  user: {};

  @Expose()
  paymentDetails: any;

  @Expose()
  @TransformTransactionDetails()
  transactionDetails: any;

  @Expose()
  @Transform(
    ({ value }) => {
      return {
        commissionRate: value?.commissionRate,
        commissionAmount: value?.commissionAmount,
        quotaEarned: value?.quotaEarned,
      };
    },
    { toClassOnly: true },
  )
  quotaDetails: {};
}

function TransformTransactionDetails() {
  return Transform(
    ({ value }) => {
      return {
        transactionId: value.transactionId,
        receipt: value.receipt,
        gateway: value.gateway,
        member: value.member,
        recipient: value.recipient,
      };
    },
    { toClassOnly: true },
  );
}
