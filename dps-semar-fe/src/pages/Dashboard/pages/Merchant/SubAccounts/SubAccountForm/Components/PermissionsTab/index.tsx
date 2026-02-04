import { Checkbox, Fieldset, Flex, Select, Text, Title } from "@mantine/core";
import React, { useState } from "react";
import { Tab2KeyNames, Tab2State } from "../../Utils/types";

const PermissionsTab: React.FC<{
  formState: Tab2State;
  handleChange: (key: Tab2KeyNames, value: any) => void;
}> = ({ formState, handleChange }) => {
  return (
    <>
      <Fieldset legend="Select Permissions">
        <Flex direction={"column"} gap={"sm"} mt={"xs"}>
          <Checkbox
            value="react"
            label="Submit payout requests"
            checked={formState.submitPayouts}
            onChange={(e) =>
              handleChange("submitPayouts", e.currentTarget.checked)
            }
          />
          <Checkbox
            value="react"
            label="Submit withdrawal requests"
            checked={formState.submitWithdrawals}
            onChange={(e) =>
              handleChange("submitWithdrawals", e.currentTarget.checked)
            }
          />
          <Checkbox
            value="react"
            label="Add/Update/Delete withdraw channel profiles"
            checked={formState.withdrawalChannels}
            onChange={(e) =>
              handleChange("withdrawalChannels", e.currentTarget.checked)
            }
          />
        </Flex>
      </Fieldset>
    </>
  );
};

export default PermissionsTab;
