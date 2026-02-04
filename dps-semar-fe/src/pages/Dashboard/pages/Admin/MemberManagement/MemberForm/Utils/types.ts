import ChannelProfile from "../../../../../../../components/ChannelProfile";
import { Channel } from "../../../../../../../types/channel";

export type Tab1State = {
  firstName: string;
  lastName: string;
  email: string;
  contact?: string;
  password: string;
  confirmPassword: string;
  enabled: boolean;
  referralCode: string;
  telegramId?: string;
  updateLogin: boolean;
};

export type ErrorsTab1 = {
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  password: string;
  confirmPassword: string;
  referralCode: string;
  telegramId?: string;
};

export type Tab2State = {
  // payinCommission: number;
  // payoutCommission: number;
  // topupCommission: number;

  minPayout: number;
  maxPayout: number;
  dailyPayoutLimit: number;
};

export type ErrorsTab2 = {
  payinCommission: string;
  payoutCommission: string;
  topupCommission: string;
  minPayout: string;
  maxPayout: string;
  dailyPayoutLimit: string;
};

// export type Tab3State = {
//   channelProfile: {
//     channel: Channel;
//     fields: ChannelField[];
//   }[];
// };

export type Tab3State = {
  // channelProfile: ChannelProfile[];
  channelProfile: {
    upi: upiField[];
    netBanking: netBankingField[];
    eWallet: eWalletField[];
  };
};

export type Tab1KeyNames = keyof Tab1State;
export type Tab2KeyNames = keyof Tab2State;

//=================Response Type=======================//
// type ChannelField = {
//   label: string;
//   //fieldId: number;
//   value: string;
// };
export type upiField = {
  upiId: string;
  mobile: string;
  isBusinessUpi?: boolean;
};
export type eWalletField = {
  app: string;
  mobile: string;
};
export type netBankingField = {
  bankName: string;
  accountNumber: string;
  ifsc: string;
  benefeciaryName: string;
};

export type channelProfile = {
  upi: upiField[] | null;
  netBanking: netBankingField[] | null;
  eWallet: eWalletField[] | null;
};

// type ChannelProfile = {
//   channel: Channel;
//   fields: ChannelField[];
// };
// export type ChannelProfile = {
//   type: "upi" | "netBanking" | "eWallet";
//   data: ChannelField[];
// };

export type MemberResponseDto = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  referralCode: string;
  telegramId?: string;
  id: number;
  enabled: boolean;
  // payinCommissionRate: number;
  // payoutCommissionRate: number;
  // topupCommissionRate: number;
  singlePayoutUpperLimit: number;
  singlePayoutLowerLimit: number;
  dailyTotalPayoutLimit: number;
  createdAt: string;
  updatedAt: string;
  // channelProfile: ChannelProfile[];
  channelProfile: {
    upi: upiField[];
    netBanking: netBankingField[];
    eWallet: eWalletField[];
  };
};

//==============Request Dto===================
// interface ProfileField {
//  fieldId: number;
//   value: string;
// }

// export interface ChannelProfileRequest {
//  // channelId: number;
//   profileFields: ProfileField[];
//   // Optional: If there might be other properties, include them here
// }

export type MemberRequestDto = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  referralCode?: string;
  telegramId?: string;
  enabled: boolean;
  // payinCommissionRate: number;
  // payoutCommissionRate: number;
  // topupCommissionRate: number;
  singlePayoutUpperLimit: number;
  singlePayoutLowerLimit: number;
  dailyTotalPayoutLimit: number;
  // channelProfile: ChannelProfile[];
  channelProfile: {
    upi: upiField[];
    netBanking: netBankingField[];
    eWallet: eWalletField[];
  };
  updateLoginCredentials: boolean;
  // updateWithdrawalCredentials?: boolean;
};
