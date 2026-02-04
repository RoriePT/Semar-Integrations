import {
  GatewayResponseType,
  ErrorsTab1,
  ErrorsTab2,
  ErrorsTab3,
  FieldType,
  Tab1State,
  Tab2State,
  Tab3State,
} from "./types";
import {
  mapEditDataToStateTab1,
  mapEditDataToStateTab2,
  mapEditDataToStateTab3,
} from "./helpers";

//===========Tab 1===========//

export const defaultStateTab1: Tab1State = {
  GatewayName: "",
  // channelTag: "",
  enabledForPayins: true,
  enabledForPayouts: true,
  GatewayLogo: "",
};

export const defaultErrorsTab1: ErrorsTab1 = {
  GatewayName: "",
  // channelTag: "",
};

export const getIntialStateTab1 = (editData: GatewayResponseType) => {
  if (editData) return mapEditDataToStateTab1(editData);
  else return defaultStateTab1;
};

//===========Tab 2===========//

export const defaultStateTab2: Tab2State = {
  fields: [
    {
      id: null,
      payinsEnabled: false,
      lowerLimitForPayins: null,
      upperLimitForPayins: null,
      payinFees: null,
      payoutsEnabled: false,
      lowerLimitForPayouts: null,
      upperLimitForPayouts: null,
      payoutFees: null,
    },
  ],
};

export const initializeErrorsForFields = (fields: FieldType[]): ErrorsTab2 => {
  const errors: ErrorsTab2 = {};
  fields.forEach((_, index) => {
    errors[index] = {
      channelName: "",
      lowerLimitForPayins: "",
      upperLimitForPayins: "",
      payinFees: "",
      lowerLimitForPayouts: "",
      upperLimitForPayouts: "",
      payoutFees: "",
    };
  });
  return errors;
};

export const getIntialStateTab2 = (editData: GatewayResponseType) => {
  if (editData) return mapEditDataToStateTab2(editData);
  else return defaultStateTab2;
};

export const defaultStateTab3: Tab3State = {
  uatMerchantKeys: [],
  prodMerchantKeys: [],
};

export const defaultErrorsTab3: ErrorsTab3 = {
  uatMerchantKeys: [],
  prodMerchantKeys: [],
};

export const getIntialStateTab3 = (
  editData: GatewayResponseType | null
): Tab3State => {
  if (editData) return mapEditDataToStateTab3(editData);
  return defaultStateTab3;
};
