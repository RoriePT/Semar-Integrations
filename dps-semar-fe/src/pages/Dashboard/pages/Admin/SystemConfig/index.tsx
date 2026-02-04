import { Flex, Grid, Tabs } from "@mantine/core";
import GatewayAndTimeouts from "./Components/GatewayAndTimeouts";
import TopUpConfigurations from "./Components/TopUpConfigurations";
import MemberDefaults from "./Components/MemberDefaults";
import MerchantDefaults from "./Components/MerchantDefaults";
import WithdrawalDefaults from "./Components/Withdrawals";
import DefaultRates from "./Components/DefaultRates";

const SystemConfig = () => {
  return (
    <Tabs variant="default" defaultValue="gallery">
      <Tabs.List mb={"md"}>
        <Tabs.Tab value="gallery">General</Tabs.Tab>
        <Tabs.Tab value="messages">Defaults</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="gallery">
        <Grid grow justify="flex-start" align="stretch">
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <GatewayAndTimeouts />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Flex direction={"column"} gap={"lg"}>
              <TopUpConfigurations />
              <DefaultRates />
            </Flex>
          </Grid.Col>
        </Grid>
      </Tabs.Panel>

      <Tabs.Panel value="messages">
        <Grid grow justify="flex-start" align="stretch">
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <MemberDefaults />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <MerchantDefaults />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <WithdrawalDefaults />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}></Grid.Col>
        </Grid>
      </Tabs.Panel>
    </Tabs>
  );
};

export default SystemConfig;
