import { Box, Button, Flex, TextInput } from "@mantine/core";
import React, { useEffect, useState } from "react";
import MobileNumberInput from "../../Common/ChangePassword/MobileNumberInput/Index";

interface EWalletFormData {
  app: string;
  mobile: string;
  email: string;
  channelIndex?: number;
  type?: string;
  beneficiaryName?: string;
}

interface EWalletModalProps {
  opened: boolean;
  handlers: { close: () => void; open: () => void };
  handleSubmit: (data: EWalletFormData) => void;
  initialData?: EWalletFormData;
  channelIndex: number;
  setChannelIndex?: (index: number) => void;
}

const EWalletModal: React.FC<EWalletModalProps> = ({
  opened,
  handlers,
  handleSubmit,
  initialData = { app: "", mobile: "", email: "", beneficiaryName: "" },
  setChannelIndex,
  channelIndex,
}) => {
  const [app, setApp] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [beneficiaryName, setBeneficiaryName] = useState<string>("");

  const [errors, setErrors] = useState<{
    app?: string;
    mobile?: string;
    email?: string;
    beneficiaryName?: string;
  }>({});

  useEffect(() => {
    setApp(initialData.app);
    setMobile(initialData.mobile);
    setEmail(initialData.email);
    setBeneficiaryName(initialData.beneficiaryName);
  }, [initialData]);

  const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }
    return null;
  };

  const handleSave = () => {
    let isVerified = true;

    if (!mobile) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        mobile: "Mobile number is required.",
      }));
      isVerified = false;
    } else if (!/^\d{10}$/.test(mobile.toString())) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        mobile: "Mobile number must be exactly 10 digits (numbers only).",
      }));
      isVerified = false;
    }

    if (!email) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Email is required.",
      }));
      isVerified = false;
    } else {
      const emailError = validateEmail(email);
      if (emailError) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: emailError,
        }));
        isVerified = false;
      }
    }

    const appError = !app
      ? "Please enter App"
      : app.length < 3
      ? "App name must contain atleast 3 characters."
      : "";

    setErrors((prevErrors) => ({
      ...prevErrors,
      app: appError,
    }));

    if (appError) {
      isVerified = false;
    }

    if (isVerified) {
      setChannelIndex(channelIndex + 1);
      handleSubmit({
        app,
        mobile,
        email,
        channelIndex: channelIndex + 1,
        type: "eWallet",
        beneficiaryName,
      });
      handlers.close();
    }
  };

  return (
    <Box mb="md">
      <Flex direction="column" gap="lg">
        <TextInput
          label="App"
          placeholder="Add App"
          withAsterisk
          error={errors.app}
          value={app}
          //onChange={(e) => setApp(e.target.value)}
          onChange={(e) => {
            setApp(e.target.value);
            setErrors((prevErrors) => ({ ...prevErrors, app: undefined }));
          }}
        />
        <MobileNumberInput
          label="Mobile Number"
          withAsterisk
          value={mobile}
          // onChange={(value) => {
          //   setMobile(`${value}`);
          // }}
          error={errors.mobile}
          onChange={(value) => {
            setMobile(`${value}`);
            setErrors((prevErrors) => ({ ...prevErrors, mobile: undefined }));
          }}
        />
        <TextInput
          label="Email"
          placeholder="Add Email"
          withAsterisk
          error={errors.email}
          value={email}
          onChange={(e) => {
            setEmail(e.currentTarget.value);
            setErrors((prevErrors) => ({ ...prevErrors, email: undefined }));
          }}
        />
        <TextInput
          label="Beneficiary Name"
          placeholder="Add Beneficiary Name"
          error={errors.beneficiaryName}
          value={beneficiaryName}
          onChange={(e) => {
            setBeneficiaryName(e.currentTarget.value);
            setErrors((prev) => ({ ...prev, beneficiaryName: undefined }));
          }}
        />
        <Button onClick={handleSave}>Save</Button>
      </Flex>
    </Box>
  );
};

export default EWalletModal;
