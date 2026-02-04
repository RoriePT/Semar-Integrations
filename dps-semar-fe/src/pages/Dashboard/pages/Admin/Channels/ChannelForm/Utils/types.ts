export type Tab1State = {
  channelName: string;
  channelTag: string;
  enabledForPayins: boolean;
  enabledForPayouts: boolean;
  channelLogo: File | string;
};

export type FieldType = {
  fieldLabel: string;
  isOptional: boolean;
  fieldRegex: string;
  fieldErrorMessage: string;
};

export type Tab2State = {
  fields: FieldType[];
};

export type ErrorsTab2 = {
  [index: number]: {
    fieldLabel: string;
    fieldRegex: string;
    fieldErrorMessage: string;
  };
};

export type ErrorsTab1 = {
  channelName: string;
  channelTag: string;
};

export type Tab1KeyNames = keyof Tab1State;
export type Tab2KeyNames = keyof Tab2State;
export type FieldTypeKeyNames = keyof FieldType;

// Define the type for ChannelProfileFieldDto
export type ProfileFieldRequest = {
  label: string;
  regex: string;
  errorMessage: string;
  optional: boolean;
};

// Define the type for CreateChannelDto
export type ChannelRequestDtoType = {
  name: string;
  tag: string;
  incomingStatus: boolean;
  outgoingStatus: boolean;
  logo?: File;
  profileFields: ProfileFieldRequest[];
};

// Define the type for profile fields
export type ProfileFieldResponse = {
  id: number;
  label: string;
  regex: string;
  errorMessage: string;
  optional: boolean;
};

// Define the type for the main object
export type ChannelResponseType = {
  id: number;
  name: string;
  tag: string;
  incomingStatus: boolean;
  outgoingStatus: boolean;
  logo: string;
  createdAt: string; // Consider using Date if handling date objects
  updatedAt: string; // Consider using Date if handling date objects
  profileFields: ProfileFieldResponse[];
};
