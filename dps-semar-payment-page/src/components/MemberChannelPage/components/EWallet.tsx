import {
  Box,
  Button,
  CopyButton,
  Divider,
  Flex,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { IoCopyOutline } from "react-icons/io5";

const EWallet = ({ amount, appName, mobile }) => {
  return (
    <>
      <Paper p="sm">
        <Box ta={"center"}>
          <Title order={4}>Payment Amount</Title>
          <Text size="xs" c={"gray"} mb={"sm"}>
            Transfer this amount only
          </Text>

          <div
            style={{
              fontSize: "24px",
              fontWeight: 600,
              color: "#646464",
            }}
          >
            ₹{amount}
          </div>
          <CopyButton value={amount} timeout={10000}>
            {({ copied, copy }) => (
              <Button
                color={copied ? "teal" : "blue"}
                onClick={copy}
                leftSection={<IoCopyOutline />}
                mt={"sm"}
                variant="light"
                size="xs"
                radius={"xs"}
              >
                {copied ? "Amount Copied" : "Copy Amount"}
              </Button>
            )}
          </CopyButton>
        </Box>
      </Paper>

      <Paper p="sm" mt={"sm"}>
        <Box ta={"center"}>
          <Title order={4}>Pay via E-Wallet</Title>
          <Text size="xs" c={"gray"} mb={"sm"}>
            Make payment to the below details
          </Text>
        </Box>

        <Flex align={"center"} justify={"space-between"} mt={"lg"}>
          <Box>
            <Title order={5}>E-Wallet app</Title>

            <Text size="lg">{appName}</Text>
          </Box>
          <CopyButton value={appName} timeout={10000}>
            {({ copied, copy }) => (
              <Button
                color={copied ? "teal" : "blue"}
                onClick={copy}
                leftSection={<IoCopyOutline />}
                mt={"sm"}
                variant="light"
                size="xs"
                radius={"xs"}
              >
                {copied ? "Copied" : "Copy"}
              </Button>
            )}
          </CopyButton>
        </Flex>
        <Divider my={"xs"} />

        <Flex align={"center"} justify={"space-between"}>
          <Box>
            <Title order={5}>Wallet Mobile Number</Title>

            <Text size="lg">{mobile}</Text>
          </Box>
          <CopyButton value={mobile} timeout={10000}>
            {({ copied, copy }) => (
              <Button
                color={copied ? "teal" : "blue"}
                onClick={copy}
                leftSection={<IoCopyOutline />}
                mt={"sm"}
                variant="light"
                size="xs"
                radius={"xs"}
              >
                {copied ? "Copied" : "Copy"}
              </Button>
            )}
          </CopyButton>
        </Flex>
      </Paper>
    </>
  );
};

export default EWallet;
