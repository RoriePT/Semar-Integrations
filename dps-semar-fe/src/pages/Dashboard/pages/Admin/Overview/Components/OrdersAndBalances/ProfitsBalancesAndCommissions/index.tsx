import { BarChart } from "@mantine/charts";
import { Box, Divider, Flex, Grid, Paper, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import DateTimeRangePicker from "../../../../../../../../components/DataTimeRangePicker";
import SubBoxWithProps from "../../../../../../../../components/OverallBoxes/SubBoxWithProps";
import OverviewLoader from "../../../../../../../../components/OverviewLoader";
import useData from "./useData";

const ProfitsBalancesAndCommissions = () => {
  const collapsingScreen = useMediaQuery("(max-width:1190px)");

  const {
    balances,
    commissions,
    graphData,
    loading,
    loading2,
    isMobile,
    isTablet,
    getGraphData,
    getAllData,
  } = useData();

  return (
    <>
      <Box pt="26">
        <Paper
          radius={"md"}
          h={"100%"}
          shadow="sm"
          style={{ padding: isMobile ? "40px 24px" : "17px 17px 40px 17px" }}
        >
          <Title
            order={3}
            c="#101113"
            style={{
              fontSize: "24px",
              fontWeight: "600",
              paddingBottom: isMobile ? "10px" : "unset",
            }}
          >
            Balances
          </Title>
          <Divider my="12" />

          <Flex
            direction={collapsingScreen ? "column" : "row"}
            style={{ visibility: loading ? "hidden" : "visible" }}
            pos={"relative"}
          >
            {loading && <OverviewLoader />}

            <Box style={{ width: "100%" }}>
              <Grid grow justify="flex-start" align="stretch">
                <SubBoxWithProps
                  items={balances}
                  isTablet={isTablet}
                  showHrForLastItem={true}
                />
              </Grid>
            </Box>
          </Flex>
        </Paper>
      </Box>
      <Box pt="26">
        <Paper
          radius={"md"}
          h={"100%"}
          shadow="sm"
          style={{ padding: isMobile ? "40px 24px" : "17px 17px 40px 17px" }}
        >
          <Title
            order={3}
            c="#101113"
            style={{
              fontSize: "24px",
              fontWeight: "600",
              paddingBottom: isMobile ? "10px" : "unset",
            }}
            mb="xs"
          >
            Commissions and Charges
          </Title>

          <DateTimeRangePicker
            handleDateRange={(start, end) => {
              getGraphData(start, end);
              getAllData(start, end);
            }}
          />

          <Divider my="12" />
          <Flex
            direction={collapsingScreen ? "column" : "row"}
            style={{ visibility: loading2 || loading ? "hidden" : "visible" }}
            pos={"relative"}
          >
            {(loading2 || loading) && <OverviewLoader />}
            <Box style={{ width: collapsingScreen ? "100%" : "50%" }}>
              <Grid grow justify="flex-start" align="stretch">
                <SubBoxWithProps
                  items={commissions}
                  isTablet={isTablet}
                  showHrForLastItem={true}
                />
              </Grid>
            </Box>
            <Box
              style={{
                width: collapsingScreen ? "100%" : "50%",
                marginTop: collapsingScreen ? "20px" : "auto",
                marginBottom: "auto",
              }}
              p={"md"}
            >
              <Title
                order={3}
                c="#101113"
                py="40"
                style={{
                  fontSize: "20px",
                  fontWeight: "400",
                  textAlign: "center",
                }}
              >
                System Profits Distribution
              </Title>
              <BarChart
                h={300}
                data={graphData}
                dataKey="gateway"
                type="stacked"
                withTooltip
                withLegend
                withBarValueLabel
                legendProps={{
                  verticalAlign: "bottom",
                  wrapperStyle: {
                    display: "flex",
                    justifyContent: "center",
                    bottom: "-10%",
                  },
                }}
                series={[
                  { name: "UPI", color: "violet.6" },
                  { name: "Netbanking", color: "brand.6" },
                  { name: "E-wallet", color: "teal.6" },
                ]}
              />
            </Box>
          </Flex>
        </Paper>
      </Box>
    </>
  );
};
export default ProfitsBalancesAndCommissions;
