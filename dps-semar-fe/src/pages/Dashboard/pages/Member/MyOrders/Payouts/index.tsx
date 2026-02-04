import React, { useState } from "react";
import { useDashboardUser } from "../../../../DashboardProvider";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import usePagination from "../../../../../../hook/usePagination";
import PayoutStatusBadge from "../../../../../../components/OrderStatus/Badges/PayoutStatusBadge";
import { ActionIcon, Badge, Button, Flex, Table } from "@mantine/core";
import ExportBtn from "../../../../../../components/TableLayout/HeaderSection/ExportBtn";
import TableLayout from "../../../../../../components/TableLayout2";
import PayoutStatusInfoModal from "../../../../../../components/OrderStatus/InfoModal/PayoutStatusInfoModal";
import { FaListAlt, FaInfoCircle } from "react-icons/fa";
import PayoutModal from "../../../../../../components/OrderModals/PayoutModals";
import { getAllPayoutsForMember } from "../../../../../../api/DummyOrders/Paginate";
import PayoutOrders from "../../../../../../api/payoutOrders";
import ChangePaymentStatus from "../../../../../../api/updatePaymentStatus";
import { notifications } from "@mantine/notifications";

const Payouts = () => {
  const { userData, loading } = useDashboardUser();
  const { permissionAdmins } = userData;
  const [opened, handlers] = useDisclosure();
  const navigate = useNavigate();

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
  } = usePagination({
    table: "payout/member",
    userId: userData?.id,
  });

  const handleView = (id) => {
    setOrderId(id);
    handlers.open();
  };

  const columns = [
    "SNo.",
    "System Order Id",
    "Amount",
    "Status",
    "Channel",
    "Payee",
    "Quota Credit",
    "",
  ];

  const handleGrabOrder = async (systemOrderId) => {
    const payload = {
      id: systemOrderId,
      paymentMode: "MEMBER",
      memberId: userData.id,
      memberPaymentDetails: {
        "Upi Id": userData.channelProfile.upi[0].upiId,
        "Mobile Number": userData.channelProfile.upi[0].mobile,
      },
    };

    const res = await ChangePaymentStatus.changePaymentStatusAssigned(payload);

    if (res) {
      notifications.show({
        title: "Successfull",
        color: "green",
        message: "Order grabbed",
        withCloseButton: true,
      });
      triggerReload();
    } else {
      notifications.show({
        title: "Failed",
        color: "red",
        message: "Order grabbed failed",
        withCloseButton: true,
      });
    }
  };

  const mappedRows = rows.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>{(pageNumber - 1) * 10 + index + 1}</Table.Td>
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
      <Table.Td>{row.user.name}</Table.Td>
      <Table.Td>₹{row.quotaCredit}</Table.Td>

      <Table.Td>
        {" "}
        <Flex justify={"space-evenly"} gap={"8px"}>
          {row.status === "initiated" ? (
            <Button
              onClick={() => handleGrabOrder(row.systemOrderId)}
              size="xs"
            >
              Grab
            </Button>
          ) : (
            <ActionIcon onClick={() => handleView(row.systemOrderId)}>
              <FaListAlt />
            </ActionIcon>
          )}
        </Flex>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <TableLayout
        table={"admin"}
        headerText={"All Payout Orders"}
        subtext={"Oversee and manage all payout orders grabbed by you."}
        showAddBtn={false}
        addBtnText={""}
        addBtnHandler={null}
        showDownloadBtn={false}
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
      <PayoutStatusInfoModal
        opened={statusInfo}
        close={statusInfoHandlers.close}
      />
      <PayoutModal
        opened={opened}
        close={handlers.close}
        mode={"member"}
        orderId={orderId}
        triggerReload={triggerReload}
        handlers={handlers}
      />
    </>
  );
};

export default Payouts;
