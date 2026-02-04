import React, { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import {
  ActionIcon,
  Badge,
  Button,
  Checkbox,
  Flex,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { FaListAlt } from "react-icons/fa";
import { RiCloseLargeLine } from "react-icons/ri";
import { FaCheck } from "react-icons/fa";
import usePagination from "../../../../../hook/usePagination";
import TableLayout from "../../../../../components/TableLayout2";
import WithdrawalsBadge from "../../../../../components/OrderStatus/Badges/WithdrawalsBadge";
import WithdrawalModal from "./WithdrawalModal";
import WithdrawalModals from "../../../../../components/OrderModals/WithdrawalModals";
import { useDashboardUser } from "../../../DashboardProvider";
import { userAllWithdrawals } from "../../../../../api/DummyOrders/Paginate/Data/userAllWithdrawals";
import moment from "moment";
import { IoMdInformationCircle } from "react-icons/io";
import WithdrawalStatusInfoModal from "../../../../../components/OrderStatus/InfoModal/WithdrawalStatusInfoModal";
import { formatDateIST } from "../../../../../utils";

const MyWithdrawals = () => {
  const [opened, handlers] = useDisclosure();
  const [selected, selectedHandlers] = useDisclosure();
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
  } = usePagination({ table: "withdrawal/member", userId: userData.id });

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
      <Table.Td>
        {row.serviceCharge !== null ? <>₹{row.serviceCharge}</> : <>None</>}
      </Table.Td>
      <Table.Td>
        {row.balanceBefore !== null ? <>₹{row.balanceBefore}</> : <>None</>}
      </Table.Td>
      <Table.Td>
        {row.balanceAfter !== null ? <>₹{row.balanceAfter}</> : <>None</>}
      </Table.Td>
      <Table.Td>{formatDateIST(row.date)}</Table.Td>
      <Table.Td>
        <WithdrawalsBadge status={row.status} size={"md"} fullWidth />
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
    "Actions",
  ];

  return (
    <>
      <TableLayout
        table={"admin"}
        headerText={"Withdrawal Orders"}
        subtext={"Withdrawal Orders."}
        showAddBtn={true}
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
        user={"member"}
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
