import { useEffect } from "react";

import { Switch, Table } from "@mantine/core";

import { notifications } from "@mantine/notifications";
import usePagination from "../../../../../../hook/usePagination";
import TableLayout from "../../../../../../components/TableLayout2";
import CommonAPIs from "../../../../../../api/common";
import { getChannelDetails } from "../../../Merchant/PayoutOrders/Users";

const AllUsers = (reload) => {
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
    table: "end-user",
  });

  useEffect(() => {
    triggerReload();
  }, [reload]);

  const handleToggleBlacklist = async ({ id }) => {
    try {
      const response = await CommonAPIs.toggleBlacklistStatus(id);
      if (response === 200) {
        notifications.show({
          title: "Success",
          message: `Blacklist status changed.`,
          color: "green",
          withCloseButton: true,
        });
        triggerReload();
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to toggle blacklist status.",
        color: "red",
        withCloseButton: true,
      });
    }
  };

  const mappedRows = rows.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>{(pageNumber - 1) * 10 + index + 1}</Table.Td>
      <Table.Td>
        {row.merchant.firstName + " " + row.merchant.lastName}
      </Table.Td>
      <Table.Td>{row.userId}</Table.Td>
      <Table.Td>{row.name}</Table.Td>
      <Table.Td>{row?.email || "N/A"}</Table.Td>
      <Table.Td>{row?.mobile || "N/A"}</Table.Td>
      <Table.Td>₹{row.totalPayinAmount}</Table.Td>
      <Table.Td>₹{row.totalPayoutAmount}</Table.Td>
      <Table.Td>{getChannelDetails("UPI", row.channelDetails)}</Table.Td>
      <Table.Td>{getChannelDetails("E_WALLET", row.channelDetails)}</Table.Td>
      <Table.Td>
        {getChannelDetails("NET_BANKING", row.channelDetails)}
      </Table.Td>
      <Table.Td>
        <Switch
          checked={row.isBlacklisted}
          size="sm"
          onChange={() => handleToggleBlacklist({ id: row.id })}
        />
      </Table.Td>
    </Table.Tr>
  ));

  const columns = [
    "SNo.",
    "Merchant",
    "Merchant User ID",
    "Name",
    "Email",
    "Mobile",
    "Payin Amount",
    "Payout Amount",
    "UPI Details",
    "E-Wallet Details",
    "NetBanking Details",
    "Blacklist",
  ];

  return (
    <>
      <TableLayout
        table={"admin"}
        headerText={"End Users of Merchants"}
        subtext={
          "Manage and oversee all end user accounts of merchant websites registered via payin and payout orders."
        }
        showAddBtn={false}
        addBtnText={""}
        addBtnHandler={null}
        showDownloadBtn={false}
        showSearch={true}
        searchPlaceholder={"Search by username, mobile"}
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

      {/* <PayoutStatusInfoModal
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
      /> */}

      {/* <Dialog
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
      </Dialog> */}
    </>
  );
};

export default AllUsers;
