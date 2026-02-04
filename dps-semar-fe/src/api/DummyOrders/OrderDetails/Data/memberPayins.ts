export const memberPayins = [
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

    transactionDetails: {
      transactionId: "848484575775784",
      receipt:
        "https://unsplash.com/photos/black-flat-screen-computer-monitor-cFFEeHNZEqw",
      member: {
        "Upi Id": "9149965887@2912",
        "Mobile Number": "9149965887",
      },
    },

    quotaDetails: {
      commissionRate: 2,
      commissionAmount: 192,
      quotaDeducted: 230,
      withHeldAmount: 230,
      withHeldRate: 1,
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

    transactionDetails: {
      transactionId: "848484575775784",
      receipt:
        "https://unsplash.com/photos/black-flat-screen-computer-monitor-cFFEeHNZEqw",
      member: {
        "Upi Id": "9149965887@2912",
        "Mobile Number": "9149965887",
      },
    },

    quotaDetails: {
      commissionRate: 2,
      commissionAmount: 192,
      quotaDeducted: 230,
      withHeldAmount: 230,
      withHeldRate: 1,
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

    transactionDetails: {
      transactionId: "848484575775784",
      receipt:
        "https://unsplash.com/photos/black-flat-screen-computer-monitor-cFFEeHNZEqw",
      member: {
        "Upi Id": "9149965887@2912",
        "Mobile Number": "9149965887",
      },
    },

    quotaDetails: {
      commissionRate: 2,
      commissionAmount: 192,
      quotaDeducted: 230,
      withHeldAmount: 230,
      withHeldRate: 1,
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

    transactionDetails: null,

    quotaDetails: {
      commissionRate: 2,
      commissionAmount: 192,
      quotaDeducted: 230,
      withHeldAmount: 230,
      withHeldRate: 1,
    },
  },
];
