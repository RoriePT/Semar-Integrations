import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { ActionIcon, Badge, Flex, Table } from "@mantine/core";
import { FaListAlt } from "react-icons/fa";
import usePagination from "../../../../../hook/usePagination";
import TableLayout from "../../../../../components/TableLayout2";
import WithdrawalsBadge from "../../../../../components/OrderStatus/Badges/WithdrawalsBadge";
import WithdrawalModal from "./WithdrawalModal";
import WithdrawalModals from "../../../../../components/OrderModals/WithdrawalModals";
import moment from "moment";
import { useDashboardUser } from "../../../DashboardProvider";
import { IoMdInformationCircle } from "react-icons/io";
import WithdrawalStatusInfoModal from "../../../../../components/OrderStatus/InfoModal/WithdrawalStatusInfoModal";
import { formatDateIST } from "../../../../../utils";

const MyWithdrawals = () => {
  const [withdrawalModalOpened, withdrawalModalHandlers] = useDisclosure();
  const [withdrawalModalsOpened, withdrawalModalsHandlers] = useDisclosure();
  const [orderId, setOrderId] = useState(null);
  const { userData } = useDashboardUser();
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
  } = usePagination({ table: "withdrawal/merchant", userId: userData.id });

  const handleView = (id) => {
    setOrderId(id);
    withdrawalModalsHandlers.open();
  };

  const mappedRows = rows.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>{(pageNumber - 1) * 10 + index + 1}</Table.Td>
      <Table.Td>{row.systemOrderId}</Table.Td>
      <Table.Td>₹{row.amount}</Table.Td>
      <Table.Td>
        <Badge fullWidth variant="light" fw={400} color="black">
          {row.channel}
        </Badge>
      </Table.Td>
      <Table.Td>₹{row.serviceCharge || 0}</Table.Td>
      <Table.Td>₹{row.balanceBefore || 0}</Table.Td>
      <Table.Td>₹{row.balanceAfter || 0}</Table.Td>
      <Table.Td>{formatDateIST(row.date)}</Table.Td>
      <Table.Td>
        <WithdrawalsBadge status={row.status} size={"md"} fullWidth />
      </Table.Td>
      <Table.Td>{formatDateIST(row.createdAt)}</Table.Td>
      <Table.Td>
        {row.updatedAt && row.status?.toLowerCase() !== "pending"
          ? formatDateIST(row.updatedAt)
          : "Pending"}
      </Table.Td>
      <Table.Td>
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
    "Amount",
    "Channel",
    "Service Charge",
    "Balance Before",
    "Balance After",
    "Date",
    <Flex
      gap={"4px"}
      align={"center"}
      justify={"center"}
      style={{ cursor: "pointer" }}
      onClick={statusInfoHandlers.open}
    >
      Status <IoMdInformationCircle size={"14px"} />
    </Flex>,
    "Created at",
    "Completed at",
    "Actions",
  ];

  return (
    <>
      <TableLayout
        table={"admin"}
        headerText={"Withdrawal Orders"}
        subtext={"Oversee and manage all withdrawal orders submitted by you."}
        showAddBtn={
          userData.userType === "Merchant" ||
          (userData.userType === "Sub-Merchant" &&
            userData.permissionSubmitWithdrawals)
        }
        addBtnText={"New Withdrawal"}
        addBtnHandler={withdrawalModalHandlers.open}
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
      <WithdrawalModal
        opened={withdrawalModalOpened}
        onClose={withdrawalModalHandlers.close}
        reload={triggerReload}
      />
      <WithdrawalModals
        opened={withdrawalModalsOpened}
        close={withdrawalModalsHandlers.close}
        mode={"user"}
        orderId={orderId}
        user={"merchant"}
        reload={triggerReload}
      />
      <WithdrawalStatusInfoModal
        opened={statusInfo}
        close={statusInfoHandlers.close}
      />
    </>
  );
};

export default MyWithdrawals;
