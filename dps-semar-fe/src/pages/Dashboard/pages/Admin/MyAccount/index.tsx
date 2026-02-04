import {
  Badge,
  Box,
  Center,
  Flex,
  Grid,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import InfoRow from "../../../../../components/InfoRow";
import Icon from "../../../../../assets/admin.png";
import axios from "axios";
import { useDashboardUser } from "../../../DashboardProvider";
import CommonAPIs from "../../../../../api/common";

import ChangePassword from "../../../../../components/Common/ChangePassword";
import { useMediaQuery } from "@mantine/hooks";

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

const MyAccount = () => {
  // const isSubAdmin = true;

  const { userData } = useDashboardUser();

  const {
    firstName,
    lastName,
    phone,
    email,
    permissionAdmins,
    permissionChannelsAndGateways,
    permissionHandleWithdrawals,
    permissionSystemConfig,
    permissionUsers,
    permissionVerifyOrders,
    permissionAdjustBalance,
    role,
  } = userData;
  const isSubAdmin = role === "SUB_ADMIN";
  const isTablet = useMediaQuery("(min-width: 768px)");

  return (
    <div>
      <Paper p={"lg"}>
        <Flex
          justify={"space-between"}
          align={"center"}
          style={{
            flexDirection: isTablet ? "row" : "column",
            gap: isTablet ? "20px" : "10px",
          }}
        >
          <Flex
            gap={"md"}
            align={"center"}
            style={{ flexDirection: isTablet ? "row" : "column" }}
          >
            <img
              src={Icon}
              alt=""
              style={{
                width: "80px",
                borderRadius: "50%",
                boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                padding: "10px",
              }}
            />
            <Box>
              <Title order={3}>
                {firstName} {lastName}
              </Title>
              <Text>
                {isSubAdmin ? <>Sub Admin account</> : <>Super Admin account</>}
              </Text>
            </Box>
          </Flex>

          <Box>
            <InfoRow label={"Email"} value={email} />
            <InfoRow label={"Phone"} value={phone} />
          </Box>
        </Flex>
      </Paper>
      <Grid justify="flex-start" align="stretch" mt={"lg"}>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Paper p={"lg"} radius={"md"} h={"100%"}>
            <Center mb={"lg"}>
              <Title order={3}>Profile Details</Title>
            </Center>

            <Stack>
              <PermissionField
                label={"Add other admins"}
                helperText={""}
                isAlloted={permissionAdmins}
              />
              <PermissionField
                label={"Add members, merchants and agents"}
                helperText={""}
                isAlloted={permissionUsers}
              />
              <PermissionField
                label={"Verify top-up and payout orders"}
                helperText={""}
                isAlloted={permissionVerifyOrders}
              />
              <PermissionField
                label={"Handle Withdrawal Orders"}
                helperText={""}
                isAlloted={permissionHandleWithdrawals}
              />
              <PermissionField
                label={"Update balances and quotas"}
                helperText={""}
                isAlloted={permissionAdjustBalance}
              />

              <PermissionField
                label={"Update System Configurations"}
                helperText={""}
                isAlloted={permissionSystemConfig}
              />

              <PermissionField
                label={"Channels and Gateways"}
                helperText={""}
                isAlloted={permissionChannelsAndGateways}
              />
            </Stack>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <ChangePassword />
        </Grid.Col>
        {/* <Grid.Col span={{ base: 12, sm: 6 }}>
          <ChangePassword withdrawal={true} />
        </Grid.Col> */}
      </Grid>
    </div>
  );
};

export default MyAccount;
