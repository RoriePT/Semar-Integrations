import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const getAPIErrorMessage = (error: unknown) => {
  const errorMessage = (error as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
  if (Array.isArray(errorMessage)) return errorMessage[0];
  else if (errorMessage) return errorMessage;
  else return "Oops! Something went wrong. Try Again";
};
