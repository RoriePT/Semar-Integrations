import { dummyTimeout } from "../../../utils";

// const profitsAndBalances = async () => {
//   await dummyTimeout();
//   return {
//     balances: {
//       merchantBalance: 45,
//       memberQuota: 67,
//       agentBalance: 89,
//       systemBalance: 90,
//     },
//     commissions: {
//       merchantIncome: 45,
//       merchantFees: 87,
//       memberCommissions: 90,
//       agentCommissions: 90,
//       gatewayCharge: 80,
//       systemIncome: 10,
//     },
//     graphData: {
//       memberChannel: {
//         upi: 45,
//         netBanking: 8,
//         eWallet: 99,
//       },
//       razorpay: {
//         upi: 45,
//         netBanking: 8,
//         eWallet: 99,
//       },
//       phonepe: {
//         upi: 45,
//         netBanking: 8,
//         eWallet: 99,
//       },
//     },
//   };
// };

// const payinOrders = async () => {
//   await dummyTimeout();
//   return {
//     orders: {
//       total: 40,
//       totalFailed: 30,
//       totalPending: 10,
//       totalCompleted: 6,
//     },
//     pieChartData: {
//       initiated: 30,
//       assigned: 90,
//       submitted: 80,
//       completed: 10,
//       failed: 20,
//     },
//     lineChartData: [
//       { date: "March", Orders: 10 },
//       { date: "April", Orders: 20 },
//       { date: "May", Orders: 50 },
//       { date: "June", Orders: 300 },
//       { date: "July", Orders: 80 },
//     ],
//   };
// };

const payoutOrders = async () => {
  await dummyTimeout();
  return {
    orders: {
      total: 40,
      totalFailed: 30,
      totalPending: 10,
      totalCompleted: 6,
    },
    pieChartData: {
      initiated: 30,
      assigned: 90,
      submitted: 80,
      completed: 10,
      failed: 20,
    },
    lineChartData: [
      { date: "March", Orders: 10 },
      { date: "April", Orders: 20 },
      { date: "May", Orders: 50 },
      { date: "June", Orders: 300 },
      { date: "July", Orders: 80 },
    ],
  };
};

const withdrawalOrders = async () => {
  await dummyTimeout();
  return {
    orders: {
      total: 40,
      totalFailed: 30,
      totalPending: 10,
      totalCompleted: 6,
    },
    pieChartData: {
      pending: 30,
      rejected: 90,
      completed: 10,
      failed: 20,
    },
    lineChartData: [
      { date: "March", Orders: 10 },
      { date: "April", Orders: 20 },
      { date: "May", Orders: 50 },
      { date: "June", Orders: 300 },
      { date: "July", Orders: 80 },
    ],
  };
};

const topupOrders = async () => {
  await dummyTimeout();
  return {
    orders: {
      total: 40,
      totalFailed: 30,
      totalCompleted: 6,
    },

    lineChartData: [
      { date: "March", Orders: 10 },
      { date: "April", Orders: 20 },
      { date: "May", Orders: 50 },
      { date: "June", Orders: 300 },
      { date: "July", Orders: 80 },
    ],
  };
};

// const getAllGateways = async () => {
//   await dummyTimeout();
//   return {
//     payins: {
//       orders: {
//         memberChannel: 100,
//         phonepe: 40,
//         razorpay: 90,
//       },
//       distribution: {
//         memberChannel: { upi: 45, netBanking: 70, eWallet: 80 },
//         razorpay: { upi: 45, netBanking: 70, eWallet: 80 },
//         phonepe: { upi: 45, netBanking: 70, eWallet: 80 },
//       },
//     },
//     payouts: {
//       orders: {
//         memberChannel: 100,
//         phonepe: 40,
//         razorpay: 90,
//       },
//       distribution: {
//         memberChannel: { upi: 45, netBanking: 70, eWallet: 80 },
//         razorpay: { upi: 45, netBanking: 70, eWallet: 80 },
//         phonepe: { upi: 45, netBanking: 70, eWallet: 80 },
//       },
//     },
//   };
// };

// const getMemberChannels = async () => {
//   await dummyTimeout();

