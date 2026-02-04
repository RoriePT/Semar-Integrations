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
  userName,
  userEmail,
  userMobile,

  createdOn,
  updatedOn,
  status,

  quotaDeducted,
  commissionFee,
  commissionRate,
  withHeldAmount,
  withHeldRate,
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
            ? "Deductible Quota:"
            : "Quota Deducted:"}
        </Text>

        <Text>₹{quotaDeducted}</Text>
      </Flex>
      <Flex gap={"sm"} align={"center"}>
        <Text fw={500}>Commission:</Text>

        <Text>
          ₹{commissionFee} ({commissionRate})
        </Text>
      </Flex>
      {status === "submitted" && (
        <>
          {" "}
          <Flex gap={"sm"} align={"center"}>
            <Text fw={500}>Withheld Amount:</Text>

            <Text>₹{withHeldAmount}</Text>
          </Flex>
          <Text size="xs" c={"gray"}>
            Approve or Reject this order in order to release withheld amount
          </Text>
        </>
      )}
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
