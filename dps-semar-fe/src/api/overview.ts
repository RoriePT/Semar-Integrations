import moment from "moment-timezone";
import { handleAPICatchBlock, axiosInstance as AxiosInstance } from "./utils";
import { getAuthToken } from "../utils/auth";

const axiosInstance = AxiosInstance();

export const getAgentOverview = async () => {
  try {
    const response = await axiosInstance.get(`/overview-user/agent`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.log(error);
  }
};

export const getMerchantOverview = async () => {
  try {
    const response = await axiosInstance.get(`/overview-user/merchant`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.log(error);
  }
};

export const getMemberOverview = async () => {
  try {
    const response = await axiosInstance.get(`/overview-user/member`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.log(error);
  }
};

export const getUserAnalytics = async () => {
  try {
    const response = await axiosInstance.get(`/overview-admin/user-analytics`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.log(error);
  }
};

export const getAllGateways = async ({ startDate, endDate, mode }) => {
  try {
    const response = await axiosInstance.post(
      `/overview-admin/all-gateway-analytics`,
      {
        startDate: moment(startDate).tz("Asia/Kolkata"),
        endDate: moment(endDate).tz("Asia/Kolkata"),
        mode,
      },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.log(error);
  }
};

export const getMemberChannels = async ({ startDate, endDate, mode }) => {
  try {
    const response = await axiosInstance.post(
      `/overview-admin/gateway-member-channel-analytics`,
      {
        startDate: moment(startDate).tz("Asia/Kolkata"),
        endDate: moment(endDate).tz("Asia/Kolkata"),
        mode,
      },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.log(error);
  }
};

export const getPhonePe = async ({ startDate, endDate, mode }) => {
  try {
    const response = await axiosInstance.post(
      `/overview-admin/phonepe-analytics`,
      {
        startDate: moment(startDate).tz("Asia/Kolkata"),
        endDate: moment(endDate).tz("Asia/Kolkata"),
        mode,
      },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.log(error);
  }
};

export const getRazorPay = async ({ startDate, endDate, mode }) => {
  try {
    const response = await axiosInstance.post(
      `/overview-admin/razorpay-analytics`,
      {
        startDate: moment(startDate).tz("Asia/Kolkata"),
        endDate: moment(endDate).tz("Asia/Kolkata"),
        mode,
      },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.log(error);
  }
};

export const getUniqpay = async ({ startDate, endDate, mode }) => {
  try {
    const response = await axiosInstance.post(
      `/overview-admin/uniqpay-analytics`,
      {
        startDate: moment(startDate).tz("Asia/Kolkata"),
        endDate: moment(endDate).tz("Asia/Kolkata"),
        mode,
      },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.log(error);
  }
};

export const getPayu = async ({ startDate, endDate, mode }) => {
  try {
    const response = await axiosInstance.post(
      `/overview-admin/payu-analytics`,
      {
        startDate: moment(startDate).tz("Asia/Kolkata"),
        endDate: moment(endDate).tz("Asia/Kolkata"),
        mode,
      },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.log(error);
  }
};

export const getCashfree = async ({ startDate, endDate, mode }) => {
  try {
    const response = await axiosInstance.post(
      `/overview-admin/cashfree-analytics`,
      { startDate, endDate, mode },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.log(error);
  }
};

export const getAllChannels = async ({ startDate, endDate, mode }) => {
  try {
    const response = await axiosInstance.post(
      `/overview-admin/all-channel-analytics`,
      {
        startDate: moment(startDate).tz("Asia/Kolkata"),
        endDate: moment(endDate).tz("Asia/Kolkata"),
        mode,
      },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.log(error);
  }
};

export const getUpi = async ({ startDate, endDate, mode }) => {
  try {
    const response = await axiosInstance.post(
      `/overview-admin/upi-analytics`,
      {
        startDate: moment(startDate).tz("Asia/Kolkata"),
        endDate: moment(endDate).tz("Asia/Kolkata"),
        mode,
      },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.log(error);
  }
};

export const getNetbanking = async ({ startDate, endDate, mode }) => {
  try {
    const response = await axiosInstance.post(
      `/overview-admin/netbanking-analytics`,
      {
        startDate: moment(startDate).tz("Asia/Kolkata"),
        endDate: moment(endDate).tz("Asia/Kolkata"),
        mode,
      },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.log(error);
  }
};

export const getEwallet = async ({ startDate, endDate, mode }) => {
  try {
    const response = await axiosInstance.post(
      `/overview-admin/ewallet-analytics`,
      {
        startDate: moment(startDate).tz("Asia/Kolkata"),
        endDate: moment(endDate).tz("Asia/Kolkata"),
        mode,
      },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.log(error);
  }
};

export const profitsAndBalances = async ({ startDate, endDate }) => {
  try {
    const response = await axiosInstance.post(
      `/overview-admin/balances-commissions-profits`,
      {
        startDate: moment(startDate).tz("Asia/Kolkata"),
        endDate: moment(endDate).tz("Asia/Kolkata"),
      },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.log(error);
  }
};

export const payinOrders = async ({ startDate, endDate, merchantId }) => {
  try {
    const response = await axiosInstance.post(
      `/overview-admin/payin-analytics`,
      {
        startDate: moment(startDate).tz("Asia/Kolkata"),
        endDate: moment(endDate).tz("Asia/Kolkata"),
        merchantId,
      },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.log(error);
  }
};

export const payoutOrders = async ({ startDate, endDate, merchantId }) => {
  try {
    const response = await axiosInstance.post(
      `/overview-admin/payout-analytics`,
      {
        startDate: moment(startDate).tz("Asia/Kolkata"),
        endDate: moment(endDate).tz("Asia/Kolkata"),
        merchantId,
      },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.log(error);
  }
};

export const withdrawalOrders = async ({ startDate, endDate }) => {
  try {
    const response = await axiosInstance.post(
      `/overview-admin/withdrawal-analytics`,
      {
        startDate: moment(startDate).tz("Asia/Kolkata"),
        endDate: moment(endDate).tz("Asia/Kolkata"),
      },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.log(error);
  }
};

export const topupOrders = async ({ startDate, endDate }) => {
  try {
    const response = await axiosInstance.post(
      `/overview-admin/topup-analytics`,
      {
        startDate: moment(startDate).tz("Asia/Kolkata"),
        endDate: moment(endDate).tz("Asia/Kolkata"),
      },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.log(error);
  }
};

export const settlementOrders = async ({ startDate, endDate }) => {
  try {
    const response = await axiosInstance.post(
      `/overview-admin/settlement-analytics`,
      {
        startDate: moment(startDate).tz("Asia/Kolkata"),
        endDate: moment(endDate).tz("Asia/Kolkata"),
      },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.log(error);
  }
};

export const getUpiVendorOverview = async () => {
  try {
    const response = await axiosInstance.get(`/overview-user/upi-vendor`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.log(error);
  }
};

export const UserOverviewAPIs = {
  agent: getAgentOverview,
  member: getMemberOverview,
  merchant: getMerchantOverview,
  upiVendor: getUpiVendorOverview,
};

export const getUpiVendor = async ({ startDate, endDate, mode }) => {
  try {
    const response = await axiosInstance.post(
      `/overview-admin/upi-vendor-analytics`,
      {
        startDate: moment(startDate).tz("Asia/Kolkata"),
        endDate: moment(endDate).tz("Asia/Kolkata"),
        mode,
      },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.log(error);
  }
};

export const AdminOverviewAPIs = {
  ordersAndBalances: {
    profitsAndBalances,
    payinOrders,
    payoutOrders,
    withdrawalOrders,
    topupOrders,
    settlementOrders,
  },

  gateways: {
    all: getAllGateways,
    memberChannel: getMemberChannels,
    phonePe: getPhonePe,
    razorPe: getRazorPay,
    uniqpay: getUniqpay,
    payu: getPayu,
    cashfree: getCashfree,
    upiVendor: getUpiVendor,
  },

  channels: {
    all: getAllChannels,
    upi: getUpi,
    netBanking: getNetbanking,
    eWallet: getEwallet,
  },

  users: getUserAnalytics,
};
