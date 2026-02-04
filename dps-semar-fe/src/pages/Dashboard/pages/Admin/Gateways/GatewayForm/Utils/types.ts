export type Tab1State = {
  GatewayName: string;
  enabledForPayins: boolean;
  enabledForPayouts: boolean;
  GatewayLogo: string;
};

export type FieldType = {
  id: number;
  payinsEnabled: boolean;
  lowerLimitForPayins: number;
  upperLimitForPayins: number;
  payinFees: number;
  payoutsEnabled: boolean;
  lowerLimitForPayouts: number;
  upperLimitForPayouts: number;
  payoutFees: number;
};

export type Tab2State = {
  fields: FieldType[];
};

export type ErrorsTab2 = {
  [index: number]: {
    channelName: string;
    lowerLimitForPayins: string;
    upperLimitForPayins: string;
    payinFees: string;
    lowerLimitForPayouts: string;
    upperLimitForPayouts: string;
    payoutFees: string;
  };
};

export type ErrorsTab1 = {
  GatewayName: string;
 // channelTag: string;
};

export type Tab1KeyNames = keyof Tab1State;
export type Tab2KeyNames = keyof Tab2State;
export type Tab3KeyNames = keyof Tab3State;
export type FieldTypeKeyNames = keyof FieldType;

// Define the type for ChannelProfileFieldDto
export type ChannelFieldRequest = {
  id: number;
  payinsEnabled: boolean;
  lowerLimitForPayins: number;
  upperLimitForPayins: number;
  payinFees: number;
  payoutsEnabled: boolean;
  lowerLimitForPayouts: number;
  upperLimitForPayouts: number;
  payoutFees: number;
};

// Define the type for CreateChannelDto
export type GatewayRequestDtoType = {
  name: string;
  //tag: string;
  incomingStatus: boolean;
  outgoingStatus: boolean;
  logo?: string;
  channels: ChannelFieldRequest[];
  uatMerchantKeys: Key[];
  prodMerchantKeys: Key[];
};

// Define the type for profile fields
export type ChannelFieldResponse = {
  id: number;
  channelName: string;
  payinsEnabled: boolean;
  lowerLimitForPayins: number;
  upperLimitForPayins: number;
  payinFees: number;
  payoutsEnabled: boolean;
  lowerLimitForPayouts: number;
  upperLimitForPayouts: number;
  payoutFees: number;
};


export type GatewayResponseType = {
  id: number;
  name: string;
  incomingStatus: boolean;
  outgoingStatus: boolean;
  logo: string;
  createdAt: string; // Consider using Date if handling date objects
  updatedAt: string; // Consider using Date if handling date objects
  gatewayToChannel: ChannelFieldResponse[];
  uatMerchantKeys: Key[];
  prodMerchantKeys: Key[];
};


export interface Key {
  label: string;
  value: string;
}

export interface Tab3State {
  uatMerchantKeys: Key[];
  prodMerchantKeys: Key[];
}

export interface ErrorsTab3 {
  uatMerchantKeys?: string[];
  prodMerchantKeys?: string[];
}
