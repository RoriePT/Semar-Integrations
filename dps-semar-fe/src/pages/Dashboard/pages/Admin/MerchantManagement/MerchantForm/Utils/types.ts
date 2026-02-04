import { PaymentChannels } from "../../../../../../../types/channel";

export type Tab1State = {
  firstName: string;
  lastName: string;
  contact?: string;
  businessName?: string;
  businessUrl: string;
  gst: string;
  agent: {
    id: number;
    name: string;
  };
  enabled: boolean;
  agentPayinCommissionRate: number;
  agentPayoutCommissionRate: number;
};

// updateLogin: boolean;
export type ErrorsTab1 = {
  firstName: string;
  lastName: string;
  contact: string;
  businessName: string;
  businessUrl: string;
  gst: string;
  agent: string;
  enabled: string;
  agentPayinCommissionRate: string;
  agentPayoutCommissionRate: string;
};

export type Tab2State = {
  updateLoginCredentials: boolean;
  email: string;
  password: string;
  confirmPassword: string;
  allowOnlyIp: boolean;
  ips: string[];
  updateWithdrawalCredentials: boolean;
  withdrawalPassword: string;
  confirmWithdrawalPassword: string;
  merchantIntegrationId: string;
  merchantApiKey: string;
};

// updateLogin: boolean;
export type ErrorsTab2 = {
  email: string;
  password: string;
  confirmPassword: string;
  ips: string[];
  withdrawalPassword: string;
  confirmWithdrawalPassword: string;
};

export interface RangeDto {
  lower: number;
  upper: number;
  gateway: string;
}
export interface RangeError {
  lower: string;
  upper: string;
  gateway: string;
}

export interface RatioDto {
  ratio: number | string;
  gateway: string;
}

export type PayinChannelKey = "UPI" | "E_WALLET" | "NET_BANKING" | "";

export interface PayinChannel {
  channel: PayinChannelKey;
  gateway: string;
}

export type Tab3State = {
  // payinChannels: PaymentChannels;
  payinChannels: PayinChannel[];
  payinServiceRate: {
    mode: string;
    absoluteAmount: number;
    percentageAmount: number;
  };
  allowMemberChannelsPayin: boolean;
  allowPgBackupForPayin: boolean;
  payinMode: "DEFAULT" | "PROPORTIONAL" | "AMOUNT RANGE";
  numberOfRangesOrRatio?: number;
  amountRanges?: RangeDto[];
  ratios?: RatioDto[];
  enablePayins: boolean;
  enableUpiVendorGateway?: boolean;
  upiVendorAutoVerifyThreshold?: number;
};

export type ErrorsTab3 = {
  payinServiceRate: {
    mode: string;
    absoluteAmount: string;
    percentageAmount: string;
  };
  payinMode: string;
  payinChannels: string;
  amountRanges: RangeDto[];
  ratios: RatioDto[];
  numberOfRangesOrRatio: "";
};

export type ServiceRateError = {
  mode: string;
  percentageAmount: string;
  absoluteAmount: string;
};

export type Tab4State = {
  payoutChannels: PaymentChannels;
  allowMemberChannelsPayout: boolean;
  allowPgBackupForPayout: boolean;
  payoutServiceRate: {
    mode: string;
    absoluteAmount: number;
    percentageAmount: number;
  };
  minPayout: number;
  maxPayout: number;
  enablePayouts: boolean;
};

export type ErrorsTab4 = {
  payoutChannels: string;
  payoutServiceRate: {
    mode: string;
    absoluteAmount: string;
    percentageAmount: string;
  };
  minPayout: string;
  maxPayout: string;
};

export type Tab5State = {
  withdrawalServiceRate: number;
  minWithdrawal: number;
  maxWithdrawal: number;
  // channelProfile: channelProfile[];
  channelProfile: {
    upi: upiField[];
    netBanking: netBankingField[];
    eWallet: eWalletField[];
  };
};

export type ErrorsTab5 = {
  withdrawalServiceRate: string;
  minWithdrawal: string;
  maxWithdrawal: string;
};

