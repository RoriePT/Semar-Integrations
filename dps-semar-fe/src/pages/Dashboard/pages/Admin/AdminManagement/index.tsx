import { useState } from "react";
import TableLayout from "../../../../../components/TableLayout2";
import { useDisclosure } from "@mantine/hooks";
import AdminForm from "./AdminForm";
import { ActionIcon, Badge, Flex, Table } from "@mantine/core";
import { FaTrash } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { FaListAlt } from "react-icons/fa";

import usePagination from "../../../../../hook/usePagination";
import { getUserType } from "../../../../../utils/auth";

import Confirmation from "../../../../../components/Confirmation";
import useEditDeleteTableRow from "../../../../../hook/useEditDeleteTableRow";
import { AdminResponseType } from "./AdminForm/Utils/types";

import { useDashboardUser } from "../../../DashboardProvider";
import Admin from "../../../../../components/Users/Admin";
import { formatDateIST } from "../../../../../utils";

const AdminManagement = () => {
  const [opened, handlers] = useDisclosure();
  const { userData } = useDashboardUser();
  const [openedInfo, InfoHandlers] = useDisclosure();
  const [selectedRow, setSelectedRow] = useState(null);

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
  } = usePagination({
    table: "admin",
    userId: userData?.id,
  });

  const {
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
      <Table.Td>{(pageNumber - 1) * 10 + index + 1}</Table.Td>
      <Table.Td>
        {row.firstName} {row.lastName}
      </Table.Td>
      <Table.Td>{row.email}</Table.Td>
      <Table.Td>
        <Badge color="gray">{getUserType(row.role)}</Badge>
      </Table.Td>
      <Table.Td>{formatDateIST(row.createdAt)}</Table.Td>
      <Table.Td>
        <Flex justify={"space-evenly"} gap={"8px"}>
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

          {userData.role === "SUPER_ADMIN" && (
            <ActionIcon onClick={() => handleDelete(row.id)}>
              <FaTrash />
            </ActionIcon>
          )}
        </Flex>
      </Table.Td>
    </Table.Tr>
  ));

  const columns = ["SNo.", "Name", "Email", "Role", "Registered on", "Actions"];

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
        headerText={"Administrator Accounts"}
        subtext={"Oversee and manage all administrator accounts."}
        showAddBtn={true}
        addBtnText={"Add new admin"}
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
      <Admin
        opened={openedInfo}
        setOpened={InfoHandlers.close}
        userId={selectedRow?.id}
      />
    </>
  );
};

export default AdminManagement;
