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
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { FaListAlt } from "react-icons/fa";
import { IoMdInformationCircle } from "react-icons/io";
import OrderAPIs from "../../../../../../../api/order";
import PayinModal from "../../../../../../../components/OrderModals/PayinModals";
import PayinStatusBadge from "../../../../../../../components/OrderStatus/Badges/PayinStatusBadge";
import PayinStatusInfoModal from "../../../../../../../components/OrderStatus/InfoModal/PayinStatusInfoModal";
import TableLayout from "../../../../../../../components/TableLayout2";
import usePagination from "../../../../../../../hook/usePagination";
import { formatDateIST } from "../../../../../../../utils";

const MismatchedUtrPayins = ({ reload }) => {
  const [statusInfo, statusInfoHandlers] = useDisclosure();
  const [details, detailsHandler] = useDisclosure();
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
    sortBy,
    setSortBy,

    startRecord,
    endRecord,
    totalRecords,

    search,
    setSearch,
    triggerReload,
  } = usePagination({
    table: "admin/paginate/mismatched-utr",
    skipPaginateAppend: true,
  });

  const handleView = (id) => {
    setOrderId(id);
    detailsHandler.open();
  };

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
    "Payer",
    "Merchant Income",
    "Merchant Charge",
    "System Profit",
    "Callback Status",
    "Change Status",
    "Created at",
    "Updated at",
    "",
  ];

  const mappedRows = rows.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>{(pageNumber - 1) * 10 + index + 1}</Table.Td>
      <Table.Td>{row.systemOrderId}</Table.Td>
      <Table.Td>{row.merchantOrderId}</Table.Td>
      <Table.Td>{row.gatewayTransactionId || "N/A"}</Table.Td>
      <Table.Td>₹{row.amount}</Table.Td>
      <Table.Td>
        <PayinStatusBadge status={row.status} size={"md"} fullWidth />
      </Table.Td>
      <Table.Td>{row.merchant}</Table.Td>
      <Table.Td>
        <Badge fullWidth variant="light" fw={400} color="black">
          {row.channel}
        </Badge>
      </Table.Td>
      <Table.Td>
        {!row.payinMadeOn || row.payinMadeOn === null ? (
          "To be assigned"
        ) : row.payinMadeOn === "gateway" ? (
          <Badge fullWidth variant="light">
            {row.gatewayName === "UNIQPAY"
              ? "BENAKPAY"
              : row.gatewayName || "N/A"}
          </Badge>
        ) : row.payinMadeOn === "upi_vendor" ? (
          <Badge fullWidth variant="light" color="cyan">
            UPI VENDOR
          </Badge>
        ) : row.payinMadeOn === "MEMBER" ? (
          <>{row.member || "N/A"}</>
        ) : (
          <>N/A</>
        )}
      </Table.Td>
      <Table.Td>{row.user}</Table.Td>

      <Table.Td>
        ₹{parseFloat((row.amount - row.merchantCharge).toFixed(2))}
      </Table.Td>
      <Table.Td>₹{row.merchantCharge}</Table.Td>
      <Table.Td>₹{row.systemProfit}</Table.Td>
      <Table.Td>{row.callbackStatus}</Table.Td>
      <Table.Td miw={"200px"}>
        {row.status === "complete" || row.status === "failed" ? (
          <PayinStatusBadge status={row.status} size={"lg"} fullWidth />
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
        table={"payin"}
        headerText={"UTR Mismatched Pending Orders"}
        subtext={
          "View and manage payin orders with UTR mismatches that require manual review."
        }
        showAddBtn={false}
        addBtnText={""}
        addBtnHandler={null}
        showDownloadBtn={true}
        showSearch={true}
        searchPlaceholder={
          "Search by order ID, tracking ID, or gateway transaction ID"
        }
        showDateRange={false}
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
        startDate={null}
        handleStartDate={() => {}}
        endDate={null}
        handleEndDate={() => {}}
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
        mode={"admin"}
        opened={details}
        orderId={orderId}
        close={detailsHandler.close}
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
                const result = await OrderAPIs.changeStatusAdmin(
                  statusToUpdate.orderId,
                  statusToUpdate.status,
                );

                if (result && !result.isError) {
                  notifications.show({
                    title: "Success",
                    message: `Order status updated to ${statusToUpdate.status} successfully`,
                    color: "green",
                    withCloseButton: true,
                  });
                  triggerReload();
                  confirmModalHandler.close();
                } else {
                  const errorMessage =
                    result?.error ||
                    result?.message ||
                    "Failed to update order status";
                  notifications.show({
                    title: "Error",
                    message: errorMessage,
                    color: "red",
                    withCloseButton: true,
                  });
                }
              } catch (e: any) {
                console.error("Failed to update status", e);
                const errorMessage =
                  e?.response?.data?.message ||
                  e?.response?.data?.error ||
                  e?.message ||
                  "Failed to update order status. Please try again.";
                notifications.show({
                  title: "Error",
                  message: errorMessage,
                  color: "red",
                  withCloseButton: true,
                });
              } finally {
                setLoadingStatusChange(false);
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

export default MismatchedUtrPayins;
