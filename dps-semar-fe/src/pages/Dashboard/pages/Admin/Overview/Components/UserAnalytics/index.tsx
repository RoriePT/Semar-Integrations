import { BarChart, LineChart, PieChart } from "@mantine/charts";
import {
  Box,
  Center,
  Divider,
  Flex,
  Grid,
  Paper,
  ScrollArea,
  SegmentedControl,
  Table,
  Title,
} from "@mantine/core";
import React, { useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import SubBoxWithProps from "../../../../../../../components/OverallBoxes/SubBoxWithProps";
import moment from "moment";
import OverviewLoader from "../../../../../../../components/OverviewLoader";
import useData from "./useData";
import { formatDateIST } from "../../../../../../../utils";

const UserAnalytics = () => {
  const getSpan = () => (isMobile ? 12 : 2);
  const {
    isMobile,
    isTablet,
    userData,
    memberData,
    members,

    loading,
  } = useData();

  const collapsingScreen = useMediaQuery("(max-width:1190px)");

  const data = [
    { name: "Self signup", value: memberData.self, color: "indigo.6" },
    { name: "Admin onboarding", value: memberData.admin, color: "yellow.6" },
  ];

  const payinItems = [
    { amount: userData.admins, subHeading: "Total admins", colSpan: getSpan() },
    {
      amount: userData.merchants,
      subHeading: "Total merchant",
      colSpan: getSpan(),
    },
    { amount: userData.agents, subHeading: "Total agents", colSpan: getSpan() },
    {
      amount: userData.members,
      subHeading: "Total members",
      colSpan: getSpan(),
    },
  ];

  const rows = members.map((element) => (
    <Table.Tr key={element.name} style={{ fontSize: "14px", padding: "12px" }}>
      <Table.Td style={{ padding: "10px" }}>{element.name}</Table.Td>
      <Table.Td style={{ padding: "10px" }}>{element.gmail}</Table.Td>
      <Table.Td style={{ padding: "10px" }}>
        {formatDateIST(element.onboardingDate)}
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Box pt="26">
        <Paper
          radius={"md"}
          h={"100%"}
          shadow="sm"
          style={{ padding: isMobile ? "40px 24px" : "17px" }}
        >
          <Flex
            justify={"space-between"}
            style={{ flexDirection: isMobile ? "column" : "row" }}
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
              User Analytics
            </Title>
          </Flex>
          <Divider my="12" />

          <Box
            style={{ visibility: loading ? "hidden" : "visible" }}
            pos={"relative"}
          >
            {loading && <OverviewLoader />}

            <Box>
              <Grid grow justify="flex-start" align="stretch">
                <SubBoxWithProps items={payinItems} isTablet={isTablet} />
              </Grid>
              <Divider />
            </Box>

            <Flex
              direction={isTablet ? "column" : "row"}
              pt="20"
              style={{ gap: "20px" }}
            >
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
                  Members (self signup Vs admin onboarding)
                </Title>
                <PieChart
                  h={isMobile ? 220 : 300}
                  data={data}
                  size={isMobile ? 220 : 300}
                  labelsPosition="inside"
                  labelsType="value"
                  withLabels
                  withTooltip
                  style={{ margin: "auto" }}
                />
              </Box>
              <hr
                style={{
                  borderColor: "#D9D9D9",
                  margin: "12px 0",
                  opacity: "0.3",
                }}
              ></hr>
              <Box
                style={{
                  width: collapsingScreen ? "100%" : "50%",
                }}
              >
                <Title
                  order={3}
                  c="#101113"
                  py="17"
                  style={{
                    fontSize: "20px",
                    fontWeight: "400",
                    textAlign: "center",
                  }}
                >
                  Latest Registered members via self signup
                </Title>
                <ScrollArea>
                  <Table verticalSpacing="md">
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th
                          style={{
                            fontSize: "14px",
                            fontWeight: "700",
                            background: "#F1F5F9",
                            color: "#000",
                          }}
                        >
                          NAME
                        </Table.Th>
                        <Table.Th
                          style={{
                            fontSize: "14px",
                            fontWeight: "700",
                            background: "#F1F5F9",
                            color: "#000",
                          }}
                        >
                          EMAIL
                        </Table.Th>
                        <Table.Th
                          style={{
                            fontSize: "14px",
                            fontWeight: "700",
                            background: "#F1F5F9",
                            color: "#000",
                          }}
                        >
                          ONBOARDING DATE
                        </Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody
                      style={{ fontSize: "18px", fontWeight: "500" }}
                    >
                      {rows}
                    </Table.Tbody>
                  </Table>
                </ScrollArea>
              </Box>
            </Flex>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default UserAnalytics;
