import { Tab1KeyNames, Tab1State } from "./types";
import { Tab2KeyNames, Tab2State } from "./types";

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

  //  if ((isForEdit && data.updateWithdrawalCredentials) || !isForEdit) {
  //    requiredKeys.push("withdrawalPassword", "confirmWithdrawalPassword");
  //  }

  const fieldsAreRequired = validateRequiredFields(
    data,
    requiredKeys,
    setError
  );
  if (fieldsAreRequired) isVerified = false;

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

  if (data.telegramId && data.telegramId.length < 5) {
    setError("telegramId", "Telegram ID is too short.");
    isVerified = false;
  }

  return isVerified;
};

const validateNumberInRange = (
  value: number | undefined,
  min: number,
  max: number,
  setError: (key: string, value: string) => void,
  fieldName: string
) => {
  if (value === undefined || value < min || value > max) {
    setError(fieldName, `Value should be between ${min} and ${max}`);
    return false;
  }
  return true;
};

export const validateTab2 = (
  data: Tab2State,
  setError: (key: Tab2KeyNames, value: string) => void
) => {
  let isVerified = true;

  const requiredKeys: Tab2KeyNames[] = [
    // "payinCommission",
    // "payoutCommission",
    // "topupCommission",
    "minPayout",
    "maxPayout",
    "dailyPayoutLimit",
  ];

  for (const key of requiredKeys) {
    if (data[key] === undefined || data[key] === null) {
      setError(key, "This field is required.");
      isVerified = false;
    }
  }

  // isVerified =
  //   validateNumberInRange(
  //     data.payinCommission,
  //     0,
  //     100,
  //     setError,
  //     "payinCommission"
  //   ) && isVerified;

  // isVerified =
  //   validateNumberInRange(
  //     data.payoutCommission,
  //     0,
  //     100,
  //     setError,
  //     "payoutCommission"
  //   ) && isVerified;

  // isVerified =
  //   validateNumberInRange(
  //     data.topupCommission,
  //     0,
  //     100,
  //     setError,
  //     "topupCommission"
  //   ) && isVerified;

  // isVerified =
  //   validateNumberInRange(
  //     data.withdrawalRate,
  //     0,
  //     100,
  //     setError,
  //     "withdrawalRate"
  //   ) && isVerified;

  isVerified =
    validateNumberInRange(data.minPayout, 0, 10000000, setError, "minPayout") &&
    isVerified;

  isVerified =
    validateNumberInRange(data.maxPayout, 0, 10000000, setError, "maxPayout") &&
    isVerified;

  isVerified =
    validateNumberInRange(
      data.dailyPayoutLimit,
      0,
      10000000,
      setError,
      "dailyPayoutLimit"
    ) && isVerified;

  // isVerified =
  //   validateNumberInRange(
  //     data.minWithdrawalAmount,
  //     0,
  //     10000000,
  //     setError,
  //     "minWithdrawalAmount"
  //   ) && isVerified;

  // isVerified =
  //   validateNumberInRange(
  //     data.maxWithdrawalAmount,
  //     0,
  //     10000000,
  //     setError,
  //     "maxWithdrawal"
  //   ) && isVerified;

  return isVerified;
};
