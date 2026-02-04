import {
  ErrorsTab1,
  SubMerchantResponseType,
  Tab1State,
  Tab2State,
} from "./types";
import { mapEditDataToStateTab1, mapEditDataToStateTab2 } from "./helpers";

//===========Tab 1===========//

export const defaultStateTab1: Tab1State = {
  firstName: "",
  lastName: "",
  email: "",
  contact: "",
  password: "",
  confirmPassword: "",
  enabled: true,
  updateLogin: false,
};

export const defaultErrorsTab1: ErrorsTab1 = {
  firstName: "",
  lastName: "",
  email: "",
  contact: "",
  password: "",
  confirmPassword: "",
};

export const getIntialStateTab1 = (editData: SubMerchantResponseType) => {
  if (editData) return mapEditDataToStateTab1(editData);
  else return defaultStateTab1;
};

//===========Tab 2===========//

export const defaultStateTab2: Tab2State = {
  submitWithdrawals: false,
  submitPayouts: false,
  withdrawalChannels: false,
};

export const getIntialStateTab2 = (editData: SubMerchantResponseType) => {
  if (editData) return mapEditDataToStateTab2(editData);
  else return defaultStateTab2;
};
