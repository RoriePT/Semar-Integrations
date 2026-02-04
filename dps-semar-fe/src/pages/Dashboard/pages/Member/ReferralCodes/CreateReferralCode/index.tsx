import { useEffect, useState } from "react";
import {
  ActionIcon,
  Button,
  Fieldset,
  Flex,
  Stack,
  TextInput,
} from "@mantine/core";

import ModalLayout from "../../../../../../components/ModalLayout";
import { useDashboardUser } from "../../../../DashboardProvider";
import RegisterAPIs from "../../../../../../api/register";
import { notifications } from "@mantine/notifications";
import { FaCheck, FaSyncAlt } from "react-icons/fa";
import useReferralCodeGenerator from "../../../../../../hook/useReferralCodeGenerator";

const CreateReferralCode = ({ opened, close, triggerReload }) => {
  const { userData } = useDashboardUser();
  const [loading, setLoading] = useState(false);
  const {
    referralCode,
    setRegenerateCode,
    generateUniqueCode,
    referralLoading,
  } = useReferralCodeGenerator("agent-referral", opened);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, referralCode: referralCode }));
  }, [referralCode]);

  useEffect(() => {
    if (!opened) return;
    resetFormFields();
    generateUniqueCode();
  }, [opened]);

  const [formData, setFormData] = useState({
    memberId: userData.id,
    referralCode: "",
    payinCommission: -1,
    payoutCommission: -1,
    topupCommission: -1,
  });

  const [errors, setErrors] = useState({
    referralCode: "",
    payinCommission: "",
    payoutCommission: "",
    topupCommission: "",
  });

  const resetFormFields = () => {
    setFormData({
      memberId: userData.id,
      referralCode: "",
      payinCommission: -1,
      payoutCommission: -1,
      topupCommission: -1,
    });

    setErrors({
      referralCode: "",
      payinCommission: "",
      payoutCommission: "",
      topupCommission: "",
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      referralCode: "",
      payinCommission: "",
      payoutCommission: "",
      topupCommission: "",
    };

    if (!formData.referralCode) {
      newErrors.referralCode = "This field cannot be empty!";
      isValid = false;
    }

    if (formData.payinCommission < 0) {
      newErrors.payinCommission =
        "Payin commission must be greater than or equal to zero!";
      isValid = false;
    }
    if (formData.payoutCommission < 0) {
      newErrors.payoutCommission =
        "Payout commission must be greater than or equal to zero!";
      isValid = false;
    }
    if (formData.topupCommission < 0) {
      newErrors.topupCommission =
        "Topup commission must be greater than or equal to zero!";
      isValid = false;
    }

    setErrors(newErrors);

    return isValid;
  };

  const handleSubmit = async () => {
    let isValid = validateForm();
    if (!isValid) return;

    setLoading(true);
    const created = await RegisterAPIs.registerMemberReferral(formData);
    setLoading(false);

    if (created.error) {
      if (created?.forPayin) {
        setErrors((prev) => ({
          ...prev,
          payinCommission: created?.messsage,
        }));
        isValid = false;
      }
      if (created?.forTopup) {
        setErrors((prev) => ({
          ...prev,
          topupCommission: created?.messsage,
        }));
        isValid = false;
      }
      if (created?.forPayout) {
        setErrors((prev) => ({
          ...prev,
          payoutCommission: created?.messsage,
        }));
        isValid = false;
      }

      return notifications.show({
        color: "red",
        title: "Failed!",
        message: created?.error.message,
        icon: <FaCheck size={18} color="white" />,
        autoClose: 4000,
        withCloseButton: true,
      });
    }

    notifications.show({
      color: "teal",
      title: "Referral Created",
      message: "Referral code craeted successfuly!",
      icon: <FaCheck size={18} color="white" />,
      autoClose: 4000,
      withCloseButton: false,
    });

    triggerReload();
    resetFormFields();
    close();
  };

  const Header = <>Create new referral code</>;

  const Body = (
    <Stack>
      <TextInput
        label="Referral code"
        error={errors.referralCode}
        onChange={(e) => {
          setFormData({ ...formData, referralCode: e.target.value });
        }}
        value={formData.referralCode}
        // disabled
        readOnly
        rightSection={
          <ActionIcon
            variant="outline"
            loading={referralLoading}
            onClick={() => generateUniqueCode()}
          >
            <FaSyncAlt size={16} />
          </ActionIcon>
        }
      />

      <Fieldset legend="Your commissions">
        <TextInput
          label="Payin commission rate"
          error={errors.payinCommission}
          rightSection="%"
          onChange={(e) => {
            setFormData({
              ...formData,
              payinCommission: parseFloat(e.target.value),
            });
          }}
        />
        <TextInput
          label="Payout commission rate"
          error={errors.payoutCommission}
          rightSection="%"
          onChange={(e) => {
            setFormData({
              ...formData,
              payoutCommission: parseFloat(e.target.value),
            });
          }}
        />
        <TextInput
          label="Top-up commission rate"
          error={errors.topupCommission}
          rightSection="%"
          onChange={(e) => {
            setFormData({
              ...formData,
              topupCommission: parseFloat(e.target.value),
            });
          }}
        />
      </Fieldset>

      {/* <Fieldset legend="Member's Commission rates">
        <TextInput
          label="Payin commission rate"
          error={errors.referredMemberPayinCommission}
          rightSection="%"
          onChange={(e) => {
            setFormData({
              ...formData,
              referredMemberPayinCommission: parseFloat(e.target.value),
            });
          }}
        />
        <TextInput
          label="Payout commission rate"
          error={errors.referredMemberPayoutCommission}
          rightSection="%"
          onChange={(e) => {
            setFormData({
              ...formData,
              referredMemberPayoutCommission: parseFloat(e.target.value),
            });
          }}
        />
        <TextInput
          label="Top-up commission rate"
          error={errors.referredMemberTopupCommission}
          rightSection="%"
          onChange={(e) => {
            setFormData({
              ...formData,
              referredMemberTopupCommission: parseFloat(e.target.value),
            });
          }}
        />
      </Fieldset> */}
    </Stack>
  );
  const Footer = (
    <Flex justify={"space-between"}>
      <Button
        variant="outline"
        onClick={() => {
          close();
          resetFormFields();
        }}
      >
        Cancel
      </Button>
      <Button loading={loading} onClick={handleSubmit}>
        Create
      </Button>
    </Flex>
  );

  return (
    <ModalLayout
      opened={opened}
      close={close}
      header={Header}
      body={Body}
      footer={Footer}
      closeOnOutsideClick={false}
    />
  );
};

export default CreateReferralCode;
