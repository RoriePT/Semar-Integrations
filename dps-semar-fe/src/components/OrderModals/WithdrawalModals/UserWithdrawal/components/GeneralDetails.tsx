import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  SegmentedControl,
  Text,
} from "@mantine/core";
import React from "react";
import CopyButton from "../../../../CopyButton";
import PayinStatusBadge from "../../../../OrderStatus/Badges/PayinStatusBadge";
import InfoRow from "../../../../InfoRow";
import moment from "moment";
import { formatDateIST } from "../../../../../utils";

const GeneralDetails = ({
  channelDetails,
  withdrawalMadeOn,
  createdOn,
  updatedOn,
  status,
}) => {
  const openUser = (id) => {
    alert("To be implemented");
  };

  const getUpdatedTimeLabel = () => {
    if (status === "complete") return "Completed on";
    if (status === "failed") return "Failed on";
    if (status === "rejected") return "Rejected on";
  };

  return (
    <>
      {status !== "pending" && status !== "rejected" && (
        <>
          <Flex gap={"sm"} align={"center"}>
            <Text fw={500}>Withdrawal made via:</Text>

            <Text>
              <Badge color="gray.6">
                {withdrawalMadeOn === "admin"
                  ? "Offline Remittance"
                  : "Gateway API"}
              </Badge>
            </Text>
          </Flex>
          <Divider my={"xs"} />
        </>
      )}
      <Box>
        <Text fw={600} size="sm">
          Channel Details:{" "}
        </Text>

        {Object.keys(channelDetails).map((key) => (
          <Flex gap={"sm"} align={"center"}>
            <Text fw={500}>{key}:</Text>

            <Text>{channelDetails[key]}</Text>
          </Flex>
        ))}
      </Box>

      <Divider my={"xs"} />
      <Flex gap={"sm"} align={"center"}>
        <Text fw={500}>Initiated on:</Text>

        <Text>{formatDateIST(createdOn)}</Text>
      </Flex>

      {status !== "pending" && (
        <Flex gap={"sm"} align={"center"}>
          <Text fw={500}>{getUpdatedTimeLabel()}:</Text>

          <Text>{formatDateIST(updatedOn)}</Text>
        </Flex>
      )}
    </>
  );
};

export default GeneralDetails;
