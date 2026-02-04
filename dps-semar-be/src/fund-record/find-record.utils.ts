import { OrderType, UserTypeForTransactionUpdates } from 'src/utils/enum/enum';
import { roundOffAmount } from 'src/utils/utils';

interface argType {
  type: OrderType;
  userType: UserTypeForTransactionUpdates;
  userAmount: number;
  orderAmount: number;
  isAgentMember?: boolean;
  isSendingMember?: boolean;
  before?: number;
  after?: number;
  rate?: number;
  upiId?: string;
}

const getUserFromUserType = (userType: UserTypeForTransactionUpdates) => {
  if (userType === UserTypeForTransactionUpdates.MERCHANT_BALANCE)
    return 'Merchant';

  if (userType === UserTypeForTransactionUpdates.MEMBER_QUOTA) return 'Member';

  if (userType === UserTypeForTransactionUpdates.AGENT_BALANCE) return 'Agent';

  if (userType === UserTypeForTransactionUpdates.SYSTEM_PROFIT) return 'System';
};

export function getDescription({
  type,
  userType,
  userAmount,
  orderAmount,
  isAgentMember,
  isSendingMember,
  before,
  after,
  rate,
  upiId,
}: argType) {
  let text = '';

  orderAmount = roundOffAmount(orderAmount);

  switch (type) {
    case OrderType.PAYIN:
      if (userType === UserTypeForTransactionUpdates.MERCHANT_BALANCE)
        text = `Order Amount - ${orderAmount} | Income - ${orderAmount - userAmount}`;

      if (userType === UserTypeForTransactionUpdates.MEMBER_QUOTA)
        text = isAgentMember
          ? `Order Amount - ${orderAmount} | Agent Commission - ${userAmount} | Quota Credit - ${userAmount} `
          : `Order Amount - ${orderAmount} | Member Commission - ${userAmount} | Quota Debit - ${orderAmount - userAmount}`;

      if (userType === UserTypeForTransactionUpdates.AGENT_BALANCE)
        text = `Order Amount - ${orderAmount} | Agent Commission - ${userAmount}`;

      if (userType === UserTypeForTransactionUpdates.SYSTEM_PROFIT)
        text = `Net Profit - ${userAmount}`;

      if (userType === UserTypeForTransactionUpdates.UPI_VENDOR_COMMISSION) {
        const beforeAmount = before !== undefined ? roundOffAmount(before) : 0;
        const afterAmount = after !== undefined ? roundOffAmount(after) : 0;
        const commissionRate = rate !== undefined ? rate : 0;
        text = `Before - ${beforeAmount} | After - ${afterAmount} | Commission Rate - ${commissionRate}%`;
      }
      break;

    case OrderType.PAYOUT:
      if (userType === UserTypeForTransactionUpdates.MERCHANT_BALANCE)
        text = `Order Amount - ${orderAmount} | Balance Debit - ${orderAmount + userAmount}`;

      if (userType === UserTypeForTransactionUpdates.MEMBER_QUOTA)
        text = isAgentMember
          ? `Order Amount - ${orderAmount} | Agent Commission - ${userAmount} | Quota Credit - ${userAmount}`
          : `Order Amount - ${orderAmount} | Member Commission - ${userAmount} | Quota Credit - ${orderAmount + userAmount}`;

      if (userType === UserTypeForTransactionUpdates.AGENT_BALANCE)
        text = `Order Amount - ${orderAmount} | Agent Commission - ${userAmount}`;

      if (userType === UserTypeForTransactionUpdates.SYSTEM_PROFIT)
        text = `Net Profit - ${userAmount}`;
      break;

    case OrderType.WITHDRAWAL:
      text = `Order Amount - ${orderAmount} | Service Charge - ${userAmount} | Balance Debit - ${roundOffAmount(orderAmount + userAmount)}`;
      break;

    case OrderType.TOPUP:
      if (userType === UserTypeForTransactionUpdates.MEMBER_QUOTA)
        text = isAgentMember
          ? `Order Amount - ${orderAmount} | Agent Commission - ${userAmount} | Quota Credit - ${userAmount}`
          : `Order Amount - ${orderAmount} | Member Commission - ${userAmount} | Quota Credit - ${orderAmount + userAmount}`;

      if (userType === UserTypeForTransactionUpdates.SYSTEM_PROFIT)
        text = `Net Profit - ${userAmount}`;

      break;

    case OrderType.ADMIN_ADJUSTMENT:
      const user = getUserFromUserType(userType);

      const amount =
        userAmount > 0
          ? `Credit - ${userAmount}`
          : `Debit - ${Math.abs(userAmount)}`;

      if (user === 'Merchant') text = `Balance ${amount}`;

      if (user === 'Agent') text = `Balance ${amount}`;

      if (user === 'Member') text = `Quota ${amount}`;

      break;

    case OrderType.MEMBER_adjustment:
      text = !isSendingMember
        ? `Quota Credit - ${userAmount}`
        : `Quota Debit - ${userAmount}`;

      break;

    case OrderType.SETTLEMENT:
      const beforeSettlement =
        before !== undefined ? roundOffAmount(before) : 0;
      const afterSettlement = after !== undefined ? roundOffAmount(after) : 0;
      const settledAmount = roundOffAmount(orderAmount);
      const settlementUpiId = upiId || 'N/A';
      text = `Before - ${beforeSettlement} | After - ${afterSettlement} | Settled Amount - ${settledAmount} | UPI ID - ${settlementUpiId}`;
      break;

    default:
      break;
  }

  return text;
}
