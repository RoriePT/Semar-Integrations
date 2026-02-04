import { useEffect, useState } from "react";
import usePagination from "../../../../../../hook/usePagination";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { FaListAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import TableLayout from "../../../../../../components/TableLayout2";
import InfoRow from "../../../../../../components/InfoRow";
import TopUpBadge from "../../../../../../components/OrderStatus/Badges/TopUpBadge";
import Member from "../../../../../../components/Users/Member";
import TopUpModal from "../../../../../../components/OrderModals/TopUpModals";
import { TopupOrders } from "../../../../../../api/topupOrders";
import { IoMdInformationCircle } from "react-icons/io";
import TopupStatusInfoModal from "../../../../../../components/OrderStatus/InfoModal/TopupStatusInfoModal";
import { topupOrders } from "../../../../../../api/overview";

const TopUpOrders = ({ currentTopUpstatus = "grabbed" }) => {
  const navigate = useNavigate();
  const [opened, handlers] = useDisclosure();
  const [openedInfo, InfoHandlers] = useDisclosure();
  const [statusInfo, statusInfoHandlers] = useDisclosure();
  const [orderId, setOrderId] = useState(null);
  const [topUpDetails, setTopupDetails] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [reload, setReload] = useState(false);

  const isMobile = useMediaQuery("(max-width: 720px)");

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

    startDate,
    endDate,
    setStartDate,
    setEndDate,

    search,
    setSearch,
    triggerReload,

    filterData,
    handleChangeFilterData,
    resetFilters,
    handleApplyFilter,
    appliedFilterCount,
  } = usePagination({
    table: "topup/admin",
  });

  const fetchCurrentOrderDetails = async () => {
    const res = await TopupOrders.getCurrentTopupDetails();
    if (res) setTopupDetails(res);
  };

  const handleView = (id) => {
    setOrderId(id);
    handlers.open();
  };

  const handleViewMember = (id) => {
    alert("To be implemented!");
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
    "Member",
    "Member Commissions",
    "Agent Commissions",
    "Actions",
  ];

  const mappedRows = rows?.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>{(pageNumber - 1) * 10 + index + 1}</Table.Td>
      <Table.Td>{row.systemOrderId}</Table.Td>
      <Table.Td>₹{row.amount}</Table.Td>
      <Table.Td>
        <TopUpBadge status={row.status} size="md" fullWidth />
      </Table.Td>
      <Table.Td>
        <Badge fullWidth variant="light" fw={400} color="black">
          {row.channel}
        </Badge>
      </Table.Td>
      <Table.Td>{row.member}</Table.Td>
      <Table.Td>₹{row.memberCommission}</Table.Td>
      <Table.Td>₹{row.totalAgentCommission}</Table.Td>
      <Table.Td>
        <Flex justify={"space-evenly"} gap={"8px"}>
          <ActionIcon onClick={() => handleView(row.systemOrderId)}>
            <FaListAlt />
          </ActionIcon>
        </Flex>
      </Table.Td>
    </Table.Tr>
  ));

  const handleReload = () => setReload((prev) => !prev);

  useEffect(() => {
    fetchCurrentOrderDetails();
  }, [reload]);

  return (
    <>
      {topUpDetails ? (
        <>
          {" "}
          <Card p="md" radius="md" mb={"md"}>
            <Flex
              justify="space-between"
              direction={isMobile ? "column" : "row"}
            >
              <Box>
                <InfoRow
                  label="Current System Profit"
                  value={`₹${topUpDetails?.upperCard?.currentSystemProfit}`}
                />
                <InfoRow
                  label="Current System Holdings"
                  value={`₹${topUpDetails?.upperCard?.currentSystemHoldings}`}
                />
                <InfoRow
                  label="Amount pending till next top-up roll out"
                  value={`₹${topUpDetails?.upperCard?.amountPending}`}
                />
                <InfoRow
                  label="Next Top-up amount"
                  value={`₹${topUpDetails?.upperCard?.nextTopupAmount}`}
                />
              </Box>
              <Box>
                <Title order={5}>Next Top-up channel:</Title>
                <Box
                  mt="xs"
                  style={{
                    padding: "12px 16px",
                    borderRadius: "10px",
                    boxShadow:
                      "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
                  }}
                >
                  {Object.entries(
                    topUpDetails?.upperCard?.nextTopupChannel?.channelDetails
                  ).map(([key, value]: any[]) => (
                    <Text key={key} size="sm">
                      <strong>{key}:</strong> {value}
                    </Text>
                  ))}
                </Box>
              </Box>
            </Flex>
          </Card>
          {topUpDetails.lowerCard && (
            <>
              {" "}
              <Title order={4} p="md">
                Current Top-up
              </Title>
              <Card p="md" radius="md" mb="md">
                <Flex
                  justify={"space-between"}
                  direction={isMobile ? "column" : "row"}
                >
                  <Box>
                    <InfoRow
                      label="Amount"
                      value={`₹${topUpDetails.lowerCard.amount}`}
                    />
                    <Flex>
                      <Title order={5} mr="xs">
                        Channel:
                      </Title>
                      <Badge fullWidth variant="light" fw={400} color="black">
                        {topUpDetails.lowerCard.channel}
                      </Badge>
                    </Flex>
                    <Title order={5} mr="xs">
                      Channel Details:
                    </Title>
                    <Box
                      mt="xs"
                      style={{
                        padding: "12px 16px",
                        borderRadius: "10px",
                        boxShadow:
                          "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
                      }}
                    >
                      {topUpDetails?.lowerCard?.channelDetails
                        ? Object.entries(
                            topUpDetails?.lowerCard?.channelDetails
                          ).map(([key, value]: any) => (
                            <Text key={key} size="sm">
                              <strong>{key}:</strong> {value}
                            </Text>
                          ))
                        : null}
                    </Box>
                  </Box>
                  <Box pt={isMobile ? "xs" : ""}>
                    <Flex>
                      <Title mr="xs" order={5}>
                        Status:
                      </Title>
                      <TopUpBadge
                        status={topUpDetails.lowerCard.status}
                        size="md"
                        fullWidth
                      />
                    </Flex>
                    {topUpDetails.lowerCard.status === "assigned" && (
                      <Button
                        onClick={() => {
                          handleViewMember(topUpDetails.lowerCard?.member?.id);
                        }}
                        mt="md"
                      >
                        View Member
                      </Button>
                    )}
                    {topUpDetails.lowerCard.status === "submitted" && (
                      <Button
                        onClick={() =>
                          handleView(topUpDetails.lowerCard?.systemOrderId)
                        }
                        mt="md"
                      >
                        Verify
                      </Button>
                    )}
                  </Box>
                </Flex>
              </Card>{" "}
            </>
          )}
        </>
      ) : (
        <Card p="md" radius="md" mb="md">
          <Title order={5} mb={"4px"}>
            No top-up channel found!
          </Title>
          <Text>
            Please add a top-up channel to start creating top-up orders.
          </Text>
          <Button
            mt={"md"}
            w={"20%"}
            onClick={() => {
              navigate("/admin/system-config");
            }}
          >
            Add a top-up channel
          </Button>
        </Card>
      )}

      <TableLayout
        table={"topup"}
        headerText={"All Top up Orders"}
        subtext={"Manage and oversee all top-up orders rolled out via system."}
        showAddBtn={false}
        addBtnText={""}
        addBtnHandler={null}
        showDownloadBtn={true}
        showSearch={true}
        searchPlaceholder={"Search by system order ID"}
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
        topupFilters={true}
      />
      <TopUpModal
        opened={opened}
        close={handlers.close}
        mode={"admin"}
        orderId={orderId}
        triggerReload={triggerReload}
        handlers={handlers}
        handleReload={handleReload}
      />
      <Member
        opened={openedInfo}
        setOpened={InfoHandlers.close}
        id={selectedRow?.id}
      />
      <TopupStatusInfoModal
        opened={statusInfo}
        close={statusInfoHandlers.close}
      />
    </>
  );
};

export default TopUpOrders;
