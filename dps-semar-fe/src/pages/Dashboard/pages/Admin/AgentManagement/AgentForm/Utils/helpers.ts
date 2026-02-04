import {
  AgentRequestDto,
  AgentResponseType,
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

export const mapEditDataToStateTab1 = (data: AgentResponseType): Tab1State => {
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    contact: data.phone,
    email: data.email,
    password: "",
    confirmPassword: "",
    enabled: data.enabled,
    updateLogin: false,
    agent: data.agent,
    agentPayinCommissionRate: data?.agentPayinCommissionRate,
    agentPayoutCommissionRate: data?.agentPayoutCommissionRate,
  };
};

export const mapEditDataToStateTab2 = (data: AgentResponseType): Tab2State => {
  return {
    withdrawalRate: data.withdrawalRate,
    minWithdrawalAmount: data.minWithdrawalAmount,
    maxWithdrawalAmount: data.maxWithdrawalAmount,
    withdrawalPassword: "",
    confirmWithdrawalPassword: "",
    updateWithdrawal: false,
    channelProfile: data.channelProfile || {
      upi: [],
      eWallet: [],
      netBanking: [],
    },
  };
};

export const getPayload = (
  tab1State: Tab1State,
  tab2State: Tab2State,
  isForUpdate: boolean
): AgentRequestDto => {
  return {
    email: tab1State.email,
    password: tab1State.password,
    firstName: tab1State.firstName,
    lastName: tab1State.lastName,
    enabled: tab1State.enabled,
    updateLoginCredentials: isForUpdate ? tab1State.updateLogin : true,
    agentId: tab1State.agent?.id || undefined,
    agentPayinCommissionRate: tab1State?.agentPayinCommissionRate || undefined,
    agentPayoutCommissionRate:
      tab1State?.agentPayoutCommissionRate || undefined,
    phone: tab1State.contact,
    withdrawalPassword: tab2State.withdrawalPassword,
    withdrawalRate: tab2State.withdrawalRate,
    minWithdrawalAmount: tab2State.minWithdrawalAmount,
    maxWithdrawalAmount: tab2State.maxWithdrawalAmount,
    channelProfile: tab2State.channelProfile,
  };
};
