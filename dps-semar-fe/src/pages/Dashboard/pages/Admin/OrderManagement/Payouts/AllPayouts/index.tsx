import {
  ActionIcon,
  Badge,
  Button,
  Flex,
  Modal,
  Select,
  Table,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { FaListAlt } from "react-icons/fa";
import { IoMdInformationCircle } from "react-icons/io";
import PayoutOrders from "../../../../../../../api/payoutOrders";
import PayoutModal from "../../../../../../../components/OrderModals/PayoutModals";
import PayoutStatusBadge from "../../../../../../../components/OrderStatus/Badges/PayoutStatusBadge";
import PayoutStatusInfoModal from "../../../../../../../components/OrderStatus/InfoModal/PayoutStatusInfoModal";
import TableLayout from "../../../../../../../components/TableLayout2";
import usePagination from "../../../../../../../hook/usePagination";
import { formatDateIST } from "../../../../../../../utils";

const AllPayouts = (reload) => {
  const [opened, handlers] = useDisclosure();

  const [statusInfo, statusInfoHandlers] = useDisclosure();
  const [orderId, setOrderId] = useState(null);

  const [statusToUpdate, setStatusToUpdate] = useState(null);
  const [confirmModalOpened, confirmModalHandler] = useDisclosure(false);
  const [loadingStatusChange, setLoadingStatusChange] = useState(false);

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

    filterData,
    handleChangeFilterData,
    resetFilters,
    handleApplyFilter,
    appliedFilterCount,
  } = usePagination({
    table: "payout/admin",
  });

  useEffect(() => {
    triggerReload();
  }, [reload]);

  const handleView = async (id) => {
    setOrderId(id);
    handlers.open();
  };

  const mappedRows = rows?.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>{(pageNumber - 1) * 10 + index + 1}</Table.Td>
      <Table.Td>{row.systemOrderId}</Table.Td>
      <Table.Td>{row.merchantOrderId || "N/A"}</Table.Td>
      <Table.Td>{row.transactionId || "N/A"}</Table.Td>
      <Table.Td>₹{row.amount}</Table.Td>
      <Table.Td>
        <PayoutStatusBadge status={row.status} size={"md"} fullWidth />
      </Table.Td>
      <Table.Td>{row.merchant}</Table.Td>
      <Table.Td>
        <Badge fullWidth variant="light" fw={400} color="black">
          {row.channel}
        </Badge>
      </Table.Td>
      <Table.Td>
        {!row.payoutMadeVia || row.payoutMadeVia === null ? (
          "To be assigned"
        ) : row.payoutMadeVia === "gateway" ? (
          <Badge fullWidth variant="light">
            {row.gatewayName === "UNIQPAY"
              ? "BENAKPAY"
              : row.gatewayName || "N/A"}
          </Badge>
        ) : row.payoutMadeVia === "upi_vendor" ? (
          <Badge fullWidth variant="light" color="cyan">
            UPI VENDOR
          </Badge>
        ) : row.payoutMadeVia === "MEMBER" ? (
          <>{row.member || "N/A"}</>
        ) : (
          <>N/A</>
        )}
      </Table.Td>
      <Table.Td>{row.user}</Table.Td>

      <Table.Td>₹{row.merchantCharge}</Table.Td>
      <Table.Td>₹{row.systemProfit}</Table.Td>
      <Table.Td>{row.callbackStatus}</Table.Td>
      <Table.Td miw={"200px"}>
        {row.status === "complete" || row.status === "failed" ? (
          <PayoutStatusBadge status={row.status} size={"lg"} fullWidth />
        ) : (
          <Select
            placeholder={row.status?.toUpperCase()}
            value={row.status?.toUpperCase()}
            data={["COMPLETE", "FAILED"]}
            radius="xl"
            size="xs"
            onChange={(selectedStatus) => {
              if (!selectedStatus) return;
              setStatusToUpdate({
                orderId: row.systemOrderId,
                status: selectedStatus,
              });
              confirmModalHandler.open();
            }}
          />
        )}
      </Table.Td>
      <Table.Td>{formatDateIST(row.createdAt)}</Table.Td>
      <Table.Td>{formatDateIST(row.updatedAt)}</Table.Td>
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
    "System Order Id",
    "Merchant Order Id",
    "Gateway Transaction ID",
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
    "Merchant",
    "Channel",
    "Payment Gateway",
    "Payee",
    "Merchant Charge",
    "System Profit",
    "Callback status",
    "Change Status",
    "Created at",
    "Updated at",
    "",
  ];

  return (
    <>
      <TableLayout
        table={"payout"}
        headerText={"All Payout Orders"}
        subtext={
          "View and manage all outgoing payment orders initiated by merchants."
        }
        showAddBtn={false}
        addBtnText={""}
        addBtnHandler={null}
        showDownloadBtn={true}
        showSearch={true}
        searchPlaceholder={"Search by order IDs"}
        showDateRange={true}
        showFilter={true}
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
        filterData={filterData}
        handleChangeFilterData={handleChangeFilterData}
        resetFilters={resetFilters}
        handleApplyFilter={handleApplyFilter}
        appliedFilterCount={appliedFilterCount}
        gatewayFilter={true}
        memberFilter={true}
        merchantFilter={true}
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
        handlers={handlers}
        triggerReload={triggerReload}
      />

      <Modal
        opened={confirmModalOpened}
        onClose={confirmModalHandler.close}
        title="Confirm Status Change"
        centered
        size="md"
      >
        <Text mb="md">
          Are you sure you want to change the status to{" "}
          <strong>{statusToUpdate?.status}</strong> for the order{" "}
          <strong>{statusToUpdate?.orderId}</strong>?
        </Text>
        <Flex justify="end" gap="sm">
          <Button variant="default" onClick={confirmModalHandler.close}>
            Cancel
          </Button>
          <Button
            color="brand"
            loading={loadingStatusChange}
            onClick={async () => {
              setLoadingStatusChange(true);
              try {
                await PayoutOrders.changeStatusAdmin(
                  statusToUpdate.orderId,
                  statusToUpdate.status,
                );
                setLoadingStatusChange(false);
                triggerReload();
              } catch (e) {
                console.error("Failed to update status", e);
              } finally {
                confirmModalHandler.close();
              }
            }}
          >
            Confirm
          </Button>
        </Flex>
      </Modal>
    </>
  );
};

export default AllPayouts;
