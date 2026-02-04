import { MultiSelect, NumberInput, Switch } from "@mantine/core";
import React, { useEffect } from "react";
import { Tab4State, ErrorsTab4, Tab4KeyNames } from "../../Utils/types";
import { Channel } from "../../../../../../../../types/channel";

import ServiceRate from "../../../../../../../../components/ServiceRate";

const PayoutsTab: React.FC<{
  formState: Tab4State;
  handleChange: (key: Tab4KeyNames, value: any) => void;
  errors: ErrorsTab4;
  channels: Channel[];
}> = ({ formState, handleChange, errors, channels }) => {
  useEffect(() => {
    if (!formState.allowMemberChannelsPayout)
      handleChange("allowPgBackupForPayout", true);
    if (!formState.allowPgBackupForPayout)
      handleChange("allowMemberChannelsPayout", true);
  }, [formState.allowMemberChannelsPayout, formState.allowPgBackupForPayout]);

  return (
    <>
      <MultiSelect
        label="Payout Channels"
        // description="njnj bcbhbd"
        placeholder="Pick one or more channels "
        withAsterisk
        data={channels?.map((ch) => ch.name)}
        value={formState.payoutChannels}
        onChange={(strs) => {
          handleChange("payoutChannels", strs);
        }}
        error={errors.payoutChannels}
      />

      <ServiceRate
        label="Select Payout Mode"
        formState={formState.payoutServiceRate}
        onValueChange={(value) => handleChange("payoutServiceRate", value)}
        errorMessage={errors.payoutServiceRate}
      />

      <NumberInput
        label="Minimum payout amount"
        withAsterisk
        defaultValue={0}
        value={formState.minPayout}
        onChange={(value) => handleChange("minPayout", value)}
        error={errors.minPayout}
      />

      <NumberInput
        label="Maximum payout amount"
        withAsterisk
        defaultValue={1000000}
        value={formState.maxPayout}
        onChange={(value) => handleChange("maxPayout", value)}
        error={errors.maxPayout}
      />

      <Switch
        label="Enable Payouts"
        labelPosition="left"
        checked={formState.enablePayouts}
        onChange={(e) => handleChange("enablePayouts", e.currentTarget.checked)}
      />

      <Switch
        label="Allow member channels for payouts"
        labelPosition="left"
        checked={formState.allowMemberChannelsPayout}
        onChange={(e) => {
          handleChange("allowMemberChannelsPayout", e.currentTarget.checked);
        }}
      />

      <Switch
        label="Allow 3rd party gateway fallback for payouts"
        labelPosition="left"
        checked={formState.allowPgBackupForPayout}
        onChange={(e) =>
          handleChange("allowPgBackupForPayout", e.currentTarget.checked)
        }
      />
    </>
  );
};

export default PayoutsTab;
