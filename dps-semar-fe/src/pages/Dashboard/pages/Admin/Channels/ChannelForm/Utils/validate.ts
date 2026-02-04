import {
  FieldType,
  FieldTypeKeyNames,
  Tab1KeyNames,
  Tab1State,
  Tab2KeyNames,
  Tab2State,
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
    ["channelName", "channelTag"],
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
    if (!field.fieldLabel) {
      setError(index, "fieldLabel", `Please fill this field.`);
      flag = true;
    }
    if (!field.fieldRegex) {
      setError(index, "fieldRegex", `Please fill this field.`);
      flag = true;
    }
    if (!field.fieldErrorMessage) {
      setError(index, "fieldErrorMessage", `Please fill this field.`);
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
