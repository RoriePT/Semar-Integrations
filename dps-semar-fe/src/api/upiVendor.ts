import { getAuthToken } from "../utils/auth";
import {
  axiosInstance as AxiosInstance,
  getAPIErrorMessage,
  handleAPICatchBlock,
} from "./utils";

const axiosInstance = AxiosInstance();

// UPI Vendor API functions
export const upiVendorList = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get("/upi-vendor", {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.error(error);
  }
};

export const createUpiVendor = async (body: any): Promise<any> => {
  try {
    const response = await axiosInstance.post("/upi-vendor", body, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

export const updateUpiVendor = async (body: any, id: number): Promise<any> => {
  try {
    const response = await axiosInstance.patch(`/upi-vendor/${id}`, body, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

export const deleteUpiVendor = async (id: number): Promise<any> => {
  try {
    const response = await axiosInstance.delete(`/upi-vendor/${id}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

export const getUpiVendor = async (id: number): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/upi-vendor/${id}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.error(error);
  }
};

export const getPreservedUpi = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get("/upi-vendor/admin/preserved-upi", {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.error(error);
    return { isPreserved: false, preservedUpi: null, message: "Failed to fetch preserved UPI" };
  }
};

const UpiVendorAPIs = {
  upiVendorList,
  createUpiVendor,
  updateUpiVendor,
  deleteUpiVendor,
  getUpiVendor,
  getPreservedUpi,
};

export default UpiVendorAPIs;
