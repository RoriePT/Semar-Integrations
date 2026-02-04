import {
  Fieldset,
  NumberInput,
  PasswordInput,
  Select,
  Switch,
  TextInput,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import {
  AgentResponseType,
  ErrorsTab1,
  Tab1KeyNames,
  Tab1State,
} from "../../Utils/types";
import MobileNumberInput from "../../../../../../../../components/Common/ChangePassword/MobileNumberInput/Index";
import CommonAPIs from "../../../../../../../../api/common";

const ProfileTab: React.FC<{
  formState: Tab1State;
  handleChange: (key: Tab1KeyNames, value: any) => void;
  errors: ErrorsTab1;
  editData: AgentResponseType;
}> = ({ formState, handleChange, errors, editData }) => {
  const [agents, setAgents] = useState([]);
  const isLoginCredsDisabeld = !!editData && !formState.updateLogin;

  const getAgentList = async () => {
    const data = await CommonAPIs.agentList();
    setAgents(data);
  };

  useEffect(() => {
    if (!formState.updateLogin) handleChange("email", editData?.email || "");
    handleChange("password", "");
    handleChange("confirmPassword", "");
  }, [formState.updateLogin]);

  useEffect(() => {
    getAgentList();
  }, []);

  return (
    <>
      <TextInput
        label="First name"
        withAsterisk
        placeholder="Enter first name"
        value={formState.firstName}
        onChange={(e) => handleChange("firstName", e.target.value)}
        error={errors.firstName}
      />

      <TextInput
        label="Last name"
        withAsterisk
        placeholder="Enter last name"
        value={formState.lastName}
        onChange={(e) => handleChange("lastName", e.target.value)}
        error={errors.lastName}
      />

      <MobileNumberInput
        value={formState.contact}
        label={"Contact number"}
        onChange={(value: number) => handleChange("contact", `${value}`)}
        error={errors.contact}
      />

      <Select
        label="Agent"
        placeholder="Select an agent"
        data={agents.map((agent) => ({
          value: agent.id?.toString(),
          label: agent.name,
        }))}
        value={formState.agent?.id.toString()}
        onChange={(_val, option) => {
          handleChange("agent", {
            id: parseInt(option.value),
            name: option.label,
          });
        }}
        readOnly={!!editData}
        maxDropdownHeight={200}
        searchable
      />

      {formState.agent?.name && (
        <>
          <NumberInput
            label="Agent Payin Commission Rate"
            withAsterisk
            placeholder="Payin commission rate"
            description="Payin commission rate for agent"
            value={formState.agentPayinCommissionRate}
            onChange={(e) => handleChange("agentPayinCommissionRate", e)}
            error={errors.agentPayinCommissionRate}
            readOnly={!!editData}
          />

          <NumberInput
            label="Agent Payout Commission Rate"
            withAsterisk
            placeholder="Payout commission rate"
            description="Payout commission rate for agent"
            value={formState.agentPayoutCommissionRate}
            onChange={(e) => handleChange("agentPayoutCommissionRate", e)}
            error={errors.agentPayoutCommissionRate}
            readOnly={!!editData}
          />
        </>
      )}

      {!!editData && (
        <Switch
          label={"Update login credentials"}
          labelPosition="left"
          checked={formState.updateLogin}
          onChange={(e) => handleChange("updateLogin", e.currentTarget.checked)}
        />
      )}

      <Fieldset legend="Login credentials" variant="filled">
        <TextInput
          label="Email"
          withAsterisk
          placeholder="Enter email address"
          description="This email will be used for login purpose"
          value={formState.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={errors.email}
          mb={"md"}
          disabled={isLoginCredsDisabeld}
        />

        <PasswordInput
          withAsterisk
          label="Login password"
          placeholder="Enter login password"
          value={formState.password}
          onChange={(e) => handleChange("password", e.target.value)}
          error={errors.password}
          mb={"md"}
          disabled={isLoginCredsDisabeld}
        />

        <PasswordInput
          withAsterisk
          label="Confirm login password"
          placeholder="Enter login password agian"
          value={formState.confirmPassword}
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
          error={errors.confirmPassword}
          mb={"md"}
          disabled={isLoginCredsDisabeld}
        />
      </Fieldset>

      <Switch
        label={"Enabled"}
        labelPosition="left"
        checked={formState.enabled}
        onChange={(e) => handleChange("enabled", e.currentTarget.checked)}
      />
    </>
  );
};

export default ProfileTab;
