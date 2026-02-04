import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Center,
  Flex,
  Loader,
  Modal,
  Paper,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { AiOutlineInfoCircle, AiOutlineWarning } from "react-icons/ai";

import APIs from "../../services/api";
import UPI from "../MemberChannelPage/components/UPI";

import { UPIVendorGatewayResponse } from "../../types/payment";

const UPIVendorGatewayPage = ({
  orderId,
  environment,
  handleReceiptUploaded,
  status,
}) => {
  const [confirmModalOpened, confirmModalHandlers] = useDisclosure();

  const [amount, setAmount] = useState("");
  const [upiDetails, setUpiDetails] = useState<
    UPIVendorGatewayResponse["upiDetails"] | null
  >(null);

  const [txnId, setTxnId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [utrError, setUtrError] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<
    "PENDING" | "SUCCESS" | "FAILED" | "SUBMITTED" | null
  >(null);
  const [initialStatusCheck, setInitialStatusCheck] = useState(false);

  console.log({ upiDetails });

  const checkPaymentStatus = async () => {
    if (!orderId || !environment) {
      return;
    }

    const statusResponse = await APIs.fetchPaymentStatus(orderId, environment);

    if (!statusResponse.isError && statusResponse.data) {
      const status = statusResponse.data.status;
      if (
        status === "SUCCESS" ||
        status === "FAILED" ||
        status === "SUBMITTED"
      ) {
        setPaymentStatus(status);
      }
    }
    setInitialStatusCheck(true);
  };

  const getUPIVendorGatewayDetails = async () => {
    if (!orderId || !environment) {
      return;
    }

    const data = await APIs.getUPIVendorGateway(orderId, environment);

    if (!data.isError && data.data) {
      setAmount(String(data.data.amount));
      setUpiDetails(data.data.upiDetails);
    }
  };

  useEffect(() => {
    checkPaymentStatus();
    getUPIVendorGatewayDetails();
  }, [orderId, environment]);

  const validateUTR = (value: string) => {
    // Regex: exactly 12 numeric characters
    const utrRegex = /^[0-9]{12}$/;
    return utrRegex.test(value);
  };

  const handleUTRChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numeric input
    const numericValue = value.replace(/[^0-9]/g, "");
    setTxnId(numericValue);

    if (numericValue && !validateUTR(numericValue)) {
      setUtrError("UTR must be exactly 12 numeric characters");
    } else {
      setUtrError("");
    }
  };

  const handleOpenConfirmModal = () => {
    if (validateUTR(txnId)) {
      confirmModalHandlers.open();
    }
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    confirmModalHandlers.close();

    // Call the parent handler which will submit and start polling
    handleReceiptUploaded(txnId);
  };

  return (
    <Flex justify={"center"} bg={"blue.1"} h={"100dvh"} pos="relative">
      <Paper
        maw={"400px"}
        w={"100%"}
        style={{
          position: "relative",
          overflowY: "auto",
          maxHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
        }}
        bg={"#f2f7fc"}
        id="map-container"
      >
        <Box w={"100%"} p={"sm"} style={{ minHeight: "auto" }}>
          {!initialStatusCheck ? (
            <Flex h={"100%"} justify={"center"} align={"center"}>
              <Loader />
            </Flex>
          ) : paymentStatus === "SUCCESS" ? (
            <Flex
              direction={"column"}
              justify={"space-between"}
              h={"100%"}
              id="kg-payment-page"
            >
              <Center h={"100%"}>
                <Flex direction={"column"} align={"center"}>
                  <Text fz={"xl"} fw={700} c={"green"} mb={"md"}>
                    Payment Successful!
                  </Text>
                  <Text fz={"md"} ta={"center"} c={"gray.7"}>
                    Your payment has been successfully verified.
                  </Text>
                </Flex>
              </Center>
            </Flex>
          ) : paymentStatus === "FAILED" ? (
            <Flex
              direction={"column"}
              justify={"space-between"}
              h={"100%"}
              id="kg-payment-page"
            >
              <Center h={"100%"}>
                <Flex direction={"column"} align={"center"}>
                  <Text fz={"xl"} fw={700} c={"red"} mb={"md"}>
                    Payment Failed!
                  </Text>
                  <Text fz={"md"} ta={"center"} c={"gray.7"}>
                    Your payment could not be verified. Please try again.
                  </Text>
                </Flex>
              </Center>
            </Flex>
          ) : paymentStatus === "SUBMITTED" ? (
            <Flex
              direction={"column"}
              justify={"space-between"}
              h={"100%"}
              id="kg-payment-page"
            >
              <Center h={"100%"}>
                <Flex direction={"column"} align={"center"}>
                  <Text fz={"xl"} fw={700} c={"green"} mb={"md"}>
                    Payment Submitted Successfully!
                  </Text>
                  <Text fz={"md"} ta={"center"} c={"gray.7"}>
                    Your payment has been submitted and is being processed.
                  </Text>
                </Flex>
              </Center>
            </Flex>
          ) : upiDetails ? (
            <Flex direction={"column"} gap="md" id="kg-payment-page" pb="md">
              <UPI
                name={upiDetails.beneficiaryName}
                amount={amount}
                upiId={upiDetails.upiId}
                isBusinessUpi={upiDetails.isBusiness}
                qrCode={upiDetails.qrCode}
                isVendorGateway={true}
                trackingId={upiDetails.trackingId}
                tr={upiDetails.tr}
              />
              <Alert
                color="brand"
                variant="light"
                p={"sm"}
                radius="md"
                icon={<AiOutlineInfoCircle size={18} />}
                style={{ overflow: "visible" }}
              >
                <Box
                  style={{ wordWrap: "break-word", overflowWrap: "break-word" }}
                >
                  <Text
                    fz={"xs"}
                    ta={"left"}
                    c={"blue.9"}
                    fw={700}
                    mb={6}
                    style={{ lineHeight: 1.5 }}
                  >
                    Notes
                  </Text>
                  <Stack gap={4}>
                    <Text fz={"xs"} ta={"left"} c={"blue.9"}>
                      1. Please ensure you have a UPI app installed (Google Pay,
                      PhonePe, Paytm, etc.) before proceeding.
                    </Text>
                    <Text fz={"xs"} ta={"left"} c={"blue.9"}>
                      2. Please do not pay the same payment link more than once.
                    </Text>
                  </Stack>
                </Box>
              </Alert>
              <Alert
                color="yellow"
                variant="light"
                p={"sm"}
                radius="md"
                icon={<AiOutlineWarning size={18} />}
                style={{ overflow: "visible" }}
              >
                <Box
                  style={{ wordWrap: "break-word", overflowWrap: "break-word" }}
                >
                  <Text
                    fz={"xs"}
                    ta={"left"}
                    c={"yellow.9"}
                    fw={700}
                    mb={4}
                    style={{ lineHeight: 1.5 }}
                  >
                    After completing the payment in your UPI app, return to this
                    page.
                  </Text>
                  <Text
                    fz={"xs"}
                    ta={"left"}
                    c={"yellow.9"}
                    style={{ lineHeight: 1.5 }}
                  >
                    Enter your 12‑digit UTR / Transaction ID in the field below
                    and submit it to confirm your payment.
                  </Text>
                </Box>
              </Alert>

              <Paper p="md" radius="md" withBorder>
                <Stack gap="md">
                  <TextInput
                    label="Transaction ID / UTR"
                    withAsterisk
                    size="md"
                    placeholder="Enter 12 digit numeric UTR"
                    value={txnId}
                    onChange={handleUTRChange}
                    error={utrError}
                    description="Exactly 12 numeric characters"
                    disabled={isSubmitting}
                    maxLength={12}
                  />

                  <Button
                    size="md"
                    radius={"xl"}
                    w={"100%"}
                    loading={isSubmitting}
                    onClick={handleOpenConfirmModal}
                    disabled={!txnId || !!utrError || isSubmitting}
                  >
                    Submit Payment
                  </Button>
                </Stack>
              </Paper>
            </Flex>
          ) : (
            <Flex h={"100%"} justify={"center"} align={"center"}>
              <Loader />
            </Flex>
          )}
        </Box>

        {/* Confirmation Modal */}
        <Modal
          opened={confirmModalOpened}
          onClose={confirmModalHandlers.close}
          title="Confirm Transaction ID"
          centered
          closeOnClickOutside={!isSubmitting}
          closeOnEscape={!isSubmitting}
        >
          <Stack gap="md">
            <Text size="sm" c="gray.7">
              Please verify your transaction ID/UTR before submitting. You won't
              be able to edit it after submission.
            </Text>

            <Paper p="md" bg="blue.0" style={{ borderRadius: "8px" }}>
              <Text size="xs" c="gray.6" mb={4}>
                Transaction ID / UTR
              </Text>
              <Text
                size="md"
                fw={600}
                c="blue.9"
                style={{ wordBreak: "break-all" }}
              >
                {txnId}
              </Text>
            </Paper>

            <Alert color="yellow" p="sm">
              <Text size="xs" fw={500}>
                ⚠️ This transaction ID cannot be changed once submitted
              </Text>
            </Alert>

            <Flex gap="sm" justify="flex-end">
              <Button
                variant="subtle"
                color="gray"
                onClick={confirmModalHandlers.close}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button onClick={handleConfirmSubmit} loading={isSubmitting}>
                Confirm & Submit
              </Button>
            </Flex>
          </Stack>
        </Modal>
      </Paper>
    </Flex>
  );
};

export default UPIVendorGatewayPage;
