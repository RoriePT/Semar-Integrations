import { Grid } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import DataCard from "./DataCard";
import useData from "./useData";

const UpiVendor = () => {
  const collapsingScreen = useMediaQuery("(max-width:1190px)");

  const {
    isMobile,
    isTablet,
    payinData,
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
      </Grid>
    </>
  );
};

export default UpiVendor;

