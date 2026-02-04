import { getAuthToken } from "../utils/auth";
import { axiosInstance as AxiosInstance, handleAPICatchBlock } from "./utils";
const axiosInstance = AxiosInstance();

export const getMyNotifications = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/notification`, {
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

export const changeNotificationStatusToRead = async (
  notificationsIds: number[]
): Promise<any> => {
  try {
    const response = await axiosInstance.put(
      `/notification/mark-read`,
      {
        notificationsIds,
      },
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

export const getMyAlerts = async (userType) => {
  try {
    const response = await axiosInstance.post(
      `/alert`,
      { userType },
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

export const changeAlertStatusToRead = async (id) => {
  try {
    const response = await axiosInstance.put(
      `/alert/mark-read`,
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
    handleAPICatchBlock({ error });
    console.log(error);
  }
};
