import React, { useState } from "react";
import { useDashboardUser } from "../../../../DashboardProvider";
import usePagination from "../../../../../../hook/usePagination";
import { ActionIcon, Badge, Button, Flex, Table } from "@mantine/core";
import { FaListAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import TableLayout from "../../../../../../components/TableLayout2";
import PayoutStatusBadge from "../../../../../../components/OrderStatus/Badges/PayoutStatusBadge";
import PayoutModal from "../../../../../../components/OrderModals/PayoutModals";
import TopUpModal from "../../../../../../components/OrderModals/TopUpModals";
import { memberAllPayins } from "../../../../../../api/DummyOrders/Paginate/Data/memberAllPayins";
import { memberAllTopups } from "../../../../../../api/DummyOrders/Paginate/Data/memberAllTopups";
import TopUpBadge from "../../../../../../components/OrderStatus/Badges/TopUpBadge";
import ChangePaymentStatus from "../../../../../../api/updatePaymentStatus";
import { notifications } from "@mantine/notifications";
import { getPaymentDetails } from "../../../../../../utils/helpers";
import TopupStatusInfoModal from "../../../../../../components/OrderStatus/InfoModal/TopupStatusInfoModal";
import { IoMdInformationCircle } from "react-icons/io";

const TopUps = () => {
  const { userData } = useDashboardUser();
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
    table: "topup/member",
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
    "Commission",
    "Quota Credit",
    "Actions",
  ];

  const handleGrabOrder = async (id) => {
    const payload = {
      id,
      memberId: userData.id,
      memberPaymentDetails: getPaymentDetails(userData.channelProfile),
    };
    const res = await ChangePaymentStatus.changeTopupPaymentStatusAssigned(
      payload
    );
    if (res) {
      notifications.show({
        title: "Topup",
        message: "Topup order Grabbed",
        color: "green",
      });
      triggerReload();
    } else {
      notifications.show({
        title: "Topup",
        message: "Topup order Grab failed",
        color: "red",
      });
      triggerReload();
    }
  };

  const mappedRows = rows?.map((row, index) => (
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
      <Table.Td>
        <Flex justify={"space-evenly"} gap={"8px"}>
          {row.status === "initiated" ? (
            <Button
              size="xs"
              onClick={() => handleGrabOrder(row.systemOrderId)}
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
        headerText={"Top up Orders"}
        subtext={"Oversee and manage all top up orders grabbed by you."}
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
      <TopUpModal
        opened={opened}
        close={handlers.close}
        mode={"user"}
        orderId={orderId}
        handlers={handlers}
        triggerReload={triggerReload}
      />

      <TopupStatusInfoModal
        opened={statusInfo}
        close={statusInfoHandlers.close}
      />
    </>
  );
};

export default TopUps;
