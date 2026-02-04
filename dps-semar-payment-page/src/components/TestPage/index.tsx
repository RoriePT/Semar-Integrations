import { Button, Flex, Paper, Text, Title } from "@mantine/core";

import logo from "../../assets/kingsgate.svg";

const TestPage = ({ handlePaymentMethodSelect }) => {
  const handleChannelSelect = () => {
    handlePaymentMethodSelect();
  };

  return (
    <Flex w={"100vw"} h={"100dvh"} justify={"center"} align={"center"}>
      <Paper p={"xl"} ta={"center"} maw={"380px"} radius={"lg"}>
        <img src={logo} alt="" style={{ width: "150px" }} />
        <Title order={3} mt={"sm"} td={"underline"}>
          Sandbox Payment Testing
        </Title>
        <Title order={5} mt={"xl"}>
          Please choose your preferred payment gateway for testing.
        </Title>
        <Text mt={"sm"} c={"dimmed"}>
          All transactions are simulated and do not involve real money or
          orders.
        </Text>
        <Flex
          direction={"column"}
          justify={"center"}
          align={"stretch"}
          gap={"sm"}
          mt={"md"}
        >
          <Button
            size="md"
            onClick={() => {
              handleChannelSelect();
            }}
          >
            Member Channel
          </Button>
          <Button
            size="md"
            onClick={() => {
              handleChannelSelect();
            }}
          >
            Razorpay
          </Button>
          <Button
            size="md"
            onClick={() => {
              handleChannelSelect();
            }}
          >
            PhonePe
          </Button>
          <Button
            size="md"
            onClick={() => {
              handleChannelSelect();
            }}
          >
            PayU
          </Button>
          <Button
            size="md"
            onClick={() => {
              handleChannelSelect();
            }}
          >
            Cashfree
          </Button>
        </Flex>
      </Paper>
    </Flex>
  );
};

export default TestPage;
