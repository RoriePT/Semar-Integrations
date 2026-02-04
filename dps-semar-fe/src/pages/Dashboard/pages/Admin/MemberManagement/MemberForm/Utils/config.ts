import {
  mapEditDataToStateTab1,
  mapEditDataToStateTab2,
  mapEditDataToStateTab3,
} from "./helpers";
import {
  ErrorsTab1,
  ErrorsTab2,
  MemberResponseDto,
  Tab1State,
  Tab2State,
  Tab3State,
} from "./types";

export const defaultStateTab1: Tab1State = {
  firstName: "",
  lastName: "",
  email: "",
  contact: "",
  password: "",
  confirmPassword: "",
  enabled: true,
  referralCode: "",
  telegramId: "",
  updateLogin: false,
};

export const defaultErrorsTab1: ErrorsTab1 = {
  firstName: "",
  lastName: "",
  email: "",
  contact: "",
  password: "",
  confirmPassword: "",
  referralCode: "",
  telegramId: "",
};

export const getIntialStateTab1 = (editData: MemberResponseDto) => {
  if (editData) return mapEditDataToStateTab1(editData);
  else return defaultStateTab1;
};

export const defaultStateTab2: Tab2State = {
  // payinCommission: 1,
  // payoutCommission: 1,
  // topupCommission: 1,

  minPayout: 1,
  maxPayout: 10000000,
  dailyPayoutLimit: 10000000,
};

export const defaultErrorsTab2: ErrorsTab2 = {
  payinCommission: "",
  payoutCommission: "",
  topupCommission: "",
  minPayout: "",
  maxPayout: "",
  dailyPayoutLimit: "",
};

export const getIntialStateTab2 = (editData: MemberResponseDto) => {
  if (editData) return mapEditDataToStateTab2(editData);
  else return defaultStateTab2;
};

export const defaultStateTab3: Tab3State = {
  // channelProfile: [],
  channelProfile: {
    upi: [],
    netBanking: [],
    eWallet: [],
  },
};

export const getIntialStateTab3 = (editData: MemberResponseDto) => {
  if (editData) return mapEditDataToStateTab3(editData);
  else return defaultStateTab3;
};
