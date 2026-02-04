import React, { useState } from "react";
import { useDashboardUser } from "../../../../DashboardProvider";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import usePagination from "../../../../../../hook/usePagination";
import PayinStatusBadge from "../../../../../../components/OrderStatus/Badges/PayinStatusBadge";
import { ActionIcon, Badge, Flex, Table } from "@mantine/core";
import ExportBtn from "../../../../../../components/TableLayout/HeaderSection/ExportBtn";
import TableLayout from "../../../../../../components/TableLayout2";
import PayinStatusInfoModal from "../../../../../../components/OrderStatus/InfoModal/PayinStatusInfoModal";
import { FaListAlt, FaInfoCircle } from "react-icons/fa";
import PayinModal from "../../../../../../components/OrderModals/PayinModals";
import { getAllPayinsForMember } from "../../../../../../api/DummyOrders/Paginate";
import { IoMdInformationCircle } from "react-icons/io";

const Payins = () => {
  const { userData, loading } = useDashboardUser();

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
    table: "payin/member",
    userId: userData?.id,
  });

  const handleView = (id) => {
    setOrderId(id);
    detailsHandler.open();
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
    "Payer",
    "Commission",
    "Quota Debit",
    "",
  ];

  const mappedRows = rows.map((row, index) => (
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
        table={"admin"}
        headerText={"Payin Orders"}
        subtext={"Oversee and manage all payin orders assigned to you."}
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
      <PayinStatusInfoModal
        opened={statusInfo}
        close={statusInfoHandlers.close}
      />

      <PayinModal
        mode={"member"}
        opened={details}
        orderId={orderId}
        close={detailsHandler.close}
        reload={triggerReload}
      />
    </>
  );
};

export default Payins;
