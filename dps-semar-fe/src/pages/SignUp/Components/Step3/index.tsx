import {
  Anchor,
  Button,
  Center,
  Checkbox,
  Flex,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";

const Step3 = ({
  referralCode,
  password,
  confirmPassword,
  setReferralCode,
  setPassword,
  setConfirmPassword,

  error,
  loading,

  handleSubmit,
}) => {
  const [readOnlyReferral, setreadOnlyReferral] = useState(false);
  const [isAgree, setIsAgree] = useState(true);

  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("code");
    if (code) {
      setReferralCode(code);
      setreadOnlyReferral(true);
    }
  }, []);

  return (
    <>
      <Title ta="center" order={3}>
        Create Account
      </Title>
      <Text ta="center" mb="xl">
        Fill the following to create your account
      </Text>

      <form onSubmit={handleSubmit}>
        <TextInput
          label="Referral code"
          placeholder="Enter referrral code (Optional)"
          size="lg"
          mb={"md"}
          w={"100%"}
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
          readOnly={readOnlyReferral}
        />

        <PasswordInput
          label="Password"
          placeholder="Enter password"
          withAsterisk
          size="lg"
          mb={"md"}
          w={"100%"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <PasswordInput
          label="Confirm password"
          placeholder="Confirm password"
          withAsterisk
          size="lg"
          mb={"md"}
          w={"100%"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Checkbox
          size="sm"
          checked={isAgree}
          onChange={(e) => setIsAgree(e.currentTarget.checked)}
          label={
            <Flex justify={"flex-start"} align={"center"} gap={"4px"}>
              <p style={{ margin: 0 }}>I agree to</p>

              <Anchor
                fw={500}
                component={Link}
                to="/terms-and-conditions"
                variant="outline"
                size="sm"
              >
                Terms and Conditions
              </Anchor>
            </Flex>
          }
        />

        <p style={{ color: "tomato", marginTop: "5px" }}>{error}</p>

        <Button
          variant="filled"
          radius={"md"}
          fullWidth
          mt="md"
          size="lg"
          loading={loading}
          onClick={handleSubmit}
          disabled={!isAgree}
        >
          Create my account
        </Button>
      </form>
    </>
  );
};

export default Step3;
