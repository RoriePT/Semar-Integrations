import { axiosInstance, getAPIErrorMessage } from "./apiUtils";

import {
  CreatePaymentRequest,
  AssignPaymentGatewayRequest,
  ApiResponse,
  CheckoutResponse,
  CreatePaymentResponse,
  OrderDetails,
  MemberChannelResponse,
  UPIVendorGatewayResponse,
  PaymentStatusResponse,
  MerchantBasicDetailsResponse,
} from "../types/payment";
import { API_ENDPOINTS } from "../utils/constants";

const fetchCheckout = async (
  integrationId: string
): Promise<CheckoutResponse> => {
  try {
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.CHECKOUT}/${integrationId}`,
      {
        requestOrigin: document.referrer,
      }
    );

    return response.data;
  } catch (error) {
    return {
      isError: true,
      error: getAPIErrorMessage(error),
      businessName: "",
      channels: [],
    };
  }
};

const assignPaymentGatewayApiMode = async (
  params: AssignPaymentGatewayRequest
): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.ASSIGN_GATEWAY, {
      integrationId: params.integrationId,
      systemOrderId: params.systemOrderId,
      environment: params.environment,
      paymentGateway: params.paymentGateway?.toLowerCase() || undefined,
    });

    return response.data;
  } catch (error) {
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

const createPayment = async (
  paymentDetails: CreatePaymentRequest
): Promise<ApiResponse<CreatePaymentResponse>> => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.CREATE_PAYMENT, {
      ...paymentDetails,
      amount: +paymentDetails.amount,
      channel: paymentDetails.channel,
      paymentMethod:
        paymentDetails.environment === "sandbox"
          ? paymentDetails.paymentMethod
          : undefined,
    });

    return response.data;
  } catch (error) {
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

const getMemberChannelForPayment = async (
  orderId: string,
  environment: string
): Promise<ApiResponse<MemberChannelResponse>> => {
  try {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.MEMBER_CHANNEL}/${orderId}?environment=${environment}`
    );

    return { data: response.data, isError: false };
  } catch (error) {
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

const getUPIVendorGateway = async (
  orderId: string,
  environment: string
): Promise<ApiResponse<UPIVendorGatewayResponse>> => {
  try {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.UPI_VENDOR_CHANNEL}/${orderId}?environment=${environment}`
    );

    return { data: response.data, isError: false };
  } catch (error) {
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

const uploadReceipt = async (
  file: File,
  orderId: string
): Promise<string | { isError: boolean; error: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.UPLOAD_RECEIPT}/${orderId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.key;
  } catch (error) {
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

const submitPayment = async (
  orderId: string,
  txnId: string,
  environment = "live"
): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.SUBMIT_PAYMENT}/${orderId}?environment=${environment}`,
      {
        txnId: txnId,
      }
    );

    return response.data;
  } catch (error) {
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

const fetchPaymentStatus = async (
  orderId: string,
  environment: "live" | "sandbox" = "live"
): Promise<ApiResponse<PaymentStatusResponse>> => {
  if (!orderId || !environment)
    return { isError: true, error: "Missing required parameters" };

  try {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.PAYMENT_STATUS}/${orderId}?environment=${environment}`
    );

    return response.data;
  } catch (error) {
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

const postSuccessCallback = async (orderId: string): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.put(
      `${API_ENDPOINTS.SUCCESS_CALLBACK}/${orderId}`
    );

    return response.data;
  } catch (error) {
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

const getOrderDetails = async (
  orderId: string,
  environment: string
): Promise<ApiResponse<OrderDetails>> => {
  if (!orderId || !environment)
    return { isError: true, error: "Missing required parameters" };

  try {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.ORDER_DETAILS}/${orderId}?environment=${environment}`
    );

    return response.data;
  } catch (error) {
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

const getPayinDetailsFromMerchantOrderId = async (
  merchantOrderId: string,
  integrationId: string
): Promise<ApiResponse<{ orderId: string }>> => {
  if (!merchantOrderId || !integrationId) {
    return { isError: true, error: "Missing required parameters" };
  }

  try {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.MERCHANT_ORDER_ID}/${merchantOrderId}?integrationId=${integrationId}`
    );

    return response.data;
  } catch (error) {
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

const getMerchantBasicDetails = async (
  integrationId: string
): Promise<ApiResponse<MerchantBasicDetailsResponse>> => {
  if (!integrationId) {
    return { isError: true, error: "Missing integrationId" };
  }

  try {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.MERCHANT_BASIC_DETAILS}/${integrationId}/basic`
    );

    return { data: response.data, isError: false };
  } catch (error) {
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

const APIs = {
  fetchCheckout,
  createPayment,
  getMemberChannelForPayment,
  getUPIVendorGateway,
  fetchPaymentStatus,
  uploadReceipt,
  submitPayment,
  postSuccessCallback,
  getOrderDetails,
  assignPaymentGatewayApiMode,
  getPayinDetailsFromMerchantOrderId,
  getMerchantBasicDetails,
};

export default APIs;
