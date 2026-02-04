import { dummyTimeout } from "../../../utils";

// const getAgentOverview = async () => {
//   await dummyTimeout();
//   return {
//     orders: {
//       balance: 100,
//       withdrawalAmount: 10,
//       commissions: 90,
//       commissionAmount: 900,
//     },
//     graphData: [
//       {
//         date: "March",
//         Commissions: 0,
//       },
//       {
//         date: "April",
//         Commissions: 0,
//       },
//       {
//         date: "May",
//         Commissions: 10,
//       },
//       {
//         date: "June",
//         Commissions: 100,
//       },
//       {
//         date: "July",
//         Commissions: 70,
//       },
//     ],
//   };
// };

// const getMerchantOverview = async () => {
//   await dummyTimeout();

//   return {
//     payins: {
//       totalOrders: 10,
//       ordersPending: 20,
//       ordersCompleted: 50,
//       ordersFailed: 10,
//       income: 54,
//       serviceFee: 30,
//     },

//     payouts: {
//       totalOrders: 10,
//       ordersPending: 20,
//       ordersCompleted: 40,
//       ordersFailed: 2,
//       payoutAmount: 900,
//       serviceFee: 90,
//     },
//     balances: {
//       balance: 90,
//       withdrawal: 100,
//     },

//     graph: [
//       {
//         date: "March",
//         Payins: 2890,
//       },
//       {
//         date: "April",
//         Payins: 2756,
//       },
//       {
//         date: "May",
//         Payins: 3322,
//       },
//       {
//         date: "June",
//         Payins: 3470,
//       },
//       {
//         date: "July",
//         Payins: 3129,
//       },
//     ],
//   };
// };

// const getMemberOverview = async () => {
//   await dummyTimeout();

//   return {
//     payins: {
//       ordersPending: 20,
//       ordersCompleted: 6,

//       commission: 700,
//     },
//     payouts: {
//       ordersPending: 20,
//       ordersCompleted: 6,

//       commission: 700,
//     },
//     topups: {
//       ordersCompleted: 10,
//       commission: 900,
//     },
//     balances: {
//       quota: 4050,
//       balance: 600,
//       withdrawl: 800,
//     },
//   };
// };

export const UserOverviewAPIs = {
  // agent: getAgentOverview,
  // member: getMemberOverview,
  // merchant: getMerchantOverview,
};
