import { useState } from "react";
import { useDashboardUser } from "../../../../DashboardProvider";
import usePagination from "../../../../../../hook/usePagination";
import { Card, Flex, Table, Text } from "@mantine/core";
import TableLayout from "../../../../../../components/TableLayout2";
import NewPayoutModal from "./NewPayoutModal";

export const getChannelDetails = (type, channelDetails) => {
  if (!channelDetails) return "N/A";

  if (type && typeof channelDetails[type] === "object")
    return (
      <Card shadow={"xs"} radius={"md"}>
        {Object.keys(channelDetails[type]).map((key, index) => (
          <Flex key={index} gap={"xs"} align={"center"}>
            <Text fw={500} size="sm">
              {key}:{" "}
            </Text>
            <Text size="xs" c={"dimmed"}>
              {channelDetails[type][key] || "N/A"}
            </Text>
          </Flex>
        ))}
      </Card>
    );

  return "N/A";
};

const PayoutUsers = () => {
  const { userData } = useDashboardUser();
  const [newPayoutOpened, setNewPayoutOpened] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState(null);

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
    table: "payout/merchant-user",
    userId: userData?.id,
  });

  const mappedRows = rows?.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>{(pageNumber - 1) * 10 + index + 1}</Table.Td>
      <Table.Td>{row.name}</Table.Td>
      <Table.Td>{row.userId}</Table.Td>
      <Table.Td>{row?.email || "N/A"}</Table.Td>
      <Table.Td>{row?.mobile || "N/A"}</Table.Td>
      <Table.Td>₹{row.totalPayinAmount || "0"}</Table.Td>
      <Table.Td>₹{row.totalPayoutAmount || "0"}</Table.Td>

      <Table.Td>{getChannelDetails("UPI", row.channelDetails)}</Table.Td>
      <Table.Td>{getChannelDetails("E_WALLET", row.channelDetails)}</Table.Td>
      <Table.Td>
        {getChannelDetails("NET_BANKING", row.channelDetails)}
      </Table.Td>
    </Table.Tr>
  ));

  const columns = [
    "SNo.",
    "Name",
    "User Id",
    "Email",
    "Mobile",
    "Total Payin Amount",
    "Total Payout Amount",
    "UPI Details",
    "E-Wallet Details",
    "NetBanking Details",
  ];

  return (
    <>
      <TableLayout
        table={"admin"}
        headerText={"End Users"}
        subtext={"Oversee all of your end users involved in payin and payouts."}
        showAddBtn={
          userData.userType === "Merchant" ||
          (userData.userType === "Sub-Merchant" &&
            userData.permissionSubmitPayouts)
        }
        addBtnText={"New Payout"}
        // addBtnHandler={() => {
        //   alert("Add Modal here");
        // }}
        addBtnHandler={() => {
          setSelectedPayout(null);
          setNewPayoutOpened(true);
        }}
        showDownloadBtn={false}
        showSearch={true}
        searchPlaceholder={"Search by name"}
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
      <NewPayoutModal
        opened={newPayoutOpened}
        onClose={() => {
          setNewPayoutOpened(false);
          setSelectedPayout(null);
        }}
        setNewPayoutOpened={setNewPayoutOpened}
        payoutData={selectedPayout}
        triggerReload={triggerReload}
      />
    </>
  );
};

export default PayoutUsers;
