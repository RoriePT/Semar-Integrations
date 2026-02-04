import {
  AdminResponseType,
  ErrorsTab1,
  ErrorsTab2,
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

export const getIntialStateTab1 = (editData: AdminResponseType) => {
  if (editData) return mapEditDataToStateTab1(editData);
  else return defaultStateTab1;
};

//===========Tab 2===========//

export const defaultStateTab2: Tab2State = {
  role: "",
  admins: false,
  users: false,
  verify: false,
  withdrawals: false,
  balances: false,
  system: false,
  channelsAndGateways: false,
};

export const defaultErrorsTab2: ErrorsTab2 = {
  role: "",
};

export const getIntialStateTab2 = (editData: AdminResponseType) => {
  if (editData) return mapEditDataToStateTab2(editData);
  else return defaultStateTab2;
};
