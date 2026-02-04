import { getAuthToken } from "../utils/auth";
import {
  axiosInstance as AxiosInstance,
  getAPIErrorMessage,
  handleAPICatchBlock,
} from "./utils";

const axiosInstance = AxiosInstance();

const signin = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post(
      "/identity/sign-in",
      {
        email,
        password,
      },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

const signup = async (email: string, firstName: string, lastName: string) => {
  try {
    const response = await axiosInstance.post(
      "/identity/sign-up",
      {
        email,
        firstName,
        lastName,
      },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

const verifyOTP = async (email: string, otp: string) => {
  try {
    const response = await axiosInstance.post(
      "/identity/verify-otp",
      {
        email,
        otp: parseInt(otp),
      },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

const registerUser = async (
  email: string,
  referralCode: string,
  password: string
) => {
  try {
    const response = await axiosInstance.post(
      "/member/register",
      {
        email,
        referralCode,
        password,
      },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

const forgotPassword = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post(
      "/identity/forgot-password",
      {
        email,
        password,
      },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

const verifyOTPForgotPassword = async (email: string, otp: string) => {
  try {
    const response = await axiosInstance.post(
      "/identity/verify-otp-forgot-password",
      {
        email,
        otp: parseInt(otp),
      },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

const verifyPassword = async (password: string, userType) => {
  try {
    const response = await axiosInstance.post(
      `${userType}/verify-withdrawal-password`,
      {
        password,
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
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

const AuthAPIs = {
  signin,
  signup,
  registerUser,
  verifyOTP,
  verifyOTPForgotPassword,
  forgotPassword,
  verifyPassword,
};

export default AuthAPIs;
