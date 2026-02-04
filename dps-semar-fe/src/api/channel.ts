import { getAuthToken } from "../utils/auth";
import { handleAPICatchBlock, axiosInstance as AxiosInstance } from "./utils";

const axiosInstance = AxiosInstance();

export const getAllChannels = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/channel/config`, {
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

export const updateChannelAPI = async (channelData: {
  name: string;
  incoming: boolean;
  outgoing: boolean;
  tag_name: string;
}): Promise<any> => {
  try {
    const response = await axiosInstance.patch("/channel/update", channelData, {
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
