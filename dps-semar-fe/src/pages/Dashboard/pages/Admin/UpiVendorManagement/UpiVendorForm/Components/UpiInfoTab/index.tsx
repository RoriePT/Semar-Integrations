import { Box, Button, Flex, Modal, Text, Title, Tooltip } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import React, { useEffect, useRef, useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import UPIModal from "../../../../../../../../components/ChannelModals/UPIModal";
import { UpiVendor } from "../../../../../../../../types/upiVendor";
import { Tab2KeyNames, Tab2State, upiField } from "../../Utils/types";

interface UpiInfoTabProps {
  formState: Tab2State;
  handleChange: (key: Tab2KeyNames, value: any) => void;
  editData: UpiVendor | null;
}

const UpiInfoTab: React.FC<UpiInfoTabProps> = ({ formState, handleChange, editData }) => {
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedForEdit, setSelectedForEdit] = useState<number | null>(null);
  const selectedForEditRef = useRef<number | null>(null);
  const [editingItem, setEditingItem] = useState<upiField | null>(null);
  const editingItemRef = useRef<upiField | null>(null);
  const [formData, setFormData] = useState<upiField>({
    upiId: "",
    mobile: "",
    email: "",
    beneficiaryName: "",
    isBusinessUpi: false,
    title: "",
    enabled: true,
  });
  const [channelIndex, setChannelIndex] = useState(0);

  const handleAddUpi = (data: any) => {
    console.log("handleAddUpi called with data:", data);
    console.log("Current formState.upiIds:", formState.upiIds);
    console.log("selectedForEdit (state):", selectedForEdit);
    console.log("selectedForEditRef.current:", selectedForEditRef.current);
    
    // Create a fresh copy of the array to avoid reference issues
    const currentUpiIds = [...(formState.upiIds || [])];
    // Use ref value to avoid stale closure issues, fallback to state
    const currentSelectedForEdit = selectedForEditRef.current ?? selectedForEdit;
    const isEditing = currentSelectedForEdit !== null && currentSelectedForEdit !== undefined;
    
    console.log("isEditing:", isEditing, "currentSelectedForEdit:", currentSelectedForEdit);
    
    // Find the original item using strict comparison
    // When editing, we need to match by channelIndex AND also verify it's the correct item
    // by checking if editingItem matches (to handle cases where channelIndex might not be unique)
    const originalItemIndex = isEditing
      ? currentUpiIds.findIndex(
          (item) => {
            const itemIndex = item.channelIndex !== undefined && item.channelIndex !== null ? Number(item.channelIndex) : null;
            const selectedIndex = currentSelectedForEdit !== undefined && currentSelectedForEdit !== null ? Number(currentSelectedForEdit) : null;
            const channelIndexMatches = itemIndex === selectedIndex;
            
            // Also verify it's the same item by checking UPI ID and title if we have editingItem
            // Use ref to avoid stale closure
            const currentEditingItem = editingItemRef.current ?? editingItem;
            let isSameItem = true;
            if (currentEditingItem) {
              isSameItem = 
                item.upiId === currentEditingItem.upiId &&
                item.title === currentEditingItem.title;
            }
            
            const matches = channelIndexMatches && isSameItem;
            console.log(`Comparing item:`, {
              "item.channelIndex": itemIndex,
              "selectedIndex": selectedIndex,
              "item.upiId": item.upiId,
              "editingItem.upiId": editingItem?.upiId,
              "channelIndexMatches": channelIndexMatches,
              "isSameItem": isSameItem,
              "matches": matches,
            });
            return matches;
          }
        )
      : -1;
    
    console.log("originalItemIndex:", originalItemIndex);
    
    const originalItem = originalItemIndex >= 0 ? currentUpiIds[originalItemIndex] : null;
    const hasReceivedPayin = originalItem?.hasReceivedPayin || false;
    const isPreserved = originalItem?.isPreserved || false;
    const shouldPreserveFields = hasReceivedPayin || isPreserved;
    
    console.log("originalItem:", originalItem);
    console.log("hasReceivedPayin:", hasReceivedPayin);
    console.log("isPreserved:", isPreserved);
    console.log("shouldPreserveFields:", shouldPreserveFields);
    
    // Ensure we have valid data
    if (!data) {
      console.error("handleAddUpi: No data provided");
      return;
    }

    // Create a new UPI object with all the correct values
    // Note: If fields are disabled in the modal (hasReceivedPayin=true or isPreserved=true), 
    // the modal already preserves the original values, so we can use data directly
    // But we still need to preserve settlementAmount, hasReceivedPayin, and isPreserved flags
    const newUpi: upiField = {
      // Use the values from data - the modal handles preservation if fields are disabled
      upiId: data.upiId || "",
      title: data.title || "",
      mobile: data.mobile || "",
      email: data.email || "",
      beneficiaryName: data.beneficiaryName || "",
      isBusinessUpi:
        data.isBusinessUpi !== undefined ? data.isBusinessUpi : true,
      // When editing, always use currentSelectedForEdit to ensure correct matching
      // When adding new, use data.channelIndex
      channelIndex: isEditing
        ? currentSelectedForEdit
        : data.channelIndex,
      enabled: data.enabled !== undefined ? data.enabled : true,
      // Preserve settlementAmount, hasReceivedPayin, and isPreserved when editing
      settlementAmount: originalItem?.settlementAmount,
      hasReceivedPayin: originalItem?.hasReceivedPayin || false,
      isPreserved: originalItem?.isPreserved || false,
      // Include tr (Transaction Reference) from QR code
      tr: data.tr || "",
    };
    
    console.log("Creating newUpi with data from modal:", {
      "data.upiId": data.upiId,
      "data.title": data.title,
      "data.enabled": data.enabled,
      "newUpi": newUpi,
    });
    
    console.log("newUpi created:", newUpi);

    let updatedUpiIds: upiField[];

    if (isEditing) {
      if (originalItemIndex >= 0) {
        // Create a completely new array with new object references
        updatedUpiIds = currentUpiIds.map((item, index) => {
          // Only replace the item at the exact index we found
          if (index === originalItemIndex) {
            // Return a completely new object
            console.log("Replacing item at index", index, "with new data:", newUpi);
            return { ...newUpi };
          }
          // Return a new object for other items to avoid reference issues
          return { ...item };
        });
      } else {
        // Editing but item not found - this shouldn't happen, but handle gracefully
        console.error("Editing mode but item not found! currentSelectedForEdit:", currentSelectedForEdit, "currentUpiIds:", currentUpiIds);
        // Fall back to adding as new item
        const nextIndex = (currentUpiIds.slice(-1)[0]?.channelIndex ?? -1) + 1;
        updatedUpiIds = [
          ...currentUpiIds.map(item => ({ ...item })),
          { ...newUpi, channelIndex: nextIndex },
        ];
        setChannelIndex(nextIndex);
      }
    } else {
      // Adding new item
      const nextIndex = (currentUpiIds.slice(-1)[0]?.channelIndex ?? -1) + 1;
      updatedUpiIds = [
        ...currentUpiIds.map(item => ({ ...item })), // Create new objects for existing items
        { ...newUpi, channelIndex: nextIndex },
      ];
      setChannelIndex(nextIndex);
    }

    console.log("Updated UPI IDs:", updatedUpiIds);
    console.log("Updated UPI IDs length:", updatedUpiIds.length);
    console.log("Updated UPI IDs JSON:", JSON.stringify(updatedUpiIds, null, 2));
    console.log("Current formState.upiIds before update:", formState.upiIds);
    console.log("Calling handleChange with updatedUpiIds");
    
    // Ensure we're passing a completely new array reference
    const newArrayReference = JSON.parse(JSON.stringify(updatedUpiIds));
    console.log("New array reference created:", newArrayReference);
    
    // Update state first
    handleChange("upiIds", newArrayReference);
    
    console.log("handleChange called");
    
    // Use setTimeout to ensure state update completes before closing modal
    setTimeout(() => {
      console.log("Closing modal and clearing state...");
      setModalOpened(false);
      setSelectedForEdit(null);
      selectedForEditRef.current = null;
      setEditingItem(null);
      editingItemRef.current = null;
      setFormData({
        upiId: "",
        mobile: "",
        email: "",
        beneficiaryName: "",
        isBusinessUpi: false,
        title: "",
      });
    }, 50);
  };

  const handleDeleteUpi = (index: number | undefined, hasReceivedPayin?: boolean, isPreserved?: boolean) => {
    if (index === undefined || index === null) return;
    // Prevent deletion if hasReceivedPayin is true or isPreserved is true
    if (hasReceivedPayin || isPreserved) {
      return;
    }
    const updatedUpiIds = formState.upiIds.filter(
      (item) => item.channelIndex !== index
    );
    handleChange("upiIds", updatedUpiIds);
  };

  const handleEditUpi = (item: upiField) => {
    // Store the item being edited directly
    setEditingItem(item);
    
    // Find the actual index in the unsorted array to ensure we match the correct item
    const currentUpiIds = formState.upiIds || [];
    const actualIndex = currentUpiIds.findIndex(
      (upi) => 
        upi.channelIndex === item.channelIndex &&
        upi.upiId === item.upiId &&
        upi.title === item.title
    );
    
    // Use channelIndex for matching, but store the actual item for reference
    const channelIndex =
      item.channelIndex !== undefined && item.channelIndex !== null
        ? item.channelIndex
        : null;
    
    console.log("handleEditUpi called:", {
      item,
      actualIndex,
      channelIndex,
      "currentUpiIds.length": currentUpiIds.length,
    });
    
    setSelectedForEdit(channelIndex);
    selectedForEditRef.current = channelIndex; // Also store in ref
    setEditingItem(item);
    editingItemRef.current = item; // Also store in ref
    setFormData(item);
    setModalOpened(true);
  };

  useEffect(() => {
    console.log("formState.upiIds changed:", formState.upiIds);
    console.log("formState.upiIds length:", formState.upiIds?.length);
    if (formState.upiIds && formState.upiIds.length > 0) {
      console.log("First UPI ID in formState:", formState.upiIds[0]);
    }
  }, [formState.upiIds]);

  useEffect(() => {
    if (!modalOpened) {
      setSelectedForEdit(null);
      selectedForEditRef.current = null; // Also clear ref
      setEditingItem(null);
      editingItemRef.current = null; // Also clear ref
      setFormData({
        upiId: "",
        mobile: "",
        email: "",
        beneficiaryName: "",
        isBusinessUpi: false,
        title: "",
        enabled: true,
      });
    }
  }, [modalOpened]);

  const sortedUpiIds = [...(formState.upiIds || [])].sort(
    (a, b) => (a.channelIndex || 0) - (b.channelIndex || 0)
  );

  return (
    <>
      <Modal
        centered
        opened={modalOpened}
        onClose={() => {
          setSelectedForEdit(null);
          setModalOpened(false);
        }}
        title={selectedForEdit !== null ? "Edit UPI ID" : "Add UPI ID"}
        size="lg"
      >
        <UPIModal
          key={selectedForEdit !== null ? `edit-${selectedForEdit}` : "add"}
          opened={modalOpened}
          handlers={{ close: () => setModalOpened(false), open: () => {} }}
          handleSubmit={handleAddUpi}
          initialData={
            editingItem
              ? {
                  upiId: editingItem.upiId || "",
                  mobile: editingItem.mobile || "",
                  email: editingItem.email || "",
                  beneficiaryName: editingItem.beneficiaryName || "",
                  isBusinessUpi:
                    editingItem.isBusinessUpi !== undefined
                      ? editingItem.isBusinessUpi
                      : true,
                  channelIndex: editingItem.channelIndex,
                  title: editingItem.title || "",
                  enabled:
                    editingItem.enabled !== undefined
                      ? editingItem.enabled
                      : true,
                }
              : {
                  upiId: "",
                  mobile: "",
                  email: "",
                  beneficiaryName: "",
                  isBusinessUpi: false,
                  title: "",
                  enabled: true,
                }
          }
          businessUpi={true}
          forUpiVendor={true}
          setChannelIndex={setChannelIndex}
          channelIndex={
            editingItem?.channelIndex !== undefined
              ? editingItem.channelIndex
              : channelIndex
          }
          disableTitleAndUpiId={
            editingItem
              ? (editingItem.hasReceivedPayin || false) || (editingItem.isPreserved || false)
              : false
          }
          isPreserved={editingItem?.isPreserved || false}
          hasReceivedPayin={editingItem?.hasReceivedPayin || false}
        />
      </Modal>

      <Text c={"gray"} size="xs" mb="md">
        {sortedUpiIds.length > 0
          ? "Manage UPI IDs for this vendor. You can add multiple UPI IDs."
          : "Please add at least one UPI ID. This is required for creating a UPI vendor."}
      </Text>

      {sortedUpiIds.map((item, index) => {
        const hasReceivedPayin = item.hasReceivedPayin || false;
        const isPreserved = item.isPreserved || false;
        const shouldDisableEditDelete = hasReceivedPayin || isPreserved;
        
        return (
          <Box
            key={index}
            style={{
              padding: "12px 16px",
              borderRadius: "10px",
              boxShadow:
                "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
              marginBottom: "10px",
              marginTop: "10px",
            }}
          >
            <Flex justify={"space-between"} align={"flex-start"}>
              <Title order={5}>{item.title || "Untitled"}</Title>
              <Flex align={"center"} gap={"sm"}>
                <MdEdit
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => handleEditUpi(item)}
                />
                {!editData && !shouldDisableEditDelete && (
                  <FaTrash
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => handleDeleteUpi(item.channelIndex || 0, item.hasReceivedPayin, item.isPreserved)}
                  />
                )}
              </Flex>
            </Flex>

            <Flex direction="column" gap="xs" mt="xs">
              <Flex gap={"4px"}>
                <Text size="xs" c={"#778899"} fw={600}>
                  UPI ID:
                </Text>
                <Text c={"#778899"} size="xs">
                  {item.upiId}
                </Text>
              </Flex>
              <Flex gap={"4px"}>
                <Text size="xs" c={"#778899"} fw={600}>
                  Enabled:
                </Text>
                <Text c={"#778899"} size="xs">
                  {item.enabled !== undefined
                    ? item.enabled
                      ? "True"
                      : "False"
                    : "True"}
                </Text>
              </Flex>
            </Flex>
          </Box>
        );
      })}

      <Button variant="light" onClick={() => setModalOpened(true)} mt="md">
        Add UPI ID
      </Button>
    </>
  );
};

export default UpiInfoTab;
