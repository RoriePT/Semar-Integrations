import React, { useEffect, useState } from "react";
import {
  Modal,
  Text,
  Radio,
  Button,
  NumberInput,
  Group,
  Flex,
  Loader,
  TextInput,
  Textarea,
} from "@mantine/core";
import CommonAPIs, { updateCurrentBalance } from "../../api/common";
import { showNotification } from "@mantine/notifications";

interface ManualSettlementProps {
  opened: boolean;
  close: () => void;
  id: number;
  userType: string;
  reload: any;
  balanceLabel?: string;
}

const ManualSettlement: React.FC<ManualSettlementProps> = ({
  opened,
  close,
  id,
  userType,
  reload,
  balanceLabel = "Balance",
}) => {
  const [bal, setBal] = useState<number>(0);
  const [operation, setOperation] = useState<"increment" | "decrement">(
    "increment"
  );
  const [amount, setAmount] = useState<number | null>(null);
  const [description, setDescription] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  const getBalance = async () => {
    setLoading(true);
    try {
      const balance = await updateCurrentBalance(id, userType);
      setBal(balance);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!opened) {
      setAmount(null);
      setOperation("increment");
      setError(null);
    }
    getBalance();
  }, [opened]);

  const handleSave = async () => {
    if (amount && amount > 0) {
      if (operation === "decrement" && amount > bal) {
        setError("Decrement amount cannot exceed current balance.");
        return;
      }
      setError(null);

      const mapUserTypeToBalanceType = (type: string): string | null => {
        switch (type) {
          case "MERCHANT":
            return "merchant_balance";
          case "AGENT":
            return "agent_balance";
          case "MEMBER":
            return "member_quota";
          default:
            return null;
        }
      };

      const balanceType = mapUserTypeToBalanceType(userType);

      try {
        setLoadingSubmit(true);
        const payload = {
          userId: id,
          amount,
          description,
          operation: operation.toUpperCase() as "INCREMENT" | "DECREMENT",
          balanceType,
        };
        await CommonAPIs.adjustBalance(payload);
        showNotification({
          title: "Success",
          message: "Balance updated successfully!",
          color: "green",
        });
        setAmount(null);
        setLoadingSubmit(false);
        reload();
        close();
      } catch (err: any) {
        setLoadingSubmit(false);
        console.error("API Error:", err);
        showNotification({
          title: "Error",
          message: "Failed to update balance. Please try again.",
          color: "red",
        });
      }
    } else {
      setLoadingSubmit(false);
      setError(
        "Amount cannot be empty and must be a positive number greater than zero"
      );
    }
  };

  return (
    <Modal opened={opened} onClose={close} title="Manual Settlement Order">
      {loading ? (
        <Flex justify="center" align="center" style={{ height: "150px" }}>
          <Loader size="lg" />
        </Flex>
      ) : (
        <>
          <Text size="md" fw={500} mb="sm">
            Current {balanceLabel}: ₹{bal}
          </Text>

          <Radio.Group
            value={operation}
            onChange={(value) =>
              setOperation(value as "increment" | "decrement")
            }
            label="Choose operation"
            mb="sm"
          >
            <Group mt="xs">
              <Radio value="increment" label="Increment" />
              <Radio value="decrement" label="Decrement" />
            </Group>
          </Radio.Group>

          <NumberInput
            value={amount}
            onChange={(value) => {
              if (typeof value === "number" && value > 0) {
                setAmount(value);
                setError(null);
              }
            }}
            label="Enter amount"
            min={0}
            placeholder="Enter amount"
            mb="sm"
            required
            error={error}
          />
          <Textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            label={"Enter description"}
            placeholder="Enter description"
            required
          />
          <Button mt={"sm"} onClick={handleSave} loading={loadingSubmit}>
            Save
          </Button>
        </>
      )}
    </Modal>
  );
};

export default ManualSettlement;
