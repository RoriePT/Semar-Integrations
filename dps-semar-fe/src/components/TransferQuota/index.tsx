import React, { useEffect, useState } from "react";
import {
  Modal,
  Text,
  NumberInput,
  Button,
  Group,
  Flex,
  Loader,
} from "@mantine/core";
import { useDashboardUser } from "../../pages/Dashboard/DashboardProvider";
import CommonAPIs, { updateQuotaDetails } from "../../api/common";
import { showNotification } from "@mantine/notifications";

interface TransferQuotaProps {
  opened: boolean;
  close: () => void;
  receivingId: { email: string; name: string };
  reload: any;
}

const TransferQuota: React.FC<TransferQuotaProps> = ({
  opened,
  close,
  receivingId,
  reload,
}) => {
  const [amount, setAmount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState({
    receivingMemberQuota: 0,
    sendingMemberQuota: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const { userData } = useDashboardUser();

  const { email, name } = receivingId;

  const handleDetails = async () => {
    setLoading(true);
    try {
      const details = await updateQuotaDetails(userData.id, email);
      setDetails({
        receivingMemberQuota: details.receivingMemberQuota,
        sendingMemberQuota: details.sendingMemberQuota,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!opened) {
      setAmount(null);
      setError(null);
    }

    if (opened) handleDetails();
  }, [opened]);

  const handleSave = async () => {
    if (!amount || amount <= 0) {
      setError("Amount must be a positive number.");
      return;
    }
    if (amount > details.sendingMemberQuota) {
      setError("Amount cannot exceed your current quota.");
      return;
    }
    setError(null);

    try {
      const payload = {
        sendingMemberId: userData.id,
        receivingMemberEmail: email,
        amount,
      };
      setLoading(true);
      await CommonAPIs.adjustMemberBalance(payload);
      await handleDetails();
      setLoading(false);

      showNotification({
        title: "Success",
        message: "Quota transferred successfully!",
        color: "green",
      });
      setAmount(null);
      close();
      reload();
    } catch (err: any) {
      console.error("Error during quota transfer:", err);
      showNotification({
        title: "Error",
        message: "Failed to transfer. Please try again.",
        color: "red",
      });
    }
  };

  return (
    <Modal opened={opened} onClose={close} title="Transfer Quota">
      {loading ? (
        <Flex justify={"center"} align={"center"} style={{ height: "200px" }}>
          <Loader size="lg" />
        </Flex>
      ) : (
        <>
          <Text size="md" mb="sm">
            {" "}
            Transfer some amount of your quota to {name}{" "}
          </Text>
          <Text size="sm" mb="sm" fw={500}>
            {" "}
            Your current quota: ₹{details.sendingMemberQuota}
          </Text>
          <Text size="sm" mb="sm" fw={500}>
            {" "}
            {name}'s current quota: ₹{details.receivingMemberQuota}
          </Text>

          <NumberInput
            value={amount}
            onChange={(value) => {
              if (typeof value === "number" && value >= 0) {
                setAmount(value);
                setError(null);
              }
            }}
            label="Enter amount"
            // min={0}
            // max={details.sendingMemberQuota}
            placeholder="Enter amount"
            mb="sm"
            error={error}
          />
          <Button loading={loading} onClick={handleSave}>
            Save
          </Button>
        </>
      )}
    </Modal>
  );
};

export default TransferQuota;
