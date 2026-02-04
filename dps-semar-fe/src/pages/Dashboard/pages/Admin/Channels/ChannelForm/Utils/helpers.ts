import {
  ChannelRequestDtoType,
  ChannelResponseType,
  FieldType,
  ProfileFieldRequest,
  Tab1State,
  Tab2State,
} from "./types";

export const mapEditDataToStateTab1 = (
  data: ChannelResponseType
): Tab1State => {
  return {
    channelName: data.name,
    channelLogo: data.logo,
    channelTag: data.tag,
    enabledForPayins: data.incomingStatus,
    enabledForPayouts: data.outgoingStatus,
  };
};

export const mapEditDataToStateTab2 = (
  data: ChannelResponseType
): Tab2State => {
  return {
    fields: data.profileFields.map((field) => {
      const temp: FieldType = {
        fieldLabel: field.label,
        fieldErrorMessage: field.errorMessage,
        fieldRegex: field.regex,
        isOptional: field.optional,
      };

      return temp;
    }),
  };
};

export const getPayload = (
  tab1State: Tab1State,
  tab2State: Tab2State,
  isForUpdate: boolean
): ChannelRequestDtoType => {
  return {
    name: tab1State.channelName,
    tag: tab1State.channelTag,
    logo: tab1State.channelLogo as File,
    incomingStatus: tab1State.enabledForPayins,
    outgoingStatus: tab1State.enabledForPayouts,
    profileFields: tab2State.fields.map((item) => {
      const temp: ProfileFieldRequest = {
        label: item.fieldLabel,
        errorMessage: item.fieldErrorMessage,
        regex: item.fieldRegex,
        optional: item.isOptional,
      };
      return temp;
    }),
  };
};
