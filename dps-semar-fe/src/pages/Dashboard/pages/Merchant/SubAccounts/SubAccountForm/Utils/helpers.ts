import {
  SubMerchantRequestDto,
  SubMerchantResponseType,
  Tab1State,
  Tab2State,
} from "./types";

export const mapEditDataToStateTab1 = (
  data: SubMerchantResponseType
): Tab1State => {
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

export const mapEditDataToStateTab2 = (
  data: SubMerchantResponseType
): Tab2State => {
  return {
    submitPayouts: data.permissionSubmitPayouts,
    withdrawalChannels: data.permissionUpdateWithdrawalProfiles,
    submitWithdrawals: data.permissionSubmitWithdrawals,
  };
};

export const getPayload = (
  tab1State: Tab1State,
  tab2State: Tab2State,
  isForUpdate: boolean
): SubMerchantRequestDto => {
  return {
    email: tab1State.email,
    password: tab1State.password,
    firstName: tab1State.firstName,
    lastName: tab1State.lastName,
    enabled: tab1State.enabled,
    phone: tab1State.contact,
    permissionSubmitPayouts: tab2State.submitPayouts,
    permissionUpdateWithdrawalProfiles: tab2State.withdrawalChannels,
    permissionSubmitWithdrawals: tab2State.submitWithdrawals,
    updateLoginCredentials: isForUpdate ? tab1State.updateLogin : true,
  };
};
