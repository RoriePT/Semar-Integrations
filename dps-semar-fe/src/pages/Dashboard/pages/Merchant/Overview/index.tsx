import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Paper,
  SegmentedControl,
  Switch,
  Tabs,
  Title,
} from "@mantine/core";
import React, { useState } from "react";
import MainBox from "../../../../../components/OverallBoxes/MainBox";
import SubBox from "../../../../../components/OverallBoxes/SubBox";
import { useMediaQuery } from "@mantine/hooks";
import { LineChart } from "@mantine/charts";
import SubBoxWithProps from "../../../../../components/OverallBoxes/SubBoxWithProps";
import OverviewLoader from "../../../../../components/OverviewLoader";
import useData from "./useData";

const Overview = () => {
  const {
    isMobile,
    isTablet,
    payinData,
    payoutData,
    balances,
    loading,
    graphData,
  } = useData();

  const getSpan = () => (isMobile ? 12 : 5);
  const getSpan2 = () => (isMobile ? 12 : 1);

  const payinItems = [
    {
      amount: payinData.totalOrders,
      subHeading: "Total orders",
      colSpan: getSpan(),
    },
    {
      amount: payinData.ordersPending,
      subHeading: "Pending orders",
      colSpan: getSpan(),
    },

    {
      amount: payinData.ordersCompleted,
      subHeading: "Completed orders",
      colSpan: getSpan(),
    },
    {
      amount: payinData.ordersFailed,
      subHeading: "Failed orders",
      colSpan: getSpan(),
      isForAmount: false,
    },
    {
      amount: payinData.income,
      subHeading: "Total payin income",
      colSpan: getSpan(),
      isForAmount: true,
    },
    {
      amount: payinData.serviceFee,
      subHeading: "Total payin service fee",
      colSpan: getSpan(),
      isForAmount: true,
    },
  ];

  const payoutItems = [
    {
      amount: payoutData.totalOrders,
      subHeading: "Total orders",
      colSpan: getSpan(),
    },
    {
      amount: payoutData.ordersPending,
      subHeading: "Pending orders",
      colSpan: getSpan(),
    },

    {
      amount: payoutData.ordersCompleted,
      subHeading: "Completed orders",
      colSpan: getSpan(),
    },
    {
      amount: payoutData.ordersFailed,
      subHeading: "Failed orders",
      colSpan: getSpan(),
      isForAmount: false,
    },
    {
      amount: payoutData.payoutAmount,
      subHeading: "Total payout amount",
      colSpan: getSpan(),
      isForAmount: true,
    },
    {
      amount: payoutData.serviceFee,
      subHeading: "Total payout service fee",
      colSpan: getSpan(),
      isForAmount: true,
    },
  ];

  return (
    <Box
      pos={"relative"}
      style={{ visibility: loading ? "hidden" : "visible" }}
      mah={loading ? "100%" : "none"}
    >
      {loading && <OverviewLoader />}
      <Grid grow justify="flex-start" align="stretch">
        <Grid.Col span={{ base: 12, sm: 2 }}>
          <MainBox
            amount={balances.balance}
            subHeading="Balance"
            isForAmount={true}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 2 }}>
          <MainBox
            amount={balances.withdrawal}
            subHeading="Withdrawn Amount"
            isForAmount={true}
          />
        </Grid.Col>
      </Grid>

      <Box mt="md">
        <Paper p={"24"} radius={"md"} h={"100%"} shadow="sm">
          <Flex justify={"space-between"}>
            <Title
              order={3}
              c="#101113"
              style={{ fontSize: "24px", fontWeight: "600" }}
            >
              Payins
            </Title>
          </Flex>
          <Divider my="12" />
          <Flex direction={isTablet ? "column" : "row"}>
            <Box style={{ width: isTablet ? "100%" : "50%" }}>
              <Grid grow justify="flex-start" align="stretch">
                <SubBoxWithProps
                  items={payinItems}
                  isTablet={isTablet}
                  showHrForLastItem={true}
                />
              </Grid>
            </Box>
            <Box
              style={{
                width: isTablet ? "100%" : "50%",
                marginTop: isTablet ? "20px" : "auto",
              }}
            >
              <LineChart
                h={340}
                data={graphData}
                dataKey="date"
                series={[{ name: "Payins", color: "indigo.6" }]}
                curveType="linear"
              />
            </Box>
          </Flex>
        </Paper>
      </Box>

      <Box mt="md">
        <Paper p={"24"} radius={"md"} h={"100%"} shadow="sm">
          <Flex justify={"space-between"}>
            <Title
              order={3}
              c="#101113"
              style={{ fontSize: "24px", fontWeight: "600" }}
            >
              Payouts
            </Title>
          </Flex>
          <Divider my="12" />

          <Grid grow justify="flex-start" align="stretch">
            <SubBoxWithProps items={payoutItems} isTablet={isTablet} />
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default Overview;
