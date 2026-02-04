import { ActionIcon, Badge, Table } from "@mantine/core";
import { useEffect } from "react";
import { FaListAlt } from "react-icons/fa";
import TableLayout from "../../../../../../components/TableLayout2";
import usePagination from "../../../../../../hook/usePagination";

const PendingSettlementOrders = ({ handleView, reload }) => {
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
    table: "bulletin/upi-vendor/settlement/submitted",
  });

  // Trigger reload when parent reload prop changes
  useEffect(() => {
    triggerReload();
  }, [reload]);

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: "grape",
      submitted: "yellow",
      approved: "brand",
      completed: "green",
      rejected: "red",
    };

    return (
      <Badge fullWidth color={statusColors[status?.toLowerCase()] || "gray"}>
        {status?.toLowerCase() || "N/A"}
      </Badge>
    );
  };

  const columns = ["SNo.", "System Order ID", "UPI ID", "Amount", "Status", ""];

  const mappedRows = (rows || []).map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>{(pageNumber - 1) * pageSize + index + 1}</Table.Td>
      <Table.Td>
        {row.systemOrderId || row.settlementId || row.id || "-"}
      </Table.Td>
      <Table.Td>{row.upiId || "-"}</Table.Td>
      <Table.Td>₹{row.paidAmount || row.amount || 0}</Table.Td>
      <Table.Td>{getStatusBadge(row.status)}</Table.Td>
      <Table.Td>
        <ActionIcon
          onClick={() =>
            handleView({
              ...row,
              type: "settlement",
              id: row.id || row.settlementId,
            })
          }
        >
          <FaListAlt />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <TableLayout
        table={"bulletin/upi-vendor/settlement/submitted"}
        headerText={"Pending Settlement Orders"}
        subtext={"View your submitted settlement orders."}
        showAddBtn={false}
        addBtnText={""}
        addBtnHandler={() => {}}
        showDownloadBtn={false}
        showSearch={true}
        searchPlaceholder={"Search by System Order ID or UPI ID"}
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

export default PendingSettlementOrders;
