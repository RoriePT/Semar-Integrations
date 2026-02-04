import { Flex, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import CopyButton from "../../../../CopyButton";
import PayinStatusBadge from "../../../../OrderStatus/Badges/PayinStatusBadge";
import PayinStatusInfoModal from "../../../../OrderStatus/InfoModal/PayinStatusInfoModal";
import { getStatusTextForPayout } from "../../../../OrderStatus/Texts/Payout";

const MainDetails = ({
  systemOrderId,
  merchantOrderId,
  amount,
  status,
  channel,
  quotaEarned,
  commissionFee,
  commissionRate,
  isMember,
}) => {
  const [info, infoHandlers] = useDisclosure();
  return (
    <>
      <Flex gap={"sm"} align={"center"}>
        <Text fw={500}>System Order Id:</Text>
        <Flex>
          <Text>{systemOrderId}</Text>
          <CopyButton value={systemOrderId} />
        </Flex>
      </Flex>

      <Flex gap={"sm"} align={"center"}>
        <Text fw={500}>Merchant Order Id:</Text>
        <Flex>
          <Text>{merchantOrderId}</Text>
          <CopyButton value={merchantOrderId} />
        </Flex>
      </Flex>

      <Flex gap={"sm"} align={"center"}>
        <Text fw={500}>Channel:</Text>
        <Text>{channel}</Text>
      </Flex>

      <Flex justify={"space-between"} align={"center"} my="md">
        <PayinStatusBadge status={status} size={"lg"} />
        <Flex gap={"sm"} align={"center"}>
          <Text fw={500}>Amount:</Text>
          <Title order={4} c={"gray.7"}>
            {" "}
            ₹{amount}
          </Title>
        </Flex>
      </Flex>

      <Text mb={"md"} c={"gray"} size="sm">
        <span
          style={{
            fontWeight: 500,
            display: "inline-block",
            marginRight: "4px",
            color: "black",
          }}
        >
          Status Details:
        </span>
        {getStatusTextForPayout(status, isMember)}
      </Text>
      <Flex gap={"sm"} align={"center"}>
        <Text fw={500}>
          {status !== "failed" && status !== "complete"
            ? "Creditable Quota:"
            : "Quota Credited:"}
        </Text>

        <Text>₹{quotaEarned}</Text>
      </Flex>
      <Flex gap={"sm"} align={"center"}>
        <Text fw={500}>Commission:</Text>

        <Text>
          ₹{commissionFee} ({commissionRate})
        </Text>
      </Flex>

      <PayinStatusInfoModal opened={info} close={infoHandlers.close} />
    </>
  );
};

export default MainDetails;
