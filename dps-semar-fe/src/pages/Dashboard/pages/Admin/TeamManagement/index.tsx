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
  Text,
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
import RatesModal from "./RatesModal";
import RefferalModal from "./ReferralModal";

const TeamManagement = () => {
  const [opened, handlers] = useDisclosure();
  const [ratesModalOpend, ratesModalHandler] = useDisclosure();
  const [referralModalOpend, referralModalHandler] = useDisclosure();
  const { userData } = useDashboardUser();
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [commissionRates, setCommissionRates] = useState({
    teamPayoutCommissionRate: 0,
    teamTopupCommissionRate: 0,
    teamPayinCommissionRate: 0,
  });

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
    table: "team",
    userId: userData?.id,
  });

  const mappedRows = rows.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>{(pageNumber - 1) * 10 + index + 1}</Table.Td>
      <Table.Td>{row.teamId}</Table.Td>
      <Table.Td>
        {row?.teamLeader?.firstName} {row?.teamLeader?.lastName}
      </Table.Td>
      <Table.Td>{row?.teamSize}</Table.Td>
      <Table.Td>₹ {Math.round(row?.totalQuota)}</Table.Td>
      <Table.Td>
        <Flex justify={"center"} align={"center"} gap={"10px"}>
          <Flex gap={"md"} justify={"center"} align={"center"}>
            <Flex
              direction={"column"}
              justify={"center"}
              align={"center"}
              gap={"4px"}
            >
              <Text size="14px" fw={500}>
                Payin
              </Text>
              <Text size="14px">{`${row?.teamPayinCommissionRate} %`}</Text>
            </Flex>
            <Flex
              direction={"column"}
              justify={"center"}
              align={"center"}
              gap={"4px"}
            >
              <Text size="14px" fw={500}>
                Payout
              </Text>
              <Text size="14px">{`${row?.teamPayoutCommissionRate} %`}</Text>
            </Flex>
            <Flex
              direction={"column"}
              justify={"center"}
              align={"center"}
              gap={"4px"}
            >
              <Text size="14px" fw={500}>
                Topup
              </Text>
              <Text size="14px">{`${row?.teamTopupCommissionRate} %`}</Text>
            </Flex>
          </Flex>
          <Button
            size="xs"
            onClick={() => {
              setCommissionRates({
                teamPayoutCommissionRate: row.teamPayoutCommissionRate,
                teamTopupCommissionRate: row.teamTopupCommissionRate,
                teamPayinCommissionRate: row.teamPayinCommissionRate,
              });
              setSelectedTeamId(row?.teamId);
              ratesModalHandler.open();
            }}
          >
            Edit
          </Button>
        </Flex>
      </Table.Td>
      <Table.Td>
        <Flex justify={"space-evenly"} gap={"8px"}>
          <Button
            size="xs"
            onClick={() => {
              setSelectedTeamId(row?.teamId);
              referralModalHandler.open();
            }}
          >
            View
          </Button>
        </Flex>
      </Table.Td>
      <Table.Td>
        {" "}
        <Flex justify={"space-evenly"} gap={"8px"}>
          <Button
            size="xs"
            onClick={() => {
              setSelectedTeamId(row?.teamId);
              handlers.open();
            }}
          >
            View
          </Button>
        </Flex>
      </Table.Td>
    </Table.Tr>
  ));

  // const columns = [
  //   { Header: "SNo.", accessor: "id", visible: true },
  //   { Header: "Name", accessor: "fullName", visible: true },
  //   { Header: "Email", accessor: "username", visible: true },
  //   { Header: "Role", accessor: "role", visible: true },
  //   { Header: "Registered on", accessor: "phone", visible: true },
  //   { Header: "Actions", accessor: "phone", visible: permissionAdmins },
  // ];
  const columns = [
    "Rank",
    "Team Id",
    "Team Leader",
    "Team Size",
    "Total Quota",
    "Team Direct Commission Rates",
    "Referral codes",
    "Team Tree",
  ];

  return (
    <>
      <TableLayout
        table={"team"}
        headerText={"Member Teams"}
        subtext={"Oversee and Manage all member teams."}
        showAddBtn={false}
        addBtnText={"Add new admin"}
        addBtnHandler={null}
        showDownloadBtn={false}
        showSearch={true}
        searchPlaceholder={"Search by Team Id or Leader"}
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
        type={"members"}
        forUser={"admin"}
        teamId={selectedTeamId}
      />

      <RatesModal
        opened={ratesModalOpend}
        close={() => {
          ratesModalHandler.close();
          setSelectedTeamId(null);
        }}
        teamId={selectedTeamId}
        commissionRates={commissionRates}
        triggerReload={triggerReload}
      />

      <RefferalModal
        opened={referralModalOpend}
        close={() => {
          referralModalHandler.close();
          setSelectedTeamId(null);
        }}
        teamId={selectedTeamId}
      />
    </>
  );
};

export default TeamManagement;
