import { adminAllPayiouts } from "./Data/adminAllPayouts";
import { adminPayins } from "./Data/adminPayins";
import { adminPendingPayouts } from "./Data/adminPendingPayouts";
import {
  bulletinGrabbedPayouts,
  bulletinPayins,
  bulletinToBeGrabbed,
} from "./Data/bulletin";
import { memberAllPayins } from "./Data/memberAllPayins";
import { memberAllPayouts } from "./Data/memberAllPayouts";
import { merchantAllPayins } from "./Data/merchantAllPayins";
import { merchantAllPayouts } from "./Data/merchantAllPayouts";
import { payoutUsers } from "./Data/payoutUsers";

export const getAllPayinsForAdmin = () => {
  return adminPayins;
};

export const getPendingPayoutsForAdmin = () => {
  return adminPendingPayouts;
};

export const getAllPayoutsForAdmin = () => {
  return adminAllPayiouts;
};

export const getAllPayinsForMerchant = () => {
  return merchantAllPayins;
};

export const getAllPayoutsForMerchant = () => {
  return merchantAllPayouts;
};

export const getAllPayoutUsers = () => {
  return payoutUsers;
};

export const getAllPayinsForMember = () => {
  return memberAllPayins;
};

export const getAllPayoutsForMember = () => {
  return memberAllPayouts;
};

export const getMemberBulletinPayins = () => {
  return bulletinPayins;
};

export const getMemberBulletinPayoutsToBeGrabbed = () => {
  return bulletinToBeGrabbed;
};

export const getMemberBulletinGrabbedPayouts = () => {
  return bulletinGrabbedPayouts;
};
