export const OrderStatuses = {
  initiated:
    "The payin order has been created but has not yet been assigned to a member, UPI vendor, or gateway. The end user has selected their payment method and is awaiting the payment page.",
  assigned: {
    member:
      "The payin order has been assigned to a member. The end user has been directed to the payment page with the selected member's details, but has not yet submitted their transaction proof.",
    upiVendor:
      "The payin order has been assigned to a UPI vendor. The end user has been directed to the payment page with the selected UPI vendor's details, but has not yet submitted their transaction proof.",
    gateway:
      "The payin order has been assigned to a gateway. The end user has been redirected to the selected gateway's payment page, but has not yet completed the payment.",
  },
  submitted: {
    member:
      "The payin order has been assigned to a member. The end user has submitted their transaction proof on the payment page, but the member has not yet verified the transaction.",
    upiVendor:
      "The payin order has been assigned to a UPI vendor. The end user has submitted their transaction proof on the payment page, but the UPI vendor has not yet verified the transaction.",
    gateway:
      "The payin order has been assigned to a gateway. The end user has completed the payment on the selected gateway's payment page, but the transaction is still awaiting verification by the gateway.",
  },

  complete: {
    member:
      "The payin order was assigned to a member. The end user submitted their transaction proof on the payment page, and the member has approved the transaction.",
    upiVendor:
      "The payin order was assigned to a UPI vendor. The end user submitted their transaction proof on the payment page, and the UPI vendor has approved the transaction.",
    gateway:
      "The payin order was assigned to a gateway. The end user completed the payment on the selected gateway's payment page, and the transaction was successfully processed by the gateway.",
  },

  failed: {
    member:
      "The payin order was assigned to a member. The end user submitted their transaction proof on the payment page, but the member has rejected the transaction.",
    upiVendor:
      "The payin order was assigned to a UPI vendor. The end user submitted their transaction proof on the payment page, but the UPI vendor has rejected the transaction.",
    gateway:
      "The payin order was assigned to a gateway. The end user completed the payment on the selected gateway's payment page, but the transaction failed on the gateway.",
  },
};

export const getStatusTextForPayin = (status, paymentType = "gateway") => {
  const details = OrderStatuses[status];
  if (status === "initiated") return details;

  // paymentType can be "member", "upiVendor", or "gateway"
  if (paymentType === "member") return details?.member;
  else if (paymentType === "upiVendor") return details?.upiVendor;
  else return details?.gateway;
};
