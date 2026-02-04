import { ActionIcon, Badge, Flex, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { FaListAlt } from "react-icons/fa";
import { IoMdInformationCircle } from "react-icons/io";

import PayinModal from "../../../../../../components/OrderModals/PayinModals";
import PayinStatusBadge from "../../../../../../components/OrderStatus/Badges/PayinStatusBadge";
import PayinStatusInfoModal from "../../../../../../components/OrderStatus/InfoModal/PayinStatusInfoModal";
import TableLayout from "../../../../../../components/TableLayout2";
import usePagination from "../../../../../../hook/usePagination";
import { useDashboardUser } from "../../../../DashboardProvider";
import { formatDateIST } from "../../../../../../utils";

const Payins = () => {
  const { userData } = useDashboardUser();

  const [statusInfo, statusInfoHandlers] = useDisclosure();
  const [details, detailsHandler] = useDisclosure();
  const [orderId, setOrderId] = useState<string | null>(null);

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
  } = usePagination({ table: "payin/upi-vendor", userId: userData?.id });

  const handleView = (id: string) => {
    setOrderId(id);
    detailsHandler.open();
  };

  const columns = [
    "SNo.",
    "Order ID",
    "Tracking ID",
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
    "User",
    "Commission",
    "Date",
    "",
  ];

  const mappedRows = rows.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>{(pageNumber - 1) * 10 + index + 1}</Table.Td>
      <Table.Td>{row.orderId}</Table.Td>
      <Table.Td>{row.trackingId || "-"}</Table.Td>
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
      <Table.Td>₹{row.commission || 0}</Table.Td>
      <Table.Td>{row.date ? formatDateIST(row.date) : "-"}</Table.Td>
      <Table.Td>
        <Flex justify={"space-evenly"} gap={"8px"}>
          <ActionIcon onClick={() => handleView(row.orderId)}>
            <FaListAlt />
          </ActionIcon>
        </Flex>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <TableLayout
        table={"upi-vendor"}
        headerText={"Payin Orders"}
        subtext={"View payin orders assigned to you."}
        showAddBtn={false}
        addBtnText={""}
        addBtnHandler={null}
        showDownloadBtn={false}
        showSearch={true}
        searchPlaceholder={"Search by order ID or tracking ID"}
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
        mode={"upi-vendor"}
        opened={details}
        orderId={orderId}
        close={detailsHandler.close}
        reload={triggerReload}
      />
    </>
  );
};

export default Payins;
