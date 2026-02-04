export const OrderStatuses = {
  initiated:
    "The payout order has been created. The merchant has requested the payout for their end user and is waiting for the payout order to be processed.",

  assigned: {
    member:
      "The payout order has been grabbed by a member, but the member has not yet submitted their transaction proof for the payment.",
    gateway:
      "The payout order has been assigned to a gateway, but the gateway API is yet to confirm the payment.",
  },

  submitted: {
    member:
      "The payout order has been grabbed by a member. The member has submitted their transaction proof for the payment, but admin has not yet verified the transaction.",
    gateway:
      "The payout order has been assigned to a gateway, but the gateway API is yet to confirm the payment.",
  },

  complete: {
    member:
      "The payout order was grabbed by a member. The member submitted their transaction proof for the payment and admin has approved the transaction.",
    gateway:
      "The payout order was assigned to a gateway and the transaction is verified via the gateway API.",
  },

  failed: {
    member:
      "The payout order was grabbed by a member. The member submitted their transaction proof for the payment and admin has rejected the transaction.",
    gateway:
      "The payout order was assigned to a gateway and the transaction was failed by the gateway API.",
  },
};

export const getStatusTextForPayout = (status, isMember) => {
  const details = OrderStatuses[status];
  if (status === "initiated") return details;

  if (isMember) return details?.member;
  else return details?.gateway;
};
