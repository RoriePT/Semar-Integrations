import { UpiVendor } from "../../../../../../../types/upiVendor";

export type Tab1State = {
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  password: string;
  confirmPassword: string;
  enabled: boolean;
  updateLogin: boolean;
};

export type ErrorsTab1 = {
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  password: string;
  confirmPassword: string;
};

export type upiField = {
  upiId: string;
  mobile: string;
  email: string;
  beneficiaryName?: string;
  isBusinessUpi?: boolean;
  channelIndex?: number;
  title?: string;
  enabled?: boolean;
  settlementAmount?: number;
  hasReceivedPayin?: boolean;
  isPreserved?: boolean;
  tr?: string;
};

export type Tab2State = {
  commissionRate: string;
  settlementUpiId: string;
  upiIds: upiField[];
};

export type ErrorsTab2 = Record<string, never>;

export type Tab2KeyNames = keyof Tab2State;

export type Tab1KeyNames = keyof Tab1State;

export type UpiVendorResponseDto = UpiVendor;
