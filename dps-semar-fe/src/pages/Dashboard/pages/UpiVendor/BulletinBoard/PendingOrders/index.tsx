import React, { useEffect } from "react";
import TableLayout from "../../../../../../components/TableLayout2";
import { ActionIcon, Badge, Table } from "@mantine/core";
import { FaListAlt } from "react-icons/fa";
import usePagination from "../../../../../../hook/usePagination";

const PendingOrders = ({ handleView, reload }) => {
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
    search,
    setSearch,
    triggerReload,
    sortBy,
    setSortBy,
  } = usePagination({
    table: "bulletin/upi-vendor/pending-orders",
  });

  // Trigger reload when parent reload prop changes
  useEffect(() => {
    triggerReload();
  }, [reload]);

  const columns = ["SNo.", "Tracking ID", "Amount", "Channel", "Commission", ""];

  const mappedRows = (rows || []).map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>{(pageNumber - 1) * pageSize + index + 1}</Table.Td>
      <Table.Td>{row.trackingId || "-"}</Table.Td>
      <Table.Td>₹{row.amount}</Table.Td>
      <Table.Td>
        <Badge fullWidth variant="light" fw={400} color="black">
          {row.channel}
        </Badge>
      </Table.Td>
      <Table.Td>₹{row.commission || 0}</Table.Td>
      <Table.Td>
        <ActionIcon onClick={() => handleView({ ...row, type: "payin", systemOrderId: row.orderId })}>
          <FaListAlt />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <TableLayout
        table={"bulletin/upi-vendor/pending-orders"}
        headerText={"Pending Order Actions"}
        subtext={"Manage your pending Payin orders."}
        showAddBtn={false}
        addBtnText={""}
        addBtnHandler={() => {}}
        showDownloadBtn={false}
        showSearch={true}
        searchPlaceholder={"Search by Tracking ID or System Order ID"}
        showDateRange={false}
        showFilter={false}
        showSort={true}
        showStatus={false}
        showReload={true}
        showPagination={true}
        columns={columns}
        rows={mappedRows}
        loading={rowsLoading}
        search={search}
        handleSearch={setSearch}
        startDate={null}
        handleStartDate={() => {}}
        endDate={null}
        handleEndDate={() => {}}
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
        fullHeight={true}
      />
    </>
  );
};

export default PendingOrders;

