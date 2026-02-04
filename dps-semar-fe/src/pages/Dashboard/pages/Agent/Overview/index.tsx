import { Box, Divider, Flex, Grid, Paper, Text, Title } from "@mantine/core";
import React from "react";
import { LineChart } from "@mantine/charts";
import { useMediaQuery } from "@mantine/hooks";
import MainBox from "../../../../../components/OverallBoxes/MainBox";
import SubBox from "../../../../../components/OverallBoxes/SubBox";
import OverviewLoader from "../../../../../components/OverviewLoader";
import useData from "./useData";

const Overview = () => {
  const { isMobile, orders, graphData, loading } = useData();

  return (
    <Box
      pos={"relative"}
      style={{ visibility: loading ? "hidden" : "visible" }}
      mah={loading ? "100%" : "none"}
    >
      {loading && <OverviewLoader />}
      <Grid grow justify="flex-start" align="stretch">
        <Grid.Col span={{ base: 12, sm: 5 }}>
          <MainBox
            amount={orders.balance}
            subHeading="Balance"
            isForAmount={true}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 5 }}>
          <MainBox
            amount={orders.withdrawalAmount}
            subHeading="Withdrawn Amount"
            isForAmount={true}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 2 }}></Grid.Col>
      </Grid>

      <Grid grow justify="flex-start" align="stretch" pt={24}>
        <Grid.Col span={{ base: 12, sm: 10 }}>
          <Paper p={"24"} radius={"md"} h={"100%"} shadow="sm">
            <Title
              order={3}
              c="#101113"
              style={{ fontSize: "24px", fontWeight: "600" }}
            >
              Commissions
            </Title>
            <Divider my="12" />
            <Flex direction={isMobile ? "column" : "row"}>
              <Box style={{ width: isMobile ? "100%" : "50%" }}>
                <SubBox
                  amount={orders.commissions}
                  subHeading={"Total no. of commissions"}
                />
                <Divider my="8" />
                <SubBox
                  amount={orders.commissionAmount}
                  subHeading="Total commissions  amount"
                  isForAmount={true}
                />
              </Box>
              <Box style={{ width: isMobile ? "100%" : "50%" }}>
                <Text
                  p={24}
                  style={{
                    fontSize: "20px",
                    lineHeight: "24px",
                    fontWeight: "400",
                  }}
                >
                  Total number of commissions
                </Text>

                <LineChart
                  h={340}
                  data={graphData}
                  dataKey="date"
                  series={[{ name: "Commissions", color: "indigo.6" }]}
                  curveType="linear"
                />
              </Box>
            </Flex>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 2 }}></Grid.Col>
      </Grid>
    </Box>
  );
};

export default Overview;
