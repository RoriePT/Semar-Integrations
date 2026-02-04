import { NumberInput, Select, Switch, TextInput } from "@mantine/core";
import React, { useEffect, useState } from "react";
import {
  ErrorsTab1,
  MerchantResponseDto,
  Tab1KeyNames,
  Tab1State,
} from "../../Utils/types";
import MobileNumberInput from "../../../../../../../../components/Common/ChangePassword/MobileNumberInput/Index";
import CommonAPIs from "../../../../../../../../api/common";

const ProfileTab: React.FC<{
  formState: Tab1State;
  handleChange: (key: Tab1KeyNames, value: any) => void;
  errors: ErrorsTab1;
  editData: MerchantResponseDto;
}> = ({ formState, handleChange, errors, editData }) => {
  const [agents, setAgents] = useState([]);

  const getAgentList = async () => {
    const data = await CommonAPIs.agentList();
    setAgents(data);
  };

  useEffect(() => {
    if (editData) {
      handleChange("firstName", editData.firstName || "");
      handleChange("lastName", editData.lastName || "");
      handleChange("contact", editData.phone || "");
      handleChange("businessName", editData.businessName || "");
      handleChange("businessUrl", editData.businessUrl || "");
      handleChange("gst", editData.gst || "");
      handleChange("agent", editData.agent || "");
      handleChange("enabled", editData.enabled);
    }
  }, [editData]);

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

      <TextInput
        label="Business name"
        placeholder="Enter business name"
        description="Merchant's business name appears on the payment page"
        value={formState.businessName}
        onChange={(e) => handleChange("businessName", e.target.value)}
        error={errors.businessName}
        required
      />

      <TextInput
        label="Business Url"
        withAsterisk
        placeholder="Enter Business Url"
        description="Merchant can only use the payment services on this url"
        value={formState.businessUrl}
        onChange={(e) => handleChange("businessUrl", e.target.value)}
        error={errors.businessUrl}
      />

      <TextInput
        label="GST number"
        withAsterisk
        placeholder="Enter GST number"
        description="GST number will be used in receipt."
        value={formState.gst}
        onChange={(e) => handleChange("gst", e.target.value)}
        error={errors.gst}
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
          />

          <NumberInput
            label="Agent Payout Commission Rate"
            withAsterisk
            placeholder="Payout commission rate"
            description="Payout commission rate for agent"
            value={formState.agentPayoutCommissionRate}
            onChange={(e) => handleChange("agentPayoutCommissionRate", e)}
            error={errors.agentPayoutCommissionRate}
          />
        </>
      )}

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
