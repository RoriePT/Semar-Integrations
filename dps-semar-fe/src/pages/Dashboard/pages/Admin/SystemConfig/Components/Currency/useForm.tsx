import { useState } from "react";
import { useDefaultValues } from "../../../../../DefaultValue";
import { updateSystemConfigs } from "../../../../../../../api/systemConfig";
import { showNotification } from "@mantine/notifications";

type FormValues = {
  currency: string;
};

type FormErrors = {
  currency?: string;
};

const useForm = () => {
  const { systemDefaults, setReload } = useDefaultValues();

  const initialValues: FormValues = {
    currency: systemDefaults?.currency || "",
  };

  const [formState, setFormState] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (field: keyof FormValues, value: string) => {
    setFormState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleValidateForm = () => {
    const validationErrors: FormErrors = {};
    let isValid = true;

    if (!formState.currency) {
      validationErrors.currency = "Please select a currency.";
      isValid = false;
    }

    setErrors(validationErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    const isValid = handleValidateForm();
    if (isValid) {
      setLoading(true);
      try {
        await updateSystemConfigs({
          formName: "currency",
          formPayload: { currency: formState.currency },
        });
        showNotification({
          title: "Success",
          message: "Currency has been successfully updated!",
          color: "green",
        });
        setReload((prev) => !prev);
      } catch (error) {
        console.error("Error updating system configs:", error);
        showNotification({
          title: "Error",
          message: "Something went wrong while updating the data.",
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
