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
import { AdminResponseType } from "../AdminManagement/AdminForm/Utils/types";
import AdminForm from "../AdminManagement/AdminForm";
import {
  convertBalanceTypeText,
  extractUserType,
} from "../../../../../utils/helpers";
import { formatDateIST } from "../../../../../utils";

const FundRecordManagement = () => {
  const [opened, handlers] = useDisclosure();
  const { userData, loading } = useDashboardUser();
  const { permissionAdmins } = userData;
  const [openedInfo, InfoHandlers] = useDisclosure();

  const [editData, setEditData] = useState<AdminResponseType>(null);

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
    setSortByBalanceType,
    sortByBalanceType,
  } = usePagination({
    table: "fund-record",
  });

  const {
    isFetchingForEdit,
    handleEdit,
    deleteModalOpened,
    closeDeleteModal,
    handleDelete,
    onConfirmDelete,
  } = useEditDeleteTableRow({
    tableName: "admin",
    setEditData,
    triggerReload,
    successTitle: "Admin Deleted",
    successMessage: "Admin account is deleted successfully!",
    drawerOpened: opened,
  });

  const mappedRows = rows.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>{row.systemOrderId}</Table.Td>
      <Table.Td>{row?.merchantOrderId || "N/A"}</Table.Td>
      <Table.Td>{row.name || "None"}</Table.Td>
      <Table.Td>{extractUserType(row?.balanceType)}</Table.Td>
      <Table.Td>{row.orderType}</Table.Td>
      <Table.Td>{convertBalanceTypeText(row.balanceType)}</Table.Td>
      <Table.Td>₹{row.orderAmount}</Table.Td>
      <Table.Td>₹{row?.netAmount}</Table.Td>
      <Table.Td>₹{row.before}</Table.Td>
      <Table.Td>₹{row.after}</Table.Td>
      <Table.Td>{row.description}</Table.Td>
      <Table.Td>{formatDateIST(row.createdAt)}</Table.Td>
    </Table.Tr>
  ));

  const columns = [
    "System Order ID",
    "Merchant Order Id",
    "User name",
    "User type",
    "Order type",
    "Balance type",
    "Total Order Amount",
    "Net Amount",
    "Balance before",
    "Balance after",
    "Description",
    "Created at",
  ];

  return (
    <>
      <Confirmation
        close={closeDeleteModal}
        onCancel={closeDeleteModal}
        onConfirm={onConfirmDelete}
        opened={deleteModalOpened}
      />

      <AdminForm
        opened={opened}
        handlers={handlers}
        editData={editData}
        triggerReload={triggerReload}
      />
      <TableLayout
        table={"fund-record"}
        headerText={"Fund Records"}
        subtext={
          "Overview of all fund transafer transactions of all users for financial bookkeeping."
        }
        showAddBtn={false}
        addBtnText={"Add new admin"}
        addBtnHandler={handlers.open}
        showDownloadBtn={true}
        showSearch={true}
        searchPlaceholder={"Search by user name, order IDs"}
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
        balanceTypeFilter={true}
        sortByBalanceType={sortByBalanceType}
        setSortByBalanceType={setSortByBalanceType}
      />
      <Admin opened={openedInfo} setOpened={InfoHandlers.close} userId={0} />
    </>
  );
};

export default FundRecordManagement;
