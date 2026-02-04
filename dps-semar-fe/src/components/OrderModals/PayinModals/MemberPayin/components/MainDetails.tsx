import { Flex, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import CopyButton from "../../../../CopyButton";
import PayinStatusBadge from "../../../../OrderStatus/Badges/PayinStatusBadge";
import PayinStatusInfoModal from "../../../../OrderStatus/InfoModal/PayinStatusInfoModal";
import { getStatusTextForPayin } from "../../../../OrderStatus/Texts/Payin";

const MainDetails = ({
  systemOrderId,
  trackingId = undefined,
  amount,
  status,
  channel,
  isMember = false,
  paymentType = undefined,
}) => {
  const [info, infoHandlers] = useDisclosure();

  // Determine the payment type for status text
  const statusPaymentType =
    paymentType || (isMember === true ? "member" : "gateway");

  return (
    <>
      <Flex gap={"sm"} align={"center"}>
        <Text fw={500}>System Order Id:</Text>
        <Flex>
          <Text>{systemOrderId}</Text>
          <CopyButton value={systemOrderId} />
        </Flex>
      </Flex>

      {trackingId && (
        <>
          <Flex gap={"sm"} align={"center"}>
            <Text fw={500}>Tracking ID:</Text>
            <Flex>
              <Text>{trackingId}</Text>
              <CopyButton value={trackingId} />
            </Flex>
          </Flex>
          <Text size="xs" c="dimmed" mb="sm" ml="0">
            This is the reference ID of the payment. Kindly use this id to find
            the transaction in your UPI app.
          </Text>
        </>
      )}

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
        {getStatusTextForPayin(status, statusPaymentType)}
      </Text>
      <PayinStatusInfoModal opened={info} close={infoHandlers.close} />
    </>
  );
};

export default MainDetails;
