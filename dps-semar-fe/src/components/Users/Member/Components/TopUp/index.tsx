import React, { useEffect, useState } from "react";
import { ActionIcon, Badge, Flex, Table } from "@mantine/core";
import { FaListAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { useDashboardUser } from "../../../../../pages/Dashboard/DashboardProvider";
import usePagination from "../../../../../hook/usePagination";
import PayoutStatusBadge from "../../../../OrderStatus/Badges/PayoutStatusBadge";
import TableLayout from "../../../../TableLayout2";
import PayoutModal from "../../../../OrderModals/PayoutModals";
import TopUpBadge from "../../../../OrderStatus/Badges/TopUpBadge";

const TopUp = ({ setLength,userId }) => {
  const { userData, loading } = useDashboardUser();
  const { permissionAdmins } = userData;
  const navigate = useNavigate();
  const [opened, handlers] = useDisclosure();

  const [statusInfo, statusInfoHandlers] = useDisclosure();
  const [orderId, setOrderId] = useState(null);

  const {
    rows,
    rowsLoading,
    handleChangePageSize,
    pageSize,
    pageNumber,
    handleSetCurrentPage,
    totalPages,
    sortBy,
    setSortBy,

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
    table: "user-details/member/topups",
    userId: userId,
  });

  const handleView = (id) => {
    setOrderId(id);
    handlers.open();
  };

  // const dummyData = [
  //   {
  //     id: 1,
  //     systemOrderId: "SYS123456",
  //     amount: 5000,
  //     status: "assigned",
  //     channel: "UPI",
  //     member: "John Doe",
  //     systemProfit: 200,
  //   },
  //   {
  //     id: 2,
  //     systemOrderId: "SYS123457",
  //     amount: 15000,
  //     status: "complete",
  //     channel: "UPI",
  //     member: "Jane Smith",
  //     systemProfit: 450,
  //   },
  //   {
  //     id: 3,
  //     systemOrderId: "SYS123458",
  //     amount: 8000,
  //     status: "submitted",
  //     channel: "Net Banking",
  //     member: "Michael Johnson",
  //     systemProfit: 320,
  //   },
  // ];

  const columns = [
    "SNo.",
    "System Order Id",
    "Amount",
    "Status",
    "Channel",
    "Commission",
    "Quota Credit",
  ];

  //const payoutsLength = dummyData.length;
  useEffect(() => {
    setLength(rows.length);
  }, [rows]);

  const mappedRows = rows.slice(0, 3).map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>{(pageNumber - 1) * 10 + index + 1}</Table.Td>
      <Table.Td>{row.systemOrderId}</Table.Td>
      <Table.Td>₹{row.amount}</Table.Td>
      <Table.Td>
        <TopUpBadge status={row.status} size={"md"} fullWidth />
      </Table.Td>
      <Table.Td>
        <Badge fullWidth variant="light" fw={400} color="black">
          {row.channel}
        </Badge>
      </Table.Td>
      <Table.Td>₹{row.commission || 0}</Table.Td>
      <Table.Td>₹{row.quotaCredit || 0}</Table.Td>
    </Table.Tr>
  ));

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
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <PayoutModal
        opened={opened}
        close={handlers.close}
        mode={"admin"}
        orderId={orderId}
        triggerReload={triggerReload}
        handlers={handlers}
      />
    </>
  );
};

export default TopUp;
