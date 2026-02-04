import { useEffect, useState } from "react";
import { useDefaultValues } from "../../../../../DefaultValue";
import { updateSystemConfigs } from "../../../../../../../api/systemConfig";
import { showNotification } from "@mantine/notifications";

const useForm = (payinGateways, payoutGateways, withdrawalGateways) => {
  const { systemDefaults, gateways, setReload } = useDefaultValues();

  const initialValues = {
    payinTimeout: 0,
    payoutTimeout: 0,
    defaultPayinGateway: null,
    defaultPayoutGateway: null,
    defaultWithdrawalGateway: null,
  };

  type FormValues = {
    payinTimeout: number;
    payoutTimeout: number;
    defaultPayinGateway: object;
    defaultPayoutGateway: object;
    defaultWithdrawalGateway: object;
  };

  type FormErrors = {
    payinTimeout?: string;
    payoutTimeout?: string;
    defaultPayinGateway?: string;
    defaultPayoutGateway?: string;
    defaultWithdrawalGateway?: string;
  };

  const [formState, setFormState] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (field: keyof FormValues, value: any) => {
    setFormState((prevState) => ({
      ...prevState,
      [field]: value,
    }));

    if (value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: undefined,
      }));
    }
  };

  const setInitialValues = (defaults: any) => {
    if (defaults) {
      setFormState({
        payinTimeout: defaults.payinTimeout,
        payoutTimeout: defaults.payoutTimeout,
        defaultPayinGateway: defaults.defaultPayinGateway,
        defaultPayoutGateway: defaults.defaultPayoutGateway,
        defaultWithdrawalGateway: defaults.defaultWithdrawalGateway,
      });
    }
  };

  const handleValidateForm = () => {
    const validationErrors: FormErrors = {};
    let isValid = true;

    const timeoutFields: (keyof FormValues)[] = [
      "payinTimeout",
      "payoutTimeout",
    ];

    timeoutFields.forEach((field) => {
      const value = formState[field];
      if (typeof value === "number" && value <= 0) {
        validationErrors[field] = " Field cannot be 0, negative, or empty.";
        isValid = false;
      }
    });

    setErrors(validationErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    const isValid = handleValidateForm();

    const payinGatewayObject = payinGateways.reduce((acc, gateway, index) => {
      acc[index + 1] = gateway;
      return acc;
    }, {});

    const payoutGatewayObject = payoutGateways.reduce((acc, gateway, index) => {
      acc[index + 1] = gateway;
      return acc;
    }, {});

    const withdrawalGatewayObject = withdrawalGateways.reduce(
      (acc, gateway, index) => {
        acc[index + 1] = gateway;
        return acc;
      },
      {}
    );

    if (isValid) {
      setLoading(true);
      try {
        const payload = {
          defaultPayinGateway: payinGatewayObject,
          defaultPayoutGateway: payoutGatewayObject,
          defaultWithdrawalGateway: withdrawalGatewayObject,
          payinTimeout: formState.payinTimeout,
          payoutTimeout: formState.payoutTimeout,
        };

        await updateSystemConfigs({
          formName: "gateways-and-timeouts",
          formPayload: payload,
        });
        setReload((prev) => !prev);
        showNotification({
          title: "Success",
          message: "Gateway and Timeout have been successfully updated!",
          color: "green",
        });
      } catch (error) {
        console.error("Error saving changes:", error);
        showNotification({
          title: "Error",
          message: "Something went wrong while saving the configurations.",
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    setInitialValues(systemDefaults);
  }, [systemDefaults]);

  return {
    formState,
    handleChange,
    errors,
    setInitialValues,
    handleSubmit,
    gateways,
    loading,
  };
};

export default useForm;
