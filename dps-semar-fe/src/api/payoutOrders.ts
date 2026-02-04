import { getAuthToken } from "../utils/auth";
import {
  axiosInstance as AxiosInstance,
  getAPIErrorMessage,
  handleAPICatchBlock,
} from "./utils";

const axiosInstance = AxiosInstance();

const createPayoutOrder = async (payoutData) => {
  try {
    const res = await axiosInstance.post("/payout", payoutData, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return res;
  } catch (error) {
    handleAPICatchBlock({ error });
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

const getOnePayoutOrderDetails = async (user: string, id: string) => {
  if (!id || !user) return;

  try {
    const res = await axiosInstance.get(`/payout/${user}/${id}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return res;
  } catch (error) {
    handleAPICatchBlock({ error });
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

const changeStatusAdmin = async (
  systemOrderId: string,
  status: "COMPLETE" | "FAILED"
) => {
  if (!systemOrderId && !status) return;

  try {
    const response = await axiosInstance.patch(
      `payout/update-status-manual/${systemOrderId}?status=${status}`,
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

const PayoutOrders = {
  createPayoutOrder,
  getOnePayoutOrderDetails,
  changeStatusAdmin,
};

export default PayoutOrders;
