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
  payinMadeOn,
  userName,
  userEmail,
  userMobile,
  merchant,
  member,
  gateway,
  createdOn,
  updatedOn,
  status,
  callbackStatus,
  balanceEarned,
  serviceFee,
  serviceRate,
}) => {
  const openMerchant = (id) => {
    alert("To be implemented");
  };

  const openMember = (id) => {
    alert("To be implemented");
  };

  const getUpdatedTimeLabel = () => {
    if (status === "complete") return "Completed on";
    if (status === "failed") return "Failed on";
    if (status === "submitted") return "Submitted on";
    if (status === "assigned") return "Assigned on";
  };

  return (
    <>
      <Flex gap={"sm"} align={"center"}>
        <Text fw={500}>
          {" "}
          {status !== "failed" && status !== "complete"
            ? "Creditable Balance:"
            : "Balance Credited:"}
        </Text>

        <Text>₹{balanceEarned}</Text>
      </Flex>
      <Flex gap={"sm"} align={"center"}>
        <Text fw={500}>Service Fee:</Text>

        <Text>
          ₹{serviceFee} ({serviceRate})
        </Text>
      </Flex>
      <Divider my={"xs"} />
      {status !== "initiated" && (
        <>
          <Flex gap={"sm"} align={"center"}>
            <Text fw={500}>
              {status === "assigned" ? "Payin assigned to:" : "Payin made via:"}
            </Text>

            <Text>
              <Badge color="gray.6">
                {payinMadeOn === "member" ? "Member Channel" : "Gateway"}
              </Badge>
            </Text>
          </Flex>
          <Divider my={"xs"} />
        </>
      )}

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

      <Flex gap={"sm"} align={"center"} mt={"xs"}>
        <Text fw={500}>Callback Status:</Text>
        <Badge
          variant="dot"
          color={callbackStatus === "success" ? "green" : "yellow"}
        >
          {callbackStatus}
        </Badge>
      </Flex>
    </>
  );
};

export default GeneralDetails;
