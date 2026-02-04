import { useEffect, useState } from "react";
import { useDefaultValues } from "../../../../../DefaultValue";
import { updateSystemConfigs } from "../../../../../../../api/systemConfig";
import { showNotification } from "@mantine/notifications";

type FormValues = {
  payinCommissionRateForMember: number;
  payoutCommissionRateForMember: number;
  topupCommissionRateForMember: number;
  minimumPayoutAmountForMember: number;
  maximumPayoutAmountForMember: number;
  maximumDailyPayoutAmountForMember: number;
};

type FormErrors = {
  [key: string]: string;
};

const useForm = () => {
  const { systemDefaults, setReload } = useDefaultValues();

  const initialValues: FormValues = {
    payinCommissionRateForMember:
      systemDefaults?.payinCommissionRateForMember || 0,
    payoutCommissionRateForMember:
      systemDefaults?.payoutCommissionRateForMember || 0,
    topupCommissionRateForMember:
      systemDefaults?.topupCommissionRateForMember || 0,
    minimumPayoutAmountForMember:
      systemDefaults?.minimumPayoutAmountForMember || 0,
    maximumPayoutAmountForMember:
      systemDefaults?.maximumPayoutAmountForMember || 0,
    maximumDailyPayoutAmountForMember:
      systemDefaults?.maximumDailyPayoutAmountForMember || 0,
  };

  const [formState, setFormState] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleChange = (field: keyof FormValues, value: any) => {
    setFormState((prevState) => ({
      ...prevState,
      [field]: value || 0,
    }));

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[field];
      return newErrors;
    });
  };

  const handleValidateForm = () => {
    const validationErrors: FormErrors = {};
    let isValid = true;

    if (
      formState.payinCommissionRateForMember < 0 ||
      formState.payinCommissionRateForMember > 100
    ) {
      validationErrors.payinCommissionRateForMember =
        "Payin commission rate must be between 0 and 100.";
      isValid = false;
    }
    if (
      formState.payoutCommissionRateForMember < 0 ||
      formState.payoutCommissionRateForMember > 100
    ) {
      validationErrors.payoutCommissionRateForMember =
        "Payout commission rate must be between 0 and 100.";
      isValid = false;
    }
    if (
      formState.topupCommissionRateForMember < 0 ||
      formState.topupCommissionRateForMember > 100
    ) {
      validationErrors.topupCommissionRateForMember =
        "Top-up commission rate must be between 0 and 100.";
      isValid = false;
    }

    Object.keys(formState).forEach((key) => {
      const value = formState[key as keyof FormValues];
      if (value <= 0) {
        validationErrors[key] =
          "Field cannot be empty and must be greater than 0.";
        isValid = false;
      }
    });

    setErrors(validationErrors);
    return isValid;
  };

  // const handleSubmit = async () => {
  //   const isValid = handleValidateForm();

  //   const payload = {
  //     payinCommissionRateForMember: formState.payinCommissionRateForMember,
  //     payoutCommissionRateForMember: formState.payoutCommissionRateForMember,
  //     topupCommissionRateForMember: formState.topupCommissionRateForMember,
  //     minimumPayoutAmountForMember: formState.minimumPayoutAmountForMember,
  //     maximumPayoutAmountForMember: formState.maximumPayoutAmountForMember,
  //     maximumDailyPayoutAmountForMember:
  //       formState.maximumDailyPayoutAmountForMember,
  //   };

  //   if (isValid)
  //     await updateSystemConfigs({
  //       formName: "member-defaults",
  //       formPayload: payload,
  //     });
  //   setReload((prev) => !prev);
  // };

  // return { formState, handleChange, handleSubmit, errors };

  const handleSubmit = async () => {
    const isValid = handleValidateForm();

    if (isValid) {
      setLoading(true);
      const payload = {
        payinCommissionRateForMember: formState.payinCommissionRateForMember,
        payoutCommissionRateForMember: formState.payoutCommissionRateForMember,
        topupCommissionRateForMember: formState.topupCommissionRateForMember,
        minimumPayoutAmountForMember: formState.minimumPayoutAmountForMember,
        maximumPayoutAmountForMember: formState.maximumPayoutAmountForMember,
        maximumDailyPayoutAmountForMember:
          formState.maximumDailyPayoutAmountForMember,
      };

      try {
        await updateSystemConfigs({
          formName: "member-defaults",
          formPayload: payload,
        });

        showNotification({
          title: "Success",
          message: "Member Defaults updated successfully!",
          color: "green",
        });

        setReload((prev) => !prev);
      } catch (error) {
        console.error("Error saving changes:", error);
        showNotification({
          title: "Error",
          message: "Failed to update system configuration.",
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    formState,
    handleChange,
    handleSubmit,
    errors,
    openConfirm,
    setOpenConfirm,
    loading,
  };
};

export default useForm;
