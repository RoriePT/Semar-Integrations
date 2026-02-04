import { ActionIcon, Badge, Flex, Table, Tabs } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { FaListAlt } from "react-icons/fa";
import TableLayout from "../../../../../../components/TableLayout2";
import usePagination from "../../../../../../hook/usePagination";
import { formatDateIST } from "../../../../../../utils";
import SettlementDetailsModal from "./SettlementDetailsModal";

const SettlementOrders = () => {
  const [detailsModalOpened, detailsModalHandlers] = useDisclosure();
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [activeTab, setActiveTab] = useState<string>("pending");

  // Pending Orders
  const {
    rows: pendingRows,
    rowsLoading: pendingLoading,
    handleChangePageSize: handlePendingPageSize,
    pageSize: pendingPageSize,
    pageNumber: pendingPageNumber,
    handleSetCurrentPage: handlePendingPage,
    totalPages: pendingTotalPages,
    startRecord: pendingStartRecord,
    endRecord: pendingEndRecord,
    totalRecords: pendingTotalRecords,
    startDate: pendingStartDate,
    endDate: pendingEndDate,
    setStartDate: setPendingStartDate,
    setEndDate: setPendingEndDate,
    search: pendingSearch,
    setSearch: setPendingSearch,
    triggerReload: triggerPendingReload,
    sortBy: pendingSortBy,
    setSortBy: setPendingSortBy,
    filterData: pendingFilterData,
    handleChangeFilterData: handlePendingFilterData,
    resetFilters: resetPendingFilters,
    handleApplyFilter: handlePendingApplyFilter,
    appliedFilterCount: pendingAppliedFilterCount,
  } = usePagination({
    table: "settlement/admin/pending",
  });

  // All Orders
  const {
    rows: allRows,
    rowsLoading: allLoading,
    handleChangePageSize: handleAllPageSize,
    pageSize: allPageSize,
    pageNumber: allPageNumber,
    handleSetCurrentPage: handleAllPage,
    totalPages: allTotalPages,
    startRecord: allStartRecord,
    endRecord: allEndRecord,
    totalRecords: allTotalRecords,
    startDate: allStartDate,
    endDate: allEndDate,
    setStartDate: setAllStartDate,
    setEndDate: setAllEndDate,
    search: allSearch,
    setSearch: setAllSearch,
    triggerReload: triggerAllReload,
    sortBy: allSortBy,
    setSortBy: setAllSortBy,
    filterData: allFilterData,
    handleChangeFilterData: handleAllFilterData,
    resetFilters: resetAllFilters,
    handleApplyFilter: handleAllApplyFilter,
    appliedFilterCount: allAppliedFilterCount,
  } = usePagination({
    table: "settlement/admin",
  });

  const handleView = (orderId) => {
    setSelectedOrderId(orderId);
    detailsModalHandlers.open();
  };

  const handleModalClose = () => {
    detailsModalHandlers.close();
    // Reload both tabs after any action
    triggerPendingReload();
    triggerAllReload();
  };

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

  const columns = [
    "SNo.",
    "System Order ID",
    "UPI Vendor",
    "UPI ID",
    "Amount",
    "Transaction ID",
    "Status",
    "Created At",
    "",
  ];

  const renderRows = (rows, pageNumber, pageSize) =>
    (rows || []).map((row, index) => (
      <Table.Tr key={index}>
        <Table.Td>{(pageNumber - 1) * pageSize + index + 1}</Table.Td>
        <Table.Td>{row.systemOrderId || row.settlementId || row.id}</Table.Td>
        <Table.Td>{row.upiVendorName || row.vendorName || "N/A"}</Table.Td>
        <Table.Td>{row.upiId || "N/A"}</Table.Td>
        <Table.Td>₹{row.paidAmount || row.amount || 0}</Table.Td>
        <Table.Td>{row.transactionId || row.utr || "N/A"}</Table.Td>
        <Table.Td>{getStatusBadge(row.status)}</Table.Td>
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
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List mb="md">
          <Tabs.Tab value="pending">Pending Orders</Tabs.Tab>
          <Tabs.Tab value="all">All Orders</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="pending">
          <TableLayout
            table={"settlement/admin/pending"}
            headerText={"Pending Settlement Orders"}
            subtext={"View and manage submitted settlement orders"}
            showAddBtn={false}
            addBtnText=""
            addBtnHandler={() => {}}
            showDownloadBtn={true}
            showSearch={true}
            searchPlaceholder={
              "Search by System Order ID, UPI Vendor, or UPI ID"
            }
            showDateRange={true}
            showFilter={false}
            showSort={true}
            showStatus={false}
            showReload={true}
            showPagination={true}
            columns={columns}
            rows={renderRows(pendingRows, pendingPageNumber, pendingPageSize)}
            loading={pendingLoading}
            search={pendingSearch}
            handleSearch={setPendingSearch}
            startDate={pendingStartDate}
            handleStartDate={setPendingStartDate}
            endDate={pendingEndDate}
            handleEndDate={setPendingEndDate}
            handleReload={triggerPendingReload}
            totalPages={pendingTotalPages}
            pageNumber={pendingPageNumber}
            handleSetCurrentPage={handlePendingPage}
            pageSize={pendingPageSize}
            handleSetPageSize={handlePendingPageSize}
            startRecord={pendingStartRecord}
            endRecord={pendingEndRecord}
            totalRecords={pendingTotalRecords}
            sortBy={pendingSortBy}
            setSortBy={setPendingSortBy}
            filterData={pendingFilterData}
            handleChangeFilterData={handlePendingFilterData}
            resetFilters={resetPendingFilters}
            handleApplyFilter={handlePendingApplyFilter}
            appliedFilterCount={pendingAppliedFilterCount}
          />
        </Tabs.Panel>

        <Tabs.Panel value="all">
          <TableLayout
            table={"settlement/admin"}
            headerText={"All Settlement Orders"}
            subtext={"View all settlement orders"}
            showAddBtn={false}
            addBtnText=""
            addBtnHandler={() => {}}
            showDownloadBtn={true}
            showSearch={true}
            searchPlaceholder={
              "Search by System Order ID, UPI Vendor, or UPI ID"
            }
            showDateRange={true}
            showFilter={true}
            showSort={true}
            showStatus={true}
            showReload={true}
            showPagination={true}
            columns={columns}
            rows={renderRows(allRows, allPageNumber, allPageSize)}
            loading={allLoading}
            search={allSearch}
            handleSearch={setAllSearch}
            startDate={allStartDate}
            handleStartDate={setAllStartDate}
            endDate={allEndDate}
            handleEndDate={setAllEndDate}
            handleReload={triggerAllReload}
            totalPages={allTotalPages}
            pageNumber={allPageNumber}
            handleSetCurrentPage={handleAllPage}
            pageSize={allPageSize}
            handleSetPageSize={handleAllPageSize}
            startRecord={allStartRecord}
            endRecord={allEndRecord}
            totalRecords={allTotalRecords}
            sortBy={allSortBy}
            setSortBy={setAllSortBy}
            filterData={allFilterData}
            handleChangeFilterData={handleAllFilterData}
            resetFilters={resetAllFilters}
            handleApplyFilter={handleAllApplyFilter}
            appliedFilterCount={allAppliedFilterCount}
          />
        </Tabs.Panel>
      </Tabs>

      <SettlementDetailsModal
        opened={detailsModalOpened}
        close={handleModalClose}
        orderId={selectedOrderId}
        triggerReload={handleModalClose}
      />
    </>
  );
};

export default SettlementOrders;
