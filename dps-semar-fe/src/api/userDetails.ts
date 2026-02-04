import { getAuthToken } from "../utils/auth";
import {
  handleAPICatchBlock,
  axiosInstance as AxiosInstance,
  getAPIErrorMessage,
} from "./utils";

const axiosInstance = AxiosInstance();

const getUserDetails = async (role, id) => {
  if (!role || !id) return;

  try {
    // Convert role to API format (e.g., "upi vendor" -> "upi-vendor")
    const apiRole = role.toLowerCase().replace(/\s+/g, "-");
    
    const response = await axiosInstance.get(`user-details/${apiRole}/${id}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error, raiseError: false });
  }
};

const getMerchantEndUserDetails = async (userId) => {
  if (!userId) return;

  try {
    const response = await axiosInstance.get(
      `payout/merchant-user/details/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error, raiseError: false });
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

const UserDetailAPIs = {
  getUserDetails,
  getMerchantEndUserDetails,
};

export default UserDetailAPIs;
