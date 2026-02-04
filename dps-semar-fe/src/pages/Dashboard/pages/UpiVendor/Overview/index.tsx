import { BarChart, LineChart } from "@mantine/charts";
import { Box, Divider, Grid, Paper, Title } from "@mantine/core";
import MainBox from "../../../../../components/OverallBoxes/MainBox";
import SubBoxWithProps from "../../../../../components/OverallBoxes/SubBoxWithProps";
import OverviewLoader from "../../../../../components/OverviewLoader";
import useData from "./useData";

const Overview = () => {
  const {
    isMobile,
    isTablet,
    totalSettlement,
    payinData,
    commissionData,
    upiIds,
    loading,
  } = useData();

  const getSpan = () => (isMobile ? 12 : isTablet ? 6 : 3);
  const getSpan2 = () => (isTablet ? 12 : 2);

  const payinItems = [
    {
      amount: payinData.ordersPending,
      subHeading: "Pending Orders",
      colSpan: getSpan2(),
    },
    {
      amount: payinData.ordersCompleted,
      subHeading: "Completed Orders",
      colSpan: getSpan2(),
    },
    {
      amount: payinData.pendingAmount,
      subHeading: "Pending Amount",
      colSpan: getSpan2(),
      isForAmount: true,
    },
    {
      amount: payinData.completedAmount,
      subHeading: "Completed Amount",
      colSpan: getSpan2(),
      isForAmount: true,
    },
    {
      amount: payinData.totalAmount,
      subHeading: "Total Amount",
      colSpan: getSpan2(),
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
            amount={totalSettlement}
            subHeading="Total Settlement Amount"
            isForAmount={true}
          />
        </Grid.Col>
        <Grid.Col span={getSpan()}>
          <MainBox
            amount={commissionData.total}
            subHeading="Total Commission Earned"
            isForAmount={true}
          />
        </Grid.Col>
      </Grid>

      <Box pt="24">
        <Paper p="24" radius="md" h="100%" shadow="sm">
          <Title
            order={3}
            c="#101113"
            style={{ fontSize: "24px", fontWeight: "600" }}
          >
            Payin Orders
          </Title>
          <Divider my="12" />
          <Grid grow justify="flex-start" align="stretch">
            <SubBoxWithProps items={payinItems} isTablet={isTablet} />
          </Grid>
        </Paper>
      </Box>

      <Box pt="24">
        <Grid grow justify="flex-start" align="stretch">
          <Grid.Col span={isMobile ? 12 : 6}>
            <Paper p="24" radius="md" h="100%" shadow="sm">
              <Title
                order={3}
                c="#101113"
                style={{ fontSize: "24px", fontWeight: "600" }}
              >
                UPI IDs Settlement Amount
              </Title>
              <Divider my="12" />
              <Box pt="12">
                {upiIds.length > 0 ? (
                  <LineChart
                    h={300}
                    data={upiIds}
                    dataKey="upiId"
                    series={[
                      {
                        name: "settlementAmount",
                        color: "brand.6",
                        label: "Settlement Amount (₹)",
                      },
                    ]}
                    tickLine="y"
                    gridAxis="xy"
                    curveType="linear"
                  />
                ) : (
                  <Title order={5} c="dimmed" ta="center" py="40">
                    No UPI IDs available
                  </Title>
                )}
              </Box>
            </Paper>
          </Grid.Col>

          <Grid.Col span={isMobile ? 12 : 6}>
            <Paper p="24" radius="md" h="100%" shadow="sm">
              <Title
                order={3}
                c="#101113"
                style={{ fontSize: "24px", fontWeight: "600" }}
              >
                Commission (Last 5 Months)
              </Title>
              <Divider my="12" />
              <Box pt="12">
                <BarChart
                  h={300}
                  data={commissionData.monthlyData}
                  dataKey="month"
                  series={[
                    {
                      name: "commission",
                      color: "violet.6",
                      label: "Commission (₹)",
                    },
                  ]}
                  tickLine="y"
                  gridAxis="xy"
                />
              </Box>
            </Paper>
          </Grid.Col>
        </Grid>
      </Box>
    </Box>
  );
};

export default Overview;
