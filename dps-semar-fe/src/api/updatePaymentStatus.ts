import { getAuthToken } from "../utils/auth";
import {
  axiosInstance as AxiosInstance,
  getAPIErrorMessage,
  handleAPICatchBlock,
} from "./utils";

const axiosInstance = AxiosInstance();

interface PayloadTypes {
  status: string;
  id: string;
  transactionId?: string;
  transactionReceipt?: string;
  paymentType?: string;
}

const changePaymentStatus = async ({ ...payload }: PayloadTypes) => {
  const { status, id, transactionId, transactionReceipt, paymentType } =
    payload;

  try {
    const res = await axiosInstance.post(
      `/${paymentType || "payout"}/update-status-${status}`,
      {
        id,
        transactionId,
        transactionReceipt,
      },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return res.status;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.log(error);
  }
};

const changePaymentStatusAssigned = async (payload, orderType = "payout") => {
  try {
    const res = await axiosInstance.post(
      `/${orderType}/update-status-assigned`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

const changeTopupPaymentStatusAssigned = async (payload) => {
  try {
    const res = await axiosInstance.post(
      `/topup/update-status-assigned`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return res.status;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.log(error);
  }
};

const ChangePaymentStatus = {
  changePaymentStatus,
  changePaymentStatusAssigned,
  changeTopupPaymentStatusAssigned,
};

export default ChangePaymentStatus;
