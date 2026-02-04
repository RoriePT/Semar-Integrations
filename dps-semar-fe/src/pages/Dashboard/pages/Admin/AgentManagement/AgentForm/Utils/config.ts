import {
  AgentResponseType,
  ErrorsTab1,
  ErrorsTab2,
  Tab1State,
  Tab2State,
} from "./types";
import { mapEditDataToStateTab1, mapEditDataToStateTab2 } from "./helpers";

//===========Tab 1===========//

export const defaultStateTab1: Tab1State = {
  firstName: "",
  lastName: "",
  email: "",
  contact: "",
  password: "",
  confirmPassword: "",
  enabled: true,
  updateLogin: false,
  agent: {
    id: 0,
    name: "",
  },
  agentPayinCommissionRate: 1,
  agentPayoutCommissionRate: 1,
};

export const defaultStateTab2: Tab2State = {
  withdrawalRate: 0,
  minWithdrawalAmount: 0,
  maxWithdrawalAmount: 0,
  withdrawalPassword: "",
  confirmWithdrawalPassword: "",
  updateWithdrawal: false,
  channelProfile: { upi: [], eWallet: [], netBanking: [] },
};

export const defaultErrorsTab1: ErrorsTab1 = {
  firstName: "",
  lastName: "",
  email: "",
  contact: "",
  password: "",
  confirmPassword: "",
  agentPayinCommissionRate: "",
  agentPayoutCommissionRate: "",
};

export const defaultErrorsTab2: ErrorsTab2 = {
  withdrawalRate: null,
  minWithdrawalAmount: null,
  maxWithdrawalAmount: null,
  withdrawalPassword: "",
  confirmWithdrawalPassword: "",
};

export const getIntialStateTab1 = (editData: AgentResponseType) => {
  if (editData) return mapEditDataToStateTab1(editData);
  else return defaultStateTab1;
};

export const getIntialStateTab2 = (editData: AgentResponseType) => {
  if (editData) return mapEditDataToStateTab2(editData);
  else return defaultStateTab2;
};
