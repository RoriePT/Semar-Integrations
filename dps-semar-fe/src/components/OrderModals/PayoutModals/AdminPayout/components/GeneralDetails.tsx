import { Badge, Box, Button, Divider, Flex, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { formatDateIST } from "../../../../../utils";
import UserProfileModal from "../../../../Users/UserProfileModal";

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
      {payoutMadeVia === "member" && (
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

      {payoutMadeVia === "gateway" && (
        <>
          <Divider my={"xs"} />
          <Flex gap={"sm"} align={"center"}>
            <Text fw={500}>Gateway:</Text>

            <Text>{gateway === "UNIQPAY" ? "BENAKPAY" : gateway}</Text>
          </Flex>
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
        <Text fw={500}>Notification Status:</Text>
        <Badge
          variant="dot"
          color={notificationStatus === "success" ? "green" : "yellow"}
        >
          {notificationStatus}
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
