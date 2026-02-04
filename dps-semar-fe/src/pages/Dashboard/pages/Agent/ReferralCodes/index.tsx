import {
  ActionIcon,
  Badge,
  Button,
  Center,
  Flex,
  Table,
  CopyButton as MCopyButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import CreateReferralCode from "./CreateReferralCode";
import { FaPlus } from "react-icons/fa6";
import usePagination from "../../../../../hook/usePagination";
import CopyButton from "../../../../../components/CopyButton";
import {
  getFullName,
  getReferralStatusColor,
} from "../../../../../utils/helpers";
import TableLayout from "../../../../../components/TableLayout2";
import ReferralCodeView from "../../Admin/MerchantAgentReferralCodes/ReferralCodeView";
import { FaListAlt } from "react-icons/fa";
import moment from "moment";
import { useDashboardUser } from "../../../DashboardProvider";
import { IoCopyOutline } from "react-icons/io5";
import { formatDateIST } from "../../../../../utils";

const ReferralCodes = () => {
  const [createOpened, createHandlers] = useDisclosure();
  const [viewOpened, viewHandlers] = useDisclosure();
  const [agentReferralRow, setAgentReferralRow] = useState({});
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
    table: "agent-referral",
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
          {row.agentType === "agent" ? "For Agent" : "For Merchant"}
        </Table.Td>
        <Table.Td>
          <Badge variant="dot" color={getReferralStatusColor(row.status)}>
            {row.status}
          </Badge>
        </Table.Td>
        <Table.Td>{formatDateIST(row.createdAt)}</Table.Td>
        <Table.Td>
          {row.agentType === "merchant"
            ? getFullName(row.referredMerchant)
            : getFullName(row.referredAgent)}
        </Table.Td>
      </Table.Tr>
    );
  });

  const columns = [
    "SNo.",
    "Code",
    "Referral Type",
    "Status",
    "Created on",
    "Referee",
  ];

  return (
    <>
      <TableLayout
        table={"agent-referral"}
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
        data={agentReferralRow}
      />
    </>
  );
};

export default ReferralCodes;
