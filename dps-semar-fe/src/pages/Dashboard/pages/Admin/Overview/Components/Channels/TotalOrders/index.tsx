import { Grid } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import DataCard from "./DataCard";
import { useState } from "react";
import useData from "./useData";

const TotalOrders = () => {
  const {
    isMobile,
    isTablet,
    payinData,
    payoutData,

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
            overallData={payinData.orders}
            distributedData={payinData.distribution}
            loading={loading.payins}
            handleDateSubmit={(start, end) => getDateData(start, end, "payins")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6 }}>
          <DataCard
            title="Payouts"
            isMobile={isMobile}
            overallData={payoutData.orders}
            distributedData={payoutData.distribution}
            loading={loading.payouts}
            handleDateSubmit={(start, end) =>
              getDateData(start, end, "payouts")
            }
          />
        </Grid.Col>
      </Grid>
    </>
  );
};

export default TotalOrders;
