import {
  Box,
  Button,
  Divider,
  Flex,
  Modal,
  NumberInput,
  Paper,
  Select,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { FaCopy } from "react-icons/fa";
import { SettlementAPIs } from "../../../../../api/settlement";

interface CreateSettlementModalProps {
  opened: boolean;
  close: () => void;
  triggerReload: () => void;
}

const CreateSettlementModal: React.FC<CreateSettlementModalProps> = ({
  opened,
  close,
  triggerReload,
}) => {
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [upiIds, setUpiIds] = useState([]);
  const [selectedUpiId, setSelectedUpiId] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | string>("");
  const [utr, setUtr] = useState("");
  const [settlementRecipientDetails, setSettlementRecipientDetails] = useState<{
    upiId?: string;
    qrCode?: string;
  } | null>(null);
  const [totalSettlement, setTotalSettlement] = useState(0);
  const [totalPendingSettlement, setTotalPendingSettlement] = useState(0);
  const [confirmModalOpened, setConfirmModalOpened] = useState(false);

  // Get selected UPI details
  const selectedUpi = upiIds.find((upi) => upi.value === selectedUpiId);
  const maxSettlement = selectedUpi?.settlementAmount || 0;

  const fetchSettlementDetails = async () => {
    setFetchingData(true);
    try {
      const response = await SettlementAPIs.getDetailsForVendor();

      if (response) {
        // Format UPI IDs for dropdown
        const formattedUpiIds = (response.upiIds || [])
          .filter((upi) => upi.enabled && upi.settlementAmount > 0)
          .map((upi) => ({
            value: String(upi.id),
            label: `${upi.title || upi.upiId} - ₹${upi.settlementAmount}`,
            upiId: upi.upiId,
            settlementAmount: upi.settlementAmount,
            beneficiaryName: upi.beneficiaryName,
            mobile: upi.mobile,
            email: upi.email,
          }));

        setUpiIds(formattedUpiIds);
        setSettlementRecipientDetails(
          response.settlementRecipientDetails || null,
        );
        setTotalSettlement(response.totalSettlement || 0);
        setTotalPendingSettlement(response.totalPendingSettlement || 0);
      }
    } catch (error) {
      console.error("Error fetching settlement details:", error);
      notifications.show({
        title: "Error",
        message: "Failed to fetch settlement details",
        color: "red",
      });
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    if (opened) {
      fetchSettlementDetails();
      // Reset form
      setSelectedUpiId(null);
      setAmount("");
      setUtr("");
    }
  }, [opened]);

  const handleSubmit = () => {
    // Validation
    if (!selectedUpiId) {
      notifications.show({
        title: "Error",
        message: "Please select a UPI ID",
        color: "red",
      });
      return;
    }

    if (!amount || Number(amount) <= 0) {
      notifications.show({
        title: "Error",
        message: "Please enter a valid amount",
        color: "red",
      });
      return;
    }

    if (Number(amount) > maxSettlement) {
      notifications.show({
        title: "Error",
        message: `Amount cannot exceed settlement amount of ₹${maxSettlement}`,
        color: "red",
      });
      return;
    }

    if (!utr || utr.trim() === "") {
      notifications.show({
        title: "Error",
        message: "Please enter UTR/Transaction ID",
        color: "red",
      });
      return;
    }

    // Validate UTR format: exactly 12 numeric characters
    const utrTrimmed = utr.trim();
    if (!/^\d{12}$/.test(utrTrimmed)) {
      notifications.show({
        title: "Error",
        message: "UTR/Transaction ID must be exactly 12 numeric characters",
        color: "red",
      });
      return;
    }

    // Open confirmation modal
    setConfirmModalOpened(true);
  };

  const handleConfirmSubmit = async () => {
    // Validate UTR format: exactly 12 numeric characters
    const utrTrimmed = utr.trim();
    if (!/^\d{12}$/.test(utrTrimmed)) {
      notifications.show({
        title: "Error",
        message: "UTR/Transaction ID must be exactly 12 numeric characters",
        color: "red",
      });
      return;
    }

    setConfirmModalOpened(false);
    setLoading(true);
    try {
      const payload = {
        upiId: Number(selectedUpiId),
        paidAmount: Number(amount),
        transactionId: utrTrimmed,
      };

      await SettlementAPIs.create(payload);

      notifications.show({
        title: "Success",
        message: "Settlement order created successfully",
        color: "green",
      });

      // Reload first, then close modal
      triggerReload();

      setTimeout(() => {
        close();
      }, 100);
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message:
          error?.response?.data?.message || "Failed to create settlement order",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    notifications.show({
      title: "Copied",
      message: `${label} copied to clipboard`,
      color: "green",
    });
  };

  return (
    <>
      <Modal
        opened={confirmModalOpened}
        onClose={() => setConfirmModalOpened(false)}
        title={<Title order={3}>Confirm UTR/Transaction ID</Title>}
        size="md"
        centered
        zIndex={1000}
      >
        <Box>
          <Text size="sm" mb="md">
            Please carefully verify the UTR/Transaction ID before submitting:
          </Text>
          <Paper
            p="md"
            withBorder
            style={{
              backgroundColor: "#f8f9fa",
              border: "2px solid #A85706",
            }}
            mb="md"
          >
            <Flex direction="column" gap="xs">
              <Text size="xs" c="dimmed">
                UTR/Transaction ID:
              </Text>
              <Text
                size="lg"
                fw={700}
                c="brand"
                style={{ fontFamily: "monospace", wordBreak: "break-all" }}
              >
                {utr.trim()}
              </Text>
            </Flex>
          </Paper>
          <Text size="sm" c="dimmed" mb="lg">
            Once submitted, this cannot be changed. Please ensure the
            UTR/Transaction ID is correct.
          </Text>
          <Flex justify="flex-end" gap="md">
            <Button
              variant="outline"
              onClick={() => setConfirmModalOpened(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmSubmit} loading={loading}>
              Confirm & Submit
            </Button>
          </Flex>
        </Box>
      </Modal>
      <Modal
        opened={opened}
        onClose={close}
        title={<Title order={3}>Create Settlement Order</Title>}
        size="lg"
      >
        {fetchingData ? (
          <Flex justify="center" align="center" py="xl">
            <Box ta="center">
              <Text size="sm" c="dimmed" mb="md">
                Loading settlement details...
              </Text>
            </Box>
          </Flex>
        ) : (
          <Box>
            {/* Total Settlement Info */}
            {totalSettlement > 0 && (
              <Paper
                p="md"
                mb="lg"
                withBorder
                style={{ backgroundColor: "#e7f5ff" }}
              >
                <Flex direction="column" gap="xs">
                  <Flex justify="space-between" align="center">
                    <Text size="sm" fw={500}>
                      Remaining Settlement Amount:
                    </Text>
                    <Text size="lg" fw={700} c="brand">
                      ₹{totalSettlement.toFixed(2)}
                    </Text>
                  </Flex>
                  {totalPendingSettlement > 0 && (
                    <Flex direction="column" gap={2}>
                      <Flex justify="space-between" align="center">
                        <Text size="sm" fw={500}>
                          Settlement Amount in Process:
                        </Text>
                        <Text size="lg" fw={700} c="orange">
                          ₹{totalPendingSettlement.toFixed(2)}
                        </Text>
                      </Flex>
                      <Text size="xs" c="dimmed" mt={0}>
                        This amount is pending to be verified by the admin.
                      </Text>
                    </Flex>
                  )}
                </Flex>
              </Paper>
            )}

            {/* Settlement Selection */}
            <Box mb="lg">
              <Select
                label="Select UPI ID"
                placeholder="Choose UPI ID to settle"
                data={upiIds}
                value={selectedUpiId}
                onChange={setSelectedUpiId}
                withAsterisk
                mb="xs"
                searchable
                size="md"
              />
              {selectedUpi && (
                <Text size="sm" c="dimmed" mt="xs">
                  Maximum settlement amount:{" "}
                  <strong>₹{selectedUpi.settlementAmount}</strong>
                </Text>
              )}
            </Box>

            {selectedUpiId && (
              <>
                <NumberInput
                  label="Settlement Amount"
                  placeholder="Enter amount (partial or full)"
                  value={amount}
                  onChange={setAmount}
                  withAsterisk
                  min={1}
                  max={maxSettlement}
                  mb="xs"
                  leftSection="₹"
                  size="md"
                />
                <Text size="sm" c="dimmed" mb="lg">
                  You can pay partial or full amount (max: ₹{maxSettlement})
                </Text>

                <Divider
                  my="lg"
                  label={
                    <Text size="sm" fw={500} c="dimmed">
                      Settlement UPI Details
                    </Text>
                  }
                  labelPosition="center"
                />

                {/* Settlement Recipient Details */}
                {settlementRecipientDetails ? (
                  <Box mb="lg">
                    <Paper
                      p="md"
                      mb="md"
                      withBorder
                      style={{ backgroundColor: "#f8f9fa" }}
                    >
                      <Flex direction="column" gap="md" align="center">
                        {/* QR Code */}
                        {settlementRecipientDetails.qrCode && (
                          <Box>
                            <img
                              src={settlementRecipientDetails.qrCode}
                              alt="Settlement QR Code"
                              style={{
                                width: "200px",
                                height: "200px",
                                objectFit: "contain",
                                border: "1px solid #dee2e6",
                                borderRadius: "8px",
                                backgroundColor: "white",
                                padding: "8px",
                              }}
                            />
                          </Box>
                        )}

                        {/* UPI ID */}
                        {settlementRecipientDetails.upiId && (
                          <Flex
                            direction="column"
                            gap="xs"
                            align="center"
                            w="100%"
                          >
                            <Text size="sm" fw={500} c="dimmed">
                              Settlement UPI ID:
                            </Text>
                            <Flex align="center" gap="xs">
                              <Text size="sm" fw={600} c="brand">
                                {settlementRecipientDetails.upiId}
                              </Text>
                              <FaCopy
                                style={{
                                  cursor: "pointer",
                                  color: "#A85706",
                                }}
                                onClick={() =>
                                  handleCopy(
                                    settlementRecipientDetails.upiId || "",
                                    "Settlement UPI ID",
                                  )
                                }
                              />
                            </Flex>
                          </Flex>
                        )}
                      </Flex>
                    </Paper>
                    <Text size="sm" c="dimmed" mb="lg" ta="center">
                      Scan the QR code or use the UPI ID above to make the
                      payment and submit the transaction ID below
                    </Text>
                  </Box>
                ) : (
                  <Text size="sm" c="dimmed" mb="lg" ta="center">
                    Settlement recipient details not available
                  </Text>
                )}

                {/* Transaction Submission */}
                <Box
                  p="md"
                  style={{
                    backgroundColor: "#f1f3f5",
                    borderRadius: "8px",
                    border: "1px solid #dee2e6",
                  }}
                >
                  <TextInput
                    label="Transaction Id"
                    placeholder="Enter 12 digit transaction ID"
                    value={utr}
                    onChange={(e) => {
                      const value = e.currentTarget.value;
                      // Only allow numeric characters and limit to 12 digits
                      const numericValue = value
                        .replace(/\D/g, "")
                        .slice(0, 12);
                      setUtr(numericValue);
                    }}
                    withAsterisk
                    size="md"
                    mb="xs"
                    maxLength={12}
                  />
                  <Text size="xs" c="dimmed" mb="md">
                    Enter exactly 12 digit Transaction ID
                  </Text>

                  <Flex justify="flex-end">
                    <Button onClick={handleSubmit} loading={loading} size="md">
                      Submit Payment
                    </Button>
                  </Flex>
                </Box>
              </>
            )}

            {!selectedUpiId && (
              <Box py="xl">
                <Text size="sm" c="dimmed" ta="center">
                  Select a UPI ID to continue with settlement
                </Text>
              </Box>
            )}
          </Box>
        )}
      </Modal>
    </>
  );
};

export default CreateSettlementModal;
