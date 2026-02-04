import { Flex, Table } from "@mantine/core";
import React from "react";
import "./styles.css";
import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";
import { useMediaQuery } from "@mantine/hooks";

const TableLayout = ({
  headerText,
  subtext,
  showAddBtn,
  addBtnText,
  addBtnHandler,
  showDownloadBtn,
  table,
  showDateRange,
  showFilter,
  showSort,
  showReload,
  showSearch,
  showStatus,
  searchPlaceholder,
  showPagination,
  columns,
  rows,
  loading,

  search,
  handleSearch,

  startDate,
  handleStartDate,

  endDate,
  handleEndDate,
  handleReload,

  totalPages,
  pageNumber,
  handleSetCurrentPage,
  pageSize,
  handleSetPageSize,

  startRecord,
  endRecord,
  totalRecords,

  sortBy = "",
  setSortBy = (value) => {},
  paymentStatus = "",
  setPaymentStatus = (value) => {},
  sortByBalanceType = "",
  setSortByBalanceType = (value) => {},

  fullHeight = true,
  filterData = null,
  handleChangeFilterData = (key, value) => {},
  resetFilters = () => {},
  handleApplyFilter = () => {},
  appliedFilterCount = 0,
  withdrawalFilters = false,
  topupFilters = false,
  balanceTypeFilter = false,
  memberFilter = false,
  merchantFilter = false,
  gatewayFilter = false,
}) => {
  return (
    <Flex
      direction={"column"}
      p={"lg"}
      bg={"white"}
      style={{ borderRadius: "6px", height: fullHeight ? "100%" : "auto" }}
      justify={"space-between"}
      w={"100%"}
    >
      <Header
        table={table}
        headerText={headerText}
        subText={subtext}
        showAddBtn={showAddBtn}
        addBtnText={addBtnText}
        addBtnHandler={addBtnHandler}
        showDownloadBtn={showDownloadBtn}
        showDateRange={showDateRange}
        showFilter={showFilter}
        showSort={showSort}
        showReload={showReload}
        showSearch={showSearch}
        showStatus={showStatus}
        searchPlaceholder={searchPlaceholder}
        search={search}
        handleSearch={handleSearch}
        startDate={startDate}
        handleStartDate={handleStartDate}
        endDate={endDate}
        handleEndDate={handleEndDate}
        handleReload={handleReload}
        sortBy={sortBy}
        setSortBy={setSortBy}
        paymentStatus={paymentStatus}
        setPaymentStatus={setPaymentStatus}
        filterData={filterData}
        handleChangeFilterData={handleChangeFilterData}
        resetFilters={resetFilters}
        handleApplyFilter={handleApplyFilter}
        appliedFilterCount={appliedFilterCount}
        withdrawalFilters={withdrawalFilters}
        topupFilters={topupFilters}
        balanceTypeFilter={balanceTypeFilter}
        sortByBalanceType={sortByBalanceType}
        setSortByBalanceType={setSortByBalanceType}
        gatewayFilter={gatewayFilter}
        memberFilter={memberFilter}
        merchantFilter={merchantFilter}
      />
      <Body rows={rows} columns={columns} loading={loading} />
      {showPagination && rows.length > 0 && !loading && (
        <Footer
          totalPages={totalPages}
          pageNumber={pageNumber}
          handleSetCurrentPage={handleSetCurrentPage}
          pageSize={pageSize}
          handleSetPageSize={handleSetPageSize}
          startRecord={startRecord}
          endRecord={endRecord}
          totalRecords={totalRecords}
        />
      )}
    </Flex>
  );
};

export default TableLayout;
