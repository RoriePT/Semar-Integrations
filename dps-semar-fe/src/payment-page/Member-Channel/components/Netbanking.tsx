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

const Netbanking = () => {
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

              color: "#238be6",
            }}
          >
            ₹ 4000
          </div>
          <CopyButton value="4000" timeout={10000}>
            {({ copied, copy }) => (
              <Button
                color={copied ? "teal" : "brand"}
                onClick={copy}
                leftSection={<IoCopyOutline />}
                mt={"sm"}
                variant="light"
              >
                {copied ? "Amount Copied" : "Copy Amount"}
              </Button>
            )}
          </CopyButton>
        </Box>
      </Paper>

      <Paper p="sm" mt={"sm"}>
        <Box ta={"center"}>
          <Title order={4}>Pay via Netbanking</Title>
          <Text size="xs" c={"gray"} mb={"sm"}>
            Make payment to the below UPI Id on a UPI app
          </Text>
        </Box>

        <Box>
          <Flex align={"flex-end"} justify={"space-between"}>
            <Title order={5}>Recipient name</Title>
            <CopyButton value="aryan.mahajan893@okhdfcbank" timeout={10000}>
              {({ copied, copy }) => (
                <Button
                  color={copied ? "teal" : "brand"}
                  onClick={copy}
                  leftSection={<IoCopyOutline />}
                  mt={"sm"}
                  variant="light"
                  size="xs"
                >
                  {copied ? "Copied" : "Copy"}
                </Button>
              )}
            </CopyButton>
          </Flex>
          <Text size="lg">Aryan Mahajan</Text>
        </Box>
        <Divider mt={"sm"} />

        <Box>
          <Flex align={"flex-end"} justify={"space-between"}>
            <Title order={5}>Bank name</Title>
            <CopyButton value="aryan.mahajan893@okhdfcbank" timeout={10000}>
              {({ copied, copy }) => (
                <Button
                  color={copied ? "teal" : "brand"}
                  onClick={copy}
                  leftSection={<IoCopyOutline />}
                  mt={"sm"}
                  variant="light"
                  size="xs"
                >
                  {copied ? "Copied" : "Copy"}
                </Button>
              )}
            </CopyButton>
          </Flex>
          <Text size="lg">Aryan Mahajan</Text>
        </Box>

        <Divider mt={"sm"} />

        <Box>
          <Flex align={"flex-end"} justify={"space-between"}>
            <Title order={5}>Bank IFSC Code</Title>
            <CopyButton value="aryan.mahajan893@okhdfcbank" timeout={10000}>
              {({ copied, copy }) => (
                <Button
                  color={copied ? "teal" : "brand"}
                  onClick={copy}
                  leftSection={<IoCopyOutline />}
                  mt={"sm"}
                  variant="light"
                  size="xs"
                >
                  {copied ? "Copied" : "Copy"}
                </Button>
              )}
            </CopyButton>
          </Flex>
          <Text size="lg">Aryan Mahajan</Text>
        </Box>
        <Divider mt={"sm"} />

        <Box>
          <Flex align={"flex-end"} justify={"space-between"}>
            <Title order={5}>Account number</Title>
            <CopyButton value="aryan.mahajan893@okhdfcbank" timeout={10000}>
              {({ copied, copy }) => (
                <Button
                  color={copied ? "teal" : "brand"}
                  onClick={copy}
                  leftSection={<IoCopyOutline />}
                  mt={"sm"}
                  variant="light"
                  size="xs"
                >
                  {copied ? "Copied" : "Copy"}
                </Button>
              )}
            </CopyButton>
          </Flex>
          <Text size="lg">Aryan Mahajan</Text>
        </Box>
      </Paper>
    </>
  );
};

export default Netbanking;
