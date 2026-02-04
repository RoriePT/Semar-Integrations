import { adminPayins } from "./Data/adminPayins";
import { adminPayouts } from "./Data/adminPayouts";
import { adminTopups } from "./Data/adminTopups";
import { adminWithdrawals } from "./Data/adminWithdrawals";
import { memberPayins } from "./Data/memberPayins";
import { memberPayouts } from "./Data/memberPayouts";
import { memberTopups } from "./Data/memberTopups";
import { merchantPayins } from "./Data/merchantPayins";
import { merchantPayouts } from "./Data/merchantPayouts";
import { userWithdrawals } from "./Data/userWithdrawals";

export const getPayinOrderDetailsForAdmin = (orderID) => {
  return adminPayins.find((details) => details.id === orderID);
};

export const getPayoutOrderDetailsForAdmin = (orderID) => {
  return adminPayouts.find((details) => details.id === orderID);
};

export const getPayinOrderDetailsForMerchant = (orderID) => {
  return merchantPayins.find((details) => details.id === orderID);
};

export const getPayoutOrderDetailsForMerchant = (orderID) => {
  return merchantPayouts.find((details) => details.id === orderID);
};

export const getPayinOrderDetailsForMember = (orderID) => {
  return memberPayins.find((details) => details.id === orderID);
};

export const getPayoutOrderDetailsForMember = (orderID) => {
  return memberPayouts.find((details) => details.id === orderID);
};

export const getWithdrawalOrderDetailsForAdmin = (orderID) => {
  return adminWithdrawals.find((details) => details.id === orderID);
};

export const getWithdrawalOrderDetailsForUser = (orderID) => {
  return userWithdrawals.find((details) => details.id === orderID);
};

export const getTopupOrderDetailsForAdmin = (orderID) => {
  return adminTopups.find((details) => details.id === orderID);
};

export const getTopupOrderDetailsForMember = (orderID) => {
  return memberTopups.find((details) => details.id === orderID);
};

