import {
  FieldType,
  FieldTypeKeyNames,
  Tab1KeyNames,
  Tab1State,
  Tab3State,
  Tab3KeyNames,
  Tab2KeyNames,
  Tab2State,
  Key,
  ErrorsTab3,
} from "./types";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateRequiredFieldsTab1 = (
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
  const fieldsAreRequired = validateRequiredFieldsTab1(
    data,
    ["GatewayName"],
    setError
  );

  if (fieldsAreRequired) return false;

  return true;
};

const validateRequiredFieldsTab2 = (
  fields: FieldType[],
  setError: (index: number, key: FieldTypeKeyNames, value: string) => void
) => {
  let flag = false;

  fields.forEach((field, index) => {
    if (!field.id) {
      setError(index, "id", `Please select a channel.`);
      flag = true;
    }
    if (
      field.lowerLimitForPayins === null ||
      field.lowerLimitForPayins === undefined
    ) {
      setError(index, "lowerLimitForPayins", `Please fill this field.`);
      flag = true;
    }
    if (field.lowerLimitForPayins < 0) {
      setError(index, "lowerLimitForPayins", `Field value cannot be negative.`);
      flag = true;
    }
    if (
      field.upperLimitForPayins === null ||
      field.upperLimitForPayins === undefined
    ) {
      setError(index, "upperLimitForPayins", `Please fill this field.`);
      flag = true;
    }
    if (field.upperLimitForPayins < 0) {
      setError(index, "upperLimitForPayins", `Field value cannot be negative.`);
      flag = true;
    }
    if (field.payinFees === null || field.payinFees === undefined) {
      setError(index, "payinFees", `Please fill this field.`);
      flag = true;
    }
    if (field.payinFees < 0) {
      setError(index, "payinFees", `Field value cannot be negative.`);
      flag = true;
    }
    if (
      field.lowerLimitForPayouts === null ||
      field.lowerLimitForPayouts === undefined
    ) {
      setError(index, "lowerLimitForPayouts", `Please fill this field.`);
      flag = true;
    }
    if (field.lowerLimitForPayouts < 0) {
      setError(
        index,
        "lowerLimitForPayouts",
        `Field value cannot be negative.`
      );
      flag = true;
    }
    if (
      field.upperLimitForPayouts === null ||
      field.upperLimitForPayouts === undefined
    ) {
      setError(index, "upperLimitForPayouts", `Please fill this field.`);
      flag = true;
    }
    if (field.upperLimitForPayouts < 0) {
      setError(
        index,
        "upperLimitForPayouts",
        `Field value cannot be negative.`
      );
      flag = true;
    }
    if (field.payoutFees === null || field.payoutFees === undefined) {
      setError(index, "payoutFees", `Please fill this field.`);
      flag = true;
    }
    if (field.payoutFees < 0) {
      setError(index, "payoutFees", `Field value cannot be negative.`);
      flag = true;
    }
  });
  return flag;
};

export const validateTab2 = (
  data: Tab2State,
  setError: (index: number, key: FieldTypeKeyNames, value: string) => void
) => {
  const fieldsAreRequired = validateRequiredFieldsTab2(data.fields, setError);
  if (fieldsAreRequired) return false;

  return true;
};

export const validateTab3 = (
  tab3State: Tab3State,
  setError: (key: keyof ErrorsTab3, value: string) => void
): boolean => {
  const { uatMerchantKeys, prodMerchantKeys } = tab3State;
  let isValid = true;

  uatMerchantKeys.forEach((key, index) => {
    if (!key.value.trim()) {
      setError("uatMerchantKeys", `Field cannot be empty`);

      isValid = false;
    }
  });

  prodMerchantKeys.forEach((key, index) => {
    if (!key.value.trim()) {
      setError("prodMerchantKeys", `Field  cannot be empty`);
      isValid = false;
    }
  });

  return isValid;
};
