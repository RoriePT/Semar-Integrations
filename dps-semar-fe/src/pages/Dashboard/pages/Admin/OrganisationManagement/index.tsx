import React, { useState } from "react";
import TableLayout from "../../../../../components/TableLayout2";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";

import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Flex,
  Group,
  Table,
} from "@mantine/core";
import { FaPlus } from "react-icons/fa6";
import ExportBtn from "../../../../../components/TableLayout/HeaderSection/ExportBtn";
import { FaTrash } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { FaListAlt } from "react-icons/fa";

import usePagination from "../../../../../hook/usePagination";
import moment from "moment";
import { getUserType } from "../../../../../utils/auth";
import CommonAPIs from "../../../../../api/common";

import Confirmation from "../../../../../components/Confirmation";
import useEditDeleteTableRow from "../../../../../hook/useEditDeleteTableRow";

import { useDashboardUser } from "../../../DashboardProvider";
import Admin from "../../../../../components/Users/Admin";
import Tree from "../../../../../components/Tree";

const OrganisationManagement = () => {
  const [opened, handlers] = useDisclosure();
  const { userData } = useDashboardUser();
  const [selectedTeamId, setSelectedTeamId] = useState(null);

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
    table: "organization",
    // userId: userData?.id,
  });

  const mappedRows = rows.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>{(pageNumber - 1) * 10 + index + 1}</Table.Td>
      <Table.Td>{row?.organizationId}</Table.Td>
      <Table.Td>
        {row?.leader?.firstName} {row?.leader?.lastName}
      </Table.Td>
      <Table.Td>{row?.organizationSize}</Table.Td>
      <Table.Td>₹ {row?.totalReferralCommission}</Table.Td>

      <Table.Td>
        {" "}
        <Flex justify={"space-evenly"} gap={"8px"}>
          <Button
            onClick={() => {
              setSelectedTeamId(row?.organizationId);
              handlers.open();
            }}
          >
            View
          </Button>
        </Flex>
      </Table.Td>
    </Table.Tr>
  ));

  const columns = [
    "Rank",
    "Organisation Id",
    "Leader",
    "Organisation Size",
    "Total Referral Commission",
    "Actions",
  ];

  return (
    <>
      <TableLayout
        table={"organization"}
        headerText={"Agent Organisations"}
        subtext={"Oversee and manage all agent organisations."}
        showAddBtn={false}
        addBtnText={"Add new admin"}
        addBtnHandler={null}
        showDownloadBtn={false}
        showSearch={true}
        searchPlaceholder={"Search by Organisation Id or Leader"}
        showDateRange={false}
        showFilter={false}
        showSort={false}
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

      <Tree
        opened={opened}
        close={() => {
          handlers.close();
          setSelectedTeamId(null);
        }}
        type={"agents"}
        forUser="admin"
        teamId={selectedTeamId}
      />
    </>
  );
};

export default OrganisationManagement;
