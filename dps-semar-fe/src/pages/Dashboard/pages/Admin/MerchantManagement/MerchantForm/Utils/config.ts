import uniqid from "uniqid";
import { v4 as uuidv4 } from "uuid";

import {
  mapEditDataToStateTab1,
  mapEditDataToStateTab2,
  mapEditDataToStateTab3,
  mapEditDataToStateTab4,
  mapEditDataToStateTab5,
} from "./helpers";
import {
  ErrorsTab1,
  ErrorsTab2,
  ErrorsTab3,
  ErrorsTab4,
  ErrorsTab5,
  MerchantResponseDto,
  Tab1State,
  Tab2State,
  Tab3State,
  Tab4State,
  Tab5State,
} from "./types";

export const defaultStateTab1: Tab1State = {
  firstName: "",
  lastName: "",
  contact: "",

  enabled: true,
  businessUrl: "",
  agent: {
    id: 0,
    name: "",
  },
  agentPayinCommissionRate: 1,
  agentPayoutCommissionRate: 1,
  gst: "",
};

export const defaultErrorsTab1: ErrorsTab1 = {
  firstName: "",
  lastName: "",
  contact: "",
  businessUrl: "",
  businessName: "",
  agent: "",
  enabled: "",
  agentPayinCommissionRate: "",
  agentPayoutCommissionRate: "",
  gst: "",
};

export const getIntialStateTab1 = (editData: MerchantResponseDto) => {
  if (editData) return mapEditDataToStateTab1(editData);
  else return defaultStateTab1;
};

export const defaultStateTab2: Tab2State = {
  updateLoginCredentials: false,
  email: "",
  password: "",
  confirmPassword: "",
  allowOnlyIp: false,
  ips: [],
  updateWithdrawalCredentials: false,
  withdrawalPassword: "",
  confirmWithdrawalPassword: "",
  merchantIntegrationId: "KG-IK-" + uniqid(),
  merchantApiKey: "KG-SK-" + uuidv4(),
};

export const defaultErrorsTab2: ErrorsTab2 = {
  email: "",
  password: "",
  confirmPassword: "",
  ips: [],
  withdrawalPassword: "",
  confirmWithdrawalPassword: "",
};

export const getIntialStateTab2 = (editData: MerchantResponseDto) => {
  if (editData) return mapEditDataToStateTab2(editData);
  else return defaultStateTab2;
};

export const defaultStateTab3: Tab3State = {
  payinChannels: [],
  payinServiceRate: {
    mode: "PERCENTAGE",
    absoluteAmount: null,
    percentageAmount: 0.2,
  },
  allowMemberChannelsPayin: true,
  allowPgBackupForPayin: true,
  payinMode: "DEFAULT",
  numberOfRangesOrRatio: 2,
  enablePayins: true,
  enableUpiVendorGateway: false,
};

export const defaultErrorsTab3: ErrorsTab3 = {
  payinChannels: "",
  amountRanges: [],
  ratios: [],
  numberOfRangesOrRatio: "",
  payinServiceRate: {
    mode: "",
    absoluteAmount: "",
    percentageAmount: "",
  },
  payinMode: "",
};

export const getIntialStateTab3 = (editData: MerchantResponseDto) => {
  if (editData) return mapEditDataToStateTab3(editData);
  else return defaultStateTab3;
};

export const defaultStateTab4: Tab4State = {
  payoutChannels: [],
  allowMemberChannelsPayout: true,
  allowPgBackupForPayout: true,
  payoutServiceRate: {
    mode: "PERCENTAGE",
    absoluteAmount: null,
    percentageAmount: 0.2,
  },
  minPayout: 0,
  maxPayout: 1000000,
  enablePayouts: true,
};

export const defaultErrorsTab4: ErrorsTab4 = {
  payoutChannels: "",
  payoutServiceRate: {
    mode: "",
    absoluteAmount: "",
    percentageAmount: "",
  },
  minPayout: "",
  maxPayout: "",
};

export const getInitialStateTab4 = (editData: MerchantResponseDto) => {
  if (editData) return mapEditDataToStateTab4(editData);
  else return defaultStateTab4;
};

export const defaultStateTab5: Tab5State = {
  withdrawalServiceRate: 0.5,
  minWithdrawal: 0,
  maxWithdrawal: 1000000,
  // channelProfile: [],
  channelProfile: {
    upi: [],
    netBanking: [],
    eWallet: [],
  },
};

export const defaultErrorsTab5: ErrorsTab5 = {
  withdrawalServiceRate: "",
  minWithdrawal: "",
  maxWithdrawal: "",
};

export const getInitialStateTab5 = (editData: MerchantResponseDto) => {
  if (editData) return mapEditDataToStateTab5(editData);
  else return defaultStateTab5;
};
