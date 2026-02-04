import { getAuthToken } from "../utils/auth";
import { handleAPICatchBlock, axiosInstance as AxiosInstance } from "./utils";

const axiosInstance = AxiosInstance();

const getOrderDetails = async (table, id) => {
  if (!table || !id) return;

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

const approveOrderForMember = async (id) => {
  if (!id) return;

  try {
    const response = await axiosInstance.post(
      `payin/update-status-complete`,
      {
        id,
      },
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

const rejectOrderForMember = async (id) => {
  if (!id) return;
  try {
    const response = await axiosInstance.post(
      `payin/update-status-failed`,
      {
        id,
      },
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

const approveOrderForUpiVendor = async (id, utr) => {
  if (!id) return;

  try {
    const response = await axiosInstance.post(
      `payment-system/verify-payment`,
      {
        payinOrderId: id,
        utr,
      },
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

const rejectOrderForUpiVendor = async (payinOrderId) => {
  if (!payinOrderId) return;
  try {
    const response = await axiosInstance.post(
      `payment-system/reject-payment`,
      {
        payinOrderId,
      },
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

const createPayinOrderAdmin = async (payload) => {
  if (!payload) return;

  try {
    const response = await axiosInstance.post(
      `payin/create-by-admin`,
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

const submitPayinOrderAdmin = async (payload) => {
  if (!payload) return;

  try {
    const response = await axiosInstance.post(
      `payin/update-status-submitted`,
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

const changeStatusAdmin = async (
  systemOrderId: string,
  status: "COMPLETE" | "FAILED"
) => {
  if (!systemOrderId && !status) return;

  try {
    const response = await axiosInstance.patch(
      `payin/update-status-manual/${systemOrderId}?status=${status}`,
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error, raiseError: false });
    throw error;
  }
};

const OrderAPIs = {
  getOrderDetails,
  approveOrderForMember,
  rejectOrderForMember,
  approveOrderForUpiVendor,
  rejectOrderForUpiVendor,
  createPayinOrderAdmin,
  submitPayinOrderAdmin,
  changeStatusAdmin,
};

export default OrderAPIs;
