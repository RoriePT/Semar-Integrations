export const OrderStatuses = {
  initiated:
    "The topup order has been created via the system but has not yet been grabbed by a member.",
  assigned:
    "The topup order has been grabbed by a member but the member has not yet submitted their transaction proof.",
  submitted:
    "The topup order has been grabbed by a member and the member has submitted their transaction proof, but the admin has not yet verified the transaction.",
  complete:
    "The topup order has been grabbed by a member and the member has submitted their transaction proof, but the admin has verified the transaction.",
  failed:
    "The topup order has been grabbed by a member and the member has submitted their transaction proof, but the admin has rejected the transaction.",
};

export const getStatusTextForTopup = (status, isMember) => {
  const details = OrderStatuses[status];
  return details;
};
