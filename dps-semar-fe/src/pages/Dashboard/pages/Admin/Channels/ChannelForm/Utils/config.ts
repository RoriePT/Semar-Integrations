import {
  ChannelResponseType,
  ErrorsTab1,
  ErrorsTab2,
  FieldType,
  Tab1State,
  Tab2State,
} from "./types";
import { mapEditDataToStateTab1, mapEditDataToStateTab2 } from "./helpers";

//===========Tab 1===========//

export const defaultStateTab1: Tab1State = {
  channelName: "",
  channelTag: "",
  enabledForPayins: true,
  enabledForPayouts: true,
  channelLogo: "",
};

export const defaultErrorsTab1: ErrorsTab1 = {
  channelName: "",
  channelTag: "",
};

export const getIntialStateTab1 = (editData: ChannelResponseType) => {
  if (editData) return mapEditDataToStateTab1(editData);
  else return defaultStateTab1;
};

//===========Tab 2===========//

export const defaultStateTab2: Tab2State = {
  fields: [
    {
      fieldLabel: "",
      isOptional: false,
      fieldRegex: "",
      fieldErrorMessage: "",
    },
  ],
};

export const initializeErrorsForFields = (fields: FieldType[]): ErrorsTab2 => {
  const errors: ErrorsTab2 = {};
  fields.forEach((_, index) => {
    errors[index] = {
      fieldLabel: "",
      fieldRegex: "",
      fieldErrorMessage: "",
    };
  });
  return errors;
};

export const getIntialStateTab2 = (editData: ChannelResponseType) => {
  if (editData) return mapEditDataToStateTab2(editData);
  else return defaultStateTab2;
};
