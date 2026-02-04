import {
  getServicerRateForMerchant,
  roundOffAmount,
  sanitizeTransactionDetails,
} from './../../utils/utils';
import { Exclude, Expose, Transform } from 'class-transformer';
import {
  CallBackStatus,
  ChannelName,
  GatewayName,
  OrderStatus,
  PaymentMadeOn,
  UserTypeForTransactionUpdates,
} from 'src/utils/enum/enum';

@Exclude()
export class PayinAdminResponseDto {
  @Expose()
  id: number;

  @Expose()
  systemOrderId: string;

  @Expose()
  merchantOrderId: string;

  @Expose()
  @Transform(({ value }) => roundOffAmount(value), { toClassOnly: true })
  amount: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Transform(({ value }) => value?.toLowerCase(), { toClassOnly: true })
  status: string;

  @Expose()
  channel: ChannelName;

  @Expose()
  @Transform(({ value }) => value?.toLowerCase(), { toClassOnly: true })
  callbackStatus: CallBackStatus;

  @Expose()
  @Transform(({ value }) => value?.name, { toClassOnly: true })
  user: string;

  @Expose()
  @Transform(({ value }) => value?.firstName + ' ' + value?.lastName, {
    toClassOnly: true,
  })
  merchant: string;

  @Expose()
  @Transform(({ value }) => (value ? value.toLowerCase() : null), {
    toClassOnly: true,
  })
  payinMadeOn: PaymentMadeOn;

  @Expose()
  @Transform(({ value }) => value?.firstName + ' ' + value?.lastName, {
    toClassOnly: true,
  })
  member: string | null;

  @Expose()
  gatewayName: GatewayName | null;

  @Expose()
  merchantCharge: number;

  @Expose()
  systemProfit: number;

  @Expose()
  gatewayTransactionId: number;

  @Expose()
  trackingId: string | null;

  @Expose()
  hasUtrMismatch: boolean;
}

@Exclude()
export class PayinDetailsAdminResDto {
  @Expose()
  id: number;

  @Expose()
  systemOrderId: string;

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
  @Transform(({ value }) => value?.toLowerCase(), { toClassOnly: true })
  callbackStatus: CallBackStatus;

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
  @Transform(
    ({ value }) => ({
      id: value?.id,
      name: value?.firstName + ' ' + value?.lastName,
    }),
    { toClassOnly: true },
  )
  merchant: {};

  @Expose()
  @Transform(({ value }) => (value ? value.toLowerCase() : null), {
    toClassOnly: true,
  })
  payinMadeOn: PaymentMadeOn | null;

  @Expose()
  @Transform(
    ({ value }) => ({
      id: value?.id,
      name: value?.firstName + ' ' + value?.lastName,
    }),
    { toClassOnly: true },
  )
  member: {} | null;

