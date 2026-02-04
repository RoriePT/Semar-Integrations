import { ActionIcon, Badge, Button, Center, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useState } from "react";
import ReferralCodeAction from "./ReferralCodeAction";
import usePagination from "../../../../../hook/usePagination";
import CopyButton from "../../../../../components/CopyButton";
import {
  getFullName,
  getReferralStatusColor,
} from "../../../../../utils/helpers";
import TableLayout from "../../../../../components/TableLayout2";
import ReferralCodeView from "./ReferralCodeView";
import { BsClipboardCheckFill } from "react-icons/bs";
import { FaListAlt } from "react-icons/fa";
import moment from "moment";
import { formatDateIST } from "../../../../../utils";

const MerchantAgentReferralCodes = () => {
  const [approveOpened, approveHandlers] = useDisclosure();
  const [viewOpened, viewHandlers] = useDisclosure();
  const [referralRow, setReferralRow] = useState({});

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
        <Table.Td>{row.agent?.firstName + " " + row.agent?.lastName}</Table.Td>
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
        <Table.Td>
          {row.status === "pending" ? (
            <ActionIcon
              onClick={() => {
                setReferralRow(row);
                approveHandlers.open();
              }}
            >
              <BsClipboardCheckFill />
            </ActionIcon>
          ) : (
            <ActionIcon
              onClick={() => {
                setReferralRow(row);
                viewHandlers.open();
              }}
            >
              <FaListAlt />
            </ActionIcon>
          )}
        </Table.Td>
      </Table.Tr>
    );
  });

  const columns = [
    "SNo.",
    "Code",
    "Referrer",
    "Referral Type",
    "Status",
    "Created on",
    "Referee",
    "Actions",
  ];

  return (
    <>
      <TableLayout
        table={"agent-referral"}
        headerText={"Merchant Agent Referral"}
        subtext={"Manage agent referral."}
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

      <ReferralCodeAction
        opened={approveOpened}
        close={approveHandlers.close}
        data={referralRow}
        triggerReload={triggerReload}
      />

      <ReferralCodeView
        opened={viewOpened}
        close={viewHandlers.close}
        isForAgent={false}
        data={referralRow}
      />
    </>
  );
};

export default MerchantAgentReferralCodes;
