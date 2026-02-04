import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { ActionIcon, Badge, Flex, Table } from "@mantine/core";
import { FaListAlt } from "react-icons/fa";
import usePagination from "../../../../../../../hook/usePagination";
import WithdrawalsBadge from "../../../../../../../components/OrderStatus/Badges/WithdrawalsBadge";
import TableLayout from "../../../../../../../components/TableLayout2";
import WithdrawalModals from "../../../../../../../components/OrderModals/WithdrawalModals";
import moment from "moment";
import WithdrawalStatusInfoModal from "../../../../../../../components/OrderStatus/InfoModal/WithdrawalStatusInfoModal";
import { IoMdInformationCircle } from "react-icons/io";
import { formatDateIST } from "../../../../../../../utils";

const AllWithdrawals = (reload) => {
  const [opened, handlers] = useDisclosure();
  const [orderId, setOrderId] = useState(null);
  const [statusInfo, statusInfoHandlers] = useDisclosure();

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
  } = usePagination({ table: "withdrawal/admin" });

  useEffect(() => {
    triggerReload();
  }, [reload]);

  const handleView = (id) => {
    setOrderId(id);
    handlers.open();
  };

  const mappedRows = rows.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>{(pageNumber - 1) * 10 + index + 1}</Table.Td>
      <Table.Td>{row.systemOrderId}</Table.Td>
      <Table.Td>{row?.transactionId || "N/A"}</Table.Td>
      <Table.Td>₹{row.amount}</Table.Td>
      <Table.Td>
        {" "}
        <Badge fullWidth variant="light" fw={400} color="black">
          {row.channel}
        </Badge>
      </Table.Td>
      <Table.Td>{row.user}</Table.Td>
      <Table.Td>{row.userRole}</Table.Td>
      <Table.Td>{formatDateIST(row.date)}</Table.Td>
      <Table.Td>
        <WithdrawalsBadge status={row.status} size={"md"} fullWidth />
      </Table.Td>

      <Table.Td>
        <Flex justify={"space-evenly"} gap={"8px"}>
          <ActionIcon onClick={() => handleView(row.systemOrderId)}>
            <FaListAlt />
          </ActionIcon>
        </Flex>
      </Table.Td>
    </Table.Tr>
  ));

  const columns = [
    "SNo.",
    "Order Id",
    "Gateway Transaction ID",
    "Amount",
    "Channel",
    "User Name",
    "User Role",
    "Date",
    <Flex
      gap={"4px"}
      align={"center"}
      justify={"center"}
      style={{ cursor: "pointer" }}
      onClick={statusInfoHandlers.open}
    >
      Status <IoMdInformationCircle size={"14px"} />
    </Flex>,
    "Actions",
  ];

  return (
    <>
      <TableLayout
        table={"withdrawal"}
        headerText={"All Withdrawal Orders"}
        subtext={
          "Oversee and manage all withdrawal orders of merchants and agents"
        }
        showAddBtn={false}
        addBtnText={""}
        addBtnHandler={null}
        showDownloadBtn={true}
        showSearch={true}
        searchPlaceholder={"Search by system order ID"}
        showDateRange={true}
        showFilter={true}
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
        withdrawalFilters={true}
      />
      <WithdrawalModals
        opened={opened}
        close={handlers.close}
        mode={"admin"}
        orderId={orderId}
        user={"admin"}
        reload={triggerReload}
      />

      <WithdrawalStatusInfoModal
        opened={statusInfo}
        close={statusInfoHandlers.close}
      />
    </>
  );
};

export default AllWithdrawals;
