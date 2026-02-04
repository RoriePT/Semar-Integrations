export const MemberComplete = {
  systemOrderId: "QWEFC1234565432",
  amount: 200,
  status: "complete",
  channel: "Netbanking",
  createdAt: new Date(),
  updatedAt: new Date(),
  notificationStatus: "success",
  user: {
    name: "Aryan Mahajan",
    mobile: "9149965887",
    email: "aryan.mahajan893@gmail.com",
  },
  merchant: {
    id: 1,
    name: "Ravi Dubey",
  },
  payoutMadeVia: "member",
  member: {
    id: 2,
    name: "Kanishk Priyadarshi",
  },
  gatewayName: null,
  transactionDetails: {
    transactionId: "848484575775784",
    receipt:
      "https://unsplash.com/photos/black-flat-screen-computer-monitor-cFFEeHNZEqw",
    recipient: {
      "Upi Id": "9149965887@2912",
      "Mobile Number": "9149965887",
    },
    member: {
      "Upi Id": "9149965887@2912",
      "Mobile Number": "9149965887",
    },
    gateway: null,
  },

  balanceDetails: {
    serviceRate: 2,
    serviceFee: 23,
    balanceDeducted: 192,
  },
};

export const GatewayComplete = {
  systemOrderId: "QWEFC1234565432",

  amount: 200,
  status: "complete",
  channel: "UPI",
  createdAt: new Date(),
  updatedAt: new Date(),
  notificationStatus: "pending",
  user: {
    name: "Aryan Mahajan",
    mobile: "9149965887",
    email: "aryan.mahajan893@gmail.com",
  },
  merchant: {
    id: 1,
    name: "Ravi Dubey",
  },
  payoutMadeVia: "gateway",
  member: null,
  gatewayName: "Razorpay",
  transactionDetails: {
    transactionId: "848484575775784",
    receipt:
      "https://unsplash.com/photos/black-flat-screen-computer-monitor-cFFEeHNZEqw",
    recipient: {
      "Upi Id": "9149965887@2912",
      "Mobile Number": "9149965887",
    },
    member: null,
    gateway: {
      "Upi Id": "9149965887@2912",
      "Mobile Number": "9149965887",
    },
  },

  balanceDetails: {
    serviceRate: 2,
    serviceFee: 23,
    balanceDeducted: 192,
  },
};

export const MemberFailed = {
  systemOrderId: "QWEFC1234565432",
  amount: 200,
  status: "failed",
  channel: "Netbanking",
  createdAt: new Date(),
  updatedAt: new Date(),
  notificationStatus: "success",
  user: {
    name: "Aryan Mahajan",
    mobile: "9149965887",
    email: "aryan.mahajan893@gmail.com",
  },
  merchant: {
    id: 1,
    name: "Ravi Dubey",
  },
  payoutMadeVia: "member",
  member: {
    id: 2,
    name: "Kanishk Priyadarshi",
  },
  gatewayName: null,
  transactionDetails: {
    transactionId: "848484575775784",
    receipt:
      "https://unsplash.com/photos/black-flat-screen-computer-monitor-cFFEeHNZEqw",
    recipient: {
      "Upi Id": "9149965887@2912",
      "Mobile Number": "9149965887",
    },
    member: {
      "Upi Id": "9149965887@2912",
      "Mobile Number": "9149965887",
    },
    gateway: null,
  },

  balanceDetails: {
    serviceRate: 2,
    serviceFee: 0,
    balanceDeducted: 0,
  },
};

export const GatewayFailed = {
  systemOrderId: "QWEFC1234565432",
  amount: 200,
  status: "failed",
  channel: "UPI",
  createdAt: new Date(),
  updatedAt: new Date(),
  notificationStatus: "pending",
  user: {
    name: "Aryan Mahajan",
    mobile: "9149965887",
    email: "aryan.mahajan893@gmail.com",
  },
  merchant: {
    id: 1,
    name: "Ravi Dubey",
  },
  payoutMadeVia: "gateway",
  member: null,
  gatewayName: "Razorpay",
  transactionDetails: {
    transactionId: "848484575775784",
    receipt:
      "https://unsplash.com/photos/black-flat-screen-computer-monitor-cFFEeHNZEqw",
    recipient: {
      "Upi Id": "9149965887@2912",
      "Mobile Number": "9149965887",
    },
    member: null,
    gateway: {
      "Upi Id": "9149965887@2912",
      "Mobile Number": "9149965887",
    },
  },

  balanceDetails: {
    serviceRate: 2,
    serviceFee: 0,
    balanceDeducted: 0,
  },
};

