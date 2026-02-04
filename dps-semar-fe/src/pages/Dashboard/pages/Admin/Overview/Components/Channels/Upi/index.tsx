import { BarChart, LineChart, PieChart } from "@mantine/charts";
import {
  Box,
  Center,
  Divider,
  Flex,
  Grid,
  Paper,
  SegmentedControl,
  Title,
} from "@mantine/core";
import React, { useState } from "react";
import SubBoxWithProps from "../../../../../../../../components/OverallBoxes/SubBoxWithProps";
import { useMediaQuery } from "@mantine/hooks";
import DataCard from "./DataCard";
import useData from "./useData";

const Upi = () => {
  const collapsingScreen = useMediaQuery("(max-width:1190px)");
  const {
    isMobile,
    isTablet,
    payinData,
    payoutData,
    withdrawalData,
    loading,
    getDateData,
  } = useData();

  return (
    <>
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <DataCard
            title="Payins"
            orders={payinData.orders}
            distribution={payinData.distribution}
            isMobile={isMobile}
            isTablet={isTablet}
            collapsingScreen={collapsingScreen}
            loading={loading.payins}
            handleDateSubmit={(start, end) => getDateData(start, end, "payins")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6 }}>
          <DataCard
            title="Payouts"
            orders={payoutData.orders}
            distribution={payoutData.distribution}
            isMobile={isMobile}
            isTablet={isTablet}
            collapsingScreen={collapsingScreen}
            loading={loading.payouts}
            handleDateSubmit={(start, end) =>
              getDateData(start, end, "payouts")
            }
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6 }}>
          <DataCard
            title="Withdrawals"
            orders={withdrawalData.orders}
            distribution={withdrawalData.distribution}
            isMobile={isMobile}
            isTablet={isTablet}
            collapsingScreen={collapsingScreen}
            loading={loading.withdrawls}
            handleDateSubmit={(start, end) =>
              getDateData(start, end, "withdrawls")
            }
          />
        </Grid.Col>
      </Grid>
    </>
  );
};

export default Upi;
