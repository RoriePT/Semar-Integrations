export const CHANNEL_MAP = {
  UPI: "upi",
  NET_BANKING: "netbanking",
  E_WALLET: "e-wallet",
} as const;

export const REVERSE_CHANNEL_MAP = {
  upi: "UPI",
  netbanking: "NET_BANKING",
  "e-wallet": "E_WALLET",
} as const;

export const PAYMENT_METHODS = {
  member: "member",
  razorpay: "razorpay",
  phonepe: "phonepe",
  payu: "payu",
} as const;

export const ENVIRONMENTS = {
  live: "live",
  sandbox: "sandbox",
} as const;

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
} as const;

export const API_ENDPOINTS = {
  CHECKOUT: "/payment-system/checkout",
  CREATE_PAYMENT: "/payment-system/create-payment-order",
  ASSIGN_GATEWAY: "/payment-system/assign-payment-gateway",
  MEMBER_CHANNEL: "/payment-system/member-channel",
  UPI_VENDOR_CHANNEL: "/payment-system/upi-vendor-channel",
  SUBMIT_PAYMENT: "/payment-system/submit-payment",
  PAYMENT_STATUS: "/payment-system/status",
  ORDER_DETAILS: "/payment-system/order-details",
  UPLOAD_RECEIPT: "/upload/receipt",
  SUCCESS_CALLBACK: "/payin/success-callback",
  MERCHANT_ORDER_ID: "/payin",
  MERCHANT_BASIC_DETAILS: "/merchant/integration",
} as const;
