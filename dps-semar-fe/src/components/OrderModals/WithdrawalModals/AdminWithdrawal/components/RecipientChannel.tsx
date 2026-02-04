import { Box, Divider, FileInput, Flex, Text, TextInput } from "@mantine/core";
import CopyButton from "../../../../CopyButton";
import { GrAttachment } from "react-icons/gr";
import qr from "../../../../../assets/admin.png";

const RecipientChannel = ({
  channel,
  paymentDetails,
  transactionDetails,
  setTransactionDetails,
}) => {
  return (
    <>
      <Text fw={600}>Recipient channel details</Text>
      {channel.toLowerCase() === "upi" && (
        <>
          <Box ta={"center"}>
            <Text fw={500} mb={"4px"}>
              Scan this
            </Text>
            <img src={paymentDetails.qrCode} style={{ width: "80px" }} />
          </Box>
          <Divider my={"xs"} label="OR" />
        </>
      )}

      {Object.keys(paymentDetails).map((key) => {
        if (key === "qrCode") return null;
        return (
          <Flex gap={"sm"} align={"center"}>
            <Text fw={500}>{key}:</Text>
            <Flex>
              <Text>{paymentDetails[key]}</Text>
              <CopyButton value={paymentDetails[key]} />
            </Flex>
          </Flex>
        );
      })}

      <Text size="xs" c={"gray"} my={"xs"}>
        Make the payment through your payment app on the above details and
        submit the below details
      </Text>
      <Flex mb={"sm"} gap={"md"}>
        <TextInput
          label="Transaction Id"
          placeholder="Enter transaction Id"
          w={"50%"}
          value={transactionDetails.transactionId}
          onChange={(e) => {
            setTransactionDetails({
              ...transactionDetails,
              transactionId: e.target.value,
            });
          }}
        />
        <FileInput
          label="Receipt/Screenshot"
          placeholder={"Upload receipt/screenshot"}
          leftSection={<GrAttachment />}
          w={"50%"}
          value={transactionDetails.transactionReceipt}
          onChange={(e) => {
            setTransactionDetails({
              ...transactionDetails,
              transactionReceipt: e,
            });
          }}
        />
      </Flex>
    </>
  );
};

export default RecipientChannel;
