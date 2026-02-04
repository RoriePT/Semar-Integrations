import React, { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { ActionIcon, Badge, Flex, Table } from "@mantine/core";
import { FaListAlt } from "react-icons/fa";
import usePagination from "../../../../../hook/usePagination";
import TableLayout from "../../../../../components/TableLayout2";
import PayinModal from "../../../../../components/OrderModals/PayinModals";
import PayoutModal from "../../../../../components/OrderModals/PayoutModals";
import moment from "moment";
import TopUpModal from "../../../../../components/OrderModals/TopUpModals";
import { formatDateIST } from "../../../../../utils";

const CommissionsAndProfits = () => {
  const [opened, handlers] = useDisclosure();
  const [selected, selectedHandlers] = useDisclosure();
  const [orderId, setOrderId] = useState(null);
  const [details, detailsHandler] = useDisclosure();
  const [orderType, setOrderType] = useState(null);

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
  } = usePagination({ table: "transaction-updates/commissions" });

  const handleView = (id, type) => {
    setOrderId(id);
    setOrderType(type);
    detailsHandler.open();
  };

  const mappedRows = rows.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>{(pageNumber - 1) * 10 + index + 1}</Table.Td>
      <Table.Td>{row.orderId}</Table.Td>
      <Table.Td>
        <Badge fullWidth variant="light" fw={400} color="black">
          {row.orderType}
        </Badge>
      </Table.Td>
      <Table.Td>{row.agentMember}</Table.Td>
      <Table.Td>{row.merchant}</Table.Td>
      <Table.Td>₹{row.orderAmount}</Table.Td>
      <Table.Td>₹{row.merchantFees}</Table.Td>
      <Table.Td>₹{row.commission}</Table.Td>
      <Table.Td>{formatDateIST(row.date)}</Table.Td>
      <Table.Td>
        <Flex justify={"space-evenly"} gap={"8px"}>
          <ActionIcon onClick={() => handleView(row.orderId, row.orderType)}>
            <FaListAlt />
          </ActionIcon>
        </Flex>
      </Table.Td>
    </Table.Tr>
  ));

  const columns = [
    "SNo.",
    "Order ID",
    "Order Type",
    "Agent/Member",
    "Merchant",
    "Order Amount",
    "Merchant Fees",
    "Commission",
    "Date",
    "Actions",
  ];

  return (
    <>
      <TableLayout
        table={"commissions"}
        headerText={"Commissions And Profits"}
        subtext={
          "Oversee and manage all referral commissions of merchat agents and member agents."
        }
        showAddBtn={false}
        addBtnText={""}
        addBtnHandler={null}
        showDownloadBtn={true}
        showSearch={true}
        searchPlaceholder={"Search by system order ID"}
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
          handlers={() => {}}
        />
      )}

      {orderType === "topup" && (
        <TopUpModal
          opened={details}
          close={detailsHandler.close}
          mode={"admin"}
          orderId={orderId}
          triggerReload={triggerReload}
          handlers={() => {}}
        />
      )}
    </>
  );
};

export default CommissionsAndProfits;
