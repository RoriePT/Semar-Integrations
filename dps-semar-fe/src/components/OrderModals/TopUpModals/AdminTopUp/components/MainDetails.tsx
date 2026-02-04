import { Badge, Flex, Group, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React from "react";
import CopyButton from "../../../../CopyButton";
import PayinStatusBadge from "../../../../OrderStatus/Badges/PayinStatusBadge";
import { FaInfoCircle } from "react-icons/fa";
import PayinStatusInfoModal from "../../../../OrderStatus/InfoModal/PayinStatusInfoModal";
import TopUpBadge from "../../../../OrderStatus/Badges/TopUpBadge";
import { getStatusTextForTopup } from "../../../../OrderStatus/Texts/Topup";

const MainDetails = ({ systemOrderId, amount, status, channel }) => {
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
        <Text fw={500}>Channel:</Text>
        <Text>{channel}</Text>
      </Flex>

      <Flex justify={"space-between"} align={"center"} my="md">
        <TopUpBadge status={status} size="lg" />
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
        {getStatusTextForTopup(status, false)}
      </Text>
      <PayinStatusInfoModal opened={info} close={infoHandlers.close} />
    </>
  );
};

export default MainDetails;
