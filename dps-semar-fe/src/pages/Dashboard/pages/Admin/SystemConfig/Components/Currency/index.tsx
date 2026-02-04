import {
  Button,
  Divider,
  Flex,
  Group,
  Paper,
  Select,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import useForm from "./useForm";

const Currency = () => {
  const { formState, handleChange, handleSubmit, errors } = useForm();

  return (
    <Paper p={"md"} mb={"md"}>
      <Stack>
        <Flex gap={"6px"}>
          <Title order={6}>System Profit:</Title>
          <Text size="sm">Rs 220202</Text>
        </Flex>

        <Flex gap={"6px"}>
          <Title order={6}>Current Top-up Holdings:</Title>
          <Text size="sm">Rs 1202</Text>
        </Flex>

        <Divider />

        <Select
          label={"Currency"}
          placeholder="Choose a currency"
          withAsterisk
          value={formState.currency}
          onChange={(value) => handleChange("currency", value)}
          data={["USD", "EUR", "INR", "GBP"]}
          error={errors.currency}
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

export default Currency;
