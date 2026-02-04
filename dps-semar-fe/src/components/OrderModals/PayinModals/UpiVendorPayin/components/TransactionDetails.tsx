import { Divider, Flex, Text } from "@mantine/core";
import CopyButton from "../../../../CopyButton";

const TransactionDetails = ({ transactionId, merchantOrderId, upiId, upiTitle, status }) => {
  const normalizedStatus = status?.toLowerCase();
  const shouldShowTransactionId = normalizedStatus === "complete" || normalizedStatus === "failed";

  return (
    <>
      {merchantOrderId && (
        <>
          <Flex gap={"sm"} align={"center"}>
            <Text fw={500}>Merchant Order ID:</Text>
            <Flex>
              <Text>{merchantOrderId}</Text>
              <CopyButton value={merchantOrderId} />
            </Flex>
          </Flex>
          <Divider my={"xs"} />
        </>
      )}

      {upiId && (
        <>
          <Flex gap={"sm"} align={"center"}>
            <Text fw={500}>UPI ID:</Text>
            <Flex>
              <Text>{upiId} {upiTitle && `(${upiTitle})`}</Text>
              <CopyButton value={upiId} />
            </Flex>
          </Flex>
          {shouldShowTransactionId && <Divider my={"xs"} />}
        </>
      )}

      {shouldShowTransactionId && (
        <Flex gap={"sm"} align={"center"}>
          <Text fw={500}>UTR / UPI Transaction ID:</Text>
          <Flex>
            <Text>{transactionId || "-"}</Text>
            {transactionId && <CopyButton value={transactionId} />}
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default TransactionDetails;


