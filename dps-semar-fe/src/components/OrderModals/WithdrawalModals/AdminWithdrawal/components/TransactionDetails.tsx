import { Box, Button, Divider, Flex, Text } from "@mantine/core";
import CopyButton from "../../../../CopyButton";
import TransactionReceipt from "../../../TransactionReceipt";
import { useDisclosure } from "@mantine/hooks";

const TransactionDetails = ({ id, receipt, withdrawalMadeOn }) => {
  const [opened, openHandlers] = useDisclosure();

  return (
    <>
      {id && (
        <Flex gap={"sm"} align={"center"}>
          <Text fw={500}>Transaction Id:</Text>
          <Flex>
            <Text>{id}</Text>
            <CopyButton value={"undefined"} />
          </Flex>
        </Flex>
      )}

      {receipt && (
        <>
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
        </>
      )}

      {/* {withdrawalMadeOn === "gateway" && (
        <>
          {" "}
          <Box>
            <Text fw={600} size="sm">
              Other transaction details (Gateway):{" "}
            </Text>
            {Object.keys(gatewayDetails).map((key) => (
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
      )} */}

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
