import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import {
  Button,
  Center,
  Flex,
  Loader,
  Paper,
  Text,
  Title,
} from "@mantine/core";

import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";
import { PaymentStatusDisplay } from "./PaymentStatusDisplay";
import { PaymentAmount } from "./PaymentAmount";
import { PaymentMethodsList } from "./PaymentMethodsList";
import MemberChannelPage from "../MemberChannelPage";
import UPIVendorGatewayPage from "../VendorGatewayUPIPage";
import GatewayPaymentPage from "../GatewayPage";
import TestPage from "../TestPage";
import GeneralGatewayPaymentPage from "../GatewayPage/general";

import { useCheckout } from "../../hooks/useCheckout";
import { usePaymentProcessing } from "../../hooks/usePaymentProcessing";
import { usePaymentStatus } from "../../hooks/usePaymentStatus";
import useWindowMessage from "../../hooks/useWindowMessage";
import APIs from "../../services/api";

interface PaymentPageProps {
  gatewayCallback?: boolean;
  memberPayment?: boolean;
  upiVendorGateway?: boolean;
}

const PaymentPage = ({
  gatewayCallback = false,
  memberPayment = false,
  upiVendorGateway = false,
}: PaymentPageProps) => {
  const location = useLocation();
  const { orderId: orderIdFromPath, integrationId } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const orderIdParam = queryParams.get("orderId") || orderIdFromPath;
  const environmentParam = queryParams.get("environment");

  const {
    error: checkoutError,
    initialLoading,
    channels,
    checkoutDetails,
    setCheckoutDetails,
    setIsOpened,
  } = useCheckout();

  const [isUPIVendorGatewayEnabled, setIsUPIVendorGatewayEnabled] = useState<
    boolean | null
  >(null);
  const [isCheckingUPIVendorGateway, setIsCheckingUPIVendorGateway] =
    useState(true);

  const {
    isSubmitted,
    setIsSubmitted,
    orderId,
    setOrderId,
    gatewayPageOpen,
    url,
    paymentMethodType,
    newTabRef,
    setTabRefChanged,
    status,
    setStatus,
    handleReceiptUploaded,
    handleClose,
  } = usePaymentStatus(
    checkoutDetails,
    environmentParam || "",
    setIsOpened,
    memberPayment || upiVendorGateway,
  );

  const {
    channel,
    showTestPage,
    error: paymentError,
    handleChannelSelect,
    handleSandboxPaymentMethodSelect,
    resetChannelSelection,
  } = usePaymentProcessing(checkoutDetails, setIsSubmitted, setOrderId);

  useWindowMessage(async (data) => {
    if (data.type === "callback") {
      setIsSubmitted(true);
      setOrderId(data.orderId);
    }

    if (data.type === "checkout") {
      setIsOpened(true);
      const paymentDetails = data.paymentDetails;
      setCheckoutDetails(paymentDetails);
      setOrderId("");
    }

    if (data.type === "test-submit") {
      setIsSubmitted(true);
      setTimeout(() => {
        setStatus(data.status);
      }, 5000);
      window.focus();
    }

    if (data.type === "payment-success" || data.type === "payment-failure") {
      setIsSubmitted(false);
      resetChannelSelection();
    }
  });

  const handleCancel = () => {
    setIsSubmitted(false);
    resetChannelSelection();
    handleClose();
  };

  useEffect(() => {
    if (gatewayCallback || memberPayment || upiVendorGateway) {
      setOrderId(orderIdParam || "");

      // For member payment or UPI vendor gateway route, set checkout details from URL params
      if (memberPayment || upiVendorGateway) {
        setCheckoutDetails({
          amount: "",
          orderId: orderIdParam || "",
          userId: "",
          userEmail: "",
          userMobileNumber: "",
          integrationId: "",
          environment: environmentParam || "",
          userName: "",
        });
      }
    }
  }, [
    gatewayCallback,
    memberPayment,
    upiVendorGateway,
    orderIdParam,
    environmentParam,
    setCheckoutDetails,
  ]);

  useEffect(() => {
    return () => {
      resetChannelSelection();
    };
  }, []);

  // Check if UPI vendor gateway is enabled when checkout page loads
  useEffect(() => {
    const checkUPIVendorGateway = async () => {
      if (
        !integrationId ||
        gatewayCallback ||
        memberPayment ||
        upiVendorGateway
      ) {
        setIsCheckingUPIVendorGateway(false);
        return;
      }

      try {
        const response = await APIs.getMerchantBasicDetails(integrationId);
        if (!response.isError && response.data?.data?.enableUpiVendorGateway) {
          setIsUPIVendorGatewayEnabled(true);
          // Auto-trigger UPI channel selection if enabled
          // Use same-tab redirect to avoid popup blockers
          if (
            channels.includes("upi") &&
            checkoutDetails.orderId &&
            checkoutDetails.integrationId &&
            !isSubmitted &&
            !orderId
          ) {
            handleChannelSelect("upi", true); // true = redirect in same tab
          }
        } else {
          setIsUPIVendorGatewayEnabled(false);
        }
      } catch (error) {
        setIsUPIVendorGatewayEnabled(false);
      } finally {
        setIsCheckingUPIVendorGateway(false);
      }
    };

    // Only check after initial loading is complete
    if (!initialLoading && integrationId) {
      checkUPIVendorGateway();
    }
  }, [
    integrationId,
    initialLoading,
    channels,
    checkoutDetails.orderId,
    checkoutDetails.integrationId,
    isSubmitted,
    orderId,
    gatewayCallback,
    memberPayment,
    upiVendorGateway,
    handleChannelSelect,
  ]);

  if (showTestPage && !isSubmitted && !orderId) {
    return (
      <TestPage handlePaymentMethodSelect={handleSandboxPaymentMethodSelect} />
    );
  }

  // For UPI vendor gateway, show the page directly if we have orderId from URL (skip channel selection)
  if (upiVendorGateway && orderIdParam && !isSubmitted && !gatewayPageOpen) {
    const environment =
      environmentParam || checkoutDetails?.environment || "live";
    return (
      <UPIVendorGatewayPage
        orderId={orderIdParam}
        handleReceiptUploaded={handleReceiptUploaded}
        environment={environment}
        status={status}
      />
    );
  }

  if (orderId && !isSubmitted && !gatewayPageOpen) {
    if (paymentMethodType === "MEMBER") {
      const environment =
        environmentParam || checkoutDetails?.environment || "live";
      return (
        <MemberChannelPage
          orderId={orderId}
          handleReceiptUploaded={handleReceiptUploaded}
          environment={environment}
          status={status}
        />
      );
    }

    if (paymentMethodType === "GATEWAY") {
      return (
        <GatewayPaymentPage
          orderId={orderId}
          paymentLink={url}
          openInRegisteredWebsite={false}
        />
      );
    }
  }

  if (isSubmitted) {
    return <PaymentStatusDisplay status={status} />;
  }

  if (initialLoading || isCheckingUPIVendorGateway) {
    return (
      <LoadingState
        title="Loading..."
        message="Please wait while we load your payment options."
      />
    );
  }

  if (checkoutError || paymentError) {
    return (
      <ErrorState
        error={checkoutError || paymentError || "An error occurred"}
      />
    );
  }

  if (gatewayPageOpen) {
    return (
      <GeneralGatewayPaymentPage
        url={url}
        tabRef={newTabRef}
        setTabRefChanged={setTabRefChanged}
        checkoutDetails={checkoutDetails}
        channelType={channel?.toLowerCase()}
      />
    );
  }

  // Don't show checkout page with channel selection for UPI vendor gateway
  if (upiVendorGateway) {
    // If we reach here and don't have orderId, show loading
    return (
      <LoadingState
        title="Loading..."
        message="Please wait while we load your payment options."
      />
    );
  }

  // If UPI vendor gateway is enabled, show verifying text instead of channel cards
  if (isUPIVendorGatewayEnabled && !isSubmitted && !orderId) {
    return (
      <Flex justify={"center"} h={"100dvh"}>
        <Paper
          style={{
            position: "relative",
            borderRadius: "20px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e9ecef",
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
            width: "100%",
            maxWidth: "500px",
            margin: "0 auto",
          }}
          p={"xl"}
          id="kg-payment-page"
        >
          <Flex
            direction={"column"}
            justify={"center"}
            align={"center"}
            h={"100%"}
          >
            <Title order={4} mb="md">
              Verifying your payment. Please wait.
            </Title>
            <Text ta={"center"} size="sm" mb={"lg"} c="gray.7">
              Don't close this window until your payment is not verified.
            </Text>
            <Loader size="lg" />
          </Flex>
        </Paper>
      </Flex>
    );
  }

  return (
    <Flex justify={"center"} h={"100dvh"}>
      <Paper
        style={{
          position: "relative",
          borderRadius: "20px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e9ecef",
          background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
          width: "100%",
          maxWidth: "500px",
          margin: "0 auto",
        }}
        p={"xl"}
        id="kg-payment-page"
      >
        <Flex direction={"column"} justify={"space-between"} h={"100%"}>
          <div>
            <Center mb={"xl"}>
              <Title
                order={2}
                fw={700}
                c={"#A85706"}
                style={{
                  textShadow: "0 2px 4px rgba(34, 139, 230, 0.1)",
                }}
              >
                Checkout
              </Title>
            </Center>

            <PaymentAmount amount={checkoutDetails.amount} />

            <PaymentMethodsList
              channels={channels}
              onChannelSelect={handleChannelSelect}
            />

            <Button
              w={"100%"}
              size="md"
              onClick={handleCancel}
              variant="subtle"
              mt={"xl"}
              style={{
                borderRadius: "12px",
                background: "linear-gradient(135deg, #A85706 0%, #8c4605 100%)",
                color: "white",
                border: "none",
                fontWeight: 600,
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(34, 139, 230, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 25px rgba(34, 139, 230, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(34, 139, 230, 0.3)";
              }}
            >
              Cancel
            </Button>
          </div>
        </Flex>
      </Paper>
    </Flex>
  );
};

export default PaymentPage;
