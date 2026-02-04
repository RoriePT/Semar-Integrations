import React, { useState } from "react";
import TableLayout from "../../../../../components/TableLayout2";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import AdminForm from "./SubAccountForm";
import { ActionIcon, Button, Flex, Group, Table } from "@mantine/core";
import { FaPlus } from "react-icons/fa6";
import ExportBtn from "../../../../../components/TableLayout/HeaderSection/ExportBtn";
import { FaTrash } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { FaListAlt, FaUser } from "react-icons/fa";
import usePagination from "../../../../../hook/usePagination";
import moment from "moment";
import { getUserType } from "../../../../../utils/auth";
import CommonAPIs from "../../../../../api/common";

import Confirmation from "../../../../../components/Confirmation";
import useEditDeleteTableRow from "../../../../../hook/useEditDeleteTableRow";

import { useDashboardUser } from "../../../DashboardProvider";
import SubAccountForm from "./SubAccountForm";
import { SubMerchantResponseType } from "./SubAccountForm/Utils/types";
import SubMerchant from "../../../../../components/Users/SubMerchant";
import { formatDateIST } from "../../../../../utils";

const SubAccounts = () => {
  const [opened, handlers] = useDisclosure();
  const { userData, loading } = useDashboardUser();
  const [openedInfo, InfoHandlers] = useDisclosure();
  const [selectedRow, setSelectedRow] = useState(null);
  const [editData, setEditData] = useState<SubMerchantResponseType>(null);

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
    table: `sub-merchant`,
  });

  const {
    isFetchingForEdit,
    handleEdit,
    deleteModalOpened,
    closeDeleteModal,
    handleDelete,
    onConfirmDelete,
  } = useEditDeleteTableRow({
    tableName: "sub-merchant",
    setEditData,
    triggerReload,
    successTitle: "Sub account deleted",
    successMessage: "Sub account is deleted successfully!",
    drawerOpened: opened,
  });

  const mappedRows = rows.map((row, index) => {
    if (userData?.userTable === "merchant") {
      return (
        <Table.Tr key={index}>
          <Table.Td>{(pageNumber - 1) * 10 + index + 1}</Table.Td>
          <Table.Td>
            {row.firstName} {row.lastName}
          </Table.Td>
          <Table.Td>{row.email}</Table.Td>

          <Table.Td>{formatDateIST(row?.createdAt)}</Table.Td>
          <Table.Td>
            <Flex justify={"space-evenly"} gap={"8px"}>
              <ActionIcon
                onClick={() => {
                  setSelectedRow(row);
                  InfoHandlers.open();
                }}
              >
                <FaUser />
              </ActionIcon>
              <ActionIcon onClick={() => handleEdit(row.id, handlers.open)}>
                <MdEdit />
              </ActionIcon>
              <ActionIcon onClick={() => handleDelete(row.id)}>
                <FaTrash />
              </ActionIcon>
            </Flex>
          </Table.Td>
        </Table.Tr>
      );
    } else {
      return (
        <Table.Tr key={index}>
          <Table.Td>{(pageNumber - 1) * 10 + index + 1}</Table.Td>
          <Table.Td>
            {row.firstName} {row.lastName}
          </Table.Td>
          <Table.Td>{row.email}</Table.Td>
          <Table.Td>{formatDateIST(row?.createdAt)}</Table.Td>
        </Table.Tr>
      );
    }
  });

  const columns = [
    "SNo.",
    "Name",
    "Email",
    "Registered on",
    userData?.userTable === "merchant" && "Actions",
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
        {userData?.userTable === "merchant" && (
          <Button
            size="md"
            onClick={handlers.open}
            leftSection={<FaPlus />}
            style={{ width: isTablet ? "100%" : "auto" }}
          >
            Add new sub account
          </Button>
        )}
        <ExportBtn table="sub-merchant" />
      </Flex> */}

      <SubAccountForm
        opened={opened}
        handlers={handlers}
        editData={editData}
        triggerReload={triggerReload}
      />
      <TableLayout
        table={`sub-merchant/${userData.id}`}
        headerText={"Sub Accounts"}
        subtext={"Oversee and manage all sub accounts and their permissions."}
        showAddBtn={true}
        addBtnText={"Add new sub account"}
        addBtnHandler={handlers.open}
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
      <SubMerchant
        opened={openedInfo}
        setOpened={InfoHandlers.close}
        userId={selectedRow?.id}
      />
    </>
  );
};

export default SubAccounts;
