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
import { formatDateIST } from "../../../../../utils";

const GeneralDetails = ({
  payinMadeOn,
  userName,
  userEmail,
  userMobile,
  merchant,
  member,
  gateway,
  upiVendor,
  createdOn,
  updatedOn,
  status,
  callbackStatus,
}) => {
  const [userProfileModalOpen, userProfileHandlers] = useDisclosure();
  const [selectedUserType, setSelectedUserType] = useState("");

  const openMerchant = (id) => {
    userProfileHandlers.open();
    setSelectedUserType("MERCHANT");
  };

  const openMember = (id) => {
    userProfileHandlers.open();
    setSelectedUserType("MEMBER");
  };

  const getUpdatedTimeLabel = () => {
    if (status === "complete") return "Completed on";
    if (status === "failed") return "Failed on";
    if (status === "submitted") return "Submitted on";
    if (status === "assigned") return "Assigned on";
  };

  return (
    <>
      {status !== "initiated" && (
        <>
          <Flex gap={"sm"} align={"center"}>
            <Text fw={500}>
              {status === "assigned" ? "Payin assigned to:" : "Payin made via:"}
            </Text>

            <Text>
              <Badge color="gray.6">
                {payinMadeOn === "member" 
                  ? "Member Channel" 
                  : payinMadeOn === "upi_vendor"
                  ? "UPI Vendor"
                  : "Gateway"}
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
      <Box>
        <Text fw={600} size="sm">
          Merchant{" "}
        </Text>

        <Flex justify={"space-between"} align={"center"}>
          <Text>{merchant.name}</Text>
          <Button
            variant="transparent"
            size="xs"
            onClick={() => openMerchant(merchant.id)}
          >
            View Details
          </Button>
        </Flex>
      </Box>
      {payinMadeOn === "member" && (
        <>
          <Divider my={"xs"} />
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
        </>
      )}

      {payinMadeOn === "gateway" && (
        <>
          <Divider my={"xs"} />
          <Flex gap={"sm"} align={"center"}>
            <Text fw={500}>Gateway:</Text>

            <Text>{gateway}</Text>
          </Flex>
        </>
      )}

      {payinMadeOn === "upi_vendor" && (
        <>
          <Divider my={"xs"} />
          <Box>
            <Text fw={600} size="sm">
              UPI Vendor{" "}
            </Text>
            <Flex justify={"space-between"} align={"center"}>
              <Box>
                <Text>{upiVendor?.name || "N/A"}</Text>
                {upiVendor?.upiId && (
                  <Text size="xs" c={"dimmed"}>
                    UPI ID: {upiVendor.upiId} {upiVendor.upiTitle && `(${upiVendor.upiTitle})`}
                  </Text>
                )}
                {upiVendor?.mobile && (
                  <Text size="xs" c={"dimmed"}>
                    Mobile: {upiVendor.mobile}
                  </Text>
                )}
              </Box>
            </Flex>
          </Box>
        </>
      )}

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

      <UserProfileModal
        opened={userProfileModalOpen}
        setOpened={userProfileHandlers.close}
        userId={selectedUserType === "MERCHANT" ? merchant?.id : member?.id}
        userType={selectedUserType === "MERCHANT" ? "Merchant" : "Member"}
      />
    </>
  );
};

export default GeneralDetails;
