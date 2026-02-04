import React, { useEffect, useState } from "react";
import {
  Modal,
  TextInput,
  Button,
  Flex,
  Fieldset,
  NumberInput,
  Text,
} from "@mantine/core";
import { notifications, showNotification } from "@mantine/notifications";
import CommonAPIs from "../../api/common";

interface Errors {
  payinCommissionRate?: string;
  payoutCommissionRate?: string;
  agentPayinCommissionRate?: string;
  agentPayoutCommissionRate?: string;
}

const EditRateModalOrganization = ({
  isOpen,
  onClose,
  data,
  triggerReload,
}) => {
  const [formData, setFormData] = useState({
    payinCommissionRate: 0,
    payoutCommissionRate: 0,
    agentPayinCommissionRate: 0,
    agentPayoutCommissionRate: 0,
  });

  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        payinCommissionRate: data?.memberRates?.payin || 0,
        payoutCommissionRate: data?.memberRates?.payout || 0,
        agentPayinCommissionRate: data?.ratesOfAgent?.payin || 0,
        agentPayoutCommissionRate: data?.ratesOfAgent?.payout || 0,
      });
      setErrors({});
    }
  }, [isOpen, data]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[field];
      return newErrors;
    });
  };

  const setError = (field: keyof Errors, message: string) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: message,
    }));
  };

  const validateForm = () => {
    let isValid = true;
    setErrors({});
    if (!data.isAgent && data.isRootNode) {
      if (formData.payinCommissionRate < 0) {
        setError("payinCommissionRate", "Field can't be empty or less than 0.");
        isValid = false;
      }
      if (formData.payoutCommissionRate < 0) {
        setError(
          "payoutCommissionRate",
          "Field can't be empty or less than 0."
        );
        isValid = false;
      }
    }
    if (!data.isAgent && !data.isRootNode) {
      if (formData.payinCommissionRate < 0) {
        setError("payinCommissionRate", "Field can't be empty or less than 0.");
        isValid = false;
      }
      if (formData.payoutCommissionRate < 0) {
        setError(
          "payoutCommissionRate",
          "Field can't be empty or less than 0."
        );
        isValid = false;
      }
      if (formData.agentPayinCommissionRate < 0) {
        setError(
          "agentPayinCommissionRate",
          "Field can't be empty or less than 0."
        );
        isValid = false;
      }
      if (formData.agentPayoutCommissionRate < 0) {
        setError(
          "agentPayoutCommissionRate",
          "Field can't be empty or less than 0."
        );
        isValid = false;
      }
    }

    if (data.isAgent) {
      if (formData.agentPayinCommissionRate < 0) {
        setError(
          "agentPayinCommissionRate",
          "Field can't be empty or less than 0."
        );
        isValid = false;
      }
      if (formData.agentPayoutCommissionRate < 0) {
        setError(
          "agentPayoutCommissionRate",
          "Field can't be empty or less than 0."
        );
        isValid = false;
      }
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      if (data.isAgent) {
        await CommonAPIs.updateAgentCommissionRates(formData, data.id);
      } else if (!data.isAgent) {
        const res: any = await CommonAPIs.updateMemberCommissionRates(
          formData,
          data.id,
          data.teamId
        );
        if (res.data.error && res.data.for === "payin") {
          setError("agentPayinCommissionRate", res.data.message);
          return;
        }

        if (res.data.error && res.data.for === "payout") {
          setError("agentPayoutCommissionRate", res.data.message);
          return;
        }
      }
      notifications.show({
        title: "Success",
        message: "Agent referral rates updated successfully!",
        color: "green",
      });
      onClose();
      triggerReload();
    } catch (error) {
      showNotification({
        title: "Error",
        message: "Failed to update commission rates.",
        color: "red",
      });
    }
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={
        <Text>
          Edit Referral Rates of <b>{data?.parentName}</b>
        </Text>
      }
    >
      <Flex direction="column" gap="md">
        {(data?.isAgent || !data?.isRootNode) && (
          <Fieldset>
            <NumberInput
              label="Agent's Payin Commission Rate"
              value={formData.agentPayinCommissionRate}
              onChange={(value) =>
                handleChange("agentPayinCommissionRate", value)
              }
              error={errors.agentPayinCommissionRate}
              rightSection={<div style={{ marginRight: "8px" }}>%</div>}
              mb={"sm"}
            />
            <NumberInput
              label="Agent's Payout Commission Rate"
              value={formData.agentPayoutCommissionRate}
              onChange={(value) =>
                handleChange("agentPayoutCommissionRate", value)
              }
              error={errors.agentPayoutCommissionRate}
              rightSection={<div style={{ marginRight: "8px" }}>%</div>}
            />
          </Fieldset>
        )}
        <Button onClick={handleSubmit}>Submit</Button>
      </Flex>
    </Modal>
  );
};

export default EditRateModalOrganization;
