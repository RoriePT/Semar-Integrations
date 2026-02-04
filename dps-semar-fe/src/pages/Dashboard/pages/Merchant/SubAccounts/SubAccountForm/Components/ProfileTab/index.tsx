import { Fieldset, PasswordInput, Switch, TextInput } from "@mantine/core";
import React, { useEffect } from "react";
import {
  ErrorsTab1,
  SubMerchantResponseType,
  Tab1KeyNames,
  Tab1State,
} from "../../Utils/types";
import MobileNumberInput from "../../../../../../../../components/Common/ChangePassword/MobileNumberInput/Index";

const ProfileTab: React.FC<{
  formState: Tab1State;
  handleChange: (key: Tab1KeyNames, value: any) => void;
  errors: ErrorsTab1;
  editData: SubMerchantResponseType;
}> = ({ formState, handleChange, errors, editData }) => {
  const isLoginCredsDisabeld = !!editData && !formState.updateLogin;
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
