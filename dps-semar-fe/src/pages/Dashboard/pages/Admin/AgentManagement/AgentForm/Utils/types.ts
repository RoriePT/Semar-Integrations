import { ChannelProfile } from "../../../../../../../types/channel";

export type Tab1State = {
  firstName: string;
  lastName: string;
  email: string;
  contact?: string;
  agent: {
    id: number;
    name: string;
  };
  agentPayinCommissionRate: number;
  agentPayoutCommissionRate: number;
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
  agentPayinCommissionRate: string;
  agentPayoutCommissionRate: string;
};

export type Tab2State = {
  withdrawalRate: number;
  minWithdrawalAmount: number;
  maxWithdrawalAmount: number;
  withdrawalPassword: string;
  confirmWithdrawalPassword: string;
  updateWithdrawal: boolean;
  channelProfile: ChannelProfile;
};

export type ErrorsTab2 = {
  withdrawalRate: number;
  minWithdrawalAmount: number;
  maxWithdrawalAmount: number;
  withdrawalPassword: string;
  confirmWithdrawalPassword: string;
};

export type Tab1KeyNames = keyof Tab1State;
export type Tab2KeyNames = keyof Tab2State;

export type AgentRequestDto = {
  email: string;
  password: string;
  phone?: string;
  withdrawalPassword: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
  updateLoginCredentials?: boolean;
  withdrawalRate: number;
  minWithdrawalAmount: number;
  maxWithdrawalAmount: number;
  channelProfile: ChannelProfile;
  agentId: number;
  agentPayinCommissionRate: number;
  agentPayoutCommissionRate: number;
};

export type AgentResponseType = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  withdrawalRate: number;
  minWithdrawalAmount: number;
  maxWithdrawalAmount: number;
  channelProfile: ChannelProfile;
  agent: {
    id: number;
    name: string;
  };
  agentPayinCommissionRate: number;
  agentPayoutCommissionRate: number;
};
