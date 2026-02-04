export type Tab1State = {
  firstName: string;
  lastName: string;
  email: string;
  contact?: string;
  password: string;
  confirmPassword: string;
  enabled: boolean;
  updateLogin: boolean;
};

export type Tab2State = {
  role: "Super admin" | "Sub admin" | "";
  admins: boolean;
  users: boolean;
  verify: boolean;
  withdrawals: boolean;
  balances: boolean;
  system: boolean;
  channelsAndGateways: boolean;
};

export type ErrorsTab1 = {
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  password: string;
  confirmPassword: string;
};

export type ErrorsTab2 = {
  role: string;
};

export type Tab1KeyNames = keyof Tab1State;
export type Tab2KeyNames = keyof Tab2State;

export type AdminRequestDto = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: "SUPER_ADMIN" | "SUB_ADMIN";
  enabled: boolean;
  permissionAdmins: boolean;
  permissionUsers: boolean;
  permissionAdjustBalance: boolean;
  permissionVerifyOrders: boolean;
  permissionHandleWithdrawals: boolean;
  permissionSystemConfig: boolean;
  permissionChannelsAndGateways: boolean;
  updateLoginCredentials?: boolean;
};

export type AdminResponseType = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: "SUPER_ADMIN" | "SUB_ADMIN";
  id: number;
  enabled: boolean;
  permissionAdmins: boolean;
  permissionUsers: boolean;
  permissionAdjustBalance: boolean;
  permissionVerifyOrders: boolean;
  permissionHandleWithdrawals: boolean;
  permissionSystemConfig: boolean;
  permissionChannelsAndGateways: boolean;
  createdAt: string;
  updatedAt: string;
};
