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
import { DateTimePicker } from "@mantine/dates";
import DateTimeRangePicker from "../../../../../../../../components/DataTimeRangePicker";
import useData from "./useData";
import OverviewLoader from "../../../../../../../../components/OverviewLoader";

const TopUpOrders = () => {
  const collapsingScreen = useMediaQuery("(max-width:1190px)");
  const {
    orders,

    lineChartData,
    loading,
    loading2,
    getDateData,
    isMobile,
    isTablet,
  } = useData();

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
              Topup Orders
            </Title>
            {/* <SegmentedControl
              value={value}
              onChange={setValue}
              data={[
                { label: "Today", value: "today" },
                { label: "Overall", value: "overall" },
              ]}
            /> */}
            <DateTimeRangePicker
              handleDateRange={(start, end) => getDateData(start, end)}
            />
         
          <Divider my="12" />

          <Box>
            <Grid
              grow
              justify="flex-start"
              align="stretch"
              style={{ visibility: loading || loading2 ? "hidden" : "visible" }}
              pos={"relative"}
            >
              {(loading || loading2) && <OverviewLoader />}
              <SubBoxWithProps
                items={orders}
                isTablet={isTablet}
                showHrForLastItem={true}
                dividerLine={true}
              />
            </Grid>
            <Divider my={"xl"} />
            <Box>
              <Title
                order={3}
                c="#101113"
                pb="20"
                style={{
                  fontSize: "20px",
                  fontWeight: "400",
                  textAlign: "center",
                }}
              >
                Monthly Topup Orders
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
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default TopUpOrders;
