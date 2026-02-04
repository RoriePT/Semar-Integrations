import { Checkbox, Fieldset, Flex, Select, Text, Title } from "@mantine/core";
import React, { useState } from "react";
import { ErrorsTab2, Tab2KeyNames, Tab2State } from "../../Utils/types";

const PermissionsTab: React.FC<{
  formState: Tab2State;
  handleChange: (key: Tab2KeyNames, value: any) => void;
  errors: ErrorsTab2;
  allDisabled: boolean;
}> = ({ formState, handleChange, errors, allDisabled }) => {
  return (
    <>
      <Select
        label="Role"
        placeholder="Select role for the admin"
        data={["Super admin", "Sub admin"]}
        value={formState.role}
        onChange={(value) => handleChange("role", value)}
        error={errors.role}
      />

      <Fieldset legend="Select Permissions">
        <Flex direction={"column"} gap={"sm"} mt={"xs"}>
          <Checkbox
            //  value="react"
            label="Add other admins"
            checked={formState.admins}
            onChange={(e) => handleChange("admins", e.currentTarget.checked)}
            disabled={allDisabled}
          />
          <Checkbox
            // value="react"
            label="Add members, merchants and agents"
            checked={formState.users}
            onChange={(e) => handleChange("users", e.currentTarget.checked)}
            disabled={allDisabled}
          />
          <Checkbox
            //  value="react"
            label="Verify top-up and payout orders"
            checked={formState.verify}
            onChange={(e) => handleChange("verify", e.currentTarget.checked)}
            disabled={allDisabled}
          />
          <Checkbox
            //  value="react"
            label="Handle withdrawal orders"
            checked={formState.withdrawals}
            onChange={(e) =>
              handleChange("withdrawals", e.currentTarget.checked)
            }
            disabled={allDisabled}
          />
          <Checkbox
            //  value="react"
            label="Update balances and quotas"
            checked={formState.balances}
            onChange={(e) => handleChange("balances", e.currentTarget.checked)}
            disabled={allDisabled}
          />

          <Checkbox
            label="System Configurations"
            checked={formState.system}
            onChange={(e) => handleChange("system", e.currentTarget.checked)}
            disabled={allDisabled}
          />

          <Checkbox
            label="Channels and Gateways"
            checked={formState.channelsAndGateways}
            onChange={(e) =>
              handleChange("channelsAndGateways", e.currentTarget.checked)
            }
            disabled={allDisabled}
          />
        </Flex>
      </Fieldset>
    </>
  );
};

export default PermissionsTab;
