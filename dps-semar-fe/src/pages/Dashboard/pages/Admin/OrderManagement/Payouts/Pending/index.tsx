import React, { useEffect, useState } from "react";
import { useDashboardUser } from "../../../../../DashboardProvider";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import usePagination from "../../../../../../../hook/usePagination";
import PayoutStatusBadge from "../../../../../../../components/OrderStatus/Badges/PayoutStatusBadge";
import {
  ActionIcon,
  Badge,
  Button,
  Checkbox,
  Dialog,
  Flex,
  Table,
  Text,
  Title,
} from "@mantine/core";
import TableLayout from "../../../../../../../components/TableLayout2";
import PayoutStatusInfoModal from "../../../../../../../components/OrderStatus/InfoModal/PayoutStatusInfoModal";
import PayoutModal from "../../../../../../../components/OrderModals/PayoutModals";
import { getPendingPayoutsForAdmin } from "../../../../../../../api/DummyOrders/Paginate";
import { FaListAlt } from "react-icons/fa";
import TransactionReceipt from "../../../../../../../components/OrderModals/TransactionReceipt";
import { FaCheck } from "react-icons/fa";
import { RiCloseLargeLine } from "react-icons/ri";
import ChangePaymentStatus from "../../../../../../../api/updatePaymentStatus";
import { notifications } from "@mantine/notifications";
import moment from "moment";
import { formatDateIST } from "../../../../../../../utils";

