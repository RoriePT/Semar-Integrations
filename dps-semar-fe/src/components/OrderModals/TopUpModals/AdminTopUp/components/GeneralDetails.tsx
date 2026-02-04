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
import React, { useState } from "react";
import CopyButton from "../../../../CopyButton";
import PayinStatusBadge from "../../../../OrderStatus/Badges/PayinStatusBadge";
import InfoRow from "../../../../InfoRow";
import moment from "moment";
import UserProfileModal from "../../../../Users/UserProfileModal";
import { useDisclosure } from "@mantine/hooks";

const GeneralDetails = ({
  member,

  createdOn,
  updatedOn,
  status,
}) => {
  const [userProfileModalOpen, userProfileHandlers] = useDisclosure();

  const openMember = (id) => userProfileHandlers.open();

  const getUpdatedTimeLabel = () => {
    if (status === "complete") return "Completed on";
    if (status === "rejected") return "Rejected on";
    if (status === "submitted") return "Submitted on";
    if (status === "assigned") return "Assigned on";
  };

  return (
    <>
      {member && (
        <Box>
          <Text fw={600} size="sm">
            Member{" "}
          </Text>

          <Flex justify={"space-between"} align={"center"}>
            <Text>{member.name}</Text>
            <Button
              variant="transparent"
              size="xs"
              onClick={() => openMember(member.id)}
            >
              View Details
            </Button>
          </Flex>
        </Box>
      )}

      {status !== "initiated" && <Divider my={"xs"} />}

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

      <UserProfileModal
        opened={userProfileModalOpen}
        setOpened={userProfileHandlers.close}
        userId={member?.id}
        userType={"Member"}
      />
    </>
  );
};

export default GeneralDetails;
