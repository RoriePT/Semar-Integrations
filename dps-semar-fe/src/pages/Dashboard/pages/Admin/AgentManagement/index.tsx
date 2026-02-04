import React, { useState } from "react";
import TableLayout from "../../../../../components/TableLayout2";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import AdminForm from "./AgentForm";
import { ActionIcon, Button, Flex, Group, Table } from "@mantine/core";
import { FaPlus } from "react-icons/fa6";
import ExportBtn from "../../../../../components/TableLayout/HeaderSection/ExportBtn";
import { FaTrash } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { FaCog, FaListAlt, FaUser } from "react-icons/fa";

import usePagination from "../../../../../hook/usePagination";
import moment from "moment";
import { getUserType } from "../../../../../utils/auth";
import CommonAPIs from "../../../../../api/common";

import Confirmation from "../../../../../components/Confirmation";
import useEditDeleteTableRow from "../../../../../hook/useEditDeleteTableRow";
import { AgentResponseType } from "./AgentForm/Utils/types";

import { useDashboardUser } from "../../../DashboardProvider";
import AgentForm from "./AgentForm";
import Agent from "../../../../../components/Users/Agent";
import ManualSettlement from "../../../../../components/ManualSettlement";
import UserProfileModal from "../../../../../components/Users/UserProfileModal";

const AgentManagement = () => {
  const [opened, handlers] = useDisclosure();
  const { userData, loading } = useDashboardUser();
  const { permissionAdmins } = userData;
  const [openedInfo, InfoHandlers] = useDisclosure();
  const [settlementModalOpen, settlementHandlers] = useDisclosure();
  const [userProfileModalOpen, userProfileHandlers] = useDisclosure();
  // const [selectedBalance, setSelectedBalance] = useState<number | null>(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editData, setEditData] = useState<AgentResponseType>(null);
  const { permissionUsers } = userData;

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
    table: "agent",
  });

  const {
    isFetchingForEdit,
    handleEdit,
    deleteModalOpened,
    closeDeleteModal,
    handleDelete,
    onConfirmDelete,
  } = useEditDeleteTableRow({
    tableName: "agent",
    setEditData,
    triggerReload,
    successTitle: "Agent Deleted",
    successMessage: "Agent account is deleted successfully!",
    drawerOpened: opened,
  });

  const mappedRows = rows.map((row, index) => {
    return (
      <Table.Tr key={index}>
        <Table.Td>{(pageNumber - 1) * 10 + index + 1}</Table.Td>
        <Table.Td>
          {row.firstName} {row.lastName}
        </Table.Td>
        <Table.Td>
          <Flex align="center" gap="8px" justify={"center"}>
            ₹{row.balance}
            {userData.permissionAdjustBalance && (
              <ActionIcon
                variant="filled"
                style={{
                  backgroundColor: "transparent",
                  color: "grey",
                }}
                onClick={() => {
                  setSelectedRow(row);
                  settlementHandlers.open();
                }}
              >
                <FaCog />
              </ActionIcon>
            )}
          </Flex>
        </Table.Td>
        <Table.Td>{row.createdAt}</Table.Td>
        {permissionAdmins && (
          <>
            <Table.Td>
              <Flex justify={"space-evenly"} gap={"8px"}>
                <ActionIcon
                  onClick={() => {
                    setSelectedRow(row);
                    userProfileHandlers.open();
                  }}
                >
                  <FaUser />
                </ActionIcon>
                <ActionIcon
                  onClick={() => {
                    setSelectedRow(row);
                    InfoHandlers.open();
                  }}
                >
                  <FaListAlt />
                </ActionIcon>
                <ActionIcon onClick={() => handleEdit(row.id, handlers.open)}>
                  <MdEdit />
                </ActionIcon>
                {/* <ActionIcon onClick={() => handleDelete(row.id)}>
                <FaTrash />
              </ActionIcon> */}
              </Flex>
            </Table.Td>
          </>
        )}
      </Table.Tr>
    );
  });

  const columns = [
    "SNo.",
    "Name",
    "Balance",
    "Registered on",
    permissionUsers && "Actions",
  ];
  const isTablet = useMediaQuery("(max-width: 460px)");
  return (
    <>
      <Confirmation
        close={closeDeleteModal}
        onCancel={closeDeleteModal}
        onConfirm={onConfirmDelete}
        opened={deleteModalOpened}
      />
      {/* <Flex
        align={"center"}
        mb={"xl"}
        gap={isTablet ? "sm" : "lg"}
        style={{
          flexDirection: isTablet ? "column" : "row",
        }}
      >
        {permissionAdmins && (
          <Button
            size="md"
            onClick={handlers.open}
            leftSection={<FaPlus />}
            style={{ width: isTablet ? "100%" : "auto" }}
          >
            Add new agent
          </Button>
        )}
        <ExportBtn table="agent" />
      </Flex> */}

      <AgentForm
        opened={opened}
        handlers={handlers}
        editData={editData}
        triggerReload={triggerReload}
      />
      <TableLayout
        table={"agent"}
        headerText={"Agent Accounts"}
        subtext={"Oversee and manage all merchant agent accounts."}
        showAddBtn={true}
        addBtnText={"Add new agent"}
        addBtnHandler={handlers.open}
        showDownloadBtn={true}
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
      <Agent
        opened={openedInfo}
        setOpened={InfoHandlers.close}
        id={selectedRow?.id}
      />
      <UserProfileModal
        opened={userProfileModalOpen}
        setOpened={userProfileHandlers.close}
        userId={selectedRow?.id}
        userType={"Agent"}
      />
      <ManualSettlement
        opened={settlementModalOpen}
        close={settlementHandlers.close}
        id={selectedRow?.id}
        userType="AGENT"
        reload={triggerReload}
      />
    </>
  );
};

export default AgentManagement;
