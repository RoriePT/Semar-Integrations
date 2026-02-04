import {
  Alert,
  Box,
  Button,
  Center,
  Container,
  Divider,
  Drawer,
  Flex,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FaAngleRight } from "react-icons/fa6";
import EwalletIcon from "../assets/e-wallet.png";
import NetbankingIcon from "../assets/netbanking.png";
import Logo from "../assets/semar_logo.svg";
import UpiIcon from "../assets/upi.png";
import "./styles.css";
const PaymentPage = () => {
  const [opened, handlers] = useDisclosure();
  return (
    <Flex justify={"center"} bg={"brand"} h={"100dvh"}>
      <Paper
        w={"380px"}
        style={{ position: "relative" }}
        p={"lg"}
        id="kg-payment-page"
      >
        <Flex direction={"column"} justify={"space-between"} h={"100%"}>
          <div>
            <Center mt={"md"}>
              <Title order={2}>Checkout</Title>
            </Center>
            <Box ta={"center"} mt={"xl"}>
              <Alert>
                You're making a payment to{" "}
                <Text c={"brand"} fw={700} size="sm">
                  AJAX Gaming Pvt. Ltd.
                </Text>
              </Alert>
            </Box>

            <Flex justify={"center"} gap={"5px"} mt={"lg"}>
              <Title order={6}>Order Id : </Title>
              <Text size="sm">AG-4b4bb4b44</Text>
            </Flex>
            <Divider my={"xl"} />
            <Flex direction={"column"} justify={"center"} align={"center"}>
              <Title order={5}>Payment Amount</Title>
              <Text
                size="xl"
                mt={"xs"}
                c={"brand"}
                fw={600}
                miw={"100px"}
                ta={"center"}
                style={{ border: "1px solid", borderRadius: "4px" }}
              >
                ₹ 4000
              </Text>
            </Flex>

            <Button w={"100%"} mt={"xl"} size="md" onClick={handlers.open}>
              Continue to Payment
            </Button>
          </div>

          <Flex justify={"center"} align={"center"} gap={"5px"} mt={"sm"}>
            <p style={{ fontSize: "14px" }}>Powered by</p>
            <img src={Logo} alt="" style={{ width: "80px" }} />
          </Flex>
        </Flex>

        <Drawer
          position="bottom"
          opened={opened}
          onClose={handlers.close}
          title="Payment Method"
        >
          <Container pt={"md"} h={"100%"}>
            <Title ta={"center"} order={3}>
              Choose a payment method
            </Title>
            <Stack mt={"xl"} gap={"lg"}>
              <Flex
                align={"center"}
                style={{
                  borderRadius: "8px",
                  background: "white",
                  cursor: "pointer",
                  boxShadow:
                    "rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em",
                }}
                p={"sm"}
                gap={"md"}
              >
                <Box
                  w={"50px"}
                  style={{
                    boxShadow:
                      "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
                    borderRadius: "8px",
                    flexShrink: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  h={"50px"}
                >
                  <img src={UpiIcon} alt="" style={{ width: "50px" }} />
                </Box>
                <Box style={{ flexGrow: 1 }}>
                  <Title order={3} c={"#484848"}>
                    UPI
                  </Title>
                  <Text size="xs" c={"gray"}>
                    ffff ffff fffffffff
                  </Text>
                </Box>

                <FaAngleRight />
              </Flex>

              <Flex
                align={"center"}
                style={{
                  borderRadius: "8px",
                  background: "white",
                  cursor: "pointer",
                  boxShadow:
                    "rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em",
                }}
                p={"sm"}
                gap={"md"}
              >
                <Box
                  w={"50px"}
                  style={{
                    boxShadow:
                      "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
                    borderRadius: "8px",
                    flexShrink: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  h={"50px"}
                >
                  <img src={NetbankingIcon} alt="" style={{ width: "32px" }} />
                </Box>
                <Box style={{ flexGrow: 1 }}>
                  <Title order={3} c={"#484848"}>
                    Netbanking
                  </Title>
                  <Text size="xs" c={"gray"}>
                    ffff ffff fffffffff
                  </Text>
                </Box>

                <FaAngleRight />
              </Flex>

              <Flex
                align={"center"}
                style={{
                  borderRadius: "8px",
                  cursor: "pointer",
                  background: "white",
                  boxShadow:
                    "rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em",
                }}
                p={"sm"}
                gap={"md"}
              >
                <Box
                  w={"50px"}
                  style={{
                    boxShadow:
                      "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
                    borderRadius: "8px",
                    flexShrink: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  h={"50px"}
                >
                  <img src={EwalletIcon} alt="" style={{ width: "32px" }} />
                </Box>
                <Box style={{ flexGrow: 1 }}>
                  <Title order={3} c={"#484848"}>
                    e-Wallet
                  </Title>
                  <Text size="xs" c={"gray"}>
                    ffff ffff fffffffff
                  </Text>
                </Box>

                <FaAngleRight />
              </Flex>
            </Stack>
          </Container>
        </Drawer>
      </Paper>
    </Flex>
  );
};

export default PaymentPage;