export const MemberSubmitted = {
  systemOrderId: "QWEFC1234565432",
  amount: 200,
  status: "submitted",
  channel: "Netbanking",
  createdAt: new Date(),
  updatedAt: new Date(),
  notificationStatus: "success",
  user: {
    name: "Aryan Mahajan",
    mobile: "9149965887",
    email: "aryan.mahajan893@gmail.com",
  },
  merchant: {
    id: 1,
    name: "Ravi Dubey",
  },
  payoutMadeVia: "member",
  member: {
    id: 2,
    name: "Kanishk Priyadarshi",
  },
  gatewayName: null,
  transactionDetails: {
    transactionId: "848484575775784",
    receipt:
      "https://unsplash.com/photos/black-flat-screen-computer-monitor-cFFEeHNZEqw",
    recipient: {
      "Upi Id": "9149965887@2912",
      "Mobile Number": "9149965887",
    },
    member: {
      "Upi Id": "9149965887@2912",
      "Mobile Number": "9149965887",
    },
    gateway: null,
  },

  balanceDetails: {
    serviceRate: 2,
    serviceFee: 23,
    balanceDeducted: 192,
  },
};

export const GatewaySubmitted = {
  systemOrderId: "QWEFC1234565432",
  amount: 200,
  status: "submitted",
  channel: "UPI",
  createdAt: new Date(),
  updatedAt: new Date(),
  notificationStatus: "pending",
  user: {
    name: "Aryan Mahajan",
    mobile: "9149965887",
    email: "aryan.mahajan893@gmail.com",
  },
  merchant: {
    id: 1,
    name: "Ravi Dubey",
  },
  payoutMadeVia: "gateway",
  member: null,
  gatewayName: "Razorpay",
  transactionDetails: {
    transactionId: "848484575775784",
    receipt:
      "https://unsplash.com/photos/black-flat-screen-computer-monitor-cFFEeHNZEqw",
    recipient: {
      "Upi Id": "9149965887@2912",
      "Mobile Number": "9149965887",
    },
    member: null,
    gateway: {
      "Upi Id": "9149965887@2912",
      "Mobile Number": "9149965887",
    },
  },

  balanceDetails: {
    serviceRate: 2,
    serviceFee: 23,
    balanceDeducted: 192,
  },
};

export const MemberAssigned = {
  systemOrderId: "QWEFC1234565432",
  amount: 200,
  status: "assigned",
  channel: "Netbanking",
  createdAt: new Date(),
  updatedAt: new Date(),
  notificationStatus: "pending",
  user: {
    name: "Aryan Mahajan",
    mobile: "9149965887",
    email: "aryan.mahajan893@gmail.com",
  },
  merchant: {
    id: 1,
    name: "Ravi Dubey",
  },
  payoutMadeVia: "member",
  member: {
    id: 2,
    name: "Kanishk Priyadarshi",
  },
  gatewayName: null,
  transactionDetails: null,

  balanceDetails: {
    serviceRate: 2,
    serviceFee: 23,
    balanceDeducted: 192,
  },
};

export const GatewayAssigned = {
  systemOrderId: "QWEFC1234565432",
  amount: 200,
  status: "assigned",
  channel: "UPI",
  createdAt: new Date(),
  updatedAt: new Date(),
  notificationStatus: "pending",
  user: {
    name: "Aryan Mahajan",
    mobile: "9149965887",
    email: "aryan.mahajan893@gmail.com",
  },
  merchant: {
    id: 1,
    name: "Ravi Dubey",
  },
  payoutMadeVia: "gateway",
  member: null,
  gatewayName: "Razorpay",
  transactionDetails: null,
  balanceDetails: {
    serviceRate: 2,
    serviceFee: 23,
    balanceDeducted: 192,
  },
};

export const Initiated = {
  systemOrderId: "QWEFC1234565432",
  amount: 200,
  status: "initiated",
  channel: "Netbanking",
  createdAt: new Date(),
  updatedAt: new Date(),
  notificationStatus: "pending",
  user: {
    name: "Aryan Mahajan",
    mobile: "9149965887",
    email: "aryan.mahajan893@gmail.com",
  },
  merchant: {
    id: 1,
    name: "Ravi Dubey",
  },
  payoutMadeVia: null,
  member: null,
  gatewayName: null,
  transactionDetails: null,

  balanceDetails: {
    serviceRate: 2,
    serviceFee: 23,
    balanceDeducted: 192,
  },
};
