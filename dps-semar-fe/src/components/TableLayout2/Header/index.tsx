import {
  Badge,
  Box,
  Button,
  Flex,
  Paper,
  Select,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import React from "react";
import { IoSearchOutline } from "react-icons/io5";
import { IoFilter } from "react-icons/io5";
import { IoReload } from "react-icons/io5";
import { RiSortAsc } from "react-icons/ri";
import { LuListTodo } from "react-icons/lu";
import { FaPlus, FaRegCalendarAlt } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import DateRange from "./Components/DateRange";
import Download from "./Components/Download";
import Filter from "./Components/Filter";
import moment from "moment";

const Header = ({
  headerText,
  subText,
  table,
  showAddBtn,
  addBtnText,
  addBtnHandler,
  showDownloadBtn,
  showDateRange,
  showFilter,
  showSort,
  showReload,
  showSearch,
  showStatus,
  searchPlaceholder,

  search,
  handleSearch,

  startDate,
  handleStartDate,

  endDate,
  handleEndDate,
  handleReload,

  sortBy = "",
  setSortBy = (value) => {},
  paymentStatus = "",
  setPaymentStatus = (value) => {},
  setSortByBalanceType,
  sortByBalanceType,

  filterData = null,
  handleChangeFilterData = (key, value) => {},
  resetFilters = () => {},
  handleApplyFilter = () => {},
  appliedFilterCount = 0,
  withdrawalFilters,
  topupFilters,
  balanceTypeFilter,
  gatewayFilter,
  memberFilter,
  merchantFilter,
}) => {
  const [date, dateHandlers] = useDisclosure();
  const [filter, filterHandlers] = useDisclosure();
  const [download, downloadHandlers] = useDisclosure();
  const { width } = useViewportSize();

  return (
    <Box>
      <Flex
        align={width > 940 ? "center" : "stretch"}
        justify={"space-between"}
        mb={"lg"}
        gap={"lg"}
        direction={width > 940 ? "row" : "column"}
      >
        <Box>
          <Title order={4}>{headerText}</Title>
          <Text size="sm" c={"gray.6"}>
            {subText}
          </Text>
        </Box>
        <Flex gap={"md"}>
          {showAddBtn && (
            <Button leftSection={<FaPlus />} onClick={addBtnHandler}>
              {addBtnText}
            </Button>
          )}

          {showDownloadBtn && (
            <Button
              variant="default"
              leftSection={width > 640 && <FiDownload />}
              onClick={downloadHandlers.open}
            >
              {width > 640 ? <>Download</> : <FiDownload />}
            </Button>
          )}
        </Flex>
      </Flex>
      {(showSearch ||
        showFilter ||
        showSort ||
        showReload ||
        showDateRange ||
        showStatus) && (
        <Paper
          w={"100%"}
          mb={"xs"}
          bg={"gray.0"}
          p={"xs"}
          style={{ position: "relative" }}
        >
          <Flex
            align={"center"}
            justify={"space-between"}
            direction={width > 940 ? "row" : "column"}
            gap={"md"}
          >
            {balanceTypeFilter && (
              <Select
                // leftSection={<RiSortAsc color="black" />}
                value={sortByBalanceType}
                placeholder="Filter by balance type"
                data={[
                  {
                    value: "merchant_balance",
                    label: "Merchant Balance",
                  },
                  {
                    value: "member_balance",
                    label: "Member Commission",
                  },
                  {
                    value: "agent_balance",
                    label: "Agent Commission",
                  },
                  {
                    value: "upi_vendor_commission",
                    label: "UPI Vendor Commission",
                  },
                  {
                    value: "member_quota",
                    label: "Member Quota",
                  },
                  {
                    value: "system_profit",
                    label: "System Balance",
                  },
                  {
                    value: "gateway_fee",
                    label: "Gateway Charge",
                  },
                ]}
                w={width > 640 ? "200px" : "100%"}
                fw={500}
                onChange={setSortByBalanceType}
              />
            )}

            {showSearch && (
              <TextInput
                leftSection={<IoSearchOutline />}
                placeholder={searchPlaceholder}
                w={"100%"}
                maw={width > 940 ? "320px" : "none"}
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            )}

            <Flex
              gap={"xs"}
              direction={width > 640 ? "row" : "column"}
              w={width < 940 && "100%"}
            >
              {showStatus && (
                <Select
                  leftSection={<LuListTodo color="black" />}
                  value={paymentStatus}
                  placeholder="Status"
                  data={[
                    "INITIATED",
                    "ASSIGNED",
                    "SUBMITTED",
                    "COMPLETE",
                    "FAILED",
                  ]}
                  w={width > 640 ? "160px" : "100%"}
                  fw={500}
                  onChange={setPaymentStatus}
                />
              )}
              {showDateRange && (
                <Button
                  variant="default"
                  //   color="gray.6"
                  size="sm"
                  leftSection={<FaRegCalendarAlt color="#3d3c3c" />}
                  onClick={dateHandlers.open}
                  fw={500}
                >
                  {startDate && endDate ? (
                    <>
                      {moment(startDate).format("DD/MM/YYYY HH:mm:ss")} -{" "}
                      {moment(endDate).format("DD/MM/YYYY HH:mm:ss")}
                    </>
                  ) : (
                    <>Start Date - End Date</>
                  )}
                </Button>
              )}

              {showSort && (
                <Select
                  leftSection={<RiSortAsc color="black" />}
                  value={sortBy}
                  data={["latest", "oldest"]}
                  w={width > 640 ? "160px" : "100%"}
                  fw={500}
                  onChange={setSortBy}
                />
              )}

              <Flex gap={"xs"}>
                {showFilter && (
                  <Button
                    variant="default"
                    //   color="gray.6"
                    size="sm"
                    leftSection={<IoFilter />}
                    onClick={filterHandlers.open}
                    fw={500}
                    rightSection={
                      appliedFilterCount > 0 && (
                        <Badge radius={"xl"} size="xs" color="gray.7">
                          {appliedFilterCount}
                        </Badge>
                      )
                    }
                    w={width < 640 && "100%"}
                  >
                    {(width > 940 || width < 640) && <>Filter</>}
                  </Button>
                )}

                {showReload && (
                  <Button
                    variant="default"
                    //   color="gray.6"
                    size="sm"
                    onClick={handleReload}
                  >
                    <IoReload />
                  </Button>
                )}
              </Flex>
            </Flex>
          </Flex>
        </Paper>
      )}

      <DateRange
        opened={date}
        close={dateHandlers.close}
        handleApplyDate={(start, end) => {
          handleStartDate(start);
          handleEndDate(end);
          dateHandlers.close();
        }}
        startDate={startDate}
        endDate={endDate}
      />
      <Download
        table={table}
        opened={download}
        close={downloadHandlers.close}
      />
      {showFilter && (
        <Filter
          opened={filter}
          close={filterHandlers.close}
          reset={resetFilters}
          handleChange={handleChangeFilterData}
          statuses={filterData?.statuses}
          channels={filterData?.channels}
          lowerAmount={filterData?.lowerAmount}
          upperAmount={filterData?.upperAmount}
          madeVia={filterData?.madeVia}
          apply={handleApplyFilter}
          withdrawalFilters={withdrawalFilters}
          topupFilters={topupFilters}
          memberFilter={memberFilter}
          gatewayFilter={gatewayFilter}
          merchantFilter={merchantFilter}
          filterGatewayArray={filterData?.filterGatewayArray || []}
          filterMemberSearch={filterData?.filterMemberSearch}
          filterMerchantSearch={filterData?.filterMerchantSearch}
        />
      )}
    </Box>
  );
};

export default Header;
