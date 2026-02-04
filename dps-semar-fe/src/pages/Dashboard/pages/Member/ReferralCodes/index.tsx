import {
  Badge,
  Button,
  Center,
  CopyButton as MCopyButton,
  Table,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { IoCopyOutline } from "react-icons/io5";
import CopyButton from "../../../../../components/CopyButton";
import TableLayout from "../../../../../components/TableLayout2";
import usePagination from "../../../../../hook/usePagination";
import { formatDateIST } from "../../../../../utils";
import {
  getFullName,
  getReferralStatusColor,
} from "../../../../../utils/helpers";
import { useDashboardUser } from "../../../DashboardProvider";
import ReferralCodeView from "../../Admin/MemberAgentReferralCodes/ReferralCodeView";
import CreateReferralCode from "./CreateReferralCode";

const ReferralCodes = () => {
  const [createOpened, createHandlers] = useDisclosure();
  const [viewOpened, viewHandlers] = useDisclosure();
  const [memberReferralRow, setMemberReferralRow] = useState({});
  const { userData } = useDashboardUser();

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
    table: "member-referral",
    userId: userData?.id,
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

        <Table.Td>
          <Badge variant="dot" color={getReferralStatusColor(row.status)}>
            {row.status}
          </Badge>
        </Table.Td>
        <Table.Td>{formatDateIST(row.createdAt)}</Table.Td>
        <Table.Td>{getFullName(row.referredMember)}</Table.Td>
        <Table.Td>
          <MCopyButton
            value={`${window.location.origin}/sign-up?code=${row.referralCode}`}
            timeout={5000}
          >
            {({ copied, copy }) => (
              <Button
                onClick={copy}
                size="xs"
                color={copied ? "green" : "brand"}
                leftSection={<IoCopyOutline />}
              >
                {copied ? <>Copied!</> : <>Copy</>}
              </Button>
            )}
          </MCopyButton>
        </Table.Td>
      </Table.Tr>
    );
  });

  const columns = [
    "SNo.",
    "Code",
    "Status",
    "Created on",
    "Referee",
    "Referral link",
  ];

  return (
    <>
      {/* <Flex align={"center"} mb={"xl"} gap={"lg"}>
        <Button
          size="md"
          onClick={createHandlers.open}
          leftSection={<FaPlus />}
        >
          Create new referral code
        </Button>
      </Flex> */}
      <TableLayout
        table={"member-referral"}
        headerText={"Referral Codes"}
        subtext={"Oversee and manage your referral codes."}
        showAddBtn={true}
        addBtnText={"Create new referral code"}
        addBtnHandler={createHandlers.open}
        showDownloadBtn={false}
        showSearch={false}
        searchPlaceholder={"Search by Code"}
        showDateRange={false}
        showFilter={false}
        showSort={false}
        showStatus={false}
        showReload={false}
        showPagination={false}
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
      <CreateReferralCode
        opened={createOpened}
        close={createHandlers.close}
        triggerReload={triggerReload}
      />
      <ReferralCodeView
        opened={viewOpened}
        close={viewHandlers.close}
        isForAgent={true}
        data={memberReferralRow}
      />
    </>
  );
};

export default ReferralCodes;
