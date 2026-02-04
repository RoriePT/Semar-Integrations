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

const Payins = ({ setLength, userId }) => {
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
    table: "user-details/merchant/payins",
    userId: userId,
  });

  const handleView = (id) => {
    setOrderId(id);
    detailsHandler.open();
  };

  const columns = [
    "SNo.",
    "System Order Id",
    "Merchant Order Id",
    "Amount",
    "Status",
    "Channel",
    "Via",
    "Payer",
    "Service Fee",
    "Balance Credit",
    "Callback",
  ];

  useEffect(() => {
    setLength(rows.length);
  }, [rows]);

  const mappedRows = rows.slice(0, 3).map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>{(pageNumber - 1) * 10 + index + 1}</Table.Td>
      <Table.Td>{row.systemOrderId}</Table.Td>
      <Table.Td>{row.merchantOrderId}</Table.Td>
      <Table.Td>₹{row.amount}</Table.Td>
      <Table.Td>
        <PayinStatusBadge status={row.status} size={"md"} fullWidth />
      </Table.Td>

      <Table.Td>
        <Badge fullWidth variant="light" fw={400} color="black">
          {row.channel}
        </Badge>
      </Table.Td>
      <Table.Td>
        {!row.payinMadeOn || row.payinMadeOn === null ? (
          "To be assigned"
        ) : (
          <Badge fullWidth variant="light">
            {row.payinMadeOn === "member" ? "Member channel" : row.gatewayName}
          </Badge>
        )}
      </Table.Td>
      <Table.Td>{row.user}</Table.Td>

      <Table.Td>₹{row.serviceCharge}</Table.Td>
      <Table.Td>₹{row.balanceCredit}</Table.Td>
      <Table.Td>
        <Badge
          color={row.callbackStatus === "pending" ? "yellow" : "green"}
          fullWidth
          variant="dot"
        >
          {row.callbackStatus}
        </Badge>
      </Table.Td>
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
