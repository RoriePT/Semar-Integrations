import React, { useEffect, useState } from "react";
import CommonAPIs from "../api/common";
import { notifications } from "@mantine/notifications";
import { FaCheck } from "react-icons/fa";

const useEditDeleteTableRow = ({
  tableName,
  setEditData,
  triggerReload,
  successTitle,
  successMessage,
  drawerOpened,
}) => {
  const [isFetchingForEdit, setIsFetchingForEdit] = useState<any>("0");
  const [deleteId, setDeleteId] = useState("0");

  useEffect(() => {
    if (isFetchingForEdit === "0" && !drawerOpened) setEditData(null);
  }, [isFetchingForEdit, drawerOpened]);

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const handleEdit = async (id, openFormDrawer) => {
    setIsFetchingForEdit(id);
    const editData = await CommonAPIs.getUser(tableName, id);
    setEditData(editData);

    setIsFetchingForEdit("0");
    openFormDrawer();
  };

  const onConfirmDelete = async () => {
    await CommonAPIs.deleteUser(tableName, parseInt(deleteId));
    setDeleteId("0");
    triggerReload();
    notifications.show({
      color: "teal",
      title: successTitle,
      message: successMessage,
      icon: <FaCheck size={18} color="white" />,
      autoClose: 4000,
      withCloseButton: true,
    });
  };

  return {
    isFetchingForEdit,
    handleEdit,

    deleteModalOpened: deleteId !== "0",
    closeDeleteModal: () => setDeleteId("0"),
    handleDelete,
    onConfirmDelete,
  };
};

export default useEditDeleteTableRow;
