import React, { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { ActionIcon, Badge, Flex, Table } from "@mantine/core";
import { FaListAlt } from "react-icons/fa";
import usePagination from "../../../../../hook/usePagination";
import TableLayout from "../../../../../components/TableLayout2";
import PayinModal from "../../../../../components/OrderModals/PayinModals";
import PayoutModal from "../../../../../components/OrderModals/PayoutModals";
import moment from "moment";

const Commissions = ({ setLength ,userId}) => {
  const [opened, handlers] = useDisclosure();
  const [selected, selectedHandlers] = useDisclosure();
  const [orderId, setOrderId] = useState(null);
  const [details, detailsHandler] = useDisclosure();
  const [orderType, setOrderType] = useState(null);

  // const dummyData = [
  //   {
  //     id: 1,
  //     orderId: "ORD001",
  //     orderType: "payin",
  //     agentMember: "John Doe",
  //     merchant: "Merchant A",
  //     orderAmount: 5000,
  //     merchantFees: 50,
  //     commission: 500,
  //     date: "2024-10-15",
  //   },
  //   {
  //     id: 2,
  //     orderId: "ORD002",
  //     orderType: "payout",
  //     agentMember: "Jane Doe",
  //     merchant: "Merchant B",
  //     orderAmount: 3000,
  //     merchantFees: 30,
  //     commission: 300,
  //     date: "2024-10-16",
  //   },
  //   {
  //     id: 3,
  //     orderId: "ORD003",
  //     orderType: "topUp",
  //     agentMember: "Sam Smith",
  //     merchant: "Merchant C",
  //     orderAmount: 7000,
  //     merchantFees: 70,
  //     commission: 700,
  //     date: "2024-10-17",
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
  } = usePagination({ table: "user-details/member/commissions", userId: userId, });

  const handleView = (id, type) => {
    setOrderId(id);
    setOrderType(type);
    detailsHandler.open();
  };

 // const payoutsLength = rows.length;
  useEffect(() => {
    setLength(rows.length);
  }, [rows]);

  const mappedRows = rows.slice(0, 3).map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>{(pageNumber - 1) * 10 + index + 1}</Table.Td>
      <Table.Td>{row.orderId}</Table.Td>
      <Table.Td>
        <Badge fullWidth variant="light" fw={400} color="black">
          {row.orderType}
        </Badge>
      </Table.Td>
      <Table.Td>{row.referralUser}</Table.Td>
      <Table.Td>₹{row.orderAmount}</Table.Td>
      <Table.Td>₹{row.commission}</Table.Td>
      <Table.Td>{moment(row.date).format("DD MMM, YYYY | hh:mm a")}</Table.Td>
    </Table.Tr>
  ));

  const columns = [
    "SNo.",
    "Order ID",
    "Order Type",
    "Referral User",
    "Order Amount",
    "Commission",
    "Date",
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
      {orderType === "payin" && (
        <PayinModal
          mode={"admin"}
          opened={details}
          orderId={orderId}
          close={detailsHandler.close}
        />
      )}

      {orderType === "payout" && (
        <PayoutModal
          opened={details}
          close={detailsHandler.close}
          mode={"admin"}
          orderId={orderId}
          triggerReload={triggerReload}
          handlers={handlers}
        />
      )}
    </>
  );
};

export default Commissions;
