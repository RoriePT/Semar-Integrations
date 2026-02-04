import React, { useEffect, useState } from "react";
import { ActionIcon, Badge, Flex, Table } from "@mantine/core";
import { FaListAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaInfoCircle } from "react-icons/fa";
import { useDisclosure } from "@mantine/hooks";
import TableLayout from "../../../../TableLayout2";
import PayinStatusInfoModal from "../../../../OrderStatus/InfoModal/PayinStatusInfoModal";
import PayinModal from "../../../../OrderModals/PayinModals";
import { useDashboardUser } from "../../../../../pages/Dashboard/DashboardProvider";
import usePagination from "../../../../../hook/usePagination";
import PayinStatusBadge from "../../../../OrderStatus/Badges/PayinStatusBadge";
import { IoMdInformationCircle } from "react-icons/io";

const Payins = ({ setLength ,userId}) => {
  const { userData, loading } = useDashboardUser();
  const { permissionAdmins } = userData;
  const navigate = useNavigate();

  const [statusInfo, statusInfoHandlers] = useDisclosure();
  const [details, detailsHandler] = useDisclosure();
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
    table: "user-details/member/payins",
    userId: userId,
  });

  const handleView = (id) => {
    setOrderId(id);
    detailsHandler.open();
  };

  const columns = [
    "SNo.",
    "System Order Id",
    "Amount",
    "Status",
    "Channel",
    "Payer",
    "Commission",
    "Quota Debit",
  ];

  //const payoutsLength = rows.length;
  useEffect(() => {
    setLength(rows.length);
  }, [rows]);

  const mappedRows = rows.slice(0, 3).map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>{(pageNumber - 1) * 10 + index + 1}</Table.Td>
      <Table.Td>{row.systemOrderId}</Table.Td>
      <Table.Td>₹{row.amount}</Table.Td>
      <Table.Td>
        <PayinStatusBadge status={row.status} size={"md"} fullWidth />
      </Table.Td>
      <Table.Td>
        <Badge fullWidth variant="light" fw={400} color="black">
          {row.channel}
        </Badge>
      </Table.Td>
      <Table.Td>{row.user}</Table.Td>
      <Table.Td>₹{row.commission}</Table.Td>
      <Table.Td>₹{row.quotaDebit}</Table.Td>
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
      <PayinStatusInfoModal
        opened={statusInfo}
        close={statusInfoHandlers.close}
      />

      <PayinModal
        mode={"admin"}
        opened={details}
        orderId={orderId}
        close={detailsHandler.close}
      />
    </>
  );
};

export default Payins;
