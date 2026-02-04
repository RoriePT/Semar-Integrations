import {
  Badge,
  Box,
  Divider,
  Flex,
  Loader,
  Modal,
  Text,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { SettlementAPIs } from "../../../../../api/settlement";
import { formatDateIST } from "../../../../../utils";

interface SettlementDetailsModalProps {
  opened: boolean;
  close: () => void;
  orderId: number | null;
  triggerReload?: () => void;
}

const SettlementDetailsModal: React.FC<SettlementDetailsModalProps> = ({
  opened,
  close,
  orderId,
  triggerReload,
}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

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

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: "yellow",
      completed: "green",
      rejected: "red",
      approved: "brand",
    };

    return (
      <Badge
        variant="light"
        color={statusColors[status?.toLowerCase()] || "gray"}
        size="lg"
      >
        {status?.toUpperCase() || "N/A"}
      </Badge>
    );
  };

  const InfoRow = ({ label, value }) => (
    <Flex justify="space-between" mb="sm">
      <Text size="sm" c="dimmed">
        {label}:
      </Text>
      <Text size="sm" fw={500}>
        {value}
      </Text>
    </Flex>
  );

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={<Title order={3}>Settlement Order Details</Title>}
      size="md"
    >
      {loading ? (
        <Flex justify="center" align="center" py="xl">
          <Loader />
        </Flex>
      ) : data ? (
        <Box>
          <InfoRow
            label="System Order ID"
            value={data.systemOrderId || data.settlementId || data.id || "N/A"}
          />
          <InfoRow label="UPI ID" value={data.upiId || "N/A"} />
          <Flex justify="space-between" mb="sm">
            <Text size="sm" c="dimmed">
              Status:
            </Text>
            {getStatusBadge(data.status)}
          </Flex>

          <Divider my="md" />

          <InfoRow
            label="Settlement Amount"
            value={`₹${data.settlementAmount || 0}`}
          />
          <InfoRow label="Paid Amount" value={`₹${data.paidAmount || 0}`} />
          <InfoRow
            label="Remaining Amount"
            value={`₹${data.remainingAmount || 0}`}
          />
          <InfoRow
            label="Transaction ID"
            value={data.transactionId || data.utr || "N/A"}
          />

          <Divider my="md" />

          <InfoRow
            label="Created At"
            value={formatDateIST(data.createdAt) || "N/A"}
          />
          {data.updatedAt && (
            <InfoRow
              label="Updated At"
              value={formatDateIST(data.updatedAt) || "N/A"}
            />
          )}
          {data.remarks && (
            <>
              <Divider my="md" />
              <Text size="sm" c="dimmed" mb="xs">
                Remarks:
              </Text>
              <Text size="sm">{data.remarks}</Text>
            </>
          )}
        </Box>
      ) : (
        <Text c="dimmed" ta="center" py="xl">
          No details available
        </Text>
      )}
    </Modal>
  );
};

export default SettlementDetailsModal;
