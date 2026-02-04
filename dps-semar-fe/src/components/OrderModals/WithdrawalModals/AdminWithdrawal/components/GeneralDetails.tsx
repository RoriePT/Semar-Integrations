import { Badge, Box, Button, Divider, Flex, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { formatDateIST } from "../../../../../utils";
import UserProfileModal from "../../../../Users/UserProfileModal";

const GeneralDetails = ({
  withdrawalMadeVia,
  user,
  gateway,
  createdOn,
  updatedOn,
  status,
  notificationStatus,
  userChanelDetails,
}) => {
  const [userProfileModalOpen, userProfileHandlers] = useDisclosure();
  const [selectedUserType, setSelectedUserType] = useState("");

  const getUserType = (role) => {
    if (!role) return "";
    if (role.toLowerCase() === "merchant") return "Merchant";
    if (role.toLowerCase() === "agent") return "Agent";
    if (role.toLowerCase() === "member") return "Member";
  };

  const openUser = (id, role) => {
    userProfileHandlers.open();
    setSelectedUserType(getUserType(role));
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
                {withdrawalMadeVia === "admin"
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
          Recipient User{" "}
        </Text>

        <Flex justify={"space-between"} align={"center"}>
          <Text>
            {user.name} ({user.role})
          </Text>
          <Button
            variant="transparent"
            size="xs"
            onClick={() => openUser(user.id, user.role)}
          >
            View Details
          </Button>
        </Flex>
      </Box>
      <Divider my={"xs"} />
      <Box>
        <Text fw={600} size="sm">
          Recipient channel details:{" "}
        </Text>
        {Object.keys(userChanelDetails).map((key) => {
          if (key === "qrCode") return null;
          return (
            <Flex gap={"xs"} align={"center"}>
              <Text fw={500} size="sm">
                {key}:{" "}
              </Text>
              <Text size="xs" c={"dimmed"}>
                {userChanelDetails[key]}
              </Text>
            </Flex>
          );
        })}
      </Box>

      {withdrawalMadeVia === "gateway" && (
        <>
          <Divider my={"xs"} />
          <Flex gap={"sm"} align={"center"}>
            <Text fw={500}>Gateway:</Text>

            <Text>
              {gateway?.toLowerCase() === "uniqpay" ? "Benakpay" : gateway}
            </Text>
          </Flex>
        </>
      )}

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
        userId={user?.id}
        userType={selectedUserType}
      />
    </>
  );
};

export default GeneralDetails;
