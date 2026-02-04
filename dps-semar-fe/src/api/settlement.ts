import { getAuthToken } from "../utils/auth";
import { axiosInstance as AxiosInstance, handleAPICatchBlock } from "./utils";

const axiosInstance = AxiosInstance();

export const createSettlementOrder = async (payload: {
  upiId: number;
  paidAmount: number;
  transactionId: string;
  topupChannelDetails?: string;
}) => {
  try {
    const response = await axiosInstance.post(
      `/settlement/upi-vendor`,
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
    throw error;
  }
};

export const getSettlementOrderDetails = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/settlement/upi-vendor/${id}`, {
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

export const getSettlementDetailsForVendor = async () => {
  try {
    const response = await axiosInstance.get(
      `/upi-vendor/get-details-for-settlement`,
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

export const approveSettlementOrder = async (id: number, remarks?: string) => {
  try {
    const response = await axiosInstance.patch(
      `/settlement/admin/${id}/approve`,
      { remarks },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error, raiseError: true });
    throw error;
  }
};

export const rejectSettlementOrder = async (id: number, remarks: string) => {
  try {
    const response = await axiosInstance.patch(
      `/settlement/admin/${id}/reject`,
      { remarks },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error, raiseError: true });
    throw error;
  }
};

export const SettlementAPIs = {
  create: createSettlementOrder,
  getDetails: getSettlementOrderDetails,
  getDetailsForVendor: getSettlementDetailsForVendor,
  approve: approveSettlementOrder,
  reject: rejectSettlementOrder,
};
