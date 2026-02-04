import { useDisclosure } from "@mantine/hooks";
import usePagination from "../../../../../hook/usePagination";
import { Box, Button, Center, Flex, Table, Text, Title } from "@mantine/core";
import CopyButton from "../../../../../components/CopyButton";
import TableLayout from "../../../../../components/TableLayout2";
import { getFullName } from "../../../../../utils/helpers";
import moment from "moment";
import MemberTree from "../../../../../components/MemberTree";
import { useState } from "react";
import { formatDateIST } from "../../../../../utils";

const MemberAgentReferralList = () => {
  const [treeOpened, treeHandlers] = useDisclosure();
  const [selectedRow, setSelectedRow] = useState(0);

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
    table: "member-referral/used-codes",
  });

  const mappedRows = rows.map((row, index) => {
    return (
      <Table.Tr key={index}>
        <Table.Td>{(pageNumber - 1) * 10 + index + 1}</Table.Td>
        <Table.Td>
          <Center>
            <span>{row.referralCode}</span>
            <CopyButton value={row.referralCode} />
          </Center>
        </Table.Td>
        <Table.Td>{getFullName(row.member)}</Table.Td>

        <Table.Td>
          <Flex justify={"center"} gap={"md"}>
            <Box>
              <Title order={6} fw={600}>
                Payin
              </Title>
              <Text>{row.payinCommission}</Text>
            </Box>
            <span>|</span>
            <Box>
              <Title order={6} fw={600}>
                Payout
              </Title>
              <Text>{row.payoutCommission}</Text>
            </Box>
            <span>|</span>
            <Box>
              <Title order={6} fw={600}>
                Top-up
              </Title>
              <Text>{row.topupCommission}</Text>
            </Box>
          </Flex>
        </Table.Td>

        <Table.Td>{getFullName(row.referredMember)}</Table.Td>
        <Table.Td>{formatDateIST(row.referredMember?.createdAt)}</Table.Td>
        <Table.Td>
          <Button
            size="xs"
            onClick={() => {
              setSelectedRow(row);
              treeHandlers.open();
            }}
          >
            View Tree
          </Button>
        </Table.Td>
      </Table.Tr>
    );
  });

  const columns = [
    "SNo.",
    "Code",
    "Referrer",
    "Referrer Commission Rates",
    "Referee",
    "Referee onboard date",
    "Actions",
  ];

  return (
    <>
      <TableLayout
        table={"member-referral/used-codes"}
        headerText={"Member Agent Referral List"}
        subtext={"Manage member agent referral list."}
        showAddBtn={false}
        addBtnText={""}
        addBtnHandler={null}
        showDownloadBtn={false}
        showSearch={true}
        searchPlaceholder={"Search by Code"}
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
      <MemberTree
        opened={treeOpened}
        close={treeHandlers.close}
        selectedRow={selectedRow}
      />
    </>
  );
};

export default MemberAgentReferralList;
