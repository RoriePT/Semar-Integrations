import React, { useState } from "react";
import { useDashboardUser } from "../../../../DashboardProvider";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import usePagination from "../../../../../../hook/usePagination";
import PayoutStatusBadge from "../../../../../../components/OrderStatus/Badges/PayoutStatusBadge";
import { ActionIcon, Badge, Flex, Table, Text, Title } from "@mantine/core";
import TableLayout from "../../../../../../components/TableLayout2";
import PayoutStatusInfoModal from "../../../../../../components/OrderStatus/InfoModal/PayoutStatusInfoModal";
import PayoutModal from "../../../../../../components/OrderModals/PayoutModals";
import { FaListAlt } from "react-icons/fa";
import NewPayoutModal from "../Users/NewPayoutModal";
import { formatDateIST } from "../../../../../../utils";

const AllPayouts = () => {
  const { userData, loading } = useDashboardUser();
  const { permissionAdmins } = userData;
  const [opened, handlers] = useDisclosure();
  const navigate = useNavigate();

  const [statusInfo, statusInfoHandlers] = useDisclosure();
  const [orderId, setOrderId] = useState(null);
  const [newPayoutOpened, setNewPayoutOpened] = useState(false);

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
    table: "payout/merchant",
    userId: userData?.id,
  });

  const handleView = async (id: string) => {
    setOrderId(id);
    handlers.open();
  };

  const mappedRows = rows.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>{(pageNumber - 1) * 10 + index + 1}</Table.Td>
      <Table.Td>{row.merchantOrderId || "N/A"}</Table.Td>
      <Table.Td>{row.systemOrderId}</Table.Td>
      <Table.Td>₹{row.amount}</Table.Td>
      <Table.Td>
        <PayoutStatusBadge status={row.status} size={"md"} fullWidth />
      </Table.Td>

      <Table.Td>
        <Badge fullWidth variant="light" fw={400} color="black">
          {row.channel}
        </Badge>
      </Table.Td>
      <Table.Td>
        {row.payoutMadeVia === null ? (
          "To be assigned"
        ) : (
          <Badge fullWidth variant="light">
            {row.payoutMadeVia === "member" ? row.member : row.gatewayName}
          </Badge>
        )}
      </Table.Td>
      <Table.Td>{row.user.name}</Table.Td>

      <Table.Td>₹{row.serviceFee}</Table.Td>
      <Table.Td>₹{row.balanceDebit}</Table.Td>
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

  const columns = [
    "SNo.",
    "Order Id",
    "KG Order Id",
    "Amount",
    "Status",
    "Channel",
    "Via",
    "Payee",
    "Service Fee",
    "Balance Debit",
    "Created at",
    "Completed at",
    "",
  ];

  return (
    <>
      <TableLayout
        table={"payout-merchant"}
        headerText={"Payout Orders"}
        subtext={"Oversee and manage all payout orders initiated by you."}
        showAddBtn={
          userData.userType === "Merchant" ||
          (userData.userType === "Sub-Merchant" &&
            userData.permissionSubmitPayouts)
        }
        addBtnText={"New Payout"}
        addBtnHandler={() => setNewPayoutOpened(true)}
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
      <PayoutStatusInfoModal
        opened={statusInfo}
        close={statusInfoHandlers.close}
      />
      <PayoutModal
        opened={opened}
        close={handlers.close}
        mode={"merchant"}
        orderId={orderId}
        triggerReload={triggerReload}
        handlers={handlers}
      />
      <NewPayoutModal
        opened={newPayoutOpened}
        onClose={() => {
          setNewPayoutOpened(false);
        }}
        setNewPayoutOpened={setNewPayoutOpened}
        triggerReload={triggerReload}
      />
    </>
  );
};

export default AllPayouts;
