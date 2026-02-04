import {
  Button,
  Center,
  Group,
  NumberInput,
  Paper,
  Stack,
  Title,
} from "@mantine/core";
import React from "react";
import useForm from "./useForm";

const WithdrawalDefaults = () => {
  const { formState, handleChange, handleSubmit, errors } = useForm();
  return (
    <Paper p={"md"}>
      <Center>
        <Title order={4}>Withdrawal Defaults</Title>
      </Center>
      <Stack mt={"md"}>
        <NumberInput
          label="Withdrawal Frozen Amount Threshold"
          defaultValue={1}
          withAsterisk
          step={1}
          rightSection={
            <div style={{ position: "absolute", right: "12px" }}>days</div>
          }
          value={formState.frozenAmountThreshold}
          onChange={(v) => handleChange("frozenAmountThreshold", v)}
          error={errors.frozenAmountThreshold}
        />

        <NumberInput
          label="Withdrawal Service Rate"
          defaultValue={0.5}
          // description="hfuh"
          withAsterisk
          rightSection={<div style={{ marginRight: "8px" }}>%</div>}
          value={formState.withdrawalRate}
          onChange={(v) => handleChange("withdrawalRate", v)}
          error={errors.withdrawalRate}
        />

        <NumberInput
          label="Minimum withdrawal amount"
          withAsterisk
          // min={0}
          defaultValue={0}
          value={formState.minWithdrawalAmount}
          onChange={(v) => handleChange("minWithdrawalAmount", v)}
          error={errors.minWithdrawalAmount}
        />

        <NumberInput
          label="Maximum withdrawal amount"
          withAsterisk
          // min={1000000}
          defaultValue={1000000}
          value={formState.maxWithdrawalAmount}
          onChange={(v) => handleChange("maxWithdrawalAmount", v)}
          error={errors.maxWithdrawalAmount}
        />
        <Group align="flex-start">
          <Button size="md" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
};

export default WithdrawalDefaults;
