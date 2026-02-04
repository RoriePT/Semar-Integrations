export const OrderStatuses = {
  pending:
    "The withdrawal request has been submitted by the user and the withdrawal order is awaiting to be processed via an admin or gateway.",
  rejected: "The withdrawal order has been rejected by the admin.",
  complete: {
    member:
      "The withdrawal order has been processed by an admin through offline remittance and the admin has submitted their transaction proof.",
    gateway:
      "The withdrawal order has been processed successfully by a payment gateway API.",
  },

  failed:
    "The withdrawal order was assigned to a payment gateway API but the transaction failed due to some reason.",
};

export const getStatusTextForWithdrawal = (status, isMember) => {
  const details = OrderStatuses[status];
  if (status === "complete") {
    if (isMember) return details?.member;
    else return details?.gateway;
  }

  return details;
};
