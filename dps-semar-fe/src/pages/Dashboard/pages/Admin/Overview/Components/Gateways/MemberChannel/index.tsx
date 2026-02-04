import { Grid } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import DataCard from "./DataCard";
import { useState } from "react";
import useData from "./useData";

const MemberChannel = () => {
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
            isMobile={isMobile}
            isTablet={isTablet}
            collapsingScreen={collapsingScreen}
            orders={payinData.orders}
            distribution={payinData.distribution}
            loading={loading.payins}
            handleDateSubmit={(start, end) => getDateData(start, end, "payins")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6 }}>
          <DataCard
            title="Payouts"
            isMobile={isMobile}
            isTablet={isTablet}
            collapsingScreen={collapsingScreen}
            orders={payoutData.orders}
            distribution={payoutData.distribution}
            loading={loading.payouts}
            handleDateSubmit={(start, end) =>
              getDateData(start, end, "payouts")
            }
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6 }}>
          <DataCard
            title="Withdrawals"
            isMobile={isMobile}
            isTablet={isTablet}
            collapsingScreen={collapsingScreen}
            orders={withdrawalData.orders}
            distribution={withdrawalData.distribution}
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

export default MemberChannel;
