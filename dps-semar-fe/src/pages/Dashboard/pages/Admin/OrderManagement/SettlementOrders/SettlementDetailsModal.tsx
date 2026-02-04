import { Accordion, Button, Flex, Loader, Modal, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import ModalLayout from "../../../../../../components/ModalLayout";
import { SettlementAPIs } from "../../../../../../api/settlement";
import SettlementInfo from "./components/SettlementInfo";
import VendorInfo from "./components/VendorInfo";

interface SettlementDetailsModalProps {
  opened: boolean;
  close: () => void;
  orderId: number | null;
  triggerReload: () => void;
}

const SettlementDetailsModal: React.FC<SettlementDetailsModalProps> = ({
  opened,
  close,
  orderId,
  triggerReload,
}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState<"approve" | "reject" | null>(null);
  const [approveModalOpened, approveModalHandlers] = useDisclosure();
  const [rejectModalOpened, rejectModalHandlers] = useDisclosure();

  const fetchDetails = async () => {
    if (!orderId) return;

    setLoading(true);
    try {
      const response = await SettlementAPIs.getDetails(orderId);
      setData(response);
    } catch (error) {
      console.error("Error fetching settlement details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (opened && orderId) {
      fetchDetails();
    }
  }, [opened, orderId]);

  const handleApproveClick = () => {
    approveModalHandlers.open();
  };

  const handleRejectClick = () => {
    rejectModalHandlers.open();
  };

  const handleApproveConfirm = async () => {
    if (!orderId) return;

    setActionLoading("approve");
    approveModalHandlers.close();
    try {
      await SettlementAPIs.approve(orderId);
      notifications.show({
        title: "Success",
        message: "Settlement order approved successfully",
        color: "green",
        withCloseButton: true,
      });
      
      // Reload first, then close modal
      triggerReload();
      
      setTimeout(() => {
        close();
      }, 100);
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error?.response?.data?.message || "Failed to approve settlement order",
        color: "red",
        withCloseButton: true,
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectConfirm = async () => {
    if (!orderId) return;

    setActionLoading("reject");
    rejectModalHandlers.close();
    try {
      await SettlementAPIs.reject(orderId, "Rejected by admin");
      notifications.show({
        title: "Success",
        message: "Settlement order rejected successfully",
        color: "green",
        withCloseButton: true,
      });
      
      // Reload first, then close modal
      triggerReload();
      
      setTimeout(() => {
        close();
      }, 100);
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error?.response?.data?.message || "Failed to reject settlement order",
        color: "red",
        withCloseButton: true,
      });
    } finally {
      setActionLoading(null);
    }
  };

  const isPending = data?.status?.toLowerCase() === "pending" || data?.status?.toLowerCase() === "submitted";

  const header = (
    <Flex align="center" gap="sm">
      <Title order={4}>Settlement Order Details</Title>
    </Flex>
  );

  const body = loading ? (
    <Flex justify="center" align="center" py="xl">
      <Loader />
    </Flex>
  ) : data ? (
    <Accordion
      defaultValue={["settlement-info", "vendor-info"]}
      multiple
      variant="separated"
    >
      <SettlementInfo data={data} />
      <VendorInfo data={data} />
    </Accordion>
  ) : (
    <Text c="dimmed" ta="center" py="xl">
      No details available
    </Text>
  );

  const footer = isPending ? (
    <Flex justify="flex-end" gap="md">
      <Button
        variant="outline"
        color="red"
        onClick={handleRejectClick}
        loading={actionLoading === "reject"}
        disabled={actionLoading !== null}
      >
        Reject
      </Button>
      <Button
        color="green"
        onClick={handleApproveClick}
        loading={actionLoading === "approve"}
        disabled={actionLoading !== null}
      >
        Approve
      </Button>
    </Flex>
  ) : null;

  return (
    <>
      <ModalLayout
        opened={opened}
        close={close}
        header={header}
        body={body}
        footer={footer || <></>}
        size="lg"
      />

      {/* Approve Confirmation Modal */}
      <Modal
        opened={approveModalOpened}
        onClose={approveModalHandlers.close}
        title="Approve Settlement Order"
        centered
        size="sm"
      >
        <Text size="sm" mb="md">
          Are you sure you want to approve this settlement order?
        </Text>
        <Text size="sm" fw={500} mb="xs">
          System Order ID: {data?.systemOrderId || "N/A"}
        </Text>
        <Text size="sm" fw={500} mb="md">
          Amount: ₹{data?.paidAmount || 0}
        </Text>
        <Flex justify="flex-end" gap="md">
          <Button
            variant="outline"
            onClick={approveModalHandlers.close}
            disabled={actionLoading === "approve"}
          >
            Cancel
          </Button>
          <Button
            color="green"
            onClick={handleApproveConfirm}
            loading={actionLoading === "approve"}
          >
            Approve
          </Button>
        </Flex>
      </Modal>

      {/* Reject Confirmation Modal */}
      <Modal
        opened={rejectModalOpened}
        onClose={rejectModalHandlers.close}
        title="Reject Settlement Order"
        centered
        size="sm"
      >
        <Text size="sm" mb="md">
          Are you sure you want to reject this settlement order?
        </Text>
        <Text size="sm" fw={500} mb="xs">
          System Order ID: {data?.systemOrderId || "N/A"}
        </Text>
        <Text size="sm" fw={500} mb="md">
          Amount: ₹{data?.paidAmount || 0}
        </Text>
        <Text size="xs" c="red" mb="md">
          This action cannot be undone.
        </Text>
        <Flex justify="flex-end" gap="md">
          <Button
            variant="outline"
            onClick={rejectModalHandlers.close}
            disabled={actionLoading === "reject"}
          >
            Cancel
          </Button>
          <Button
            color="red"
            onClick={handleRejectConfirm}
            loading={actionLoading === "reject"}
          >
            Reject
          </Button>
        </Flex>
      </Modal>
    </>
  );
};

export default SettlementDetailsModal;
