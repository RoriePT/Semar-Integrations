import { Box, Button, Center, Divider, Flex, Grid, Paper, Text, Title } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useDashboardUser } from "../../../DashboardProvider";
import axios from "axios";
import CommonAPIs, { getAllUser } from "../../../../../api/common";
import InfoRow from "../../../../../components/InfoRow";
import Icon from "../../../../../assets/agent.png";
import ChangePassword from "../../../../../components/Common/ChangePassword";
import { useMediaQuery } from "@mantine/hooks";
import ChannelModals from "../../../../../components/ChannelModals";
import RegisterAPIs from "../../../../../api/register";
import { notifications } from "@mantine/notifications";
const MyAccount = () => {
  const [agentData, setAgentData] = useState(null);

  const { userData } = useDashboardUser();

  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        const response = await CommonAPIs.getUser("agent");
        setAgentData(response);
      } catch (error) {
        console.error("Error fetching agent data:", error);
      }
    };

    fetchAgentData();
  }, []);

    const handleSubmitChannels = async () => {
      const res = await RegisterAPIs.updateAgentChannels(agentData);
      if (res) {
        notifications.show({
          message: "Success",
          color: "green",
        });
      }
    };

   const handleSubmitChannelData = (data: any) => {
     setAgentData((prev) => {
       const channelProfile = prev?.channelProfile;

       if (channelProfile?.upi) {
         channelProfile.upi = [...data.upi];
       }

       if (channelProfile?.netBanking) {
         channelProfile.netBanking = [...data.netBanking];
       }

       if (channelProfile?.eWallet) {
         channelProfile.eWallet = [...data.eWallet];
       }

       prev.channelProfile = channelProfile;

       return prev;
     });
   };

  const email = agentData ? agentData.email : "Not Provided";
  const phone = agentData ? agentData.phone : "Not  Provided";
  const fullName = agentData
    ? `${agentData.firstName} ${agentData.lastName}`
    : "Not Provided";
  const withdrawalRate = agentData
    ? agentData.withdrawalRate
    : "Not Provided";
  const minWithdrawalAmount = agentData
    ? agentData.minWithdrawalAmount
    : "Not Provided";
  const maxWithdrawalAmount = agentData
    ? agentData.maxWithdrawalAmount
    : "Not Provided";
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
              <Title order={3}>{fullName}</Title>
              <Text ta={isTablet ? "left" : "center"}>Agent Account</Text>
            </Box>
          </Flex>

          <Box>
            <InfoRow label={"Email"} value={email} />
            <InfoRow label={"Phone"} value={phone} />
          </Box>
        </Flex>

        <Divider my={"lg"} />

        <Box>
          <InfoRow
            label={"Withdrawal Service Rate"}
            value={+withdrawalRate + "%"}
          />
          <InfoRow
            label={"Minimum Withdrawal Amount"}
            value={minWithdrawalAmount}
          />
          <InfoRow
            label={"Maximum Withdrawal Amount"}
            value={maxWithdrawalAmount}
          />
        </Box>
      </Paper>
      <Grid grow justify="flex-start" align="stretch" mt={"lg"}>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Paper
            p={"lg"}
            radius={"md"}
            h={"100%"}
            style={{ position: "relative", padding: "20px 20px 60px" }}
          >
            <Center mb={"lg"}>
              <Title order={3}>Withdrawal Channels</Title>
            </Center>
            <ChannelModals
              handleChange={handleSubmitChannelData}
              multiple={false}
              editData={agentData}
              businessUpi={true}
            />
            <Button
              style={{ position: "absolute", right: "20px", bottom: "20px" }}
              onClick={handleSubmitChannels}
            >
              Save Changes
            </Button>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <ChangePassword />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <ChangePassword withdrawal={true} />
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default MyAccount;