const PendingPayouts = (reload) => {
  const { userData, loading } = useDashboardUser();
  const { permissionAdmins } = userData;
  const [opened, handlers] = useDisclosure();
  const [receipt, receiptHandlers] = useDisclosure();
  // const [selected, selectedHandlers] = useDisclosure();
  const [transactionDetails, setTransactionDetails] = useState({
    id: 0,
    receipt: "",
  });
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [uploading, setUploading] = useState(false);

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
    setPaymentStatus,

    sortBy,
    setSortBy,

    handleChangeFilterData,
  } = usePagination({
    table: "payout/admin",
    status: "submitted",
  });

  useEffect(() => {
    triggerReload();
    handleChangeFilterData("madeVia", "MEMBER");
  }, [reload]);

  const handleView = (id) => {
    setOrderId(id);
    handlers.open();
  };

  const handleAcceptAll = async () => {
    setUploading(true);
    setSelectedOrders([]);
    const promises = selectedOrders.map(async (order) => {
      return await ChangePaymentStatus.changePaymentStatus({
        status: "complete",
        id: order,
      });
    });

    try {
      const results = await Promise.all(promises);
      setUploading(false);
      if (results) {
        notifications.show({
          title: "success",
          message: `Payment status changed to complete successfully.`,
          color: "green",
          withCloseButton: true,
        });
        handlers.close();
        triggerReload();
      } else {
        notifications.show({
          title: "Failed",
          message: "Something went worng.",
          color: "red",
          withCloseButton: true,
        });
      }
    } catch (error) {
      setUploading(false);
      notifications.show({
        title: "Failed",
        message: "Something went worng.",
        color: "red",
        withCloseButton: true,
      });
      console.error(
        "An error occurred while updating payment statuses:",
        error
      );
    }
    setSelectedOrders([]);
  };

  const handleRejectAll = async () => {
    setUploading(true);
    setSelectedOrders([]);
    const promises = selectedOrders.map(async (order) => {
      return await ChangePaymentStatus.changePaymentStatus({
        status: "failed",
        id: order,
      });
    });

    try {
      const results = await Promise.all(promises);
      setUploading(false);
      if (results) {
        notifications.show({
          title: "success",
          message: `Payment status changed to failed successfully.`,
          color: "green",
          withCloseButton: true,
        });
        handlers.close();
        triggerReload();
      } else {
        notifications.show({
          title: "Failed",
          message: "Something went worng.",
          color: "red",
          withCloseButton: true,
        });
      }
    } catch (error) {
      setUploading(false);
      console.error(
        "An error occurred while updating payment statuses:",
        error
      );
    }
    setSelectedOrders([]);
  };

  const handlePaymentStatus = async (status, id) => {
    const res = await ChangePaymentStatus.changePaymentStatus({ status, id });
    if (res) {
      notifications.show({
        title: "success",
        message: `Payment status changed to ${status} successfully.`,
        color: "green",
        withCloseButton: true,
      });
      handlers.close();
      triggerReload();
    } else {
      notifications.show({
        title: "Failed",
        message: "Something went worng.",
        color: "red",
        withCloseButton: true,
      });
      handlers.close();
    }
  };

  const mappedRows = rows.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>
        <Checkbox
          onChange={() => {
            setSelectedOrders((prev) => {
              if (prev.includes(row.systemOrderId))
                return prev.filter((id) => id !== row.systemOrderId);
              else return [...prev, row.systemOrderId];
            });
          }}
          checked={selectedOrders.includes(row.systemOrderId)}
        />
      </Table.Td>
      <Table.Td>{(pageNumber - 1) * 10 + index + 1}</Table.Td>
      <Table.Td>{row.systemOrderId}</Table.Td>
      <Table.Td>{row?.merchantOrderId || "N/A"}</Table.Td>
      <Table.Td>₹{row.amount}</Table.Td>
      <Table.Td>{row.merchant}</Table.Td>
      <Table.Td>
        <Badge fullWidth variant="light" fw={400} color="black">
          {row.channel}
        </Badge>
      </Table.Td>
      <Table.Td>{row.user}</Table.Td>
      <Table.Td>{row.member}</Table.Td>
      <Table.Td>{row.transactionId}</Table.Td>
      <Table.Td>
        <Button
          size="xs"
          onClick={() => {
            setTransactionDetails({
              id: row.transactionId,
              receipt: row.receipt,
            });
            receiptHandlers.open();
          }}
        >
          View
        </Button>
      </Table.Td>
      <Table.Td>₹{row.merchantCharge}</Table.Td>
      <Table.Td>₹{row.systemProfit}</Table.Td>

      <Table.Td>{row.callbackStatus}</Table.Td>
      <Table.Td>{formatDateIST(row.createdAt)}</Table.Td>
      <Table.Td>{formatDateIST(row.updatedAt)}</Table.Td>
      <Table.Td>
        {" "}
        <Flex justify={"space-evenly"} gap={"8px"}>
          <ActionIcon onClick={() => handleView(row.systemOrderId)}>
            <FaListAlt />
          </ActionIcon>
          {userData.permissionVerifyOrders && (
            <ActionIcon
              color="green"
              onClick={() => handlePaymentStatus("complete", row.systemOrderId)}
            >
              <FaCheck />
            </ActionIcon>
          )}
          {userData.permissionVerifyOrders && (
            <ActionIcon
              color="red"
              onClick={() => handlePaymentStatus("failed", row.systemOrderId)}
            >
              <RiCloseLargeLine />
            </ActionIcon>
          )}
        </Flex>
      </Table.Td>
    </Table.Tr>
  ));

  const columns = [
    <Checkbox
      onChange={(e) => {
        if (e.target.checked)
          setSelectedOrders(rows.map((row) => row.systemOrderId));
        else setSelectedOrders([]);
      }}
    />,
    "SNo.",
    "System Order Id",
    "Merchant Order Id",
    "Amount",
    "Merchant",
    "Channel",
    "Payee",
    "Member",
    "Transaction Id",
    "Receipt",
    "Merchant Charge",
    "System Profit",
    "Callback status",
    "Created at",
    "Updated at",
    "",
  ];

  return (
    <>
      <TableLayout
        table={"admin"}
        headerText={"Payout orders to be verified"}
        subtext={"Oversee and verify all payout orders submitted by members."}
        showAddBtn={false}
        addBtnText={""}
        addBtnHandler={null}
        showDownloadBtn={false}
        showSearch={true}
        searchPlaceholder={"Search by order IDs"}
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
        mode={"admin"}
        orderId={orderId}
        handlers={handlers}
        triggerReload={triggerReload}
      />

      <TransactionReceipt
        txnId={transactionDetails.id}
        opened={receipt}
        close={receiptHandlers.close}
        receipt={transactionDetails.receipt}
      />

      <Dialog
        opened={selectedOrders.length >= 1}
        withCloseButton={false}
        size="lg"
        radius="md"
      >
        <Text size="md" mb="xs" fw={500}>
          {selectedOrders.length} payouts selected
        </Text>

        <Flex justify={"space-between"}>
          <Button
            leftSection={<FaCheck />}
            color="green"
            loading={uploading}
            onClick={handleAcceptAll}
          >
            Accept All
          </Button>
          <Button
            leftSection={<RiCloseLargeLine />}
            color="red"
            loading={uploading}
            onClick={handleRejectAll}
          >
            Reject All
          </Button>
        </Flex>
      </Dialog>
    </>
  );
};

export default PendingPayouts;
