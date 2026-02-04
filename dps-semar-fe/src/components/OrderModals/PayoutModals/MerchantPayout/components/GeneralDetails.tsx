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
  payoutMadeVia,
  userName,
  userEmail,
  userMobile,
  merchant,
  member,
  gateway,
  createdOn,
  updatedOn,
  status,
  notificationStatus,
  balanceDeducted,
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
          {status !== "failed" && status !== "complete"
            ? "Deductible Balance:"
            : "Balance Deducted:"}
        </Text>

        <Text>₹{balanceDeducted}</Text>
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
              {status === "assigned"
                ? "Payout assigned to:"
                : "Payout made via:"}
            </Text>

            <Text>
              <Badge color="gray.6">
                {payoutMadeVia === "member" ? "Member Channel" : "Gateway API"}
              </Badge>
            </Text>
          </Flex>
          <Divider my={"xs"} />
        </>
      )}

      <Box>
        <Text fw={600} size="sm">
          Recipient User:{" "}
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
