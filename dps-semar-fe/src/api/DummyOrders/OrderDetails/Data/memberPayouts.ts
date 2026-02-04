export const memberPayouts = [
  {
    id: 3,
    systemOrderId: "QWEFC1234565432",
    amount: 200,
    status: "complete",
    channel: "Netbanking",
    createdAt: new Date(),
    updatedAt: new Date(),

    user: {
      name: "Aryan Mahajan",
      mobile: "9149965887",
      email: "aryan.mahajan893@gmail.com",
    },

    paymentDetails: null,

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

    quotaDetails: {
      commissionRate: 2,
      commissionAmount: 192,
      quotaEarned: 230,
    },
  },

  {
    id: 4,
    systemOrderId: "QWEFC1234565432",
    amount: 200,
    status: "failed",
    channel: "Netbanking",
    createdAt: new Date(),
    updatedAt: new Date(),

    user: {
      name: "Aryan Mahajan",
      mobile: "9149965887",
      email: "aryan.mahajan893@gmail.com",
    },

    paymentDetails: null,
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

    quotaDetails: {
      commissionRate: 2,
      commissionAmount: 192,
      quotaEarned: 230,
    },
  },

  {
    id: 2,
    systemOrderId: "QWEFC1234565432",
    amount: 200,
    status: "submitted",
    channel: "Netbanking",
    createdAt: new Date(),
    updatedAt: new Date(),

    user: {
      name: "Aryan Mahajan",
      mobile: "9149965887",
      email: "aryan.mahajan893@gmail.com",
    },

    paymentDetails: null,

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

    quotaDetails: {
      commissionRate: 2,
      commissionAmount: 192,
      quotaEarned: 230,
    },
  },

  {
    id: 1,
    systemOrderId: "QWEFC1234565432",
    amount: 200,
    status: "assigned",
    channel: "Netbanking",
    createdAt: new Date(),
    updatedAt: new Date(),
    user: {
      name: "Aryan Mahajan",
      mobile: "9149965887",
      email: "aryan.mahajan893@gmail.com",
    },

    paymentDetails: {
      "Payment amount": "₹ 200",
      "Account number": "9149965887@2912",
      "Bank name": "9149965887",
      "Beneficiary name": "9149965887@2912",
      "Bank IFSC": "9149965887ww",
    },

    transactionDetails: null,

    quotaDetails: {
      commissionRate: 2,
      commissionAmount: 192,
      quotaEarned: 230,
    },
  },
];
