import { getAuthToken } from "../utils/auth";
import { handleAPICatchBlock, axiosInstance as AxiosInstance } from "./utils";

const axiosInstance = AxiosInstance();

const getChannelProfiles = async (user) => {
  try {
    const response = await axiosInstance.get(`withdrawal/${user}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error, raiseError: false });
  }
};

const createOrder = async (widthdrawalData) => {
  try {
    const res = await axiosInstance.post("/withdrawal", widthdrawalData, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return res;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.log(error);
  }
};

const getOrderDetails = async (table, id) => {
  try {
    const response = await axiosInstance.get(`${table}/${id}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error, raiseError: false });
  }
};

const processWithdrawal = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `withdrawal/update-status-complete`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error, raiseError: false });
  }
};

const rejectWithdrawal = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `withdrawal/update-status-rejected`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error, raiseError: false });
  }
};

const processGatewayWithdrawal = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `withdrawal/make-gateway-payout`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error, raiseError: true });
  }
};

const WithdrawalOrderAPIs = {
  getChannelProfiles,
  createOrder,
  getOrderDetails,
  processWithdrawal,
  processGatewayWithdrawal,
  rejectWithdrawal,
};

export default WithdrawalOrderAPIs;
