import { Fieldset, PasswordInput, Switch, TextInput } from "@mantine/core";
import React, { useEffect } from "react";
import {
  ErrorsTab1,
  MemberResponseDto,
  Tab1KeyNames,
  Tab1State,
} from "../../Utils/types";
import MobileNumberInput from "../../../../../../../../components/Common/ChangePassword/MobileNumberInput/Index";

const ProfileTab: React.FC<{
  formState: Tab1State;
  handleChange: (key: Tab1KeyNames, value: any) => void;
  errors: ErrorsTab1;
  editData: MemberResponseDto;
}> = ({ formState, handleChange, errors, editData }) => {
  const isLoginCredsDisabeld = !!editData && !formState.updateLogin;
  // const isWithdrawalCredsDisabeld =
  //   !!editData && !formState.updateWithdrawalCredentials;

  useEffect(() => {
    if (!formState.updateLogin) handleChange("email", editData?.email || "");
    handleChange("password", "");
    handleChange("confirmPassword", "");
  }, [formState.updateLogin]);

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

     {
      !editData && (
      <TextInput
        label="Referral code"
        placeholder="Enter referral code (optional)"
        value={formState.referralCode}
        onChange={(e) => handleChange("referralCode", e.target.value)}
        error={errors.referralCode}
        disabled={!!editData}
      />)}

      <TextInput
        label="Telegram ID"
        placeholder="Enter Telegram ID (optional)"
        value={formState.telegramId}
        onChange={(e) => handleChange("telegramId", e.target.value)}
        error={errors.telegramId}
      />

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
          disabled={isLoginCredsDisabeld}
        />
      </Fieldset>

      {/* {!!editData && (
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
      </Fieldset> */}

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
