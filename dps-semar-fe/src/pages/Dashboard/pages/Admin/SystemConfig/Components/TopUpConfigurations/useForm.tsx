import { useState } from "react";
import { useDefaultValues } from "../../../../../DefaultValue";
import { updateSystemConfigs } from "../../../../../../../api/systemConfig";
import { showNotification } from "@mantine/notifications";
import { ChannelProfile } from "../../../../../../../types/channel";

type FormValues = {
  topupThreshold: number;
  topupAmount: number;
  topupServiceRate: number;
  // defaultTopupChannels: {
  //   channel: any;
  //   fields: any[];
  // }[];
  channelProfile: ChannelProfile;
};

type FormErrors = {
  topupThreshold?: string;
  topupAmount?: string;
  topupServiceRate?: string;
};

const useForm = () => {
  const { systemDefaults, setReload } = useDefaultValues();
  const initialValues: FormValues = {
    topupThreshold: systemDefaults?.topupThreshold || 0,
    topupAmount: systemDefaults?.topupAmount || 0,
    topupServiceRate: systemDefaults?.topupServiceRate || 0,
    channelProfile: systemDefaults?.channelProfile || {
      upi: [],
      netBanking: [],
      eWallet: [],
    },
  };

  const [formState, setFormState] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (fieldName, value) => {
    if (fieldName === "channelProfile") {
      setFormState((prevState) => ({
        ...prevState,
        channelProfile: {
          ...prevState.channelProfile,
          ...value,
        },
      }));
    } else {
      setFormState((prevState) => ({
        ...prevState,
        [fieldName]: value,
      }));
    }

    if (value && errors[fieldName]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: undefined,
      }));
    }
  };

  const handleValidateForm = () => {
    const validationErrors: FormErrors = {};
    let isValid = true;

    if (formState.topupThreshold <= 0) {
      validationErrors.topupThreshold =
        "Field must not be empty and must be greater than 0.";
      isValid = false;
    }

    if (formState.topupAmount <= 0) {
      validationErrors.topupAmount =
        "Field must not be empty and must be greater than 0.";
      isValid = false;
    }

    setErrors(validationErrors);
    return isValid;
  };

  const formatChannelsForPayload = (channels) => {
    return channels?.map((item) => ({
      channelId: item.channel.id,
      profileFields: item.fields.map((field) => ({
        fieldId: field.fieldId,
        value: field.value,
      })),
    }));
  };

  const handleSubmit = async () => {
    const isValid = handleValidateForm();

    if (isValid) {
      setLoading(true);
      try {
        await updateSystemConfigs({
          formName: "topup-config",
          formPayload: {
            topupThreshold: formState.topupThreshold,
            topupAmount: formState.topupAmount,
            topupServiceRate: formState?.topupServiceRate || 0,
            channelProfile: {
              upi: formState.channelProfile.upi || [],
              netBanking: formState.channelProfile.netBanking || [],
              eWallet: formState.channelProfile.eWallet || [],
            },
          },
        });

        showNotification({
          title: "Success",
          message: "Top-up configuration updated successfully!",
          color: "green",
        });

        setReload((prev) => !prev);
      } catch (error) {
        console.error("Error saving changes:", error);

        showNotification({
          title: "Error",
          message: "Failed to update top-up configuration.",
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
