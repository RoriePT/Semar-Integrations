import {
  Box,
  Divider,
  Flex,
  Text,
} from "@mantine/core";
import React from "react";
import { formatDateIST } from "../../../../../utils";

const GeneralDetails = ({
  userName,
  userEmail,
  userMobile,
  createdOn,
  updatedOn,
  status,
  commissionFee,
  commissionRate,
}) => {
  const getUpdatedTimeLabel = () => {
    if (status === "complete") return "Completed on";
    if (status === "failed") return "Failed on";
    if (status === "submitted") return "Submitted on";
    if (status === "assigned") return "Assigned on";
  };

  return (
    <>
      <Flex gap={"sm"} align={"center"}>
        <Text fw={500}>Commission:</Text>
        <Text>
          ₹{commissionFee} ({commissionRate}%)
        </Text>
      </Flex>

      <Divider my={"xs"} />
      
      <Box>
        <Text fw={600} size="sm">
          Payin User:{" "}
        </Text>
        <Text>{userName}</Text>
        <Flex justify={"space-between"} align={"center"}>
          <Text size="xs" c={"dimmed"}>
            {userEmail}
          </Text>
          <Text size="xs" c={"dimmed"}>
            {userMobile}
          </Text>
        </Flex>
      </Box>

      <Divider my={"xs"} />
      
      <Flex gap={"sm"} align={"center"}>
        <Text fw={500}>Initiated on:</Text>
        <Text>{formatDateIST(createdOn)}</Text>
      </Flex>

      {status !== "initiated" && (
        <Flex gap={"sm"} align={"center"}>
          <Text fw={500}>{getUpdatedTimeLabel()}:</Text>
          <Text>{formatDateIST(updatedOn)}</Text>
        </Flex>
      )}
    </>
  );
};

export default GeneralDetails;


