import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { ActionIcon, Badge, Flex, Table } from "@mantine/core";
import { FaListAlt } from "react-icons/fa";
import usePagination from "../../../../../../../hook/usePagination";
import TableLayout from "../../../../../../../components/TableLayout2";
import WithdrawalModals from "../../../../../../../components/OrderModals/WithdrawalModals";

import moment from "moment";
import { formatDateIST } from "../../../../../../../utils";

const PendingWithdrawals = (reload) => {
  const [opened, handlers] = useDisclosure();
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
  } = usePagination({ table: "withdrawal/admin", forBulletin: true });

  useEffect(() => {
    triggerReload();
  }, [reload]);

  const handleView = (id) => {
    setOrderId(id);
    handlers.open();
  };

  const mappedRows = rows.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>{(pageNumber - 1) * 10 + index + 1}</Table.Td>
      <Table.Td>{row.systemOrderId}</Table.Td>
      <Table.Td>₹{row.amount}</Table.Td>
      <Table.Td>
        {" "}
        <Badge fullWidth variant="light" fw={400} color="black">
          {row.channel}
        </Badge>
      </Table.Td>
      <Table.Td>{row.user}</Table.Td>
      <Table.Td>{row.userRole}</Table.Td>
      <Table.Td>{formatDateIST(row.date)}</Table.Td>
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
    "User Name",
    "User Role",
    "Date",
    "Actions",
  ];

  return (
    <>
      <TableLayout
        table={"admin"}
        headerText={"Withdrawal Orders to be processed"}
        subtext={
          "Manage and process all pending withdrawal orders requested by merchants and agents."
        }
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
      <WithdrawalModals
        opened={opened}
        close={handlers.close}
        mode={"admin"}
        orderId={orderId}
        user={"admin"}
        reload={triggerReload}
      />
    </>
  );
};

export default PendingWithdrawals;
