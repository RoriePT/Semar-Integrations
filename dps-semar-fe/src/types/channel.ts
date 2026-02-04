export interface ProfileField {
  id: number;
  label: string;
  regex: string;
  errorMessage: string;
  optional: boolean;
}

export interface Channel {
  id: number;
  name: string;
  tag: string;
  incomingStatus: boolean;
  outgoingStatus: boolean;
  logo: string;
  createdAt: string;
  updatedAt: string;
  profileFields: ProfileField[];
}

// Define the type for the array of channels
export type Channels = Channel[];

export interface UpiChannel {
  upiId: string;
  mobile: string;
  channelIndex?: number;
}

export interface EWallet {
  app: string;
  mobile: string;
  channelIndex?: number;
}

export interface NetBanking {
  bankName: string;
  ifsc: string;
  benificiaryName: string;
  accountNumber: string;
  channelIndex?: number;
}

export interface ChannelProfile {
  upi: UpiChannel[] | null;
  eWallet: EWallet[] | null;
  netBanking: NetBanking[] | null;
}

type PaymentMethod = "upi" | "e_wallet" | "net_banking";
export type PaymentChannels = PaymentMethod[];
