import { getAuthToken } from "../utils/auth";
import { axiosInstance as AxiosInstance, handleAPICatchBlock } from "./utils";

const axiosInstance = AxiosInstance();

const getOneTopupOrderDetails = async (user: string, id: string) => {
  if (!id || !user) return;

  try {
    const res = await axiosInstance.get(`/topup/${user}/${id}`, {
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

const getCurrentTopupDetails = async () => {
  try {
    const res = await axiosInstance.get(`/topup/current-topup-details`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return res?.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.log(error);
  }
};

export const TopupOrders = {
  getOneTopupOrderDetails,
  getCurrentTopupDetails,
};
