import { notifications } from "@mantine/notifications";
import axios from "axios";

export const axiosInstance = () =>
  axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
  });

export const getAPIErrorMessage = (error: any) => {
  const errorMessage = error?.response?.data?.message;
  if (Array.isArray(errorMessage)) return errorMessage[0];
  else if (errorMessage) return errorMessage;
  else return "Oops! Something went wrong. Try Again";
};

export const handleAPICatchBlock = ({
  error,
  raiseError = true,
  isMyDetailsAPI = false,
  reloadPage = true,
}) => {
  if (error.response.status === 403) {
    localStorage.removeItem("KGtoken2");
    reloadPage && window.location.reload();
    window.location.href = "/sign-in";
  }

  if (isMyDetailsAPI && error.response.status === 404) {
    localStorage.removeItem("KGtoken2");
  }

  if (raiseError) {
    notifications.show({
      autoClose: 5000,
      message: getAPIErrorMessage(error),
      color: "red",
      withCloseButton: true,
    });
  }
};

export function dummyTimeout(ms = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
