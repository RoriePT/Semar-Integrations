import React, { useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import DataCard from "./DataCard";
import { Grid } from "@mantine/core";
import useData from "./useData";

const Ewallet = () => {
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

export default Ewallet;
