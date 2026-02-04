import React, { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { ActionIcon, Badge, Flex, Table, Text, Title } from "@mantine/core";
import { FaListAlt } from "react-icons/fa";
import { useDashboardUser } from "../../../../../pages/Dashboard/DashboardProvider";
import { getAllPayoutsForAdmin } from "../../../../../api/DummyOrders/Paginate";
import usePagination from "../../../../../hook/usePagination";
import PayoutStatusBadge from "../../../../OrderStatus/Badges/PayoutStatusBadge";
import TableLayout from "../../../../TableLayout2";
import PayoutStatusInfoModal from "../../../../OrderStatus/InfoModal/PayoutStatusInfoModal";
import PayoutModal from "../../../../OrderModals/PayoutModals";

const Payouts = ({ setLength,userId }) => {
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
  } = usePagination({
    table: "user-details/member/payouts",
    userId: userId,
  });

  const handleView = (id) => {
    setOrderId(id);
    handlers.open();
  };

  // const allPayouts = getAllPayoutsForAdmin();
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
        <PayoutStatusBadge status={row.status} size={"md"} fullWidth />
      </Table.Td>
      <Table.Td>
        <Badge fullWidth variant="light" fw={400} color="black">
          {row.channel}
        </Badge>
      </Table.Td>
      <Table.Td>{row.user?.name}</Table.Td>
      <Table.Td>₹{row.quotaCredit}</Table.Td>
     
      {/* <Table.Td>
        {" "}
        <Flex justify={"space-evenly"} gap={"8px"}>
          <ActionIcon onClick={() => handleView(row.id)}>
            <FaListAlt />
          </ActionIcon>
        </Flex>
      </Table.Td> */}
    </Table.Tr>
  ));

  const columns = [
    "SNo.",
    "System Order Id",
    "Amount",
    "Status",
    "Channel",
    "Payee",
    "Quota Credit",
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
      <PayoutStatusInfoModal
        opened={statusInfo}
        close={statusInfoHandlers.close}
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

export default Payouts;
