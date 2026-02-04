import { Badge, Flex, Group, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React from "react";
import CopyButton from "../../../../CopyButton";
import PayinStatusBadge from "../../../../OrderStatus/Badges/PayinStatusBadge";
import { FaInfoCircle } from "react-icons/fa";
import PayinStatusInfoModal from "../../../../OrderStatus/InfoModal/PayinStatusInfoModal";
import { getStatusTextForPayin } from "../../../../OrderStatus/Texts/Payin";

const MainDetails = ({
  systemOrderId,
  merchantOrderId,
  amount,
  status,
  channel,
  isMember,
}) => {
  const [info, infoHandlers] = useDisclosure();
  return (
    <>
      <Flex gap={"sm"} align={"center"}>
        <Text fw={500}>Order Id:</Text>
        <Flex>
          <Text>{merchantOrderId}</Text>
          <CopyButton value={merchantOrderId} />
        </Flex>
      </Flex>

      <Flex gap={"sm"} align={"center"}>
        <Text fw={500}>KG Order Id:</Text>
        <Flex>
          <Text>{systemOrderId}</Text>
          <CopyButton value={systemOrderId} />
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
        {getStatusTextForPayin(status, isMember)}
      </Text>
      <PayinStatusInfoModal opened={info} close={infoHandlers.close} />
    </>
  );
};

export default MainDetails;
