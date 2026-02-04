import { Button, Flex, Paper, Text, Title, Center, Box } from "@mantine/core";

import UpiLogo from "../../assets/upi.png";
import NetbankingLogo from "../../assets/netbanking.png";
import EWalletLogo from "../../assets/e-wallet.png";

function GeneralGatewayPaymentPage({
  url,
  tabRef,
  setTabRefChanged,
  checkoutDetails,
  channelType = "payment",
}) {
  const getChannelLogo = (channel) => {
    const channelMap = {
      upi: UpiLogo,
      netbanking: NetbankingLogo,
      "e-wallet": EWalletLogo,
    };
    return channelMap[channel] || null;
  };

  const getChannelTitle = (channel) => {
    const titleMap = {
      upi: "UPI",
      netbanking: "Netbanking",
      "e-wallet": "E-Wallet",
    };
    return titleMap[channel] || "Payment";
  };

  const getChannelDescription = (channel) => {
    const descMap = {
      upi: "Pay instantly with any UPI App",
      netbanking: "Securely pay using your preferred bank account.",
      "e-wallet": "Use your digital wallet balance for a fast checkout.",
    };
    return descMap[channel] || "Complete your payment";
  };

  const channelLogo = getChannelLogo(channelType);

  return (
    <Flex
      align={"center"}
      direction={"column"}
      gap={"md"}
      h={"100vh"}
      style={{ backgroundColor: "#f4f4f9" }}
    >
      <Paper
        h={"100vh"}
        style={{
          position: "relative",
          borderRadius: "20px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e9ecef",
          background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
        }}
        p={"lg"}
        id="kg-payment-page"
      >
        <Flex direction={"column"} justify={"space-between"} h={"100%"}>
          <div>
            <Center mb={"xl"}>
              <Title
                order={2}
                fw={700}
                c={"#A85706"}
                style={{
                  textShadow: "0 2px 4px rgba(34, 139, 230, 0.1)",
                }}
              >
                Deposit
              </Title>
            </Center>

            <Box mb={"xl"}>
              {channelLogo && (
                <Flex
                  align={"center"}
                  style={{
                    borderRadius: "16px",
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                    border: "1px solid #e9ecef",
                    boxShadow: "0 8px 25px rgba(34, 139, 230, 0.08)",
                  }}
                  p={"lg"}
                  gap={"md"}
                  w={"100%"}
                >
                  <Box
                    w={"60px"}
                    style={{
                      background: "#f8f9fa",
                      borderRadius: "12px",
                      flexShrink: 0,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      border: "1px solid #e9ecef",
                    }}
                    h={"60px"}
                  >
                    <img
                      src={channelLogo}
                      alt=""
                      style={{ width: channelType === "upi" ? "45px" : "35px" }}
                    />
                  </Box>
                  <Box style={{ flexGrow: 1 }}>
                    <Title order={4} fw={600} c={"#2c3e50"} mb={4}>
                      {getChannelTitle(channelType)}
                    </Title>
                    <Text size="sm" c={"#6c757d"} fw={400}>
                      {getChannelDescription(channelType)}
                    </Text>
                  </Box>
                </Flex>
              )}
            </Box>

            <Box style={{ margin: "60px 0 60px 0" }}>
              <Flex direction={"column"} justify={"center"} align={"center"}>
                <Text size="sm" c={"#6c757d"} fw={500} mb={"md"}>
                  Payment Amount
                </Text>
                <Box
                  style={{
                    border: "2px solid #A85706",
                    borderRadius: "16px",
                    background:
                      "linear-gradient(135deg, #f8f9fa 0%, #fef5eb 100%)",
                    padding: "20px 32px",
                    boxShadow: "0 4px 16px rgba(34, 139, 230, 0.1)",
                  }}
                >
                  <Text
                    c={"#A85706"}
                    fw={700}
                    ta={"center"}
                    style={{
                      letterSpacing: "0.5px",
                      fontSize: "36px",
                      lineHeight: "1.2",
                    }}
                  >
                    ₹ {checkoutDetails.amount}
                  </Text>
                </Box>
              </Flex>
            </Box>

            <Box>
              <Text
                size="sm"
                c={"#6c757d"}
                ta={"center"}
                mb={"lg"}
                style={{ lineHeight: "1.5" }}
              >
                Your order is ready! Click the button below to securely complete
                your payment.
              </Text>

              <Button
                style={{
                  backgroundColor: "#A85706",
                  color: "#ffffff",
                  width: "100%",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: 600,
                  height: "48px",
                  boxShadow: "0 4px 12px rgba(34, 139, 230, 0.3)",
                }}
                onClick={() => {
                  tabRef.current = window.open(url, "_blank");
                  setTabRefChanged((prev) => !prev);
                }}
              >
                {`Proceed to Pay ₹${checkoutDetails.amount}`}
              </Button>
            </Box>
          </div>
        </Flex>
      </Paper>
    </Flex>
  );
}

export default GeneralGatewayPaymentPage;
