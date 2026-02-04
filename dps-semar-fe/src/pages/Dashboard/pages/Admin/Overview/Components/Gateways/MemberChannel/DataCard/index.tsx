import React, { useState } from "react";
import {
  Box,
  Divider,
  Flex,
  Paper,
  Title,
  SegmentedControl,
  Grid,
  Center,
} from "@mantine/core";
import { PieChart } from "@mantine/charts";
import SubBoxWithProps from "../../../../../../../../../components/OverallBoxes/SubBoxWithProps";
import { DateTimePicker } from "@mantine/dates";
import DateTimeRangePicker from "../../../../../../../../../components/DataTimeRangePicker";
import OverviewLoader from "../../../../../../../../../components/OverviewLoader";

const DataCard = ({
  title,
  orders,
  distribution,
  isMobile,
  isTablet,
  collapsingScreen,
  loading,
  handleDateSubmit,
}) => {
  const [value, setValue] = useState("today");

  return (
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
            {title}
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
            handleDateRange={(start, end) => handleDateSubmit(start, end)}
          />
        
        <Divider my="12" />
        <Box
          pos={"relative"}
          style={{ visibility: loading ? "hidden" : "visible" }}
        >
          {loading && <OverviewLoader />}
          <Box>
            <Grid grow justify="flex-start" align="stretch">
              <SubBoxWithProps
                items={orders}
                isTablet={isTablet}
                showHrForLastItem={true}
              />
            </Grid>
            {!isTablet && <Divider />}
          </Box>
          <Box
            style={{
              marginTop: collapsingScreen ? "20px" : "auto",
              marginBottom: "auto",
            }}
            my={"md"}
          >
            <Title
              order={3}
              c="#101113"
              py="11"
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
                data={distribution}
                size={isMobile ? 220 : 300}
                labelsPosition="inside"
                labelsType="value"
                withLabels
                withTooltip
              />
            </Center>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default DataCard;
