import { ActionIcon, Badge, Flex, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { FaListAlt } from "react-icons/fa";
import TableLayout from "../../../../../components/TableLayout2";
import usePagination from "../../../../../hook/usePagination";
import { formatDateIST } from "../../../../../utils";
import CreateSettlementModal from "./CreateSettlementModal";
import SettlementDetailsModal from "./SettlementDetailsModal";

const SettlementOrders = () => {
  const [createModalOpened, createModalHandlers] = useDisclosure();
  const [detailsModalOpened, detailsModalHandlers] = useDisclosure();
  const [selectedOrderId, setSelectedOrderId] = useState(null);

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
    table: "settlement/upi-vendor",
  });

  const handleView = (orderId) => {
    setSelectedOrderId(orderId);
    detailsModalHandlers.open();
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: "yellow",
      completed: "green",
      rejected: "red",
      approved: "brand",
    };

    return (
      <Badge
        fullWidth
        variant="light"
        color={statusColors[status?.toLowerCase()] || "gray"}
      >
        {status?.toUpperCase() || "N/A"}
      </Badge>
    );
  };

  const columns = [
    "SNo.",
    "System Order ID",
    "UPI ID",
    "Amount",
    "Transaction ID",
    "Created At",
    "",
  ];

  const mappedRows = (rows || []).map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>{(pageNumber - 1) * pageSize + index + 1}</Table.Td>
      <Table.Td>{row.systemOrderId || row.settlementId || row.id}</Table.Td>
      <Table.Td>{row.upiId || "N/A"}</Table.Td>
      <Table.Td>₹{row.paidAmount || row.amount || 0}</Table.Td>
      <Table.Td>{row.transactionId || row.utr || "N/A"}</Table.Td>
      <Table.Td>{formatDateIST(row.createdAt)}</Table.Td>
      <Table.Td>
        <Flex justify={"center"} gap={"8px"}>
          <ActionIcon onClick={() => handleView(row.id || row.settlementId)}>
            <FaListAlt />
          </ActionIcon>
        </Flex>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <TableLayout
        table={"settlement/upi-vendor"}
        headerText={"Settlement Orders"}
        subtext={"Create and manage your settlement orders"}
        showAddBtn={true}
        addBtnText={"Create Settlement Order"}
        addBtnHandler={createModalHandlers.open}
        showDownloadBtn={false}
        showSearch={true}
        searchPlaceholder={"Search by System Order ID or UPI ID"}
        showDateRange={true}
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

      <CreateSettlementModal
        opened={createModalOpened}
        close={createModalHandlers.close}
        triggerReload={triggerReload}
      />

      <SettlementDetailsModal
        opened={detailsModalOpened}
        close={detailsModalHandlers.close}
        orderId={selectedOrderId}
        triggerReload={triggerReload}
      />
    </>
  );
};

export default SettlementOrders;
