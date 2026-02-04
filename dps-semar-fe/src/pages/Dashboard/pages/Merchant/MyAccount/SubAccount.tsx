import {
  Badge,
  Box,
  Center,
  Divider,
  Flex,
  Grid,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import InfoRow from "../../../../../components/InfoRow";
import Icon from "../../../../../assets/merchant.png";
import { useDashboardUser } from "../../../DashboardProvider";
import ChangePassword from "../../../../../components/Common/ChangePassword";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import CommonAPIs from "../../../../../api/common";

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

const SubAccount = () => {
  const [merchantData, setMerchantData] = useState(null);
  const [loader, setLoader] = useState(true);
  const { userData } = useDashboardUser();

  const isTablet = useMediaQuery("(min-width: 768px)");

  const fetchAgentData = async () => {
    try {
      const response = await CommonAPIs.getUser("sub-merchant", userData?.id);
      setMerchantData(response);
    } catch (error) {
      console.error("Error fetching agent data:", error);
    }
    setLoader(false);
  };

  useEffect(() => {
    fetchAgentData();
  }, []);

  return (
    <div>
      {loader ? (
        <Loader />
      ) : (
        <>
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
                    {merchantData?.firstName} {merchantData?.lastName}
                  </Title>
                  <Text ta={isTablet ? "left" : "center"}>
                    Merchant Sub Account
                  </Text>
                </Box>
              </Flex>

              <Box>
                <InfoRow label={"Email"} value={merchantData?.email} />
                <InfoRow label={"Phone"} value={merchantData?.phone} />
              </Box>
            </Flex>
          </Paper>
          <Grid grow justify="flex-start" align="stretch" mt={"lg"}>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Paper p={"lg"} radius={"md"} h={"100%"}>
                <Center mb={"lg"}>
                  <Title order={3}>Profile Details</Title>
                </Center>
                <Stack>
                  <InfoRow
                    label={"Main Merchant Account"}
                    value={merchantData?.merchantName}
                  />
                  <InfoRow
                    label={"Merchant Business Name"}
                    value={merchantData?.businessName}
                  />
                  <Divider label="Permitted Operations" />
                  <PermissionField
                    label={"Submit payout requests"}
                    helperText={""}
                    isAlloted={merchantData?.permissionSubmitPayouts}
                  />
                  <PermissionField
                    label={"Submit withdrawal requests"}
                    helperText={""}
                    isAlloted={merchantData?.permissionSubmitWithdrawals}
                  />
                  <PermissionField
                    label={"Update withdraw channel profiles"}
                    helperText={""}
                    isAlloted={merchantData?.permissionUpdateWithdrawalProfiles}
                  />
                </Stack>
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <ChangePassword />
            </Grid.Col>
            {userData.permissionUpdateWithdrawalProfiles && (
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <ChangePassword withdrawal={true} />
              </Grid.Col>
            )}
            <Grid.Col span={{ base: 12, sm: 6 }}></Grid.Col>
          </Grid>
        </>
      )}
    </div>
  );
};

export default SubAccount;
