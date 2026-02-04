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
  submitWithdrawals: boolean;
  submitPayouts: boolean;
  withdrawalChannels: boolean;
};

export type ErrorsTab1 = {
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  password: string;
  confirmPassword: string;
};

export type Tab1KeyNames = keyof Tab1State;
export type Tab2KeyNames = keyof Tab2State;

export type SubMerchantRequestDto = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  enabled: boolean;
  permissionSubmitPayouts: boolean;
  permissionSubmitWithdrawals: boolean;
  permissionUpdateWithdrawalProfiles: boolean;

  updateLoginCredentials?: boolean;
};

export type SubMerchantResponseType = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  id: number;
  enabled: boolean;
  permissionSubmitPayouts: boolean;
  permissionSubmitWithdrawals: boolean;
  permissionUpdateWithdrawalProfiles: boolean;
  createdAt: string;
  updatedAt: string;
};
