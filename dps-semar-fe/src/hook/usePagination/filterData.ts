export const Channels = ["E_WALLET", "NET_BANKING", "UPI"];

export const Statuses = [
  "FAILED",
  "COMPLETE",
  "SUBMITTED",
  "INITIATED",
  "ASSIGNED",
];
export const StatusesWithdrawal = ["FAILED", "COMPLETE", "PENDING", "REJECTED"];

export const MadeVia = ["BOTH", "MEMBER", "GATEWAY", "UPI_VENDOR"];
export const MadeViaWithdrawal = ["BOTH", "ADMIN", "GATEWAY"];

export const defaultFilterData = {
  channels: Channels,
  statuses: [],
  madeVia: MadeVia[0],
  lowerAmount: 1,
  upperAmount: 1000000000,
  filterGatewayArray: ["RAZORPAY", "PHONEPE", "UPI_VENDOR"],
  filterMemberSearch: "",
  filterMerchantSearch: "",
};
