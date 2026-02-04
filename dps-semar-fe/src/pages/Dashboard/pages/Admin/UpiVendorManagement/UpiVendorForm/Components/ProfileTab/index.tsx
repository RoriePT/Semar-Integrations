import { Fieldset, PasswordInput, Switch, TextInput } from "@mantine/core";
import React, { useEffect } from "react";
import MobileNumberInput from "../../../../../../../../components/Common/ChangePassword/MobileNumberInput/Index";
import {
  ErrorsTab1,
  Tab1KeyNames,
  Tab1State,
  UpiVendorResponseDto,
} from "../../Utils/types";

const ProfileTab: React.FC<{
  formState: Tab1State;
  handleChange: (key: Tab1KeyNames, value: any) => void;
  errors: ErrorsTab1;
  editData: UpiVendorResponseDto;
}> = ({ formState, handleChange, errors, editData }) => {
  const isLoginCredsDisabled = !!editData && !formState.updateLogin;

  useEffect(() => {
    if (!formState.updateLogin) handleChange("email", editData?.email || "");
    handleChange("confirmPassword", "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState.updateLogin, editData]);

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
        withAsterisk
        onChange={(value: number) => handleChange("contact", `${value}`)}
        error={errors.contact}
      />

      {!!editData && (
        <Switch
          label={"Update login credentials"}
          labelPosition="left"
          checked={formState.updateLogin}
          onChange={(e) => handleChange("updateLogin", e.currentTarget.checked)}
          mt="sm"
        />
      )}

      <Fieldset legend="Login credentials" variant="filled" mt="sm">
        <TextInput
          label="Email"
          withAsterisk
          placeholder="Enter email address"
          value={formState.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={errors.email}
          mb="sm"
          disabled={isLoginCredsDisabled}
        />

        <PasswordInput
          label="Password"
          withAsterisk
          placeholder="Enter password"
          value={formState.password}
          onChange={(e) => handleChange("password", e.target.value)}
          error={errors.password}
          mb="sm"
          disabled={isLoginCredsDisabled}
        />

        <PasswordInput
          label="Confirm password"
          withAsterisk
          placeholder="Confirm password"
          value={formState.confirmPassword}
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
          error={errors.confirmPassword}
          disabled={isLoginCredsDisabled}
        />
      </Fieldset>

      <Switch
        label="Enabled"
        labelPosition="left"
        checked={formState.enabled}
        onChange={(e) => handleChange("enabled", e.currentTarget.checked)}
        mt="sm"
      />
    </>
  );
};

export default ProfileTab;
