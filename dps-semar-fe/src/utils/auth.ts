import { jwtDecode } from "jwt-decode";

export const decodeJwt = (token) => {
  if (!token) return null;
  const decoded = jwtDecode(token);
  return decoded;
};

export const getRouteForUserDashboard = (token) => {
  const decoded: any = decodeJwt(token);

  switch (decoded.type) {
    case "SUB_ADMIN":
    case "SUPER_ADMIN":
      return "/admin";
    case "MERCHANT":
    case "SUB_MERCHANT":
      return "/merchant";
    case "MEMBER":
      return "/member";
    case "AGENT":
      return "/agent";
    case "UPI_VENDOR":
      return "/upi-vendor";
  }
};

export const getUserType = (type) => {
  switch (type) {
    case "SUB_ADMIN":
      return "Sub Admin";
    case "SUPER_ADMIN":
      return "Super Admin";
    case "MERCHANT":
      return "Merchant";
    case "SUB_MERCHANT":
      return "Sub-Merchant";
    case "MEMBER":
      return "Member";
    case "AGENT":
      return "Agent";
    case "UPI_VENDOR":
      return "UPI Vendor";
  }
};

export const getUserTable = (type) => {
  switch (type) {
    case "SUB_ADMIN":
    case "SUPER_ADMIN":
      return "admin";
    case "MERCHANT":
      return "merchant";
    case "SUB_MERCHANT":
      return "sub-merchant";
    case "MEMBER":
      return "member";

    case "AGENT":
      return "agent";
    case "UPI_VENDOR":
      return "upi-vendor";
  }
};

export const isUserLoggedIn = () => {
  return !!localStorage.getItem("KGtoken2");
};

export const getAuthToken = () => {
  return localStorage.getItem("KGtoken2") || null;
};
