import { useEffect, useState } from "react";
import {
  ActionIcon,
  Button,
  Fieldset,
  Flex,
  Group,
  Radio,
  Stack,
  TextInput,
} from "@mantine/core";
import ModalLayout from "../../../../../../components/ModalLayout";
import RegisterAPIs from "../../../../../../api/register";
import { notifications } from "@mantine/notifications";
import { FaCheck, FaSyncAlt } from "react-icons/fa";
import { useDashboardUser } from "../../../../DashboardProvider";
import useReferralCodeGenerator from "../../../../../../hook/useReferralCodeGenerator";
import CommonAPIs, { getReferralCodeData } from "../../../../../../api/common";

const CreateReferralCode = ({ opened, close, triggerReload }) => {
  const { userData } = useDashboardUser();

  const {
    referralCode,
    setRegenerateCode,
    generateUniqueCode,
    referralLoading,
  } = useReferralCodeGenerator("agent-referral", opened);

  const [type, setType] = useState<string>("merchant");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    agentId: userData.id,
    referralCode: "",
    agentType: "merchant",
    payinCommission: 0,
    payoutCommission: 0,
    merchantPayinServiceRate: 0,
    merchantPayoutServiceRate: 0,
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, referralCode: referralCode }));
  }, [referralCode]);

  useEffect(() => {
    if (!opened) return;
    generateUniqueCode();
  }, [opened]);

  const [errors, setErrors] = useState({
    referralCode: "",
    payinCommission: "",
    payoutCommission: "",
    merchantPayinServiceRate: "",
    merchantPayoutServiceRate: "",
  });

  const [isCodeGenerated, setIsCodeGenerated] = useState(false);

  const validateForm = () => {
    let hasError = false;
    let newErrors = {
      referralCode: "",
      payinCommission: "",
      payoutCommission: "",
      merchantPayinServiceRate: "",
      merchantPayoutServiceRate: "",
    };

    if (!formData.referralCode) {
      newErrors.referralCode = "This field cannot be empty!";
      hasError = true;
    }

    if (formData?.payinCommission <= 0) {
      newErrors.payinCommission = "Payin commission must be greater than zero!";
      hasError = true;
    }

    if (formData?.payoutCommission <= 0) {
      newErrors.payoutCommission =
        "Payout commission must be greater than zero!";
      hasError = true;
    }

    if (type === "merchant" && formData?.merchantPayinServiceRate <= 0) {
      newErrors.merchantPayinServiceRate =
        "Merchant Payin service rate must be greater than zero!";
      hasError = true;
    }

    if (type === "merchant" && formData?.merchantPayoutServiceRate <= 0) {
      newErrors.merchantPayoutServiceRate =
        "Merchant Payout service rate must be greater than zero!";
      hasError = true;
    }

    setErrors(newErrors);
    return !hasError;
  };

  const handleSubmit = async () => {
    const isValid = validateForm();
    if (!isValid) return;

    setLoading(true);
    const created = await RegisterAPIs.registerAgentReferral(formData);
    setLoading(false);

    if (created.error)
      return notifications.show({
        color: "red",
        title: "Failed!",
        message: created.error,
        icon: <FaCheck size={18} color="white" />,
        autoClose: 4000,
        withCloseButton: true,
      });

    notifications.show({
      color: "teal",
      title: "Referral Created",
      message: "Referral code craeted successfuly!",
      icon: <FaCheck size={18} color="white" />,
      autoClose: 4000,
      withCloseButton: false,
    });

    triggerReload();
    close();
  };

  const Header = <>Create new referral code</>;

  const Body = (
    <Stack>
      <TextInput
        label="Referral code"
        error={errors.referralCode}
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
        onChange={(e) => {
          setFormData({ ...formData, referralCode: e.target.value });
        }}
      />
      <Radio.Group
        label="Referral Type"
        withAsterisk
        value={type}
        onChange={(v) => {
          setType(v);
          setFormData({ ...formData, agentType: v });
        }}
      >
        <Group mt="xs">
          <Radio value="merchant" label="For a Merchant" />
          <Radio value="agent" label="For another Agent" />
        </Group>
      </Radio.Group>

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
      </Fieldset>

      {type === "merchant" && (
        <>
          <Fieldset legend="Merchant's Service rates">
            <TextInput
              label="Payin service rate"
              error={errors.merchantPayinServiceRate}
              rightSection="%"
              onChange={(e) => {
                setFormData({
                  ...formData,
                  merchantPayinServiceRate: parseFloat(e.target.value),
                });
              }}
            />
            <TextInput
              label="Payout service rate"
              error={errors.merchantPayoutServiceRate}
              rightSection="%"
              onChange={(e) => {
                setFormData({
                  ...formData,
                  merchantPayoutServiceRate: parseFloat(e.target.value),
                });
              }}
            />
          </Fieldset>
        </>
      )}
    </Stack>
  );

  const Footer = (
    <Flex justify={"space-between"}>
      <Button
        variant="outline"
        onClick={() => {
          close();
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
