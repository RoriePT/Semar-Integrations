import { getAuthToken } from "../utils/auth";
import {
  handleAPICatchBlock,
  axiosInstance as AxiosInstance,
  getAPIErrorMessage,
} from "./utils";

const axiosInstance = AxiosInstance();

export const systemConfig = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/system-config/latest`, {
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

export const updateSystemConfigs = async ({ formName, formPayload }) => {
  try {
    const response = await axiosInstance.patch(
      `/system-config/${formName}`,
      formPayload,
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};
