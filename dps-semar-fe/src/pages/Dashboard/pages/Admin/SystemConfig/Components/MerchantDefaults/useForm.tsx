import { useState } from "react";
import { useDefaultValues } from "../../../../../DefaultValue";
import { updateSystemConfigs } from "../../../../../../../api/systemConfig";
import { showNotification } from "@mantine/notifications";

type FormValues = {
  payinServiceRateForMerchant: {
    mode: string;
    absoluteAmount: number;
    percentageAmount: number;
  };
  payoutServiceRateForMerchant: {
    mode: string;
    absoluteAmount: number;
    percentageAmount: number;
  };
  minimumPayoutAmountForMerchant: number;
  maximumPayoutAmountForMerchant: number;
  endUserPayinLimit: number;
};

type FormErrors = {
  [key: string]: string;
};

const useForm = () => {
  const { systemDefaults, setReload } = useDefaultValues();

  const initialValues: FormValues = {
    payinServiceRateForMerchant:
      systemDefaults?.payinServiceRateForMerchant || {
        mode: "PERCENTAGE",
        absoluteAmount: null,
        percentageAmount: 0.2,
      },
    payoutServiceRateForMerchant:
      systemDefaults?.payoutServiceRateForMerchant || {
        mode: "PERCENTAGE",
        absoluteAmount: null,
        percentageAmount: 0.2,
      },
    minimumPayoutAmountForMerchant:
      systemDefaults?.minimumPayoutAmountForMerchant || 0,
    maximumPayoutAmountForMerchant:
      systemDefaults?.maximumPayoutAmountForMerchant || 0,
    endUserPayinLimit: systemDefaults?.endUserPayinLimit || 0,
  };

  const [formState, setFormState] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors | any>({});
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (field: keyof FormValues, value: any) => {
    if (
      field === "payinServiceRateForMerchant" ||
      field === "payoutServiceRateForMerchant"
    ) {
      if (field === "payinServiceRateForMerchant") {
        setErrors((prev) => ({
          ...prev,
          payin: {
            mode: "",
            absoluteAmount: "",
            percentageAmount: "",
          },
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          payout: {
            mode: "",
            absoluteAmount: "",
            percentageAmount: "",
          },
        }));
      }

      setFormState((prevState) => ({
        ...prevState,
        [field]: value,
      }));

      return;
    }

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

  const validateMinAndMaxValues = () => {
    let isValid = true;
    const valuesToChechk = [
      "minimumPayoutAmountForMerchant",
      "maximumPayoutAmountForMerchant",
      "endUserPayinLimit",
    ];

    for (const element of valuesToChechk) {
      if (!formState[element] || formState[element] < 1) {
        setErrors((prev) => ({
          ...prev,
          [element]: "This field should not be empty or less than 1.",
        }));
        isValid = false;
      }
    }
    return isValid;
  };

  const handleValidateForm = () => {
    const validationErrors: FormErrors = {};
    let isValid = true;

    setErrors(validationErrors);

    isValid = validateMinAndMaxValues();

    if (
      !formState.payinServiceRateForMerchant ||
      !formState.payinServiceRateForMerchant.mode
    ) {
      setErrors((prev) => ({
        ...prev,
        payin: {
          // mode: formState.payinServiceRateForMerchant.mode,
          mode: "Kindly select a mode.",
          absoluteAmount: "",
          percentageAmount: "",
        },
      }));
      isValid = false;
    } else if (formState.payinServiceRateForMerchant.mode === "PERCENTAGE") {
      if (
        !formState.payinServiceRateForMerchant.percentageAmount ||
        formState.payinServiceRateForMerchant.percentageAmount <= 0
      ) {
        setErrors((prev) => ({
          ...prev,
          payin: {
            // mode: formState.payinServiceRateForMerchant.mode,
            mode: "",
            absoluteAmount: "",
            percentageAmount: "Valid percentage is required.",
          },
        }));
        isValid = false;
      }
    }

    if (formState.payinServiceRateForMerchant.mode === "ABSOLUTE") {
      if (
        !formState.payinServiceRateForMerchant.absoluteAmount ||
        formState.payinServiceRateForMerchant.absoluteAmount <= 0
      ) {
        setErrors((prev) => ({
          ...prev,
          payin: {
            mode: "",
            percentageAmount: "",
            absoluteAmount: "Valid amount is required.",
          },
        }));
        isValid = false;
      }
    }

    if (formState.payinServiceRateForMerchant.mode === "COMBINATION") {
      if (
        !formState.payinServiceRateForMerchant.absoluteAmount ||
        formState.payinServiceRateForMerchant.absoluteAmount <= 0
      ) {
        setErrors((prev) => ({
          ...prev,
          payin: {
            mode: "",
            absoluteAmount: "Valid amount is required.",
            percentageAmount: "",
          },
        }));
        isValid = false;
      }

      if (
        !formState.payinServiceRateForMerchant.percentageAmount ||
        formState.payinServiceRateForMerchant.percentageAmount <= 0
      ) {
        setErrors((prev) => ({
          ...prev,
          payin: {
            mode:"",
            absoluteAmount: "",
            percentageAmount: "Valid percentage is required.",
          },
        }));
        isValid = false;
      }

      if (
        (!formState.payinServiceRateForMerchant.absoluteAmount ||
          formState.payinServiceRateForMerchant.absoluteAmount <= 0) &&
        (!formState.payinServiceRateForMerchant.percentageAmount ||
          formState.payinServiceRateForMerchant.percentageAmount <= 0)
      ) {
        setErrors((prev) => ({
          ...prev,
          payin: {
            mode: "",
            absoluteAmount: "Valid  amount is required.",
            percentageAmount: "Valid percentage is required.",
          },
        }));
        isValid = false;
      }
    }

     if (
       !formState.payoutServiceRateForMerchant ||
       !formState.payoutServiceRateForMerchant.mode
     ) {
       setErrors((prev) => ({
         ...prev,
         payout: {
           // mode: formState.payinServiceRateForMerchant.mode,
           mode: "Kindly select a mode.",
           absoluteAmount: "",
           percentageAmount: "",
         },
       }));
       isValid = false;
     } else if (formState.payoutServiceRateForMerchant.mode === "PERCENTAGE") {
       if (
         !formState.payoutServiceRateForMerchant.percentageAmount ||
         formState.payoutServiceRateForMerchant.percentageAmount <= 0
       ) {
         setErrors((prev) => ({
           ...prev,
           payout: {
             mode: "",
             absoluteAmount: "",
             percentageAmount: "Valid percentage  is required.",
           },
         }));
         isValid = false;
       }
     }

    if (formState.payoutServiceRateForMerchant.mode === "ABSOLUTE") {
      if (
        !formState.payoutServiceRateForMerchant.absoluteAmount ||
        formState.payoutServiceRateForMerchant.absoluteAmount <= 0
      ) {
        setErrors((prev) => ({
          ...prev,
          payout: {
            mode:"",
            percentageAmount: "",
            absoluteAmount: "Valid amount is required.",
          },
        }));
        isValid = false;
      }
    }

    if (formState.payoutServiceRateForMerchant.mode === "COMBINATION") {
      if (
        !formState.payoutServiceRateForMerchant.absoluteAmount ||
        formState.payoutServiceRateForMerchant.absoluteAmount <= 0
      ) {
        setErrors((prev) => ({
          ...prev,
          payout: {
            mode: "",
            absoluteAmount: "Valid amount is required.",
            percentageAmount: "",
          },
        }));
        isValid = false;
      }
      if (
        !formState.payoutServiceRateForMerchant.percentageAmount ||
        formState.payoutServiceRateForMerchant.percentageAmount <= 0
      ) {
        setErrors((prev) => ({
          ...prev,
          payout: {
            mode: "",
            absoluteAmount: "",
            percentageAmount: "Valid percentage  is required.",
          },
        }));
        isValid = false;
      }
      if (
        (!formState.payoutServiceRateForMerchant.absoluteAmount ||
          formState.payoutServiceRateForMerchant.absoluteAmount <= 0) &&
        (!formState.payoutServiceRateForMerchant.percentageAmount ||
          formState.payoutServiceRateForMerchant.percentageAmount <= 0)
      ) {
        setErrors((prev) => ({
          ...prev,
          payout: {
            mode: "",
            absoluteAmount: "Valid  amount is required.",
            percentageAmount: "Valid percentage  is required.",
          },
        }));
        isValid = false;
      }
    }

    return isValid;
  };

  const handleSubmit = async () => {
    const isValid = handleValidateForm();

    const payload = {
      payinServiceRateForMerchant: formState.payinServiceRateForMerchant,
      payoutServiceRateForMerchant: formState.payoutServiceRateForMerchant,
      minimumPayoutAmountForMerchant: formState.maximumPayoutAmountForMerchant,
      maximumPayoutAmountForMerchant: formState.maximumPayoutAmountForMerchant,
      endUserPayinLimit: formState.endUserPayinLimit,
    };

    if (isValid) {
      setLoading(true);
      try {
        await updateSystemConfigs({
          formName: "merchant-defaults",
          formPayload: payload,
        });

        showNotification({
          title: "Success",
          message: "Merchant Defaults updated successfully!",
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

  return { formState, handleChange, handleSubmit, errors, loading };
};

export default useForm;
