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

const GeneralDetails = ({ createdOn, updatedOn, status }) => {
  const openMember = (id) => {
    alert("To be implemented");
  };

  const getUpdatedTimeLabel = () => {
    if (status === "complete") return "Completed on";
    if (status === "rejected") return "Rejected on";
    if (status === "submitted") return "Submitted on";
    if (status === "assigned") return "Assigned on";
  };

  return (
    <>
      <Flex gap={"sm"} align={"center"}>
        <Text fw={500}>Initiated on:</Text>

        <Text>{moment(createdOn).format("DD MMM, YYYY | MM:HH a")}</Text>
      </Flex>

      {status !== "initiated" && (
        <Flex gap={"sm"} align={"center"}>
          <Text fw={500}>{getUpdatedTimeLabel()}:</Text>

          <Text>{moment(updatedOn).format("DD MMM, YYYY | MM:HH a")}</Text>
        </Flex>
      )}
    </>
  );
};

export default GeneralDetails;
