export const adminWithdrawals = [
  {
    id: 1,
    systemOrderId: "QWEFC1234565432",
    amount: 200,
    status: "pending",
    channel: "Netbanking",

    userChannel: {
      "Upi Id": "9149965887@2912",
      "Mobile Number": "9149965887",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    notificationStatus: "pending",
    user: {
      name: "Aryan Mahajan",
      role: "agent",
      id: 1,
    },
    withdrawalMadeOn: null,
    gatewayName: null,
    transactionDetails: null,
    balancesAndProfit: null,
  },
  {
    id: 2,
    systemOrderId: "QWEFC1234565432",
    amount: 200,
    status: "complete",
    channel: "Netbanking",
    createdAt: new Date(),
    updatedAt: new Date(),
    notificationStatus: "success",
    user: {
      name: "Aryan Mahajan",
      role: "member",
      id: 1,
    },
    userChannel: {
      "Upi Id": "9149965887@2912",
      "Mobile Number": "9149965887",
    },
    withdrawalMadeOn: "admin",
    gatewayName: null,
    transactionDetails: {
      transactionId: "848484575775784",
      receipt:
        "https://unsplash.com/photos/black-flat-screen-computer-monitor-cFFEeHNZEqw",

      gatewayDetails: null,
    },
    balancesAndProfit: [
      {
        role: "merchant",
        name: "Ravi Dubey",
        serviceRate: null,
        serviceFee: 0,
        balanceDeducted: 192,
        balanceBefore: 20000,
        balanceAfter: 20022,
      },

      {
        role: "system",
        profit: 192,
        balanceBefore: 20000,
        balanceAfter: 20022,
      },
    ],
  },
  {
    id: 3,
    systemOrderId: "QWEFC1234565432",
    amount: 200,
    status: "complete",
    channel: "Netbanking",
    createdAt: new Date(),
    updatedAt: new Date(),
    notificationStatus: "success",
    user: {
      name: "Aryan Mahajan",
      role: "member",
      id: 1,
    },
    userChannel: {
      "Upi Id": "9149965887@2912",
      "Mobile Number": "9149965887",
    },
    withdrawalMadeOn: "gateway",
    gatewayName: "Razorpay",
    transactionDetails: {
      transactionId: "848484575775784",
      receipt:
        "https://unsplash.com/photos/black-flat-screen-computer-monitor-cFFEeHNZEqw",

      gatewayDetails: {
        "Upi Id": "9149965887@2912",
        "Mobile Number": "9149965887",
      },
    },
    balancesAndProfit: [
      {
        role: "merchant",
        name: "Ravi Dubey",
        serviceRate: 2,
        serviceFee: 23,
        balanceDeducted: 192,
        balanceBefore: 20000,
        balanceAfter: 20022,
      },
      {
        role: "gateway",
        name: "Razorpay",
        upstreamFee: 2,
        upstreamRate: 4,
      },

      {
        role: "system",
        profit: 2,
        balanceBefore: 20000,
        balanceAfter: 20022,
      },
    ],
  },
  {
    id: 5,
    systemOrderId: "QWEFC1234565432",
    amount: 200,
    status: "failed",
    channel: "Netbanking",
    createdAt: new Date(),
    updatedAt: new Date(),
    notificationStatus: "pending",
    user: {
      name: "Aryan Mahajan",
      role: "merchat",
      id: 1,
    },
    userChannel: {
      "Upi Id": "9149965887@2912",
      "Mobile Number": "9149965887",
    },
    withdrawalMadeOn: "gateway",
    gatewayName: "Razorpay",
    transactionDetails: {
      transactionId: null,
      receipt: null,
      gatewayDetails: {
        "Error no.": "9149965887@2912",
        "Mobile Number": "9149965887",
      },
    },
    balancesAndProfit: null,
  },
  {
    id: 4,
    systemOrderId: "QWEFC1234565432",
    amount: 200,
    status: "rejected",
    channel: "UPI",
    createdAt: new Date(),
    updatedAt: new Date(),
    notificationStatus: "success",
    user: {
      name: "Aryan Mahajan",
      role: "agent",
      id: 1,
    },
    userChannel: {
      "Upi Id": "9149965887@2912",
      "Mobile Number": "9149965887",
    },
    withdrawalMadeOn: null,
    gatewayName: null,
    transactionDetails: null,
    balancesAndProfit: null,
  },
];
