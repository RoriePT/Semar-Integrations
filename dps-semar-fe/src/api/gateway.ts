import { getAuthToken } from "../utils/auth";
import { handleAPICatchBlock, axiosInstance as AxiosInstance } from "./utils";

const axiosInstance = AxiosInstance();

export const getAllGateways = async (): Promise<any> => {
  return {
    data: ["RAZORPAY", "PHONEPE"],
  };
};

export const getRazorpayGateway = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/gateway/razorpay`, {
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

export const getPhonepeGateway = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/gateway/phonepe`, {
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

export const getUniqPayGateway = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/gateway/uniqpay`, {
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

export const getPayuGateway = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/gateway/payu`, {
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

export const getCashfreeGateway = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/gateway/cashfree`, {
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

export const updateRazorpay = async (
  type?: PaymentType,
  value?: boolean,
  additionalData?: {
    key_secret?: string;
    key_id?: string;
    sandbox_key_id?: string;
    sandbox_key_secret?: string;
    account_number?: string;
    sandbox_account_number?: string;
  }
): Promise<any> => {
  let payload = {};

  if (type === null) {
    payload = additionalData;
  } else {
    payload = {
      [type.toLowerCase()]: value,
      ...additionalData,
    };
  }

  try {
    const response = await axiosInstance.post(
      "/gateway/razorpay/update",
      payload,
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
  }
};

export const updatePhonepe = async (
  type?: PaymentType,
  value?: boolean,
  additionalData?: {
    merchant_id?: string;
    salt_key?: string;
    salt_index?: string;
    sandbox_merchant_id?: string;
    sandbox_salt_key?: string;
    sandbox_salt_index?: string;
  }
): Promise<any> => {
  let payload = {};

  if (type === null) {
    payload = additionalData;
  } else {
    payload = {
      [type.toLowerCase()]: value,
      ...additionalData,
    };
  }
  try {
    const response = await axiosInstance.post(
      "/gateway/phonepe/update",
      payload,
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

export const updateUniqPay = async (
  type?: PaymentType,
  value?: boolean,
  additionalData?: {
    uniqpay_id?: string;
    client_id?: string;
    client_secret?: string;
  }
): Promise<any> => {
  let payload = {};

  if (type === null) {
    payload = additionalData;
  } else {
    payload = {
      [type.toLowerCase()]: value,
      ...additionalData,
    };
  }
  try {
    const response = await axiosInstance.post(
      "/gateway/uniqpay/update",
      payload,
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

export const updatePayu = async (
  type?: PaymentType,
  value?: boolean,
  additionalData?: {
    merchant_id?: string;
    client_id?: string;
    client_secret?: string;
    sandbox_merchant_id?: string;
    sandbox_client_id?: string;
    sandbox_client_secret?: string;
  }
): Promise<any> => {
  let payload = {};

  if (type === null) {
    payload = additionalData;
  } else {
    payload = {
      [type.toLowerCase()]: value,
      ...additionalData,
    };
  }
  try {
    const response = await axiosInstance.post("/gateway/payu/update", payload, {
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

export const updateCashfree = async (
  type?: PaymentType,
  value?: boolean,
  additionalData?: {
    client_id?: string;
    client_secret?: string;
    payouts_client_id?: string;
    payouts_client_secret?: string;
    sandbox_client_id?: string;
    sandbox_client_secret?: string;
  }
): Promise<any> => {
  let payload = {};

  if (type === null) {
    payload = additionalData;
  } else {
    payload = {
      [type.toLowerCase()]: value,
      ...additionalData,
    };
  }
  try {
    const response = await axiosInstance.post(
      "/gateway/cashfree/update",
      payload,
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

export enum ChannelName {
  UPI = "UPI",
  BANKING = "NET_BANKING",
  E_WALLET = "E_WALLET",
}

export enum GatewayName {
  RAZORPAY = "RAZORPAY",
  PHONEPE = "PHONEPE",
  UNIQPAY = "UNIQPAY",
  PAYU = "PAYU",
  CASHFREE = "CASHFREE",
}

export enum PaymentType {
  INCOMING = "INCOMING",
  OUTGOING = "OUTGOING",
}

export interface ChannelConfigData {
  gatewayName: GatewayName;
  type: PaymentType;
  channelName: ChannelName;
  enabled?: boolean;
  minAmount?: number;
  maxAmount?: number;
  upstreamFee?: number;
}

export const updateChannelSetting = async (data: ChannelConfigData) => {
  try {
    const response = await axiosInstance.patch(
      `/gateway/channel-setting/update`,
      data,
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.error("Error updating channel setting:", error);
    throw error;
  }
};

export const getChannelSetting = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/gateway/channel-settings/all`, {
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
