import { getAuthToken } from "../utils/auth";
import {
  axiosInstance as AxiosInstance,
  getAPIErrorMessage,
  handleAPICatchBlock,
} from "./utils";
const axiosInstance = AxiosInstance();

export const getMemberBulletinGrabOrders = async (id): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/bulletin/grab-orders/${id}`, {
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

export const getMemberBulletinPendingOrders = async (id): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/bulletin/pending-orders/${id}`, {
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

export const getUpiVendorBulletinPendingOrders = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/bulletin/upi-vendor/pending-orders`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.log(error);
    return [];
  }
};
