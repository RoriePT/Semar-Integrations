import { BarChart, PieChart } from "@mantine/charts";
import { Box, Center, Divider, Paper, Title } from "@mantine/core";
import { useState } from "react";
import DateTimeRangePicker from "../../../../../../../../../components/DataTimeRangePicker";
import OverviewLoader from "../../../../../../../../../components/OverviewLoader";

const DataCard = ({
  title,
  pieData,
  distributedData,
  isMobile,
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

        <DateTimeRangePicker
          handleDateRange={(start, end) => handleDateSubmit(start, end)}
        />

        <Box
          pos={"relative"}
          style={{ visibility: loading ? "hidden" : "visible" }}
        >
          {loading && <OverviewLoader />}
          <Box my={"xl"}>
            <Title
              order={3}
              c="#101113"
              style={{
                fontSize: "20px",
                fontWeight: "400",
                textAlign: "center",
              }}
              mb={"xl"}
            >
              Order Distribution of Gateways
            </Title>
            <Center>
              <PieChart
                h={isMobile ? 220 : 300}
                data={pieData}
                size={isMobile ? 220 : 300}
                labelsPosition="inside"
                labelsType="value"
                withLabels
                withTooltip
              />
            </Center>
          </Box>

          <Divider my={"xl"} />

          <Box my={"xl"} px={"md"}>
            <Title
              order={3}
              c="#101113"
              style={{
                fontSize: "20px",
                fontWeight: "400",
                textAlign: "center",
              }}
              mb={"xl"}
            >
              Channel-wise Order Distribution of Gateways
            </Title>
            <BarChart
              h={300}
              data={distributedData}
              dataKey="gateway"
              type="stacked"
              // withTooltip={false}
              withLegend
              // withBarValueLabel
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
        </Box>
      </Paper>
    </Box>
  );
};

export default DataCard;
