import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import TableLayout from "../../../../../components/TableLayout2";

import { Table } from "@mantine/core";

import usePagination from "../../../../../hook/usePagination";

import Confirmation from "../../../../../components/Confirmation";
import useEditDeleteTableRow from "../../../../../hook/useEditDeleteTableRow";

import Admin from "../../../../../components/Users/Admin";
import { formatDateIST } from "../../../../../utils";
import { convertBalanceTypeText } from "../../../../../utils/helpers";
import { useDashboardUser } from "../../../DashboardProvider";
import AdminForm from "../../Admin/AdminManagement/AdminForm";
import { AdminResponseType } from "../../Admin/AdminManagement/AdminForm/Utils/types";

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
    sortByBalanceType,
    setSortByBalanceType,
  } = usePagination({
    table: "fund-record",
    userEmail: userData?.email,
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
      <Table.Td>{row?.merchantOrderId || "N/A"}</Table.Td>
      <Table.Td>{row.systemOrderId}</Table.Td>
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
    "Order type",
    "Order Id",
    "KG Order Id",
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
        table={"fund-record-merchant"}
        headerText={"Fund Records"}
        subtext={
          "Overview of all fund transafer transactions in your Semar account."
        }
        showAddBtn={false}
        addBtnText={"Add new admin"}
        addBtnHandler={handlers.open}
        showDownloadBtn={true}
        showSearch={true}
        searchPlaceholder={"Search by order IDs"}
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
        sortByBalanceType={sortByBalanceType}
        setSortByBalanceType={setSortByBalanceType}
        balanceTypeFilter={false}
      />
      <Admin opened={openedInfo} setOpened={InfoHandlers.close} userId={0} />
    </>
  );
};

export default FundRecordManagement;
