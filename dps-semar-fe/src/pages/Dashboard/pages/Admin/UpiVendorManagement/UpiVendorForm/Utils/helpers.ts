import { Tab1State, Tab2State } from "./types";

export const getPayload = (
  tab1State: Tab1State,
  tab2State: Tab2State,
  isForUpdate: boolean
): any => {
  const name = `${tab1State.firstName} ${tab1State.lastName}`.trim();

  return {
    email: tab1State.email,
    password: tab1State.password,
    firstName: tab1State.firstName,
    lastName: tab1State.lastName,
    name: name,
    phone: tab1State.contact,
    enabled: tab1State.enabled,
    commissionRate:
      tab2State.commissionRate !== undefined &&
      tab2State.commissionRate !== null &&
      `${tab2State.commissionRate}` !== ""
        ? parseFloat(`${tab2State.commissionRate}`)
        : undefined,
    settlementUpiId: tab2State.settlementUpiId || "",
    updateLoginCredentials: isForUpdate ? tab1State.updateLogin : true,
    upiIds:
      tab2State.upiIds?.map((upi) => ({
        title: upi.title || "",
        upiId: upi.upiId,
        isBusinessUpi: true, // Always true for UPI vendor
        enabled: upi.enabled !== undefined ? upi.enabled : true,
        tr: upi.tr || "",
      })) || [],
  };
};
