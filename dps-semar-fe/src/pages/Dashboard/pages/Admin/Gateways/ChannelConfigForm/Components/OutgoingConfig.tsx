import { NumberInput, Stack, Switch } from "@mantine/core";
import React from "react";

interface OutgoingConfigProps {
  outgoingData: {
    id: number;
    enabled: boolean;
    minAmount: number;
    maxAmount: number;
    upstreamFee: number;
  };
  setOutgoingData: any;
  errors: any;
}

const OutgoingConfig: React.FC<OutgoingConfigProps> = ({
  outgoingData,
  setOutgoingData,
  errors,
}) => {
  const handleChange = (field, value) => {
    setOutgoingData((prev) => {
      return prev.map((item) => {
        if (item.id === outgoingData.id) {
          return {
            ...item,
            [field]: value,
          };
        }
        return item;
      });
    });
  };

  return (
    <Stack>
      <Switch
        label={"Enabled"}
        labelPosition="left"
        description="Determines whether the gateway is enabled for outgoing transactions (Payouts and Withdrawals via API) on this channel"
        checked={outgoingData.enabled}
        onChange={(e) => handleChange("enabled", e.currentTarget.checked)}
      />

      <NumberInput
        label="Minimum amount"
        placeholder="Enter the minimum amount"
        withAsterisk
        description="The minimum amount allowed on the gateway for this channel in case of outgoing transactions (Payouts and Withdrawals via API)"
        value={outgoingData.minAmount}
        error={errors.minAmount}
        onChange={(value) => handleChange("minAmount", value)}
      />

      <NumberInput
        label="Maximum amount"
        placeholder="Enter the maximum amount"
        withAsterisk
        description="The maximum amount allowed on the gateway for this channel in case of outgoing transactions (Payouts and Withdrawals via API)"
        value={outgoingData.maxAmount}
        error={errors.maxAmount}
        onChange={(value) => handleChange("maxAmount", value)}
      />

      <NumberInput
        label="Upstream fees"
        placeholder="Enter the upstream fees"
        withAsterisk
        description="The amount fee charged to the system by the gateway for this channel's outgoing transactions (Payouts and Withdrawals via API)"
        value={outgoingData.upstreamFee}
        error={errors.upstreamFees}
        onChange={(value) => handleChange("upstreamFee", value)}
      />
    </Stack>
  );
};

export default OutgoingConfig;
