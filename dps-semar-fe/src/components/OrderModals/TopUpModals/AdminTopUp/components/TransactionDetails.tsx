import React from "react";
import InfoRow from "../../../../InfoRow";
import { Badge, Box, Button, Divider, Flex, Text } from "@mantine/core";
import CopyButton from "../../../../CopyButton";
import TransactionReceipt from "../../../TransactionReceipt";
import { useDisclosure } from "@mantine/hooks";

const TransactionDetails = ({
  id,
  receipt,

  memberChannelDetails,
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
          Member channel details:{" "}
        </Text>
        {Object.keys(memberChannelDetails).map((key) => (
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
      </Box>

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
