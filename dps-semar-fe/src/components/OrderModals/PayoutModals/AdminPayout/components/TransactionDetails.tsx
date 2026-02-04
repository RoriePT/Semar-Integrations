import React from "react";
import InfoRow from "../../../../InfoRow";
import { Badge, Box, Button, Divider, Flex, Text } from "@mantine/core";
import CopyButton from "../../../../CopyButton";
import TransactionReceipt from "../../../TransactionReceipt";
import { useDisclosure } from "@mantine/hooks";

const TransactionDetails = ({
  id,
  receipt,
  payinMadeOn,
  memberChannelDetails,
  gatewayDetails,
  recipientChannelDetails,
  channel,
}) => {
  const [opened, openHandlers] = useDisclosure();
  return (
    <>
      <Flex gap={"sm"} align={"center"}>
        <Text fw={500}>Transaction Id:</Text>
        <Flex>
          <Text>{id}</Text>
          <CopyButton value={"undefined"} />
        </Flex>
      </Flex>

      <Flex gap={"sm"} align={"center"} mt={"md"}>
        <Text fw={500}>Transaction Receipt:</Text>
        <Button
          size="xs"
          variant="light"
          onClick={openHandlers.open}
          radius={"xl"}
        >
          View Receipt
        </Button>
      </Flex>

      <Divider my={"xs"} />
      <Box>
        <Text fw={600} size="sm">
          Recipient channel details:{" "}
        </Text>
        {recipientChannelDetails &&
          Object.keys(recipientChannelDetails[channel]).map((key) => {
            const value = recipientChannelDetails[channel][key];
            return (
              <>
                <Flex gap={"xs"} align={"center"}>
                  <Text fw={500} size="sm">
                    {key}:{" "}
                  </Text>
                  <Text size="xs" c={"dimmed"}>
                    {value}
                  </Text>
                </Flex>
              </>
            );
          })}
      </Box>

      {payinMadeOn === "member" ? (
        <>
          {/* {" "}
          <Divider my={"xs"} />
          <Box>
            <Text fw={600} size="sm">
              Member channel details:{" "}
            </Text>
            {memberChannelDetails &&
              Object.keys(memberChannelDetails).map((key) => (
                <>
                  <Flex gap={"xs"} align={"center"}>
                    <Text fw={500} size="sm">
                      {key}:{" "}
                    </Text>
                    <Text size="xs" c={"dimmed"}>
                      {memberChannelDetails[key]}
                    </Text>
                  </Flex>
                </>
              ))}
          </Box> */}
        </>
      ) : (
        <>
          {" "}
          <Divider my={"xs"} />
          <Box>
            <Text fw={600} size="sm">
              Other transaction details (Gateway):{" "}
            </Text>
            {gatewayDetails &&
              Object.keys(gatewayDetails).map((key) => (
                <>
                  <Flex gap={"xs"} align={"center"}>
                    <Text fw={500} size="sm">
                      {key}:{" "}
                    </Text>
                    <Text size="xs" c={"dimmed"}>
                      {gatewayDetails[key]}
                    </Text>
                  </Flex>
                </>
              ))}
          </Box>
        </>
      )}

      <TransactionReceipt
        opened={opened}
        close={openHandlers.close}
        txnId={id}
        receipt={receipt}
      />
    </>
  );
};

export default TransactionDetails;
