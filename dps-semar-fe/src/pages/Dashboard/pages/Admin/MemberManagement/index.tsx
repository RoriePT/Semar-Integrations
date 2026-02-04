import { useState } from "react";
import TableLayout from "../../../../../components/TableLayout2";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { ActionIcon, Flex, Table } from "@mantine/core";
import { MdEdit } from "react-icons/md";
import { FaCog, FaListAlt, FaUser } from "react-icons/fa";
import usePagination from "../../../../../hook/usePagination";
import { useDashboardUser } from "../../../DashboardProvider";
import MemberForm from "./MemberForm";
import { AdminResponseType } from "../AdminManagement/AdminForm/Utils/types";
import useEditDeleteTableRow from "../../../../../hook/useEditDeleteTableRow";
import Confirmation from "../../../../../components/Confirmation";
import Member from "../../../../../components/Users/Member";
import ManualSettlement from "../../../../../components/ManualSettlement";
import UserProfileModal from "../../../../../components/Users/UserProfileModal";
import { formatDateIST } from "../../../../../utils";

const MemberManagement = () => {
  const [opened, handlers] = useDisclosure();
  const { userData } = useDashboardUser();
  const { permissionUsers } = userData;
  const [openedInfo, InfoHandlers] = useDisclosure();
  const [selectedRow, setSelectedRow] = useState(null);
  const [settlementModalOpen, settlementHandlers] = useDisclosure();
  const [userProfileModalOpen, userProfileHandlers] = useDisclosure();

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
    table: "member",
  });
  const {
    isFetchingForEdit,
    handleEdit,
    deleteModalOpened,
    closeDeleteModal,
    handleDelete,
    onConfirmDelete,
  } = useEditDeleteTableRow({
    tableName: "member",
    setEditData,
    triggerReload,
    successTitle: "Member Deleted",
    successMessage: "Member account is deleted successfully!",
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
            ₹{row.quota}
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
        <Table.Td>
          {row?.memberReferral === "undefined undefined"
            ? "None"
            : row?.memberReferral}
        </Table.Td>
        <Table.Td>{formatDateIST(row.createdAt)}</Table.Td>
        <Table.Td>{row.enabled ? "enable" : "disable"}</Table.Td>
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
    "Quota",
    "Agent",
    "Registered on",
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

      <MemberForm
        opened={opened}
        handlers={handlers}
        editData={editData}
        triggerReload={triggerReload}
      />

      <TableLayout
        table={"member"}
        headerText={"Member Accounts"}
        subtext={"Oversee and manage all member accounts."}
        showAddBtn={true}
        addBtnText={"Add new member"}
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
      <Member
        opened={openedInfo}
        setOpened={InfoHandlers.close}
        id={selectedRow?.id}
      />
      <UserProfileModal
        opened={userProfileModalOpen}
        setOpened={userProfileHandlers.close}
        userId={selectedRow?.id}
        userType={"Member"}
      />
      <ManualSettlement
        opened={settlementModalOpen}
        close={settlementHandlers.close}
        id={selectedRow?.id}
        userType={"MEMBER"}
        reload={triggerReload}
        balanceLabel="Quota"
      />
    </>
  );
};

export default MemberManagement;
