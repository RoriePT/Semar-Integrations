import { useEffect, useState } from "react";
import ModalLayout from "../../../../../../components/ModalLayout";
import {
  Button,
  Divider,
  Flex,
  NumberInput,
  SegmentedControl,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import InfoRow from "../../../../../../components/InfoRow";
import CopyButton from "../../../../../../components/CopyButton";
import { notifications } from "@mantine/notifications";
import { FaCheck } from "react-icons/fa";
import RegisterAPIs from "../../../../../../api/register";

const ReferralCodeAction = ({ opened, close, data, triggerReload }) => {
  const [value, setValue] = useState<string>("referrer");
  const [loading, setLoading] = useState(false);
  let referralType = data.agentType || "merchant";

  const [formData, setFormData] = useState({
    payinCommission: data.payinCommission,
    payoutCommission: data.payoutCommission,
    merchantPayinServiceRate: data.merchantPayinServiceRate,
    merchantPayoutServiceRate: data.merchantPayoutServiceRate,
  });

  const [errors, setErrors] = useState({
    payinCommission: "",
    payoutCommission: "",
    merchantPayinServiceRate: "",
    merchantPayoutServiceRate: "",
  });

  const resetFormFields = () => {
    setFormData({
      payinCommission: data.payinCommission,
      payoutCommission: data.payoutCommission,
      merchantPayinServiceRate: data.merchantPayinServiceRate,
      merchantPayoutServiceRate: data.merchantPayoutServiceRate,
    });

    setErrors({
      payinCommission: "",
      payoutCommission: "",
      merchantPayinServiceRate: "",
      merchantPayoutServiceRate: "",
    });
  };

  const validateForm = () => {
    if (formData.payinCommission <= 0) {
      setErrors({
        ...errors,
        payinCommission: "Payin commission rate must be greater than zero!",
      });
      return false;
    }

    if (formData.payoutCommission <= 0) {
      setErrors({
        ...errors,
        payoutCommission: "Payout commission rate must be greater than zero!",
      });
      return false;
    }

    if (formData.merchantPayinServiceRate <= 0) {
      // setErrors({
      //   ...errors,
      //   payinCommission:
      //     "Merchant payin service rate must be greater than zero!",
      // });
      // return false;
    }

    if (formData.merchantPayoutServiceRate <= 0) {
      // setErrors({
      //   ...errors,
      //   payinCommission:
      //     "Merchant payout service rate must be greater than zero!",
      // });
      // return false;
    }

    return true;
  };

  const handleApprove = async () => {
    const isValid = validateForm();
    if (!isValid) return;

    const payload = {
      payinCommission: formData.payinCommission,
      payoutCommission: formData.payoutCommission,
      merchantPayinServiceRate: formData.merchantPayinServiceRate,
      merchantPayoutServiceRate: formData.merchantPayoutServiceRate,
      status: "approved",
    };

    setLoading(true);
    const created = await RegisterAPIs.updateAgentReferral(payload, data.id);
    setLoading(false);

    if (created.error)
      return notifications.show({
        color: "red",
        title: "Failed",
        message: created.error,
        icon: <FaCheck size={18} color="white" />,
        autoClose: 4000,
        withCloseButton: true,
      });

    notifications.show({
      color: "teal",
      title: "Success",
      message: "Referral status updated to approved successfuly!",
      icon: <FaCheck size={18} color="white" />,
      autoClose: 4000,
      withCloseButton: false,
    });

    close();
    resetFormFields();
    triggerReload();
  };

  const handleReject = async () => {
    const payload = {
      status: "rejected",
    };

    setLoading(true);
    const created = await RegisterAPIs.updateAgentReferral(payload, data.id);
    setLoading(false);

    if (created.error)
      return notifications.show({
        color: "red",
        title: "Failed",
        message: created.error,
        icon: <FaCheck size={18} color="white" />,
        autoClose: 4000,
        withCloseButton: true,
      });

    notifications.show({
      color: "teal",
      title: "Success",
      message: "Referral status updated to rejected successfuly!",
      icon: <FaCheck size={18} color="white" />,
      autoClose: 4000,
      withCloseButton: false,
    });

    close();
    resetFormFields();
    triggerReload();
  };

  useEffect(() => {
    setFormData({
      payinCommission: data.payinCommission,
      payoutCommission: data.payoutCommission,
      merchantPayinServiceRate: data.merchantPayinServiceRate,
      merchantPayoutServiceRate: data.merchantPayoutServiceRate,
    });
  }, [data]);

  const Header = <>Referral Code Approval</>;

  const Body = (
    <>
      <Flex align={"center"} gap={"5px"}>
        <InfoRow label={"Referral Code"} value={data.referralCode} />
        <CopyButton value={data.referralCode} />
      </Flex>
      <InfoRow
        label={"Referrer"}
        value={data.agent?.firstName + " " + data.agent?.lastName}
      />
      <InfoRow
        label={"Referral Type"}
        value={referralType === "agent" ? "For Agent" : "For Merchant"}
      />
      <InfoRow label={"Referrer Email"} value={data.agent?.email} />

      {referralType === "agent" && (
        <>
          <Divider my={"xs"} />
          <Title order={5}>Referrer commissions</Title>
        </>
      )}

      {referralType === "merchant" && (
        <SegmentedControl
          w={"100%"}
          my={"md"}
          value={value}
          onChange={(v) => setValue(v)}
          data={[
            { label: "Referrer Commissions", value: "referrer" },
            { label: "Merchant Service Rates", value: "merchant" },
          ]}
        />
      )}

      {value === "referrer" && (
        <Stack>
          <NumberInput
            label="Payin commission rate"
            value={formData.payinCommission}
            error={errors.payinCommission}
            rightSection="%"
            onChange={(value) => {
              setFormData({
                ...formData,
                payinCommission: value,
              });
            }}
          />
          <NumberInput
            label="Payout commission rate"
            error={errors.payoutCommission}
            value={formData.payoutCommission}
            rightSection="%"
            onChange={(value) => {
              setFormData({
                ...formData,
                payoutCommission: value,
              });
            }}
          />
        </Stack>
      )}

      {value === "merchant" && (
        <Stack>
          <NumberInput
            label="Payin service rate"
            error={errors.merchantPayinServiceRate}
            value={formData.merchantPayinServiceRate}
            rightSection="%"
            onChange={(value) => {
              setFormData({
                ...formData,
                merchantPayinServiceRate: value,
              });
            }}
          />
          <NumberInput
            label="Payout service rate"
            value={formData.merchantPayoutServiceRate}
            error={errors.merchantPayoutServiceRate}
            rightSection="%"
            onChange={(value) => {
              setFormData({
                ...formData,
                merchantPayoutServiceRate: value,
              });
            }}
          />
        </Stack>
      )}
    </>
  );

  const Footer = (
    <Flex justify={"space-between"}>
      <Button variant="outline" onClick={handleReject}>
        Reject
      </Button>
      <Button loading={loading} onClick={handleApprove}>
        Approve
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

export default ReferralCodeAction;
