import { channelProfile } from "../pages/Dashboard/pages/Admin/MemberManagement/MemberForm/Utils/types";

type PaymentMethod = {
  id: number;
  name: string;
  logo: string | null;
  incomingStatus: boolean;
  outgoingStatus: boolean;
  createdAt: string; // or Date, depending on how you handle dates
  updatedAt: string; // or Date
};

type Channel = {
  id: number;
  name: string;
  tag: string;
  incomingStatus: boolean;
  outgoingStatus: boolean;
  logo: string | null;
  createdAt: string; // or Date
  updatedAt: string; // or Date
};

type Field = {
  label: string;
  fieldId: number;
  value: string;
};

type DefaultTopupChannel = {
  channel: Channel;
  fields: Field[];
};

export interface UpiChannel {
  upiId: string;
  mobile: string;
}

export interface EWallet {
  app: string;
  mobile: string;
}

export interface NetBanking {
  bankName: string;
  ifsc: string;
  benificiaryName: string;
  accountNumber: string;
}

export interface ChannelProfile {
  upi: UpiChannel[] | null;
  eWallet: EWallet[] | null;
  netBanking: NetBanking[] | null;
}

export interface UpiChannel {
  upiId: string;
  mobile: string;
}

export interface EWallet {
  app: string;
  mobile: string;
}

export interface NetBanking {
  bankName: string;
  ifsc: string;
  benificiaryName: string;
  accountNumber: string;
}

export interface ChannelProfile {
  upi: UpiChannel[] | null;
  eWallet: EWallet[] | null;
  netBanking: NetBanking[] | null;
}

export type PaymentGatewayConfig = {
  defaultPayinGateway: PaymentMethod;
  defaultPayoutGateway: PaymentMethod;
  defaultWithdrawalGateway: PaymentMethod;
  payinTimeout: number;
  payoutTimeout: number;
  currency: string;
  topupThreshold: number;
  topupAmount: number;
  topupServiceRate: number;
  defaultTopupChannels: DefaultTopupChannel[];
  channelProfile: ChannelProfile;
  payinCommissionRateForMember: number;
  payoutCommissionRateForMember: number;
  topupCommissionRateForMember: number;
  minimumPayoutAmountForMember: number;
  maximumPayoutAmountForMember: number;
  maximumDailyPayoutAmountForMember: number;
  payinServiceRateForMerchant: {
    mode: string;
    absoluteAmount: number;
    percentageAmount: number;
  };
  payoutServiceRateForMerchant: {
    mode: string;
    absoluteAmount: number;
    percentageAmount: number;
  };
  minimumPayoutAmountForMerchant: number;
  maximumPayoutAmountForMerchant: number;
  minimumWithdrawalAmountForMerchant: number;
  maximumWithdrawalAmountForMerchant: number;
  withdrawalServiceRateForMerchant: number;
  withdrawalRate: number;
  minWithdrawalAmount: number;
  maxWithdrawalAmount: number;
  frozenAmountThreshold: number;
  endUserPayinLimit: number;
  payinSystemProfitRate: number;
  payoutSystemProfitRate: number;
};
