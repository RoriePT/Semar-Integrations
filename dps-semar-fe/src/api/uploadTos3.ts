// import

import { getAuthToken } from "../utils/auth";
import {
  axiosInstance as AxiosInstance,
  getAPIErrorMessage,
  handleAPICatchBlock,
} from "./utils";

const axiosInstance = AxiosInstance();

export const uploadReceipt = async (file: File, orderId: string) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axiosInstance.post(
      `/upload/receipt/${orderId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data.key;
  } catch (error) {
    handleAPICatchBlock({ error });
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};
