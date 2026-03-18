import { NumberInput, Stack, Switch } from "@mantine/core";
import React from "react";
import { PaymentType } from "../../../../../../../api/gateway";

interface IncomingConfigProps {
  incomingData?: {
    id: number;
    enabled: boolean;
    minAmount: number;
    maxAmount: number;
    upstreamFee: number;
  } | null;
  setIncomingData: any;
  errors: any;
}

const IncomingConfig: React.FC<IncomingConfigProps> = ({
  incomingData,
  setIncomingData,
  errors,
}) => {
  if (!incomingData) {
    return <div>No configuration found for this channel.</div>;
  }

  const handleChange = (field, value) => {
    setIncomingData((prev) => {
      return prev.map((item) => {
        if (item.id === incomingData.id) {
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
        description="Determines whether the gateway is enabled for incoming transactions (Payins) on this channel"
        checked={incomingData.enabled}
        onChange={(e) => handleChange("enabled", e.currentTarget.checked)}
      />

      <NumberInput
        label="Minimum amount"
        placeholder="Enter the minimum amount"
        withAsterisk
        description="The minimum amount allowed on the gateway for this channel in case of incoming transactions (Payins)"
        value={incomingData.minAmount}
        error={errors.minAmount}
        onChange={(value) => handleChange("minAmount", value)}
      />

      <NumberInput
        label="Maximum amount"
        placeholder="Enter the maximum amount"
        withAsterisk
        description="The maximum amount allowed on the gateway for this channel in case of incoming transactions (Payins)"
        value={incomingData.maxAmount}
        error={errors.maxAmount}
        onChange={(value) => handleChange("maxAmount", value)}
      />

      <NumberInput
        label="Upstream fees"
        placeholder="Enter the upstream fees"
        withAsterisk
        description="The amount fee charged to the system by the gateway for this channel's incoming transactions (Payins)"
        value={incomingData.upstreamFee}
        error={errors.upstreamFees}
        onChange={(value) => handleChange("upstreamFee", value)}
      />
    </Stack>
  );
};

export default IncomingConfig;
