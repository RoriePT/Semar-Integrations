import {
  Accordion,
  Alert,
  Button,
  Checkbox,
  Divider,
  Flex,
  Loader,
  Modal,
  Paper,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import OrderAPIs from "../../../../api/order";
import ModalLayout from "../../../ModalLayout";
import MainDetails from "../MemberPayin/components/MainDetails";
import GeneralDetails from "./components/GeneralDetails";
import TransactionDetails from "./components/TransactionDetails";

const UpiVendorPayin = ({ opened, close, orderId, reload }) => {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [submittingUtr, setSubmittingUtr] = useState(false);
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [rejectModalOpened, setRejectModalOpened] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  const fetchOrderDetails = async () => {
    const data = await OrderAPIs.getOrderDetails("/payin/upi-vendor", orderId);
    if (data) setDetails(data);
  };

  const handleApproveSubmit = async () => {
    if (!confirmChecked) {
      notifications.show({
        title: "Error",
        message:
          "Please confirm the UTR and acknowledge that you have received the payment by checking the checkbox first.",
        color: "red",
        withCloseButton: true,
      });
      return;
    }

    setSubmittingUtr(true);
    try {
      // Send empty string for UTR as per requirement
      const update = await OrderAPIs.approveOrderForUpiVendor(
        details.systemOrderId,
        "",
      );
      if (update) {
        // Show success notification
        notifications.show({
          title: "Success",
          message: "Order approved successfully!",
          color: "green",
          withCloseButton: true,
        });

        // Reload the bulletin board first
        if (reload) reload();

        // Close modal after a brief delay to ensure reload completes
        setTimeout(() => {
          setConfirmChecked(false);
          close();
        }, 100);
      }
    } catch (error: any) {
      console.log(error);
      // Display backend error message in toaster
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "UTR verification failed. Please try again.";

      notifications.show({
        title: "Error",
        message: errorMessage,
        color: "red",
        withCloseButton: true,
      });
    } finally {
      setSubmittingUtr(false);
    }
  };

  const handleRejectConfirm = async () => {
    setRejecting(true);
    try {
      const update = await OrderAPIs.rejectOrderForUpiVendor(
        details.systemOrderId,
      );
      if (update) {
        // Show success notification
        notifications.show({
          title: "Success",
          message: "Order rejected successfully!",
          color: "green",
          withCloseButton: true,
        });

        // Reload the bulletin board first
        if (reload) reload();

        // Close modals after a brief delay to ensure reload completes
        setTimeout(() => {
          setRejectModalOpened(false);
          close();
        }, 100);
      }
    } catch (error: any) {
      console.log(error);
      // Display backend error message in toaster
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to reject order. Please try again.";

      notifications.show({
        title: "Error",
        message: errorMessage,
        color: "red",
        withCloseButton: true,
      });
    } finally {
      setRejecting(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
      setConfirmChecked(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (!opened) {
      setConfirmChecked(false);
      setRejectModalOpened(false);
    }
  }, [opened]);

  return (
    <>
      <ModalLayout
        opened={opened}
        close={close}
        fullHeight
        size="lg"
        header={<Title order={4}>Payin Details</Title>}
        body={
          details ? (
            <>
              <MainDetails
                systemOrderId={details.systemOrderId}
                trackingId={details.trackingId}
                amount={details.amount}
                status={details.status}
                channel={details.channel}
                paymentType="upiVendor"
              />

              {details.hasUtrMismatch && (
                <Alert
                  icon={<FaExclamationTriangle size="1rem" />}
                  title="UTR Mismatched"
                  color="orange"
                  mb="md"
                >
                  <Text size="sm">
                    {details.status?.toLowerCase() === "complete" ||
                    details.status?.toLowerCase() === "failed"
                      ? "At least one mismatch detected but now the order status is updated."
                      : "A UTR mismatch was detected for this transaction. This order has been escalated to the admin for manual review and resolution. You can approve or reject this order, but the final decision will be made by the admin."}
                  </Text>
                </Alert>
              )}

              {details.status === "submitted" && (
                <Paper withBorder p="md" mb="md" radius="md">
                  <Text size="md" fw={600} mb="sm">
                    Approve Order
                  </Text>
                  <Divider mb="md" />
                  <Text size="sm" fw={500} mb="xs">
                    UTR / Transaction ID:
                  </Text>
                  <Text size="lg" fw={600} mb="md" c="brand">
                    {details.transactionDetails?.transactionId ||
                      details.transactionId ||
                      "N/A"}
                  </Text>

                  <Checkbox
                    checked={confirmChecked}
                    onChange={(e) => setConfirmChecked(e.currentTarget.checked)}
                    label="I confirm the UTR and acknowledge that I have received the payment"
                    mb="md"
                  />
                </Paper>
              )}

              <Accordion defaultValue="1" variant="separated">
                <Accordion.Item key={"1"} value={"1"}>
                  <Accordion.Control>General Details</Accordion.Control>
                  <Accordion.Panel>
                    <GeneralDetails
                      userName={
                        typeof details.user === "string"
                          ? details.user
                          : details.user?.name || "N/A"
                      }
                      userEmail={
                        typeof details.user === "string"
                          ? ""
                          : details.user?.email || ""
                      }
                      userMobile={
                        typeof details.user === "string"
                          ? ""
                          : details.user?.mobile || ""
                      }
                      createdOn={details.createdAt}
                      updatedOn={details.updatedAt}
                      status={details.status}
                      commissionFee={details.commission || 0}
                      commissionRate={details.upiVendor?.commissionRate || 0}
                    />
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item key={"1"} value={"2"}>
                  <Accordion.Control>Transaction Details</Accordion.Control>
                  <Accordion.Panel>
                    {details.status === "assigned" ||
                    details.status === "initiated" ? (
                      <Flex h={"30px"} align={"center"} justify={"center"}>
                        <span style={{ color: "var(--mantine-color-dimmed)" }}>
                          Not available
                        </span>
                      </Flex>
                    ) : (
                      <TransactionDetails
                        transactionId={
                          details.transactionDetails?.transactionId ||
                          details.transactionId
                        }
                        merchantOrderId={details.merchantOrderId}
                        upiId={details.upiVendor?.upiId}
                        upiTitle={details.upiVendor?.upiTitle}
                        status={details.status}
                      />
                    )}
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </>
          ) : (
            <Flex h={"100%"} w={"100%"} justify={"center"} align={"center"}>
              <Loader />
            </Flex>
          )
        }
        footer={
          details?.status === "submitted" ? (
            <Flex justify={"flex-end"} gap={"md"}>
              <Tooltip
                label="No transaction received with this UTR"
                withArrow
                position="top"
              >
                <Button
                  color="red"
                  onClick={() => setRejectModalOpened(true)}
                  disabled={submittingUtr || rejecting}
                >
                  Reject
                </Button>
              </Tooltip>
              <Button
                bg={"green"}
                onClick={handleApproveSubmit}
                loading={submittingUtr}
                disabled={submittingUtr || rejecting}
              >
                Approve
              </Button>
            </Flex>
          ) : (
            <></>
          )
        }
      />

      {/* Reject Confirmation Modal */}
      <Modal
        opened={rejectModalOpened}
        onClose={() => setRejectModalOpened(false)}
        title="Confirm Rejection"
        centered
        zIndex={1000}
      >
        <Text size="sm" mb="md">
          Are you sure you want to reject this order? No transaction was
          received with this UTR.
        </Text>
        <Text size="sm" c="dimmed" mb="lg">
          This action cannot be undone.
        </Text>
        <Flex justify="flex-end" gap="sm">
          <Button
            variant="outline"
            onClick={() => setRejectModalOpened(false)}
            disabled={rejecting}
          >
            Cancel
          </Button>
          <Button
            color="red"
            onClick={handleRejectConfirm}
            loading={rejecting}
            disabled={rejecting}
          >
            Confirm Reject
          </Button>
        </Flex>
      </Modal>
    </>
  );
};

export default UpiVendorPayin;
