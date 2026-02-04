import { Box, Divider, Grid, Paper, Title } from "@mantine/core";
import React from "react";

import { useMediaQuery } from "@mantine/hooks";
import MainBox from "../../../../../components/OverallBoxes/MainBox";
import SubBoxWithProps from "../../../../../components/OverallBoxes/SubBoxWithProps";
import OverviewLoader from "../../../../../components/OverviewLoader";
import useData from "./useData";

const Overview = () => {
  const {
    isMobile,
    isTablet,
    payinData,
    payoutData,
    topupData,
    balances,
    loading,
  } = useData();

  const getSpan = () => (isMobile ? 12 : isTablet ? 4 : 2);
  const getSpan2 = () => (isTablet ? 12 : 2);

  const payinItems = [
    {
      amount: payinData.ordersPending,
      subHeading: "Pending orders",
      colSpan: getSpan2(),
    },
    {
      amount: payinData.ordersCompleted,
      subHeading: "Completed orders",
      colSpan: getSpan2(),
    },

    {
      amount: payinData.commission,
      subHeading: "Total commissions",
      colSpan: getSpan2(),
      isForAmount: true,
    },
  ];

  const payoutItems = [
    {
      amount: payoutData.ordersPending,
      subHeading: "Pending orders",
      colSpan: getSpan2(),
    },
    {
      amount: payoutData.ordersCompleted,
      subHeading: "Completed orders",
      colSpan: getSpan2(),
    },

    {
      amount: payoutData.commission,
      subHeading: "Total commissions",
      colSpan: getSpan2(),
      isForAmount: true,
    },
  ];

  const topupItems = [
    {
      amount: topupData.ordersCompleted,
      subHeading: "Completed orders",
      colSpan: getSpan(),
    },
    {
      amount: topupData.commission,
      subHeading: "Total commissions",
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
        <Grid.Col span={getSpan()}>
          <MainBox
            amount={balances.quota}
            subHeading="Quota Balance"
            isForAmount={true}
          />
        </Grid.Col>
        <Grid.Col span={getSpan()}>
          <MainBox
            amount={balances.balance}
            subHeading="Commission Balance"
            isForAmount={true}
          />
        </Grid.Col>
        {/* <Grid.Col span={getSpan()}>
          <MainBox
            amount={balances.withdrawal}
            subHeading="Withdrawn Commissions"
            isForAmount={true}
          />
        </Grid.Col> */}
      </Grid>

      <Box pt="24">
        <Paper p="24" radius="md" h="100%" shadow="sm">
          <Title
            order={3}
            c="#101113"
            style={{ fontSize: "24px", fontWeight: "600" }}
          >
            Payin Commissions
          </Title>
          <Divider my="12" />
          <Grid grow justify="flex-start" align="stretch">
            <SubBoxWithProps items={payinItems} isTablet={isTablet} />
          </Grid>
        </Paper>
      </Box>

      <Box pt="24">
        <Paper p="24" radius="md" h="100%" shadow="sm">
          <Title
            order={3}
            c="#101113"
            style={{ fontSize: "24px", fontWeight: "600" }}
          >
            Payout Commissions
          </Title>
          <Divider my="12" />
          <Grid grow justify="flex-start" align="stretch">
            <SubBoxWithProps items={payoutItems} isTablet={isTablet} />
          </Grid>
        </Paper>
      </Box>

      <Box pt="24">
        <Paper p="24" radius="md" h="100%" shadow="sm">
          <Title
            order={3}
            c="#101113"
            style={{ fontSize: "24px", fontWeight: "600" }}
          >
            Total Topup Orders
          </Title>
          <Divider my="12" />
          <Grid grow justify="flex-start" align="stretch">
            <SubBoxWithProps items={topupItems} isTablet={isTablet} />
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default Overview;
