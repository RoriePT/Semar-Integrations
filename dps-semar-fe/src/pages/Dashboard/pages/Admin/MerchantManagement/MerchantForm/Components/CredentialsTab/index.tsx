import {
  Button,
  Divider,
  Fieldset,
  Flex,
  PasswordInput,
  Switch,
  TextInput,
} from "@mantine/core";
import React from "react";
import {
  ErrorsTab2,
  MerchantResponseDto,
  Tab2KeyNames,
  Tab2State,
} from "../../Utils/types";

import { FaTrash } from "react-icons/fa6";

const CredentialsTab: React.FC<{
  formState: Tab2State;
  handleChange: (key: Tab2KeyNames, value: any) => void;
  errors: ErrorsTab2;
  editData: MerchantResponseDto;
}> = ({ formState, handleChange, errors, editData }) => {
  const isLoginCredsDisabeld = !!editData && !formState.updateLoginCredentials;
  const isWithdrawalCredsDisabeld =
    !!editData && !formState.updateWithdrawalCredentials;
  return (
    <>
      {!!editData && (
        <Switch
          label={"Update login credentials"}
          labelPosition="left"
          checked={formState.updateLoginCredentials}
          onChange={(e) =>
            handleChange("updateLoginCredentials", e.currentTarget.checked)
          }
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
          disabled={isLoginCredsDisabeld}
        />
      </Fieldset>

      <Fieldset legend="Merchant Integration" variant="filled">
        <TextInput
          label="Integration ID"
          value={formState.merchantIntegrationId}
          placeholder="INTEGRATION ID"
          mb={"md"}
          readOnly={true}
        />

        <TextInput
          label="API Key"
          value={formState.merchantApiKey}
          placeholder="API KEY"
          mb={"md"}
          readOnly={true}
        />
      </Fieldset>

      <Switch
        label={"Allow only whitelisted IPs"}
        checked={formState.allowOnlyIp}
        onChange={(e) => handleChange("allowOnlyIp", e.currentTarget.checked)}
        description="These IPs will be used for merchant login and payout."
      />
      {formState.allowOnlyIp && (
        <Fieldset legend="Whitelisted IPs" variant="filled">
          {formState.ips.map((ip, index) => (
            <Flex align={"center"} gap={"xs"} mb={"xs"}>
              <TextInput
                placeholder="xxx.xxx.xxx.xxx"
                value={ip}
                onChange={(e) => {
                  let allIpTexts = formState.ips;
                  allIpTexts[index] = e.target.value;
                  handleChange("ips", allIpTexts);
                }}
                error={errors.ips[index]}
                w={"100%"}
              />
              {formState.ips.length > 1 && (
                <FaTrash
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    let allIpTexts = formState.ips;
                    allIpTexts.splice(index, 1);
                    handleChange("ips", allIpTexts);
                  }}
                />
              )}
            </Flex>
          ))}
          <Button
            mt={"xs"}
            variant="light"
            onClick={() => {
              let allIpTexts = formState.ips;
              allIpTexts.push("");
              handleChange("ips", allIpTexts);
            }}
          >
            Add another IP
          </Button>
        </Fieldset>
      )}

      <Divider />

      {!!editData && (
        <Switch
          label={"Update withdrawal password"}
          labelPosition="left"
          checked={formState.updateWithdrawalCredentials}
          onChange={(e) =>
            handleChange("updateWithdrawalCredentials", e.currentTarget.checked)
          }
        />
      )}

      <Fieldset variant="filled">
        <PasswordInput
          withAsterisk
          label="Withdrawal password"
          placeholder="Enter withdrawal password"
          mb={"md"}
          value={formState.withdrawalPassword}
          onChange={(e) => handleChange("withdrawalPassword", e.target.value)}
          error={errors.withdrawalPassword}
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
          disabled={isWithdrawalCredsDisabeld}
        />
      </Fieldset>
    </>
  );
};

export default CredentialsTab;
