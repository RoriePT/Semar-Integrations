import { ActionIcon, Box, Flex, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

import Confirmation from "../../../../../components/Confirmation";
import TableLayout from "../../../../../components/TableLayout2";
import useEditDeleteTableRow from "../../../../../hook/useEditDeleteTableRow";
import usePagination from "../../../../../hook/usePagination";
import { UpiVendor } from "../../../../../types/upiVendor";
import { formatDateIST } from "../../../../../utils";
import { useDashboardUser } from "../../../DashboardProvider";
import UserProfileModal from "../../../../../components/Users/UserProfileModal";

import UpiVendorForm from "./UpiVendorForm";
import PreservedUpiCard from "./PreservedUpiCard";

const UpiVendorManagement = () => {
  const [opened, handlers] = useDisclosure();
  const [userProfileModalOpen, userProfileHandlers] = useDisclosure();
  const { userData } = useDashboardUser();
  const { permissionUsers } = userData;
  const [editData, setEditData] = useState<UpiVendor | null>(null);
  const [selectedRow, setSelectedRow] = useState(null);

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
    table: "upi-vendor",
  });

  const {
    isFetchingForEdit,
    handleEdit,
    deleteModalOpened,
    closeDeleteModal,
    handleDelete,
    onConfirmDelete,
  } = useEditDeleteTableRow({
    tableName: "upi-vendor",
    setEditData,
    triggerReload,
    successTitle: "UPI Vendor Deleted",
    successMessage: "UPI vendor account is deleted successfully!",
    drawerOpened: opened,
  });

  const mappedRows = rows?.map((row: UpiVendor, index: number) => {
    // Use firstName and lastName from API, or fallback to name
    const firstName = row.firstName || "";
    const lastName = row.lastName || "";
    const displayName =
      firstName || lastName
        ? `${firstName} ${lastName}`.trim()
        : row.name || "-";

    // Use phone from API, or fallback to mobile
    const mobile = row.phone || row.mobile || "-";

    // Map enabled to Enabled/Disabled (use enabled field first, then status)
    const isEnabled =
      row.enabled !== undefined ? row.enabled : row.status === "ACTIVE";
    const statusDisplay = isEnabled ? "enable" : "disable";

    return (
      <Table.Tr key={row.id}>
        <Table.Td>{startRecord + index}</Table.Td>
        <Table.Td>{displayName}</Table.Td>
        <Table.Td>{mobile}</Table.Td>
        <Table.Td>{row.email || "-"}</Table.Td>
        <Table.Td>{formatDateIST(row.createdAt)}</Table.Td>
        <Table.Td>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              isEnabled
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {statusDisplay}
          </span>
        </Table.Td>
        {permissionUsers && (
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
                  onClick={() => handleEdit(row.id, handlers.open)}
                  loading={isFetchingForEdit === row.id}
                >
                  <MdEdit />
                </ActionIcon>
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
    "Mobile",
    "Email",
    "Registered On",
    "Status",
    permissionUsers && "Actions",
  ];

  return (
    <>
      <Confirmation
        close={closeDeleteModal}
        onCancel={closeDeleteModal}
        onConfirm={onConfirmDelete}
        opened={deleteModalOpened}
      />

      <UpiVendorForm
        opened={opened}
        handlers={handlers}
        editData={editData}
        triggerReload={triggerReload}
      />

      <UserProfileModal
        opened={userProfileModalOpen}
        setOpened={userProfileHandlers.close}
        userId={selectedRow?.id}
        userType={"UPI Vendor"}
      />

      <Box mb="md">
        <PreservedUpiCard />
      </Box>

      <TableLayout
        table={"upi-vendor"}
        headerText={"UPI Vendor Management"}
        subtext={"Oversee and manage all UPI vendor accounts."}
        showAddBtn={true}
        addBtnText={"Add new UPI vendor"}
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
    </>
  );
};

export default UpiVendorManagement;
