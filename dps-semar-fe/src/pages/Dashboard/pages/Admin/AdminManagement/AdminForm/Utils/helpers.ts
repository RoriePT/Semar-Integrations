import {
  AdminRequestDto,
  AdminResponseType,
  Tab1State,
  Tab2State,
} from "./types";

const getRoleForPayload = (role): any => {
  if (role === "Super admin") return "SUPER_ADMIN";
  else if (role === "Sub admin") return "SUB_ADMIN";
};

const getRoleForMap = (role): any => {
  if (role === "SUPER_ADMIN") return "Super admin";
  else if (role === "SUB_ADMIN") return "Sub admin";
};

export const mapEditDataToStateTab1 = (data: AdminResponseType): Tab1State => {
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    contact: data.phone,
    email: data.email,
    password: "",
    confirmPassword: "",
    enabled: data.enabled,
    updateLogin: false,
  };
};

export const mapEditDataToStateTab2 = (data: AdminResponseType): Tab2State => {
  return {
    role: getRoleForMap(data.role),
    admins: data.permissionAdmins,
    balances: data.permissionAdjustBalance,
    channelsAndGateways: data.permissionChannelsAndGateways,
    system: data.permissionSystemConfig,
    users: data.permissionUsers,
    verify: data.permissionVerifyOrders,
    withdrawals: data.permissionHandleWithdrawals,
  };
};

export const getPayload = (
  tab1State: Tab1State,
  tab2State: Tab2State,
  isForUpdate: boolean
): AdminRequestDto => {
  return {
    email: tab1State.email,
    password: tab1State.password,
    firstName: tab1State.firstName,
    lastName: tab1State.lastName,
    enabled: tab1State.enabled,
    phone: tab1State.contact,
    role: getRoleForPayload(tab2State.role),
    permissionAdmins: tab2State.admins,
    permissionUsers: tab2State.users,
    permissionAdjustBalance: tab2State.balances,
    permissionVerifyOrders: tab2State.verify,
    permissionHandleWithdrawals: tab2State.withdrawals,
    permissionSystemConfig: tab2State.system,
    permissionChannelsAndGateways: tab2State.channelsAndGateways,
    updateLoginCredentials: isForUpdate ? tab1State.updateLogin : true,
  };
};
