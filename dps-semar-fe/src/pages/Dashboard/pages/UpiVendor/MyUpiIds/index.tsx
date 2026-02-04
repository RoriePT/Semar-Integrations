import { Table } from "@mantine/core";
import TableLayout from "../../../../../components/TableLayout2";
import usePagination from "../../../../../hook/usePagination";

const MyUpiIds = () => {
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
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  } = usePagination({ table: "upi-vendor/upi-ids" });

  const columns = ["SNo.", "Title", "UPI ID", "Settlement Amount", "Enabled"];

  const mappedRows = (rows || []).map((item, index) => (
    <Table.Tr key={item.id ?? index}>
      <Table.Td>{(pageNumber - 1) * pageSize + index + 1}</Table.Td>
      <Table.Td>{item.title || "-"}</Table.Td>
      <Table.Td>{item.upiId}</Table.Td>
      <Table.Td>₹{item.settlementAmount || 0}</Table.Td>
      <Table.Td>{item.enabled !== false ? "True" : "False"}</Table.Td>
    </Table.Tr>
  ));

  return (
    <TableLayout
      table={"upi-vendor"}
      headerText={"My UPI IDs"}
      subtext={"Your registered UPI IDs."}
      showAddBtn={false}
      addBtnText={""}
      addBtnHandler={null}
      showDownloadBtn={false}
      showSearch={true}
      searchPlaceholder={"Search by title or UPI ID"}
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
    />
  );
};

export default MyUpiIds;
