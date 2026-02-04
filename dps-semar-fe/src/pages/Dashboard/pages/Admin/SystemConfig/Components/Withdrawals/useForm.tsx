import { useState } from "react";
import { useDefaultValues } from "../../../../../DefaultValue";
import { updateSystemConfigs } from "../../../../../../../api/systemConfig";
import { showNotification } from "@mantine/notifications";

type FormValues = {
  withdrawalRate: number;
  minWithdrawalAmount: number;
  maxWithdrawalAmount: number;
  frozenAmountThreshold: number;
};

type FormErrors = {
  [key: string]: string;
};

const useForm = () => {
  const { systemDefaults, setReload } = useDefaultValues();

  const initialValues: FormValues = {
    withdrawalRate: systemDefaults?.withdrawalRate || 0,
    minWithdrawalAmount: systemDefaults?.minWithdrawalAmount || 0,
    maxWithdrawalAmount: systemDefaults?.maxWithdrawalAmount || 0,
    frozenAmountThreshold: systemDefaults?.frozenAmountThreshold || 0,
  };

  const [formState, setFormState] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (field: keyof FormValues, value: number | string) => {
    const numericValue = typeof value === "string" ? parseFloat(value) : value;

    setFormState((prevState) => ({
      ...prevState,
      [field]: isNaN(numericValue) ? 0 : numericValue,
    }));

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[field];
      return newErrors;
    });
  };

  const validateField = (field: keyof FormValues, value: number) => {
    if (value === null || value === undefined || value <= 0) {
      return `Field cannot be empty and must be greater than 0.`;
    }

    if (["withdrawal", "Withdrawal"].includes(field)) {
      if (value < 0 || value > 100) {
        return `Field must be between 0 and 100.`;
      }
    }

    return "";
  };

  const handleValidateForm = () => {
    const validationErrors: FormErrors = {};
    let isValid = true;

    Object.keys(formState).forEach((key) => {
      const value = formState[key as keyof FormValues];
      const error = validateField(key as keyof FormValues, value);
      if (error) {
        validationErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(validationErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    const isValid = handleValidateForm();

    const payload = {
      withdrawalRate: formState.withdrawalRate,
      minWithdrawalAmount: formState.minWithdrawalAmount,
      maxWithdrawalAmount: formState.maxWithdrawalAmount,
      frozenAmountThreshold: formState.frozenAmountThreshold,
    };

    if (isValid) {
      setLoading(true);

      const result = await updateSystemConfigs({
        formName: "withdrawal-defaults",
        formPayload: payload,
      });

      if (!result.isError) {
        showNotification({
          title: "Success",
          message: "Withdrawal Defaults updated successfully!",
          color: "green",
        });
        setReload((prev) => !prev);
      }

      setLoading(false);
    }
  };

  return { formState, handleChange, handleSubmit, errors, loading };
};

export default useForm;
