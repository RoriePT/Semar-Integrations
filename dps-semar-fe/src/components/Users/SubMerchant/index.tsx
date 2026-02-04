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
import CommonAPIs from "../../../api/common";

const SubMerchant = ({ opened, setOpened, userId }) => {
  const [merchantDetails, setMerchantDetails] = useState(null);
  const [loader, setLoader] = useState(false);

  const fetchUserData = async () => {
    setLoader(true);
    if (opened) {
      const res = await CommonAPIs.getUser("sub-merchant", userId);
      if (res) setMerchantDetails(res);
      setLoader(false);
    }
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
        title="Sub-merchant Information"
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
              <InfoRow
                label="Name"
                value={
                  merchantDetails?.firstName + " " + merchantDetails?.lastName
                }
              />
              <InfoRow label="Role" value={"SUB-MERCHANT"} />
              <InfoRow label="Email" value={merchantDetails?.email} />
              <InfoRow label="Phone" value={merchantDetails?.phone} />
              <InfoRow
                label="Joined on"
                value={moment(merchantDetails?.createdAt).format(
                  "DD MMM, YYYY | hh:mm a"
                )}
              />
              <InfoRow
                label="Status"
                value={merchantDetails?.enabled ? "ENABLED" : "DISABLED"}
              />
            </div>
            <Paper p={"lg"} radius={"md"} h={"100%"}>
              <Center mb={"lg"}>
                <Title order={4}>Profile Details</Title>
              </Center>

              <Stack>
                <PermissionField
                  label={"Submit payout requests"}
                  helperText={""}
                  isAlloted={merchantDetails?.permissionSubmitPayouts}
                />
                <PermissionField
                  label={"Submit withdrawal requests"}
                  helperText={""}
                  isAlloted={merchantDetails?.permissionSubmitWithdrawals}
                />
                <PermissionField
                  label={"Update withdraw channel profiles"}
                  helperText={""}
                  isAlloted={
                    merchantDetails?.permissionUpdateWithdrawalProfiles
                  }
                />
              </Stack>
            </Paper>
          </>
        )}
      </Modal>
    </div>
  );
};

export default SubMerchant;
