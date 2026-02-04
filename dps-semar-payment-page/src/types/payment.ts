export interface CheckoutDetails {
  amount: string;
  orderId: string;
  userId: string;
  userEmail: string;
  userMobileNumber: string;
  integrationId: string;
  environment: string;
  userName: string;
}

export interface PaymentMethod {
  type: "UPI" | "NET_BANKING" | "E_WALLET";
  name: string;
  description: string;
  icon: string;
}

export interface PaymentStatus {
  status: "PENDING" | "SUCCESS" | "FAILED" | "SUBMITTED";
  orderId: string;
  redirectUrl?: string;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  isError?: boolean;
  error?: string;
  status?: "PENDING" | "SUCCESS" | "FAILED" | "SUBMITTED";
}

export interface CreatePaymentRequest {
  amount: string;
  orderId: string;
  userId: string;
  integrationId: string;
  environment: string;
  channel: "UPI" | "NET_BANKING" | "E_WALLET";
  userName: string;
  userEmail?: string;
  userMobileNumber?: string;
  paymentMethod?: "member" | "razorpay" | "phonepe" | "payu";
}

export interface AssignPaymentGatewayRequest {
  integrationId: string;
  systemOrderId: string;
  environment: string;
  paymentGateway?: string;
}

export interface OrderDetails {
  orderId: string;
  kingsgateOrderId: string;
  status: string;
  user: {
    id: string;
    name: string;
  };
  transactionDetails: {
    id: string;
    amount: number;
    paymentMethod: string;
    time: string;
  };
}

export interface CheckoutResponse {
  businessName: string;
  channels: string[];
  isError?: boolean;
  error?: string;
}

export interface CreatePaymentResponse {
  orderId: string;
  url?: string;
}

export interface MemberChannelResponse {
  amount: string;
  channel: string;
  memberDetails: {
    name: string;
    upiId?: string;
    isBusiness?: boolean;
    qrCode?: string;
    beneficiaryName?: string;
    bank?: string;
    accountNumber?: string;
    ifsc?: string;
    appName?: string;
    mobile?: string;
    trackingId?: string;
  };
}

export interface UPIVendorGatewayResponse {
  channel: string;
  amount: string;
  upiDetails: {
    upiId: string;
    beneficiaryName: string;
    mobile: string;
    isBusiness?: boolean;
    title: string;
    qrCode: string;
    trackingId: string;
    tr: string;
  };
}

export interface PaymentStatusResponse {
  status: "PENDING" | "SUCCESS" | "FAILED" | "SUBMITTED";
  redirectUrl?: string;
}

export interface MerchantBasicDetailsResponse {
  status: number;
  data: {
    enableUpiVendorGateway: boolean;
  };
}