//   return {
//     payins: {
//       orders: {
//         total: 100,
//         totalCompleted: 40,
//         totalFailed: 90,
//         totalPending: 45,
//       },
//       distribution: {
//         assigned: 10,
//         submitted: 19,
//         completed: 23,
//         failed: 56,
//       },
//     },
//     payouts: {
//       orders: {
//         total: 100,
//         totalCompleted: 40,
//         totalFailed: 90,
//         totalPending: 45,
//       },
//       distribution: {
//         assigned: 10,
//         submitted: 19,
//         completed: 23,
//         failed: 56,
//       },
//     },
//     withdrawals: {
//       orders: {
//         total: 100,
//         totalCompleted: 40,
//         totalFailed: 90,
//         totalPending: 45,
//       },
//       distribution: {
//         pending: 30,
//         completed: 10,
//         failed: 20,
//       },
//     },
//   };
// };

// const getPhonePe = async () => {
//   await dummyTimeout();
//   return {
//     payins: {
//       orders: {
//         total: 100,
//         totalCompleted: 40,
//         totalFailed: 90,
//         totalPending: 45,
//       },
//       distribution: {
//         assigned: 10,
//         submitted: 19,
//         completed: 23,
//         failed: 56,
//       },
//     },
//     payouts: {
//       orders: {
//         total: 100,
//         totalCompleted: 40,
//         totalFailed: 90,
//         totalPending: 45,
//       },
//       distribution: {
//         assigned: 10,
//         submitted: 19,
//         completed: 23,
//         failed: 56,
//       },
//     },
//     withdrawals: {
//       orders: {
//         total: 100,
//         totalCompleted: 40,
//         totalFailed: 90,
//         totalPending: 45,
//       },
//       distribution: {
//         pending: 30,
//         completed: 10,
//         failed: 20,
//       },
//     },
//   };
// };

const getRazorPay = async () => {
  await dummyTimeout();

  return {
    payins: {
      orders: {
        total: 100,
        totalCompleted: 40,
        totalFailed: 90,
        totalPending: 45,
      },
      distribution: {
        assigned: 10,
        submitted: 19,
        completed: 23,
        failed: 56,
      },
    },
    payouts: {
      orders: {
        total: 100,
        totalCompleted: 40,
        totalFailed: 90,
        totalPending: 45,
      },
      distribution: {
        assigned: 10,
        submitted: 19,
        completed: 23,
        failed: 56,
      },
    },
    withdrawals: {
      orders: {
        total: 100,
        totalCompleted: 40,
        totalFailed: 90,
        totalPending: 45,
      },
      distribution: {
        pending: 30,
        completed: 10,
        failed: 20,
      },
    },
  };
};

// const getAllChannels = async () => {
//   await dummyTimeout();

//   return {
//     payins: {
//       orders: {
//         upi: 100,
//         netBanking: 40,
//         eWallet: 90,
//       },
//       distribution: {
//         upi: { memberChannel: 45, phonepe: 70, razorpay: 80 },
//         netBanking: { memberChannel: 45, phonepe: 70, razorpay: 80 },
//         eWallet: { memberChannel: 45, phonepe: 70, razorpay: 80 },
//       },
//     },
//     payouts: {
//       orders: {
//         upi: 100,
//         netBanking: 40,
//         eWallet: 90,
//       },
//       distribution: {
//         upi: { memberChannel: 45, phonepe: 70, razorpay: 80 },
//         netBanking: { memberChannel: 45, phonepe: 70, razorpay: 80 },
//         eWallet: { memberChannel: 45, phonepe: 70, razorpay: 80 },
//       },
//     },
//   };
// };

const getUpi = async () => {
  await dummyTimeout();
  return {
    payins: {
      orders: {
        total: 100,
        totalCompleted: 40,
        totalFailed: 90,
        totalPending: 45,
      },
      distribution: {
        initiated: 10,
        assigned: 10,
        submitted: 19,
        completed: 23,
        failed: 56,
      },
    },
    payouts: {
      orders: {
        total: 100,
        totalCompleted: 40,
        totalFailed: 90,
        totalPending: 45,
      },
      distribution: {
        initiated: 10,
        assigned: 10,
        submitted: 19,
        completed: 23,
        failed: 56,
      },
    },
    withdrawals: {
      orders: {
        total: 100,
        totalCompleted: 40,
        totalFailed: 90,
        totalPending: 45,
      },
      distribution: {
        pending: 30,
        rejected: 90,
        completed: 10,
        failed: 20,
      },
    },
  };
};

