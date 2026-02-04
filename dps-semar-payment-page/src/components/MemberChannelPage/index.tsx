import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Center,
  Container,
  Drawer,
  Flex,
  Loader,
  Paper,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import Logo from "../../assets/kingsgate.svg";
import APIs from "../../services/api";
import Instructions from "./Instructions";
import UPI from "./components/UPI";
import Netbanking from "./components/Netbanking";
import EWallet from "./components/EWallet";

import { MemberChannelResponse } from "../../types/payment";

const MemberChannelPage = ({
  orderId,
  environment,
  handleReceiptUploaded,
  status,
}) => {
  const [opened, handlers] = useDisclosure();
  const [instructions, setInstructions] = useState(true);

  const [amount, setAmount] = useState("");
  const [channel, setChannel] = useState<string | null>(null);
  const [memberChannel, setMemberChannel] = useState<
    MemberChannelResponse["memberDetails"] | null
  >(null);

  const [txnId, setTxnId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getMemberChannelDetails = async () => {
    if (!orderId || !environment) {
      return;
    }

    const data = await APIs.getMemberChannelForPayment(orderId, environment);

    if (!data.isError && data.data) {
      setAmount(String(data.data.amount));
      setChannel(data.data.channel);
      setMemberChannel(data.data.memberDetails);
    }
  };

  useEffect(() => {
    getMemberChannelDetails();
  }, [orderId, environment]);

  const getChannelDetails = () => {
    if (channel === "upi")
      return (
        <UPI
          name={memberChannel?.name}
          amount={amount}
          upiId={memberChannel?.upiId}
          isBusinessUpi={memberChannel?.isBusiness}
          qrCode={memberChannel?.qrCode}
          trackingId={memberChannel?.trackingId}
        />
      );
    if (channel === "netbanking")
      return (
        <Netbanking
          amount={amount}
          beneficiaryName={memberChannel?.beneficiaryName}
          bankName={memberChannel?.bank}
          accountNumber={memberChannel?.accountNumber}
          ifsc={memberChannel?.ifsc}
        />
      );

    return (
      <EWallet
        amount={amount}
        appName={memberChannel?.appName}
        mobile={memberChannel?.mobile}
      />
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    handleReceiptUploaded(txnId);
  };

  return (
    <Flex justify={"center"} bg={"blue.1"} h={"100dvh"} pos="relative">
      <Paper
        maw={"400px"}
        miw={"400px"}
        style={{ position: "relative", overflowY: opened ? "hidden" : "auto" }}
        bg={"#f2f7fc"}
        id="map-container"
      >
        <Box w={"100%"} h={"100%"} p={"sm"}>
          {memberChannel ? (
            <Flex
              direction={"column"}
              justify={"space-between"}
              h={"100%"}
              id="kg-payment-page"
            >
              <div style={{ flexGrow: 1 }}>
                {status === "SUCCESS" ? (
                  <Center h={"100%"}>
                    <Flex direction={"column"} align={"center"}>
                      <Text fz={"xl"} fw={700} c={"green"} mb={"md"}>
                        Payment Successful!
                      </Text>
                      <Text fz={"md"} ta={"center"} c={"gray.7"}>
                        Your payment has been processed successfully.
                      </Text>
                    </Flex>
                  </Center>
                ) : !instructions ? (
                  <>{getChannelDetails()}</>
                ) : (
                  <Instructions
                    channel={channel}
                    handleContinue={() => setInstructions(false)}
                  />
                )}
                {!instructions && status !== "SUCCESS" && (
                  <>
                    <Center>
                      <Button
                        size="md"
                        radius={"xl"}
                        mt={"lg"}
                        onClick={handlers.open}
                      >
                        I've Made My Payment
                      </Button>
                    </Center>
                    <Alert color="yellow" p={"sm"} mt={"md"}>
                      <Text fz={"xs"} ta={"center"} c={"yellow"} fw={"bolder"}>
                        Click the button above once you've made your payment
                      </Text>
                    </Alert>
                  </>
                )}
              </div>

              <Flex justify={"center"} align={"center"} gap={"5px"} mt={"sm"}>
                <p style={{ fontSize: "14px" }}>Powered by</p>
                <img src={Logo} alt="" style={{ width: "80px" }} />
              </Flex>
            </Flex>
          ) : (
            <Flex h={"100%"} justify={"center"} align={"center"}>
              <Loader />
            </Flex>
          )}
        </Box>
        <Drawer
          position="bottom"
          opened={opened}
          onClose={handlers.close}
          title="Submit Transaction Proof"
          closeOnClickOutside={!isSubmitting}
          withCloseButton={!isSubmitting}
          closeOnEscape={!isSubmitting}
          withinPortal
          portalProps={{ target: "#map-container" }}
          styles={{
            overlay: { position: "absolute" },
            inner: { position: "absolute" },
            content: {
              background: "aliceblue",
            },
          }}
          size={"320px"}
        >
          <Container pt={"md"}>
            <Stack gap={"md"}>
              <TextInput
                label="Transaction ID"
                withAsterisk
                size="md"
                placeholder="Enter transaction ID or UTR number"
                onChange={(e) => setTxnId(e.target.value)}
              />

              <Button
                size="md"
                radius={"xl"}
                w={"100%"}
                loading={isSubmitting}
                onClick={handleSubmit}
                disabled={!txnId}
              >
                Submit
              </Button>
            </Stack>
          </Container>
        </Drawer>
      </Paper>
    </Flex>
  );
};

export default MemberChannelPage;
