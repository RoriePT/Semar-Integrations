import { Container, Grid, Text } from "@mantine/core";
import { GatewayName } from "../../../../../api/gateway";
import Gateway from "./Gateway";

const Gateways = () => {
  return (
    <Container maw={"100%"}>
      <Text c={"gray"} maw={"700px"}>
        A gateway is a third-party payment processor integrated into Semar that
        facilitates various financial transactions, including pay-ins, pay-outs,
        and withdrawals.
      </Text>

      <Grid mt={"xl"}>
        <Grid.Col span={6}>
          <Gateway gateway={GatewayName.PHONEPE} />
        </Grid.Col>
        <Grid.Col span={6}>
          <Gateway gateway={GatewayName.RAZORPAY} />
        </Grid.Col>
        <Grid.Col span={6}>
          <Gateway gateway={GatewayName.UNIQPAY} />
        </Grid.Col>
        <Grid.Col span={6}>
          <Gateway gateway={GatewayName.PAYU} />
        </Grid.Col>
        <Grid.Col span={6}>
          <Gateway gateway={GatewayName.CASHFREE} />
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default Gateways;
