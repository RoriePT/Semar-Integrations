import {
  Box,
  Divider,
  FileInput,
  Flex,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import React from "react";
import CopyButton from "../../../../CopyButton";
import { GrAttachment } from "react-icons/gr";
import qr from "../../../../../assets/admin.png";

const RecipientChannel = ({
  channel,
  paymentDetails,
  transactionProof,
  setTransactionProof,
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
            <img src={paymentDetails?.qrCode} style={{ width: "80px" }} />
          </Box>
          <Divider my={"xs"} label="OR" />
        </>
      )}

      {paymentDetails &&
        Object.keys(paymentDetails[channel]).map((key) => {
          if (key === "qrCode") return null;

          const value = paymentDetails[channel][key];
          return (
            <Flex gap={"sm"} align={"center"}>
              <Text fw={500}>{key}:</Text>
              <Flex>
                <Text>{value}</Text>
                <CopyButton value={value} />
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
          onChange={(event) =>
            setTransactionProof((prev) => ({
              ...prev,
              transactionId: event.target.value,
            }))
          }
        />
        <FileInput
          label="Receipt/Screenshot"
          placeholder={"Upload receipt/screenshot"}
          leftSection={<GrAttachment />}
          w={"50%"}
          accept="image/png,image/jpeg"
          onChange={(file) =>
            setTransactionProof((prev) => ({ ...prev, file: file }))
          }
        />
      </Flex>
    </>
  );
};

export default RecipientChannel;
