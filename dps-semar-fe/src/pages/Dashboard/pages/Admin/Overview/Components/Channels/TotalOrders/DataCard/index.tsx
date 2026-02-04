import { BarChart, PieChart } from "@mantine/charts";
import { Box, Center, Divider, Paper, Title } from "@mantine/core";
import DateTimeRangePicker from "../../../../../../../../../components/DataTimeRangePicker";
import OverviewLoader from "../../../../../../../../../components/OverviewLoader";

const DataCard = ({
  title,
  overallData,
  distributedData,
  isMobile,
  loading,
  handleDateSubmit,
}) => {
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
              Order Distribution of Channels
            </Title>
            <Center>
              <PieChart
                h={isMobile ? 220 : 300}
                data={overallData}
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
              Gateway-wise Order Distribution of Channels
            </Title>
            <BarChart
              h={300}
              data={distributedData}
              dataKey="channel"
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
                { name: "Member Channels", color: "violet.6" },
                { name: "PhonePe", color: "brand.6" },
                { name: "Razorpay", color: "teal.6" },
                { name: "BenakPay", color: "orange.6" },
                { name: "PayU", color: "green.6" },
                { name: "Cashfree", color: "yellow.6" },
              ]}
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default DataCard;
