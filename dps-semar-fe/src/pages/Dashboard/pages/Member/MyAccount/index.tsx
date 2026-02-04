import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { getUser } from "../../../../../api/common";
import InfoRow from "../../../../../components/InfoRow";
import Icon from "../../../../../assets/member.png";
import ChangePassword from "../../../../../components/Common/ChangePassword";
import { useMediaQuery } from "@mantine/hooks";
import { useDashboardUser } from "../../../DashboardProvider";
import ChannelModals from "../../../../../components/ChannelModals";
import RegisterAPIs from "../../../../../api/register";
import { notifications } from "@mantine/notifications";

const MyAccount = () => {
  const [memberData, setMemberData] = useState(null);
  const { userData } = useDashboardUser();

  const fetchMemberData = async () => {
    try {
      const response = await getUser("member");

      setMemberData(response);
    } catch (error) {
      console.error("Error fetching member data:", error);
    }
  };

  useEffect(() => {
    fetchMemberData();
  }, []);

  const handleSubmitChannels = async () => {
    const res = await RegisterAPIs.updateMember(memberData);
    if (res) {
      notifications.show({
        message: "Success",
        color: "green",
      });
    }
  };

  const handleSubmitChannelData = (data: any) => {
    setMemberData((prev) => {
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

  const email = memberData ? memberData.email : "Not Provided";
  const phone = memberData ? memberData.phone : "Not  Provided";
  const fullName = memberData
    ? `${memberData.firstName} ${memberData.lastName}`
    : "Not Provided";
  const payInCommissionRate = memberData
    ? memberData.payinCommissionRate
    : "Not Provided";
  const payOutCommissionRate = memberData
    ? memberData.payoutCommissionRate
    : "Not Provided";
  const topupCommissionRate = memberData
    ? memberData.topupCommissionRate
    : "Not provided";
  const singlePayoutLowerLimit = memberData
    ? memberData.singlePayoutLowerLimit
    : "Not provided";
  const singlePayoutUpperLimit = memberData
    ? memberData.singlePayoutUpperLimit
    : "Not provided";
  const dailyTotalPayoutLimit = memberData
    ? memberData.dailyTotalPayoutLimit
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
              <Text ta={isTablet ? "left" : "center"}>Member Account</Text>
            </Box>
          </Flex>

          <Box>
            <InfoRow label={"Email"} value={email} />
            <InfoRow label={"Phone"} value={phone} />
          </Box>
        </Flex>
      </Paper>
      <Grid grow justify="flex-start" align="stretch" mt={"lg"}>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Paper
            radius={"md"}
            h={"100%"}
            style={{ position: "relative", padding: "20px 20px 60px" }}
          >
            <Center mb={"lg"}>
              <Title order={3}>My Channels</Title>
            </Center>
            <ChannelModals
              handleChange={handleSubmitChannelData}
              multiple={false}
              editData={memberData}
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
          <Paper p={"lg"} radius={"md"} h={"100%"}>
            <Center mb={"lg"}>
              <Title order={3}>Rates and Limits</Title>
            </Center>
            <Stack>
              <InfoRow
                label={"Payin Commission Rate"}
                value={payInCommissionRate + "%"}
              />
              <InfoRow
                label={"Payout Commission Rate"}
                value={payOutCommissionRate + "%"}
              />
              <InfoRow
                label={"Top-up Commission Rate"}
                value={topupCommissionRate + "%"}
              />

              <Divider />
              <InfoRow
                label={"Minimum Single Payout amount"}
                value={singlePayoutLowerLimit}
              />
              <InfoRow
                label={"Maximum Single Payout amount"}
                value={singlePayoutUpperLimit}
              />

              <InfoRow
                label={"Maximum Daily Payout amount"}
                value={dailyTotalPayoutLimit}
              />
            </Stack>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6 }}>
          <ChangePassword />
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6 }}></Grid.Col>
      </Grid>
    </div>
  );
};

export default MyAccount;
