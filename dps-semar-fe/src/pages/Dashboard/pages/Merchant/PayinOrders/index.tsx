import React, { useState } from "react";
import { useDashboardUser } from "../../../DashboardProvider";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import usePagination from "../../../../../hook/usePagination";
import PayinStatusBadge from "../../../../../components/OrderStatus/Badges/PayinStatusBadge";
import { ActionIcon, Badge, Flex, Table } from "@mantine/core";
import ExportBtn from "../../../../../components/TableLayout/HeaderSection/ExportBtn";
import TableLayout from "../../../../../components/TableLayout2";
import PayinStatusInfoModal from "../../../../../components/OrderStatus/InfoModal/PayinStatusInfoModal";
import { FaListAlt, FaInfoCircle } from "react-icons/fa";
import PayinModal from "../../../../../components/OrderModals/PayinModals";
import { getAllPayinsForMerchant } from "../../../../../api/DummyOrders/Paginate";
import { IoMdInformationCircle } from "react-icons/io";
import { formatDateIST } from "../../../../../utils";

const PayinOrders = () => {
  const { userData, loading } = useDashboardUser();
  const { permissionAdmins } = userData;
  const navigate = useNavigate();
  const [details, detailsHandler] = useDisclosure();
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
    paymentStatus,
    setPaymentStatus,
  } = usePagination({
    table: "payin/merchant",
    userId: userData?.id,
  });

  const handleView = (id) => {
    setOrderId(id);
    detailsHandler.open();
  };

  const columns = [
    "SNo.",
    "Order Id",
    "KG Order Id",
    "Amount",
    <Flex
      gap={"4px"}
      align={"center"}
      justify={"center"}
      style={{ cursor: "pointer" }}
      onClick={statusInfoHandlers.open}
    >
      Status <IoMdInformationCircle size={"14px"} />
    </Flex>,
    "Channel",
    "Via",
    "Payer",
    "Service Fee",
    "Balance Credit",
    "Callback",
    "Created at",
    "Completed at",
    "",
  ];

  const mappedRows = rows.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>{(pageNumber - 1) * 10 + index + 1}</Table.Td>
      <Table.Td>{row.merchantOrderId}</Table.Td>
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
      <Table.Td>{formatDateIST(row.createdAt)}</Table.Td>
      <Table.Td>
        {row.status?.toLowerCase() === "complete" ||
        row.status?.toLowerCase() === "failed"
          ? formatDateIST(row.updatedAt)
          : "Pending"}
      </Table.Td>
      <Table.Td>
        {" "}
        <Flex justify={"space-evenly"} gap={"8px"}>
          <ActionIcon onClick={() => handleView(row.systemOrderId)}>
            <FaListAlt />
          </ActionIcon>
        </Flex>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <TableLayout
        table={"payin-merchant"}
        headerText={"Payin Orders"}
        subtext={
          "View and manage all incoming payment orders initiated by end users on your website."
        }
        showAddBtn={false}
        addBtnText={""}
        addBtnHandler={null}
        showDownloadBtn={true}
        showSearch={true}
        searchPlaceholder={"Search by order IDs"}
        showDateRange={true}
        showFilter={false}
        showSort={true}
        showStatus={true}
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
        paymentStatus={paymentStatus}
        setPaymentStatus={setPaymentStatus}
      />
      <PayinStatusInfoModal
        opened={statusInfo}
        close={statusInfoHandlers.close}
      />

      <PayinModal
        mode={"merchant"}
        opened={details}
        orderId={orderId}
        close={detailsHandler.close}
      />
    </>
  );
};

export default PayinOrders;
