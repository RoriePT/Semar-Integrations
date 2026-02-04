import React, { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { ActionIcon, Badge, Flex, Table } from "@mantine/core";
import { FaListAlt } from "react-icons/fa";
import usePagination from "../../../../../hook/usePagination";
import WithdrawalsBadge from "../../../../OrderStatus/Badges/WithdrawalsBadge";
import TableLayout from "../../../../TableLayout2";
import WithdrawalModals from "../../../../OrderModals/WithdrawalModals";
import moment from "moment";

const Withdrawals = ({ setLength ,userId}) => {
  const [opened, handlers] = useDisclosure();
  const [orderId, setOrderId] = useState(null);

  // const dummyData = [
  //   {
  //     id: 1,
  //     withdrawalId: "WD001",
  //     userName: "John Doe",
  //     amount: 5000,
  //     userRole: "User",
  //     date: "2024-10-15",
  //     status: "settled",
  //     channel: "UPI",
  //   },
  //   {
  //     id: 2,
  //     withdrawalId: "WD002",
  //     userName: "Jane Smith",
  //     amount: 3000,
  //     userRole: "User",
  //     date: "2024-10-16",
  //     status: "pending",
  //     channel: "Net Banking",
  //   },
  //   {
  //     id: 3,
  //     withdrawalId: "WD002",
  //     userName: "Jane ",
  //     amount: 300,
  //     userRole: "User",
  //     date: "2024-10-16",
  //     status: "pending",
  //     channel: "Net Banking",
  //   },
  // ];

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
  } = usePagination({
    table: "user-details/merchant/withdrawals",
    userId: userId,
  });

  const handleView = (id) => {
    setOrderId(id);
    handlers.open();
  };

  useEffect(() => {
    setLength(rows.length);
  }, [rows]);

  const mappedRows = rows.slice(0, 3).map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>{(pageNumber - 1) * 10 + index + 1}</Table.Td>
      <Table.Td>{row.systemOrderId}</Table.Td>
      <Table.Td>₹{row.amount}</Table.Td>
      <Table.Td>
        <Badge fullWidth variant="light" fw={400} color="black">
          {row.channel}
        </Badge>
      </Table.Td>
      <Table.Td>₹{row.serviceCharge || 0}</Table.Td>
      <Table.Td>₹{row.balanceBefore || 0}</Table.Td>
      <Table.Td>₹{row.balanceAfter || 0}</Table.Td>
      <Table.Td>{moment(row.date).format("DD MMM, YYYY")}</Table.Td>
      <Table.Td>
        <WithdrawalsBadge status={row.status} size={"md"} fullWidth />
      </Table.Td>
    </Table.Tr>
  ));

  const columns = [
    "SNo.",
    "Order Id",
    "Amount",
    "Channel",
    "Service Charge",
    "Balance Before",
    "Balance After",
    "Date",
    "Status",
  ];

  return (
    <>
      <TableLayout
        table={"admin"}
        headerText={""}
        subtext={""}
        showAddBtn={false}
        addBtnText={""}
        addBtnHandler={null}
        showDownloadBtn={false}
        showSearch={false}
        searchPlaceholder={"Search by name"}
        showDateRange={false}
        showFilter={false}
        showSort={false}
        showStatus={false}
        showReload={false}
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
      />
      <WithdrawalModals
        opened={opened}
        close={handlers.close}
        mode={"admin"}
        orderId={orderId}
        user={"admin"}
        reload={triggerReload}
      />
    </>
  );
};

export default Withdrawals;
