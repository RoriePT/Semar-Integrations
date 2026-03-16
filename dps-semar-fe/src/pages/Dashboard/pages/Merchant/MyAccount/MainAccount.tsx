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
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import CommonAPIs from "../../../../../api/common";
import RegisterAPIs from "../../../../../api/register";
import Icon from "../../../../../assets/merchant.png";
import ChannelModals from "../../../../../components/ChannelModals";
import ChangePassword from "../../../../../components/Common/ChangePassword";
import InfoRow from "../../../../../components/InfoRow";
import { useDashboardUser } from "../../../DashboardProvider";
const MainAccount = () => {
  const [merchantData, setMerchantData] = useState(null);
  const [allChannelsAdded, setAllChannelsAdded] = useState(false);

  const { userData } = useDashboardUser();

  const isTablet = useMediaQuery("(min-width: 768px)");

  const formatChannels = (channels: any[] | undefined) => {
    if (!Array.isArray(channels) || !channels.length) return "None";

    return channels
      .map((channel) => channel?.channel || channel?.name || channel)
      .filter(Boolean)
      .join(", ");
  };

  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        const response = await CommonAPIs.getUser("merchant");
        setMerchantData(response);

        // Check if all channels are already added
        if (response?.channelProfile) {
          const allAdded = Object.values(response.channelProfile).every(
            (profiles) => Array.isArray(profiles) && profiles.length > 0
          );
          setAllChannelsAdded(allAdded);
        }
      } catch (error) {
        console.error("Error fetching agent data:", error);
      }
    };

    fetchAgentData();
  }, []);

  const handleSubmitChannels = async () => {
    const res = await RegisterAPIs.updateMerchantChannels(merchantData);
    if (res) {
      notifications.show({
        message: "Success",
        color: "green",
      });
    }
  };

  const handleSubmitChannelData = (data: any) => {
    setMerchantData((prev) => {
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

    // Check if all three channels are added
    const allAdded = Object.values(data).every(
      (profiles) => Array.isArray(profiles) && profiles.length > 0
    );
    setAllChannelsAdded(allAdded);
  };

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
              <Title
                order={3}
              >{`${merchantData?.firstName} ${merchantData?.lastName}`}</Title>
              <Text
                ta={isTablet ? "left" : "center"}
              >{`Merchant Account`}</Text>
            </Box>
          </Flex>

          <Box>
            <InfoRow label={"Email"} value={merchantData?.email} />
            <InfoRow label={"Phone"} value={merchantData?.phone} />
          </Box>
        </Flex>
      </Paper>
      <Grid justify="flex-start" align="stretch" mt={"lg"}>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Paper p={"lg"} radius={"md"} h={"100%"}>
            <Center mb={"lg"}>
              <Title order={3}>Business and Payins</Title>
            </Center>
            <Stack>
              <InfoRow
                label={"Business Name"}
                value={merchantData?.businessName}
              />
              <InfoRow
                label={"Business Url"}
                value={merchantData?.businessUrl}
              />
              <InfoRow
                label={"Integration Id"}
                value={merchantData?.integrationId}
              />
              <InfoRow label={"API Key"} value={merchantData?.apiKey} />
              <Divider />
              <InfoRow
                label={"Payin Channels"}
                value={formatChannels(merchantData?.payinChannels)}
              />
              {/* <InfoRow
                label={"Payin Service Rate"}
                value={merchantData?.payinServiceRate + "%"}
              /> */}
              {/* <Title order={5}>Payin Service Rate</Title> */}
              {merchantData?.payinServiceRate ? (
                merchantData.payinServiceRate.mode === "PERCENTAGE" ? (
                  <InfoRow
                    label="Service Rate"
                    value={`Percentage (${merchantData.payinServiceRate.percentageAmount}%)`}
                  />
                ) : merchantData.payinServiceRate.mode === "ABSOLUTE" ? (
                  <InfoRow
                    label="Payin Amount"
                    value={`Absolute (₹${merchantData.payinServiceRate.absoluteAmount})`}
                  />
                ) : merchantData.payinServiceRate.mode === "COMBINATION" ? (
                  <>
                    <InfoRow
                      label="Service Rate"
                      value={`Combination (${merchantData.payinServiceRate.percentageAmount}% + ₹${merchantData.payinServiceRate.absoluteAmount})`}
                    />
                  </>
                ) : (
                  <InfoRow label="N/A" value="" />
                )
              ) : (
                <InfoRow label="N/A" value="" />
              )}
            </Stack>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Paper p={"lg"} radius={"md"} h={"100%"}>
            <Center mb={"lg"}>
              <Title order={3}>Payouts and Withdrawals</Title>
            </Center>
            <Stack style={{ position: "relative", padding: "20px 20px 60px" }}>
              <InfoRow
                label={"Payout Channels"}
                value={formatChannels(merchantData?.payoutChannels)}
              />
              {/* <InfoRow
                label={"Payout Service Rate"}
                value={merchantData?.payoutServiceRate + "%"}
              /> */}
              {/* <Title order={5}>Payout Service Rate</Title> */}
              {merchantData?.payoutServiceRate ? (
                merchantData.payoutServiceRate.mode === "PERCENTAGE" ? (
                  <InfoRow
                    label="Payout service Rate"
                    value={`Percentage (${merchantData.payoutServiceRate.percentageAmount}%)`}
                  />
                ) : merchantData.payoutServiceRate.mode === "ABSOLUTE" ? (
                  <InfoRow
                    label="Payout Amount"
                    value={`Absolute (₹${merchantData.payoutServiceRate.absoluteAmount})`}
                  />
                ) : merchantData.payoutServiceRate.mode === "COMBINATION" ? (
                  <>
                    <InfoRow
                      label="Service Rate"
                      value={`Combination (${merchantData.payoutServiceRate.percentageAmount}% + ₹${merchantData.payoutServiceRate.absoluteAmount})`}
                    />
                  </>
                ) : (
                  <InfoRow label="N/A" value="" />
                )
              ) : (
                <InfoRow label="N/A" value="" />
              )}
              <InfoRow
                label={"Minimum Payout Amount"}
                value={merchantData?.minPayout}
              />
              <InfoRow
                label={"Maximum Payout Amount"}
                value={merchantData?.maxPayout}
              />
              <Divider />
              <InfoRow
                label={"Withdrawal Service Rate"}
                value={merchantData?.withdrawalServiceRate + "%"}
              />
              <InfoRow
                label={"Minimum Withdrawal Amount"}
                value={merchantData?.minWithdrawal}
              />
              <InfoRow
                label={"Maximum Withdrawal Amount"}
                value={merchantData?.maxWithdrawal}
              />
            </Stack>
          </Paper>
        </Grid.Col>
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
              editData={merchantData}
              businessUpi={true}
            />
            <Button
              style={
                allChannelsAdded
                  ? { width: "100%", marginTop: "20px" }
                  : { position: "absolute", right: "20px", bottom: "20px" }
              }
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

export default MainAccount;