const getNetbanking = async () => {
  await dummyTimeout();
  return {
    payins: {
      orders: {
        total: 100,
        totalCompleted: 40,
        totalFailed: 90,
        totalPending: 45,
      },
      distribution: {
        initiated: 10,
        assigned: 10,
        submitted: 19,
        completed: 23,
        failed: 56,
      },
    },
    payouts: {
      orders: {
        total: 100,
        totalCompleted: 40,
        totalFailed: 90,
        totalPending: 45,
      },
      distribution: {
        initiated: 10,
        assigned: 10,
        submitted: 19,
        completed: 23,
        failed: 56,
      },
    },
    withdrawals: {
      orders: {
        total: 100,
        totalCompleted: 40,
        totalFailed: 90,
        totalPending: 45,
      },
      distribution: {
        pending: 30,
        rejected: 90,
        completed: 10,
        failed: 20,
      },
    },
  };
};

const getEwallet = async () => {
  await dummyTimeout();
  return {
    payins: {
      orders: {
        total: 100,
        totalCompleted: 40,
        totalFailed: 90,
        totalPending: 45,
      },
      distribution: {
        initiated: 10,
        assigned: 10,
        submitted: 19,
        completed: 23,
        failed: 56,
      },
    },
    payouts: {
      orders: {
        total: 100,
        totalCompleted: 40,
        totalFailed: 90,
        totalPending: 45,
      },
      distribution: {
        initiated: 10,
        assigned: 10,
        submitted: 19,
        completed: 23,
        failed: 56,
      },
    },
    withdrawals: {
      orders: {
        total: 100,
        totalCompleted: 40,
        totalFailed: 90,
        totalPending: 45,
      },
      distribution: {
        pending: 30,
        rejected: 90,
        completed: 10,
        failed: 20,
      },
    },
  };
};

// const getUserAnalytics = async () => {
//   await dummyTimeout();
//   return {
//     members: [
//       {
//         name: "John Doe",
//         gmail: "ABCDEF@gmail.com",
//         onboardingDate: "2024-10-25T12:02:00",
//       },
//       {
//         name: "John Doe",
//         gmail: "ABCDEF@gmail.com",
//         onboardingDate: "2024-10-24T10:30:00",
//       },
//       {
//         name: "John Doe",
//         gmail: "ABCDEF@gmail.com",
//         onboardingDate: "2024-10-25T12:02:00",
//       },
//       {
//         name: "John Doe",
//         gmail: "ABCDEF@gmail.com",
//         onboardingDate: "2024-10-24T10:30:00",
//       },
//       {
//         name: "John Doe",
//         gmail: "ABCDEF@gmail.com",
//         onboardingDate: "2024-10-25T12:02:00",
//       },
//       {
//         name: "John Doe",
//         gmail: "ABCDEF@gmail.com",
//         onboardingDate: "2024-10-24T10:30:00",
//       },
//       {
//         name: "John Doe",
//         gmail: "ABCDEF@gmail.com",
//         onboardingDate: "2024-10-25T12:02:00",
//       },
//       {
//         name: "John Doe",
//         gmail: "ABCDEF@gmail.com",
//         onboardingDate: "2024-10-24T10:30:00",
//       },
//     ],
//     memberData: {
//       self: 22,
//       admin: 32,
//     },
//     userInfo: {
//       admins: 10,
//       merchants: 5,
//       agents: 20,
//       members: 10,
//     },
//   };
// };

export const AdminOverviewAPIs = {
  ordersAndBalances: {
    // profitsAndBalances: profitsAndBalances,
    // payinOrders,
    payoutOrders,
    withdrawalOrders,
    topupOrders,
  },

  gateways: {
    // all: getAllGateways,
    // memberChannel: getMemberChannels,
    // phonePe: getPhonePe,
    razorPe: getRazorPay,
  },
  channels: {
    // all: getAllChannels,
    upi: getUpi,
    netBanking: getNetbanking,
    eWallet: getEwallet,
  },

  // users: getUserAnalytics,
};
