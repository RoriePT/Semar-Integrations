import {
  Alert,
  Button,
  Container,
  Drawer,
  FileInput,
  Flex,
  List,
  Paper,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import Logo from "../../assets/semar_logo.svg";

import { GrAttachment } from "react-icons/gr";
import "../styles.css";
import Netbanking from "./components/Netbanking";

const MemberChannelPage = () => {
  const [opened, handlers] = useDisclosure();
  const [instructions, setInstructions] = useState(true);

  return (
    <Flex justify={"center"} bg={"brand"} h={"100dvh"}>
      <Paper
        w={"380px"}
        style={{ position: "relative" }}
        p={"sm"}
        id="kg-payment-page"
        bg={"#f2f7fc"}
      >
        <Flex direction={"column"} justify={"space-between"} h={"100%"}>
          {instructions ? (
            <div>
              {" "}
              <Netbanking />
            </div>
          ) : (
            <div style={{}}>
              <Paper p={"sm"}>
                <Title order={3}>Rules for Payment</Title>
                <List type="ordered" size="sm" mt={"md"}>
                  <List.Item>
                    By clicking the "Proceed to payment" button below, you will
                    be able to view the QR code and UPI ID for your payment.
                  </List.Item>
                  <List.Item>
                    You can either scan the QR code using any UPI app or
                    manually enter the UPI ID and payment amount in the app.
                  </List.Item>
                  <List.Item>
                    After completing your payment on the UPI app, return to this
                    page and click the "I have made my payment" button.
                  </List.Item>
                  <List.Item>
                    Next, provide your UTR (Transaction ID) and upload a
                    screenshot of the successful transaction.
                  </List.Item>
                  <List.Item>
                    Once your payment is verified, it will be confirmed as
                    successful.
                  </List.Item>
                </List>

                <Button size="md" w={"100%"} my={"md"}>
                  Proceed to payment
                </Button>

                <Alert
                  title="Disclaimer"
                  variant="light"
                  color="yellow"

                  //   icon={<IoMdInformationCircleOutline />}
                >
                  <div style={{ fontSize: "12px" }}>
                    1. The QR and the UPI Id are for one time payment only. Dont
                    try to make more than one transaction, otherwise payment
                    wont be recorded.
                  </div>
                  <div style={{ marginTop: "4px", fontSize: "12px" }}>
                    2. Semar is not responsible for loss of money in case you
                    dont follow the rules of payment.
                  </div>
                </Alert>
              </Paper>
            </div>
          )}

          <Button size="lg" w={"100%"} mt={"md"} onClick={handlers.open}>
            I have made my payment
          </Button>
          <Alert
            title="Click on the below button once you've made payment on the QR or
                UPI Id"
          ></Alert>
          <Flex justify={"center"} align={"center"} gap={"5px"} mt={"sm"}>
            <p style={{ fontSize: "14px" }}>Powered by</p>
            <img src={Logo} alt="" style={{ width: "80px" }} />U
          </Flex>
        </Flex>

        <Drawer
          position="bottom"
          opened={opened}
          onClose={handlers.close}
          title="Submit Transaction Proof"
        >
          <Container pt={"md"} h={"100%"}>
            <Stack gap={"lg"}>
              <TextInput
                label="Enter UTR (Transaction ID)"
                withAsterisk
                description="fjffhhf ffhfhfh fhfh fhfhfh"
                size="lg"
                placeholder="fjfjnfjnfnjf"
              />
              <FileInput
                leftSection={<GrAttachment />}
                label="Upload Transaction Screenshot/Receipt"
                placeholder="kfjnjnfnfnjf"
                leftSectionPointerEvents="none"
                withAsterisk
                size="lg"
              />

              <Button size="lg" w={"100%"}>
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