  @Expose()
  @Transform(
    ({ value, obj }) => {
      if (!value) return null;

      const result: any = {
        id: value?.id,
        name: value?.firstName + ' ' + value?.lastName,
      };

      // Include UPI ID details if available in transactionDetails.upiVendor
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
  @Transform(({ value }) => value?.toLowerCase(), { toClassOnly: true })
  gatewayName: GatewayName | null;

  @Expose()
  @TransformTransactionDetails()
  transactionDetails: {};

  @Expose()
  @TransformBalancesAndProfit()
  balancesAndProfit: [];

  @Expose()
  hasUtrMismatch: boolean;
}

function TransformBalancesAndProfit() {
  return Transform(
    ({ value }) => {
      const mappedValues = value.map((item) => {
        switch (item.userType) {
          case UserTypeForTransactionUpdates.MERCHANT_BALANCE:
            return {
              role: 'merchant',
              name: item.name,
              serviceRate: getServicerRateForMerchant(
                item?.absoluteAmount,
                item?.rate,
              ),
              rateText: item?.rateText,
              serviceFee: roundOffAmount(item.amount),
              balanceEarned: roundOffAmount(item.after - item.before),
              balanceBefore: roundOffAmount(item.before),
              balanceAfter: roundOffAmount(item.after),
            };

          case UserTypeForTransactionUpdates.AGENT_BALANCE:
            return {
              role: 'agent',
              name: item.name,
              commissionRate: item.rate,
              rateText: item?.rateText,
              commissionAmount: roundOffAmount(item.amount),
              balanceEarned: roundOffAmount(item.after - item.before),
              balanceBefore: roundOffAmount(item.before),
              balanceAfter: roundOffAmount(item.after),
              isAgentOf: item.isAgentOf,
            };

          case UserTypeForTransactionUpdates.MEMBER_QUOTA:
            return item.isAgentMember
              ? {
                  role: 'agent',
                  name: item.name,
                  commissionRate: item.rate,
                  rateText: item?.rateText,
                  commissionAmount: roundOffAmount(item.amount),
                  balanceEarned: roundOffAmount(item.after - item.before, true),
                  balanceBefore: roundOffAmount(item.before),
                  balanceAfter: roundOffAmount(item.after),
                  isAgentOf: item.isAgentOf,
                  isMember: true,
                }
              : {
                  role: 'member',
                  name: item.name,
                  commissionRate: item.rate,
                  rateText: item?.rateText,
                  commissionAmount: roundOffAmount(item.amount),
                  quotaDeducted: roundOffAmount(item.after - item.before, true),
                  quotaBefore: roundOffAmount(item.before),
                  quotaAfter: roundOffAmount(item.after),
                };

          case UserTypeForTransactionUpdates.SYSTEM_PROFIT:
            return {
              role: 'system',
              rateText: item?.rateText,
              profit: item?.pending
                ? 0
                : roundOffAmount(item.after - item.before),
              balanceBefore: roundOffAmount(item.before),
              balanceAfter: item?.pending
                ? roundOffAmount(item.before)
                : roundOffAmount(item.after),
            };

          case UserTypeForTransactionUpdates.GATEWAY_FEE:
            return {
              role: 'gateway',
              rateText: item?.rateText,
              name: item.name,
              upstreamFee: roundOffAmount(item.amount),
              upstreamRate: item.rate,
            };

          case UserTypeForTransactionUpdates.UPI_VENDOR_COMMISSION:
            return {
              role: 'upi_vendor',
              name: item.name,
              commissionRate: item.rate,
              rateText: item?.rateText,
              commissionAmount: roundOffAmount(item.amount),
              commissionBefore: roundOffAmount(item.before),
              commissionAfter: roundOffAmount(item.after),
            };

          default:
            return;
        }
      });

      const filteredValues = mappedValues.filter(Boolean);
      const systemProfitEntry = filteredValues.find(
        (entry) => entry.role === 'system',
      );
      const merchantEntry = filteredValues.find(
        (entry) => entry.role === 'merchant',
      );
      const gatewayEntry = filteredValues.find(
        (entry) => entry.role === 'gateway',
      );
      const upiVendorEntry = filteredValues.find(
        (entry) => entry.role === 'upi_vendor',
      );
      const memberEntry = filteredValues.find(
        (entry) => entry.role === 'member',
      );
      const memberAgents = filteredValues.filter(
        (entry) => entry.isMember && entry.role === 'agent',
      );
      const merchantAgents = filteredValues.filter(
        (entry) => entry.role === 'agent' && !entry.isMember,
      );

      const newSequence = [
        merchantEntry,
        memberEntry,
        ...merchantAgents.reverse(),
        ...memberAgents.reverse(),
        gatewayEntry,
        upiVendorEntry,
        systemProfitEntry,
      ];

      return newSequence.filter(Boolean);
    },
    { toClassOnly: true },
  );
}

export function TransformTransactionDetails() {
  return Transform(
    ({ value, obj }) => {
      const gatewayName = obj?.gatewayName || null;
      const formatMemberChannelDetails = (member) => {
        if (member.upiId)
          return {
            'UPI ID': member.upiId,
            Mobile: member.mobile,
          };

        if (member.app)
          return {
            App: member.app,
            Mobile: member.mobile,
          };

        if (member.bankName) {
          return {
            'Bank Name': member.bankName,
            'IFSC Code': member.ifsc,
            'Account Number': member.accountNumber,
            'Beneficiary Name': member.beneficiaryName,
          };
        }
      };

      return {
        gatewayError: value?.gatewayError,
        transactionId: value.transactionId,
        trackingId: value.trackingId || null,
        receipt: value.receipt,
        gateway: sanitizeTransactionDetails(gatewayName, value.gateway),
        member: value.member ? formatMemberChannelDetails(value.member) : null,
      };
    },
    { toClassOnly: true },
  );
}
