import { Tab1KeyNames, Tab1State, Tab2KeyNames, Tab2State } from "./types";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateRequiredFields = (
  data: any,
  requiredKeys: string[],
  setError: (key: string, value: string) => void
) => {
  let flag = false;
  for (const iterator of requiredKeys) {
    if (!data[iterator]) {
      setError(iterator, `Please fill this field.`);
      flag = true;
    }
  }
  return flag;
};

export const validateTab1 = (
  data: Tab1State,
  setError: (key: Tab1KeyNames, value: string) => void,
  isForEdit: boolean
) => {
  let isVerified = true;

  const requiredKeys: Tab1KeyNames[] =
    isForEdit && !data.updateLogin
      ? ["firstName", "lastName"]
      : ["firstName", "lastName", "password", "email", "confirmPassword"];

  const fieldsAreRequired = validateRequiredFields(
    data,
    requiredKeys,
    setError
  );
  if (fieldsAreRequired) isVerified = false;

  if (data?.agent?.id) {
    if (data?.agentPayinCommissionRate < 0) {
      setError(
        "agentPayinCommissionRate",
        "Agent payin commission rate is required!"
      );
      isVerified = false;
    }

    if (data?.agentPayoutCommissionRate < 0) {
      setError(
        "agentPayoutCommissionRate",
        "Agent payout commission rate is required!"
      );
      isVerified = false;
    }
  }

  if (!isForEdit || data.updateLogin) {
    if (data.email && !emailRegex.test(data.email)) {
      setError("email", "Invalid email address");

      isVerified = false;
    }

    if (data.password && data.password.length < 8) {
      setError("password", "Password should be of atleast 8 characters");
      isVerified = false;
    }
  }

  if (data.confirmPassword !== data.password) {
    setError("confirmPassword", "Passwords dont match.");
    isVerified = false;
  }

  if (
    data.contact &&
    (data.contact?.toString().length < 10 ||
      data.contact?.toString().length > 10)
  ) {
    setError("contact", "Invalid phone number.");
    isVerified = false;
  }

  return isVerified;
};

export const validateTab2 = (
  data: Tab2State,
  setError: (key: Tab2KeyNames, value: string) => void,
  isForEdit: boolean
) => {
  let isVerified = true;

  const requiredKeys: Tab2KeyNames[] =
    isForEdit && !data.updateWithdrawal
      ? ["withdrawalRate", "minWithdrawalAmount", "maxWithdrawalAmount"]
      : [
          "withdrawalRate",
          "minWithdrawalAmount",
          "maxWithdrawalAmount",
          "withdrawalPassword",
          "confirmWithdrawalPassword",
        ];

  const fieldsAreRequired = validateRequiredFields(
    data,
    requiredKeys,
    setError
  );

  if (fieldsAreRequired) isVerified = false;

  if (!isForEdit || data.updateWithdrawal) {
    if (data.withdrawalPassword && data.withdrawalPassword.length < 8) {
      setError(
        "withdrawalPassword",
        "Password should be of atleast 8 characters"
      );

      isVerified = false;
    }
  }

  if (data.withdrawalPassword !== data.confirmWithdrawalPassword) {
    setError("confirmWithdrawalPassword", "Passwords dont match.");
    isVerified = false;
  }

  return isVerified;
};
