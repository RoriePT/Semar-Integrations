import React, { useState } from "react";

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

import { FaTrash } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { FaListAlt } from "react-icons/fa";
import Admin from "../../Admin";
import AdminForm from "../../../../pages/Dashboard/pages/Admin/AdminManagement/AdminForm";
import Confirmation from "../../../Confirmation";
import moment from "moment";
import { convertBalanceTypeText } from "../../../../utils/helpers";
import useEditDeleteTableRow from "../../../../hook/useEditDeleteTableRow";
import usePagination from "../../../../hook/usePagination";
import { AdminResponseType } from "../../../../pages/Dashboard/pages/Admin/AdminManagement/AdminForm/Utils/types";
import { useDashboardUser } from "../../../../pages/Dashboard/DashboardProvider";
import TableLayout from "../../../TableLayout2";

const FundRecord = ({ email }) => {
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
    sortByBalanceType,
    setSortByBalanceType,
  } = usePagination({
    table: "user-details/member/fund-records",
    userEmail: email,
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
      <Table.Td>{row.orderType}</Table.Td>
      <Table.Td>{row.systemOrderId}</Table.Td>
      <Table.Td>{convertBalanceTypeText(row.balanceType)}</Table.Td>
      <Table.Td>₹{row.orderAmount}</Table.Td>
      <Table.Td>₹{row.netAmount}</Table.Td>
      <Table.Td>₹{row.before}</Table.Td>
      <Table.Td>₹{row.after}</Table.Td>
      <Table.Td>{row.description}</Table.Td>
      <Table.Td>
        {moment(row.createdAt).format("DD MMM, YYYY | hh:mm:ss")}
      </Table.Td>
    </Table.Tr>
  ));

  const columns = [
    "Order type",
    "Order id",
    "Balance type",
    "Total Order Amount",
    "Net Amount",
    "Balance before",
    "Balance after",
    "Description",
    "Created at",
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

      <AdminForm
        opened={opened}
        handlers={handlers}
        editData={editData}
        triggerReload={triggerReload}
      />
      <TableLayout
        table={"admin"}
        headerText={""}
        subtext={""}
        showAddBtn={false}
        addBtnText={""}
        addBtnHandler={null}
        showDownloadBtn={false}
        showSearch={false}
        searchPlaceholder={"Search by order id"}
        showDateRange={false}
        showFilter={false}
        showSort={false}
        showStatus={false}
        showReload={false}
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
        sortByBalanceType={sortByBalanceType}
        setSortByBalanceType={setSortByBalanceType}
        balanceTypeFilter={true}
      />
      <Admin opened={openedInfo} setOpened={InfoHandlers.close} userId={0} />
    </>
  );
};

export default FundRecord;
