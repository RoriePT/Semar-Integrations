import { Box, Paper, Stack, Text, Title } from "@mantine/core";

import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

const Integration = ({ success = false }) => {
  return (
    <Paper p={"xl"} radius={"md"}>
      <Box>
        <Title order={2}>Integrate Kigsgate payments in your website</Title>
        <Text>
          To enable payment services through Semar on your website, follow the
          below 3 steps:
        </Text>
      </Box>

      <Stack gap={"xl"}>
        <Step1 />
        <Step2 />
        <Step3 />
      </Stack>
    </Paper>
  );
};

export default Integration;
