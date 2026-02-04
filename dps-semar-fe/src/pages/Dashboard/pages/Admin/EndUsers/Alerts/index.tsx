import React, { useEffect, useState } from "react";
import TableLayout from "../../../../../../components/TableLayout2";
import usePagination from "../../../../../../hook/usePagination";
import { Table } from "@mantine/core";
import moment from "moment";
import { formatDateIST } from "../../../../../../utils";

const Alerts = () => {
  const {
    rows,
    rowsLoading,
    handleChangePageSize,
    pageSize,
    pageNumber,
    handleSetCurrentPage,
    totalPages,

    startRecord,
    endRecord,
    totalRecords,

    startDate,
    endDate,
    setStartDate,
    setEndDate,

    search,
    setSearch,
    triggerReload,

    sortBy,
    setSortBy,

    filterData,
    handleChangeFilterData,
    resetFilters,
    handleApplyFilter,
    appliedFilterCount,
  } = usePagination({
    table: "alert",
  });

  const mappedRows = rows
    ? Object?.entries(rows)?.map(([date, rows], index) => (
        <React.Fragment key={index}>
          {rows.map((row, rowIndex) => (
            <Table.Tr key={`${date}-${rowIndex}`}>
              {rowIndex === 0 && (
                <td rowSpan={rows?.length}>{formatDateIST(date)}</td>
              )}
              <Table.Td>{row?.userName}</Table.Td>
              <Table.Td>{row?.merchant}</Table.Td>
              <Table.Td>{row?.userId}</Table.Td>
              <Table.Td>{row?.userEmail}</Table.Td>
              <Table.Td>{row?.userMobile}</Table.Td>
              <Table.Td>₹{row?.payinAmount}</Table.Td>
              <Table.Td>₹{row?.payoutAmount}</Table.Td>
              <Table.Td>₹{row?.payinAmountUsingGateways}</Table.Td>
              <Table.Td>₹{row?.currentPayinOrderAmount}</Table.Td>
            </Table.Tr>
          ))}
        </React.Fragment>
      ))
    : [];

  const columns = [
    "Date",
    "UserName",
    "Merchant",
    "User Id",
    "User Email",
    "Mobile",
    "Payin Amount",
    "Payout Amount",
    "Today's Payin Amount (Gateways)",
    "Current Order Amount",
  ];

  return (
    <>
      <TableLayout
        table={"All Payin Alerts"}
        headerText={
          "Oversee and manage all daily payin alerts raised for Payment gateways."
        }
        subtext={"View all alerts"}
        showAddBtn={false}
        addBtnText={""}
        addBtnHandler={null}
        showDownloadBtn={false}
        showSearch={false}
        searchPlaceholder={"Search by system order ID"}
        showDateRange={true}
        showFilter={false}
        showSort={false}
        showStatus={false}
        showReload={false}
        showPagination={false}
        columns={columns}
        rows={mappedRows}
        loading={rowsLoading}
        search={search}
        handleSearch={setSearch}
        startDate={startDate}
        handleStartDate={setStartDate}
        endDate={endDate}
        handleEndDate={setEndDate}
        handleReload={triggerReload}
        totalPages={totalPages}
        pageNumber={pageNumber}
        handleSetCurrentPage={handleSetCurrentPage}
        pageSize={pageSize}
        handleSetPageSize={handleChangePageSize}
        startRecord={startRecord}
        endRecord={endRecord}
        totalRecords={totalRecords}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filterData={filterData}
        handleChangeFilterData={handleChangeFilterData}
        resetFilters={resetFilters}
        handleApplyFilter={handleApplyFilter}
        appliedFilterCount={appliedFilterCount}
      />
    </>
  );
};

export default Alerts;