export type Tab1KeyNames = keyof Tab1State;
export type Tab2KeyNames = keyof Tab2State;
export type Tab3KeyNames = keyof Tab3State;
export type Tab4KeyNames = keyof Tab4State;
export type Tab5KeyNames = keyof Tab5State;

//=================Response Type=======================//

type PayinModeDetail = {
  id: number;
  lower: number;
  upper: number;
  gateway: string;
};

export type upiField = {
  upiId: string;
  mobile: string;
  email: string;
};
export type eWalletField = {
  app: string;
  mobile: string;
  email: string;
};
export type netBankingField = {
  bankName: string;
  accountNumber: string;
  ifsc: string;
  benefeciaryName: string;
  mobile: string;
  email: string;
};

export type channelProfile = {
  upi: upiField[] | null;
  netBanking: netBankingField[] | null;
  eWallet: eWalletField[] | null;
};

// type channelProfile = {
//   channel: any;
//   fields: any[];
// };

type PayinPayoutChannel = {
  channelId: number;
  channelName: string;
};

export type MerchantResponseDto = {
  email: string;
  payinModeDetails: {
    [key: string]: PayinModeDetail;
  };
  firstName: string;
  lastName: string;
  phone: string;
  id: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  businessName: string;
  agent: {
    id: number;
    name: string;
  };
  agentPayinCommissionRate: number;
  agentPayoutCommissionRate: number;
  withdrawalPassword: string;
  businessUrl: string;
  gst: string;
  allowMemberChannelsPayin: boolean;
  allowPgBackupForPayin: boolean;
  allowMemberChannelsPayout: boolean;
  allowPgBackupForPayout: boolean;
  payinServiceRate: {
    mode: string;
    absoluteAmount: number;
    percentageAmount: number;
  };
  payoutServiceRate: {
    mode: string;
    absoluteAmount: number;
    percentageAmount: number;
  };
  withdrawalServiceRate: number;
  minPayout: number;
  maxPayout: number;
  minWithdrawal: number;
  maxWithdrawal: number;
  payinMode: any;
  ips: string[];
  //channelProfile: channelProfile[];
  channelProfile: {
    upi: upiField[];
    netBanking: netBankingField[];
    eWallet: eWalletField[];
  };
  payinChannels: PayinChannel[];
  payoutChannels: PaymentChannels;
  numberOfRangesOrRatio?: number;
  amountRangeRange: RangeDto[];
  propotionRatio: RatioDto[];
  integrationId: string;
  apiKey: string;
  enablePayouts: boolean;
  enablePayins: boolean;
  enableUpiVendorGateway?: boolean;
  upiVendorAutoVerifyThreshold?: number;
};

export type MerchantRequestDto = {
  email: string;
  password: string;
  withdrawalPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  enabled: boolean;
  businessName: string;
  agentId: number;
  agentPayinCommissionRate: number;
  agentPayoutCommissionRate: number;
  businessUrl: string;
  gst: string;
  allowMemberChannelsPayin: boolean;
  allowPgBackupForPayin: boolean;
  allowMemberChannelsPayout: boolean;
  allowPgBackupForPayout: boolean;
  payinServiceRate: {
    mode: string;
    absoluteAmount: number;
    percentageAmount: number;
  };
  payoutServiceRate: {
    mode: string;
    absoluteAmount: number;
    percentageAmount: number;
  };
  withdrawalServiceRate: number;
  minPayout: number;
  maxPayout: number;
  minWithdrawal: number;
  maxWithdrawal: number;
  payinMode: any;
  ipAddresses: string[];
  //channelProfile: channelProfile[];
  channelProfile: {
    upi: upiField[];
    netBanking: netBankingField[];
    eWallet: eWalletField[];
  };
  payinChannels: string;
  payoutChannels: string;
  numberOfRangesOrRatio?: number;
  amountRanges: RangeDto[];
  ratios: RatioDto[];
  updateLoginCredentials?: boolean;
  updateWithdrawalCredentials?: boolean;
  apiKey: string;
  integrationId: string;
  enablePayins: boolean;
  enablePayouts: boolean;
  enableUpiVendorGateway?: boolean;
  upiVendorAutoVerifyThreshold?: number;
};
