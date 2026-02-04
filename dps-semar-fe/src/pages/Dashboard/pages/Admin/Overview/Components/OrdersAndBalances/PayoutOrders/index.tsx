import { BarChart, LineChart, PieChart } from "@mantine/charts";
import {
  Box,
  Center,
  Divider,
  Flex,
  Grid,
  Paper,
  SegmentedControl,
  Select,
  Title,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import SubBoxWithProps from "../../../../../../../../components/OverallBoxes/SubBoxWithProps";
import { useMediaQuery } from "@mantine/hooks";
import { DateTimePicker } from "@mantine/dates";
import DateTimeRangePicker from "../../../../../../../../components/DataTimeRangePicker";
import useData from "./useData";
import OverviewLoader from "../../../../../../../../components/OverviewLoader";
import CustomDropdown from "../../../../../../../../components/CustomDropdown";

const PayoutOrders = () => {
  const collapsingScreen = useMediaQuery("(max-width:1190px)");
  const [selectedMerchant, setSelectedMerchant] = useState(null);

  const {
    orders,
    pieChartData,
    lineChartData,
    loading,
    loading2,
    getDateData,
    isMobile,
    isTablet,
  } = useData(+selectedMerchant);

  return (
    <>
      <Box pt="26">
        <Paper
          radius={"md"}
          h={"100%"}
          shadow="sm"
          style={{ padding: isMobile ? "40px 24px" : "17px" }}
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
            Payout Orders
          </Title>
          {/* <SegmentedControl
              value={value}
              onChange={setValue}
              data={[
                { label: "Today", value: "today" },
                { label: "Overall", value: "overall" },
              ]}
            /> */}
          <Flex justify={"space-between"} align={"center"}>
            <DateTimeRangePicker
              handleDateRange={(start, end) => getDateData(start, end)}
            />

            {/* <Select placeholder="All Merchants" data={[]} /> */}
            <CustomDropdown
              listType="MERCHANT"
              value={selectedMerchant}
              onChange={(value) => {
                setSelectedMerchant(value);
              }}
              error={""}
              required={false}
            />
          </Flex>

          <Divider my="12" />
          <Flex
            direction={collapsingScreen ? "column" : "row"}
            style={{ visibility: loading || loading2 ? "hidden" : "visible" }}
            pos={"relative"}
          >
            {(loading || loading2) && <OverviewLoader />}
            <Box style={{ width: collapsingScreen ? "100%" : "50%" }}>
              <Grid grow justify="flex-start" align="stretch">
                <SubBoxWithProps
                  items={orders}
                  isTablet={isTablet}
                  showHrForLastItem={true}
                  dividerLine={true}
                />
              </Grid>
            </Box>
            <Box
              style={{
                width: collapsingScreen ? "100%" : "50%",
                marginTop: collapsingScreen ? "20px" : "auto",
                marginBottom: "auto",
              }}
            >
              <Title
                order={3}
                c="#101113"
                py="20"
                style={{
                  fontSize: "20px",
                  fontWeight: "400",
                  textAlign: "center",
                }}
              >
                Order Status Breakdown
              </Title>
              <Center>
                <PieChart
                  h={isMobile ? 220 : 300}
                  data={pieChartData}
                  size={isMobile ? 220 : 300}
                  labelsPosition="inside"
                  labelsType="value"
                  withLabels
                  withTooltip
                />
              </Center>
            </Box>
          </Flex>
          <Divider my={"lg"} />
          <Box>
            <Title
              order={3}
              c="#101113"
              py="20"
              style={{
                fontSize: "20px",
                fontWeight: "400",
                textAlign: "center",
              }}
            >
              Monthly Payout Orders
            </Title>
            <Box
              style={{ visibility: loading ? "hidden" : "visible" }}
              pos={"relative"}
            >
              {loading && <OverviewLoader />}

              <LineChart
                h={400}
                data={lineChartData}
                dataKey="date"
                series={[{ name: "Orders", color: "indigo.6" }]}
                curveType="linear"
              />
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default PayoutOrders;
