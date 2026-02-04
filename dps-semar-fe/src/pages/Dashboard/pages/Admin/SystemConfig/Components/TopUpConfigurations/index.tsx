import { useState } from "react";
import {
  Button,
  Center,
  Group,
  NumberInput,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import useForm from "./useForm";
import ChannelModals from "../../../../../../../components/ChannelModals";

const TopUpConfigurations = () => {
  const { formState, handleChange, handleSubmit, errors } = useForm();

  return (
    <Paper p={"md"}>
      <Center>
        <Title order={4}>Top-up Configuration</Title>
      </Center>
      <Stack mt={"md"}>
        <NumberInput
          label={"Top-up threshold"}
          value={formState.topupThreshold}
          onChange={(value) => handleChange("topupThreshold", value)}
          error={errors.topupThreshold}
        />
        <NumberInput
          label={"Top-up amount"}
          value={formState.topupAmount}
          onChange={(value) => handleChange("topupAmount", value)}
          error={errors.topupAmount}
        />
        <NumberInput
          label={"Top-up service rate"}
          description={
            "Rate used to calculate base amount for commission calculations"
          }
          value={formState.topupServiceRate}
          onChange={(value) => handleChange("topupServiceRate", value)}
          error={errors.topupServiceRate}
          rightSection={"%"}
        />

        <Text>Top-up channels</Text>
        <ChannelModals
          handleChange={(updatedProfiles) =>
            handleChange("channelProfile", updatedProfiles)
          }
          multiple={true}
          editData={formState}
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

export default TopUpConfigurations;
