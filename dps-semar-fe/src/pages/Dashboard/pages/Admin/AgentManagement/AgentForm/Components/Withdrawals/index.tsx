import {
  Button,
  Fieldset,
  Flex,
  NumberInput,
  PasswordInput,
  Switch,
  Text,
  Title,
} from "@mantine/core";
import React, { useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { useDisclosure } from "@mantine/hooks";
import {
  AgentResponseType,
  ErrorsTab2,
  Tab2KeyNames,
  Tab2State,
} from "../../Utils/types";
import ChannelModals from "../../../../../../../../components/ChannelModals";

const WithdrawalsTab: React.FC<{
  formState: Tab2State;
  handleChange: (key: Tab2KeyNames, value: any) => void;
  errors: ErrorsTab2;
  editData: AgentResponseType;
}> = ({ formState, handleChange, errors, editData }) => {
  const [opened, handlers] = useDisclosure();
  const [selectedForEdit, setSelectedForEdit] = useState(-1);
  const isWithdrawalCredsDisabeld = !!editData && !formState.updateWithdrawal;

  return (
    <>
      <Fieldset legend="Channel Profiles for Withdrawal">
        <ChannelModals
          handleChange={(updatedProfiles) =>
            handleChange("channelProfile", updatedProfiles)
          }
          multiple={true}
          editData={editData}
        />
      </Fieldset>

      <NumberInput
        label="Withdrawal Service Rate"
        defaultValue={0.5}
        withAsterisk
        rightSection={<div style={{ marginRight: "8px" }}>%</div>}
        value={formState.withdrawalRate}
        onChange={(value) => handleChange("withdrawalRate", value)}
        error={errors.withdrawalRate}
      />

      <NumberInput
        label="Minimum withdrawal amount"
        withAsterisk
        defaultValue={0}
        value={formState.minWithdrawalAmount}
        onChange={(value) => handleChange("minWithdrawalAmount", value)}
        error={errors.minWithdrawalAmount}
      />

      <NumberInput
        label="Maximum withdrawal amount"
        withAsterisk
        defaultValue={1000000}
        value={formState.maxWithdrawalAmount}
        onChange={(value) => handleChange("maxWithdrawalAmount", value)}
        error={errors.maxWithdrawalAmount}
      />

      {!!editData && (
        <Switch
          label={"Update Withdarwal credentials"}
          labelPosition="left"
          checked={formState.updateWithdrawal}
          onChange={(e) =>
            handleChange("updateWithdrawal", e.currentTarget.checked)
          }
        />
      )}

      <Fieldset legend="Withdrawal credentials" variant="filled">
        <PasswordInput
          withAsterisk
          label="Withdrawal password"
          placeholder="Enter withdrawal password"
          value={formState.withdrawalPassword}
          onChange={(e) => handleChange("withdrawalPassword", e.target.value)}
          error={errors.withdrawalPassword}
          mb={"md"}
          disabled={isWithdrawalCredsDisabeld}
        />

        <PasswordInput
          withAsterisk
          label="Confirm withdrawal password"
          placeholder="Enter withdrawal password agian"
          value={formState.confirmWithdrawalPassword}
          onChange={(e) =>
            handleChange("confirmWithdrawalPassword", e.target.value)
          }
          error={errors.confirmWithdrawalPassword}
          mb={"md"}
          disabled={isWithdrawalCredsDisabeld}
        />
      </Fieldset>
    </>
  );
};

export default WithdrawalsTab;
