import {
  Box,
  Button,
  CopyButton,
  Divider,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { IoCopyOutline } from "react-icons/io5";
import QRCode from "react-qr-code";

const UPI = () => {
  return (
    <>
      <Paper p="sm">
        <Box ta={"center"}>
          <Title order={4}>Pay via QR code</Title>
          <Text size="xs" c={"gray"} mb={"sm"}>
            Scan this QR code with any UPI app
          </Text>
          <QRCode value="hey" size={150} />
        </Box>
      </Paper>
      <Divider label="OR" my={"sm"} />
      <Paper p="sm">
        <Box ta={"center"}>
          <Title order={4}>Pay to UPI ID</Title>
          <Text size="xs" c={"gray"} mb={"sm"}>
            Make payment to the below UPI Id on a UPI app
          </Text>

          <div
            style={{
              fontSize: "18px",
              border: "1px solid",
              borderRadius: "5px",
              wordBreak: "break-word",
              padding: "10px",
              lineHeight: "24px",
            }}
          >
            aryan.mahajan893@okhdfcbank
          </div>
          <CopyButton value="aryan.mahajan893@okhdfcbank" timeout={10000}>
            {({ copied, copy }) => (
              <Button
                color={copied ? "teal" : "brand"}
                onClick={copy}
                leftSection={<IoCopyOutline />}
                mt={"sm"}
                variant="light"
              >
                {copied ? "UPI Id Copied" : "Copy UPI Id"}
              </Button>
            )}
          </CopyButton>
        </Box>
      </Paper>

      <Paper p="sm" mt={"sm"}>
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
    </>
  );
};

export default UPI;
