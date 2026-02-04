import { Tab1KeyNames, Tab1State, Tab2State } from "./types";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateTab1 = (
  data: Tab1State,
  setError: (key: Tab1KeyNames, value: string) => void,
  isForEdit: boolean
): boolean => {
  let isVerified = true;

  const requiredKeys: Tab1KeyNames[] =
    isForEdit && !data.updateLogin
      ? ["firstName", "lastName"]
      : ["firstName", "lastName", "password", "email", "confirmPassword"];

  for (const key of requiredKeys) {
    if (!data[key] || (typeof data[key] === "string" && !data[key].trim())) {
      setError(key, "Please fill this field.");
      isVerified = false;
    }
  }

  if (!isForEdit || data.updateLogin) {
    if (data.email && !emailRegex.test(data.email)) {
      setError("email", "Invalid email address");
      isVerified = false;
    }

    if (data.password && data.password.length < 8) {
      setError("password", "Password should be of at least 8 characters");
      isVerified = false;
    }
  }

  if (data.confirmPassword !== data.password) {
    setError("confirmPassword", "Passwords don't match.");
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

export const validateTab2 = (data: Tab2State): boolean => {
  if (!data.upiIds || data.upiIds.length === 0) {
    return false;
  }
  return true;
};
