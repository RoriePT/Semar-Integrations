import { useState } from "react";
import { useDefaultValues } from "../../../../../DefaultValue";
import { updateSystemConfigs } from "../../../../../../../api/systemConfig";
import { notifications } from "@mantine/notifications";

type FormValues = {
  payoutSystemProfitRate: number;
  payinSystemProfitRate: number;
};

type FormErrors = {
  [key: string]: string;
};

const useForm = () => {
  const { systemDefaults, setReload } = useDefaultValues();

  const initialValues: FormValues = {
    payoutSystemProfitRate: systemDefaults?.payoutSystemProfitRate || 0,
    payinSystemProfitRate: systemDefaults?.payinSystemProfitRate || 0,
  };

  const [formState, setFormState] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors | any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleChange = (field: keyof FormValues, value: number) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setFormState((prev) => ({ ...prev, [field]: value }));
    return;
  };

  const handleValidateForm = () => {
    let isValid = true;
    const payinRate = formState?.payinSystemProfitRate;
    const payoutRate = formState?.payoutSystemProfitRate;

    // Empty field validations
    if (!payinRate || !payoutRate) {
      setErrors((prev) => ({
        ...prev,
        payinSystemProfitRate: payinRate ? "" : "Payin rate required",
        payoutSystemProfitRate: payoutRate ? "" : "Payout rate required",
      }));

      isValid = false;
    }

    // Range validation
    if (payinRate < 0 || payinRate > 100) {
      setErrors((prev) => ({
        ...prev,
        payinSystemProfitRate: "Payin rate must be between 0 to 100.",
      }));
      isValid = false;
    }

    // Range validation
    if (payoutRate < 0 || payoutRate > 100) {
      setErrors((prev) => ({
        ...prev,
        payoutSystemProfitRate: "Payout rate must be between 0 to 100.",
      }));
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async () => {
    const isValid = handleValidateForm();

    const formPayload = {
      payinSystemProfitRate: formState.payinSystemProfitRate,
      payoutSystemProfitRate: formState.payoutSystemProfitRate,
    };

    if (isValid) {
      setLoading(true);
      const res = await updateSystemConfigs({
        formName: "system-profit-rates",
        formPayload,
      });

      if (res) {
        notifications.show({
          title: "Success",
          message: "Profit rates are updated successfully.",
          color: "green",
        });
        setReload((prev) => !prev);
      }
      setLoading(false);
    }
  };

  return {
    handleChange,
    handleValidateForm,
    formState,
    openConfirm,
    setOpenConfirm,
    handleSubmit,
    errors,
    loading,
  };
};

export default useForm;
