import {
  Badge,
  Box,
  Center,
  Flex,
  Loader,
  Modal,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import InfoRow from "../../InfoRow";
import UserDetailAPIs from "../../../api/userDetails";
import { useEffect, useState } from "react";
import moment from "moment";
import { formatDateIST } from "../../../utils";

const Admin = ({ opened, setOpened, userId }) => {
  const [adminDetails, setAdminDetails] = useState(null);
  const [loader, setLoader] = useState(false);

  const fetchUserData = async () => {
    setLoader(true);
    const res = await UserDetailAPIs.getUserDetails("admin", userId);
    if (res) setAdminDetails(res);
    setLoader(false);
  };

  const PermissionField = ({ label, helperText, isAlloted }) => {
    return (
      <Flex justify={"space-between"} align={"center"}>
        <Box>
          <Title order={5}>{label}</Title>
          <Text c={"gray"}>{helperText}</Text>
        </Box>
        <Badge variant="dot" color={isAlloted ? "green" : "red"} size="lg">
          {isAlloted ? <>Allowed</> : <>Restricted</>}
        </Badge>
      </Flex>
    );
  };

  useEffect(() => {
    fetchUserData();
  }, [opened]);

  return (
    <div>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Admin Information"
        centered
        size="lg"
      >
        {loader ? (
          <Flex>
            <Loader />
          </Flex>
        ) : (
          <>
            <div style={{ marginBottom: "10px", padding: "10px" }}>
              <InfoRow label="Name" value={adminDetails?.name} />
              <InfoRow label="Role" value={adminDetails?.role} />
              <InfoRow label="Email" value={adminDetails?.email} />
              <InfoRow label="Phone" value={adminDetails?.phone} />
              <InfoRow
                label="Joined on"
                value={formatDateIST(adminDetails?.joinedOn)}
              />
              <InfoRow
                label="Status"
                value={adminDetails?.status ? "ENABLED" : "DISABLED"}
              />
            </div>
            <Paper p={"lg"} radius={"md"} h={"100%"}>
              <Center mb={"lg"}>
                <Title order={4}>Profile Details</Title>
              </Center>

              <Stack>
                <PermissionField
                  label={"Add other admins"}
                  helperText={""}
                  isAlloted={adminDetails?.canAddOtherAdmin}
                />
                <PermissionField
                  label={"Add members, merchants and agents"}
                  helperText={""}
                  isAlloted={adminDetails?.canAddOtherUsers}
                />
                <PermissionField
                  label={"Verify top-up and payout orders"}
                  helperText={""}
                  isAlloted={adminDetails?.canVerifyOrders}
                />
                <PermissionField
                  label={"Handle Withdrawal Orders"}
                  helperText={""}
                  isAlloted={adminDetails?.canHandleWithdrawalOrders}
                />
                <PermissionField
                  label={"Update balances and quotas"}
                  helperText={""}
                  isAlloted={adminDetails?.canDoManualAdjustment}
                />

                <PermissionField
                  label={"Update System Configurations"}
                  helperText={""}
                  isAlloted={adminDetails?.canUpdateSystemConfig}
                />

                <PermissionField
                  label={"Channels and Gateways"}
                  helperText={""}
                  isAlloted={adminDetails?.canUpdateChannelsAndGateways}
                />
              </Stack>
            </Paper>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Admin;
