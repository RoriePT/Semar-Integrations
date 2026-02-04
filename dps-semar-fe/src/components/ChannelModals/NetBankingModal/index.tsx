import { Box, Button, Flex, TextInput } from "@mantine/core";
import React, { useEffect, useState } from "react";
import MobileNumberInput from "../../Common/ChangePassword/MobileNumberInput/Index";

interface NetBankingFormData {
  bankName: string;
  accountNumber: string;
  ifsc: string;
  beneficiaryName: string;
  mobile: string;
  email: string;
  channelIndex?: number;
  type?: string;
}

interface NetBankingModalProps {
  opened: boolean;
  handlers: { close: () => void; open: () => void };
  handleSubmit: (data: NetBankingFormData) => void;
  initialData?: NetBankingFormData;
  channelIndex: number;
  setChannelIndex?: (index: number) => void;
}

const NetBankingModal: React.FC<NetBankingModalProps> = ({
  opened,
  handlers,
  handleSubmit,
  initialData = {
    bankName: "",
    accountNumber: "",
    ifsc: "",
    beneficiaryName: "",
    mobile: "",
    email: "",
  },
  setChannelIndex,
  channelIndex,
}) => {
  const [bankName, setBankName] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [ifsc, setIfsc] = useState<string>("");
  const [beneficiaryName, setBeneficiaryName] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [errors, setErrors] = useState<{
    bankName?: string;
    accountNumber?: string;
    ifsc?: string;
    beneficiaryName?: string;
    mobile?: string;
    email?: string;
  }>({});

  useEffect(() => {
    setBankName(initialData.bankName);
    setAccountNumber(initialData.accountNumber);
    setIfsc(initialData.ifsc);
    setBeneficiaryName(initialData.beneficiaryName);
    setMobile(initialData.mobile);
    setEmail(initialData.email);
  }, [initialData]);

  const isValidBankAccountNumber = (bankAccountNumber: string): boolean => {
    const regex = /^[0-9]{9,18}$/;
    return regex.test(bankAccountNumber);
  };

  const isValidIfscCode = (ifscCode: string): boolean => {
    const regex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return regex.test(ifscCode);
  };

  const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }
    return null;
  };

  const handleSave = () => {
    const accountNumberValid = isValidBankAccountNumber(accountNumber);
    const isIfscValid = isValidIfscCode(ifsc);
    const emailError = email ? validateEmail(email) : null;

    let hasErrors = false;
    const newErrors: any = {};

    if (!bankName) {
      newErrors.bankName = "Please enter Bank Name";
      hasErrors = true;
    }

    if (!accountNumber) {
      newErrors.accountNumber = "Please add Account Number";
      hasErrors = true;
    } else if (!accountNumberValid) {
      newErrors.accountNumber =
        "Please enter a valid Account Number (9-18 digits)";
      hasErrors = true;
    }

    if (!ifsc) {
      newErrors.ifsc = "Please enter IFSC Code";
      hasErrors = true;
    } else if (!isIfscValid) {
      newErrors.ifsc = "Please enter a valid IFSC Code";
      hasErrors = true;
    }

    if (!beneficiaryName) {
      newErrors.beneficiaryName = "Please enter Beneficiary Name";
      hasErrors = true;
    }

    if (!mobile) {
      newErrors.mobile = "Mobile number is required";
      hasErrors = true;
    } else if (!/^\d{10}$/.test(mobile.toString())) {
      newErrors.mobile =
        "Mobile number must be exactly 10 digits (numbers only)";
      hasErrors = true;
    }

    if (!email) {
      newErrors.email = "Email is required";
      hasErrors = true;
    } else if (emailError) {
      newErrors.email = emailError;
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setChannelIndex(channelIndex + 1);
    handleSubmit({
      bankName,
      accountNumber,
      ifsc,
      beneficiaryName,
      mobile,
      email,
      channelIndex: channelIndex + 1,
      type: "netBanking",
    });
    handlers.close();
  };

  return (
    <Box mb="md">
      <Flex direction="column" gap="lg">
        <TextInput
          label="Bank Name"
          placeholder="Add Bank Name"
          withAsterisk
          error={errors.bankName}
          value={bankName}
          // onChange={(e) => setBankName(e.target.value)}
          onChange={(e) => {
            setBankName(e.currentTarget.value);
            setErrors((prev) => ({ ...prev, bankName: undefined }));
          }}
        />
        <TextInput
          label="Account Number"
          withAsterisk
          placeholder="Add Account Number"
          error={errors.accountNumber}
          value={accountNumber}
          // onChange={(e) => setAccountNumber(e.target.value)}
          onChange={(e) => {
            setAccountNumber(e.currentTarget.value);
            setErrors((prev) => ({ ...prev, accountNumber: undefined }));
          }}
        />
        <TextInput
          label="IFSC Code"
          placeholder="Add IFSC Code"
          withAsterisk
          error={errors.ifsc}
          value={ifsc}
          // onChange={(e) => setIfsc(e.target.value)}
          onChange={(e) => {
            setIfsc(e.currentTarget.value);
            setErrors((prev) => ({ ...prev, ifsc: undefined }));
          }}
        />
        <TextInput
          label="Beneficiary Name"
          placeholder="Add Beneficiary Name"
          withAsterisk
          error={errors.beneficiaryName}
          value={beneficiaryName}
          // onChange={(e) => setBeneficiaryName(e.target.value)}
          onChange={(e) => {
            setBeneficiaryName(e.currentTarget.value);
            setErrors((prev) => ({ ...prev, beneficiaryName: undefined }));
          }}
        />
        <MobileNumberInput
          label="Mobile Number"
          withAsterisk
          value={mobile}
          onChange={(value) => {
            setMobile(`${value}`);
            setErrors((prevErrors) => ({ ...prevErrors, mobile: undefined }));
          }}
          error={errors.mobile}
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
        <Button onClick={handleSave}>Save</Button>
      </Flex>
    </Box>
  );
};

export default NetBankingModal;
