import { useEffect, useState } from "react";
import ModalLayout from "../../../../../../components/ModalLayout";
import {
  Button,
  Flex,
  NumberInput,
  SegmentedControl,
  Stack,
  TextInput,
} from "@mantine/core";
import InfoRow from "../../../../../../components/InfoRow";
import CopyButton from "../../../../../../components/CopyButton";
import RegisterAPIs from "../../../../../../api/register";
import { notifications } from "@mantine/notifications";
import { FaCheck } from "react-icons/fa";
import { getFullName } from "../../../../../../utils/helpers";
import { useMediaQuery } from "@mantine/hooks";

const ReferralCodeAction = ({ opened, close, data, triggerReload }) => {
  const [value, setValue] = useState<string>("referrer");
  const [loading, setLoading] = useState(false);
 

  const [formData, setFormData] = useState({
    payinCommission: data.payinCommission,
    payoutCommission: data.payoutCommission,
    topupCommission: data.topupCommission,
    referredMemberPayinCommission: data.referredMemberPayinCommission,
    referredMemberPayoutCommission: data.referredMemberPayoutCommission,
    referredMemberTopupCommission: data.referredMemberTopupCommission,
  });

  const [errors, setErrors] = useState({
    payinCommission: "",
    payoutCommission: "",
    topupCommission: "",
    referredMemberPayinCommission: "",
    referredMemberPayoutCommission: "",
    referredMemberTopupCommission: "",
  });

  const resetFormFields = () => {
    setFormData({
      payinCommission: data.payinCommission,
      payoutCommission: data.payoutCommission,
      topupCommission: data.topupCommission,
      referredMemberPayinCommission: data.referredMemberPayinCommission,
      referredMemberPayoutCommission: data.referredMemberPayoutCommission,
      referredMemberTopupCommission: data.referredMemberTopupCommission,
    });

    setErrors({
      payinCommission: "",
      payoutCommission: "",
      topupCommission: "",
      referredMemberPayinCommission: "",
      referredMemberPayoutCommission: "",
      referredMemberTopupCommission: "",
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

    if (formData.topupCommission <= 0) {
      setErrors({
        ...errors,
        topupCommission: "Topup commission rate must be greater than zero!",
      });
      return false;
    }

    if (formData.referredMemberPayinCommission <= 0) {
      setErrors({
        ...errors,
        referredMemberPayinCommission:
          "Member payin service rate must be greater than zero!",
      });
      return false;
    }

    if (formData.referredMemberPayoutCommission <= 0) {
      setErrors({
        ...errors,
        payinCommission:
          "Member payout service rate must be greater than zero!",
      });
      return false;
    }

    if (formData.referredMemberTopupCommission <= 0) {
      setErrors({
        ...errors,
        referredMemberTopupCommission:
          "Member payout commission rate must be greater than zero!",
      });
      return false;
    }

    return true;
  };

  const handleApprove = async () => {
    const isValid = validateForm();
    if (!isValid) return;

    const payload = {
      payinCommission: formData.payinCommission,
      payoutCommission: formData.payoutCommission,
      topupCommission: formData.topupCommission,
      referredMemberPayinCommission: formData.referredMemberPayinCommission,
      referredMemberPayoutCommission: formData.referredMemberPayoutCommission,
      referredMemberTopupCommission: formData.referredMemberTopupCommission,
      status: "approved",
    };

    setLoading(true);
    const created = await RegisterAPIs.updateMemberReferral(payload, data.id);
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
    const created = await RegisterAPIs.updateMemberReferral(payload, data.id);
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
      topupCommission: data.topupCommission,
      referredMemberPayinCommission: data.referredMemberPayinCommission,
      referredMemberPayoutCommission: data.referredMemberPayoutCommission,
      referredMemberTopupCommission: data.referredMemberTopupCommission,
    });
  }, [data]);

  const Header = <>Referral Code Approval</>;

  const Body = (
    <>
      <Flex align={"center"} gap={"5px"}>
        <InfoRow label={"Referral Code"} value={data.referralCode} />
        <CopyButton value={data.referralCode} />
      </Flex>

      <InfoRow label={"Referrer"} value={getFullName(data.member)} />
      <InfoRow
        label={"Referrer Email"}
        value={data.member?.identity?.email}
      
      />

      <SegmentedControl
        fullWidth={true}
        value={value}
        my={"md"}
        onChange={(v) => setValue(v)}
        data={[
          { label: "Referrer Commissions", value: "referrer" },
          { label: "Referee Commissions", value: "referee" },
        ]}
      />

      {value === "referrer" && (
        <Stack>
          <NumberInput
            label="Payin commission rate"
            value={formData.payinCommission}
            rightSection={"%"}
            onChange={(e) => {
              setFormData({
                ...formData,
                payinCommission: e,
              });
            }}
          />
          <NumberInput
            label="Payout commission rate"
            value={formData.payoutCommission}
            rightSection={"%"}
            onChange={(e) => {
              setFormData({
                ...formData,
                payoutCommission: e,
              });
            }}
          />
          <NumberInput
            label="Top-up commission rate"
            value={formData.topupCommission}
            rightSection={"%"}
            onChange={(e) => {
              setFormData({
                ...formData,
                topupCommission: e,
              });
            }}
          />
        </Stack>
      )}

      {value === "referee" && (
        <Stack>
          <NumberInput
            label="Payin commission rate"
            value={formData.referredMemberPayinCommission}
            rightSection={"%"}
            onChange={(e) => {
              setFormData({
                ...formData,
                referredMemberPayinCommission: e,
              });
            }}
          />
          <NumberInput
            label="Payout commission rate"
            rightSection={"%"}
            value={formData.referredMemberPayoutCommission}
            onChange={(e) => {
              setFormData({
                ...formData,
                referredMemberPayoutCommission: e,
              });
            }}
          />
          <NumberInput
            label="Top-up commission rate"
            rightSection={"%"}
            value={formData.referredMemberTopupCommission}
            onChange={(e) => {
              setFormData({
                ...formData,
                referredMemberTopupCommission: e,
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
      <Button onClick={handleApprove}>Approve</Button>
    </Flex>
  );

  return (
    <ModalLayout
      opened={opened}
      close={close}
      header={Header}
      body={Body}
      footer={Footer}
    />
  );
};

export default ReferralCodeAction;
