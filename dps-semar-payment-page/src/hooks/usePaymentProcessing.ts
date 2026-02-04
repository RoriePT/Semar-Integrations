import { useState } from "react";
import { CheckoutDetails } from "../types/payment";
import { API_ENDPOINTS } from "../utils/constants";

export const usePaymentProcessing = (
  checkoutDetails: CheckoutDetails,
  setIsSubmitted?: (value: boolean) => void,
  setOrderId?: (value: string) => void
) => {
  // Poll the backend to get the actual orderId
  const pollForOrderId = async (
    merchantOrderId: string,
    integrationId: string,
    maxAttempts = 30
  ) => {
    let attempts = 0;

    const poll = async (): Promise<string | null> => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}${
            API_ENDPOINTS.MERCHANT_ORDER_ID
          }/${merchantOrderId}?integrationId=${integrationId}`
        );
        const data = await response.json();

        if (data.orderId && data.orderId !== "") {
          return data.orderId;
        }

        attempts++;
        if (attempts >= maxAttempts) {
          return null; // Timeout after 30 attempts (60 seconds)
        }

        // Wait 2 seconds before next attempt
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return poll();
      } catch (error) {
        console.error("Error polling for orderId:", error);
        attempts++;
        if (attempts >= maxAttempts) {
          return null;
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return poll();
      }
    };

    return poll();
  };
  const [channelSelected, setChannelSelected] = useState(false);
  const [channel, setChannel] = useState("");
  const [showTestPage, setShowTestPage] = useState(false);
  const [error, setError] = useState("");

  const handleChannelSelect = async (channel: string, redirectInSameTab: boolean = false) => {
    if (setIsSubmitted) setIsSubmitted(true);
    setChannel(channel);

    const channelMap = {
      upi: "UPI",
      netbanking: "NET_BANKING",
      "e-wallet": "E_WALLET",
    };

    if (checkoutDetails.environment === "sandbox") {
      setShowTestPage(true);
    } else {

      const paymentPayload = {
        amount: checkoutDetails.amount,
        orderId: checkoutDetails.orderId,
        userId: checkoutDetails.userId,
        integrationId: checkoutDetails.integrationId,
        environment: checkoutDetails.environment,
        channel: channelMap[channel],
        userName: checkoutDetails.userName,
        userEmail: checkoutDetails?.userEmail,
        userMobileNumber: checkoutDetails?.userMobileNumber,
      };

      const encodedPayload = encodeURIComponent(JSON.stringify(paymentPayload));
      const orderCreationUrl = `${
        import.meta.env.VITE_API_BASE_URL
      }/payment-system/create-payment-order-sdk?payload=${encodedPayload}&source=sdk&timestamp=${Date.now()}`;

      // For UPI vendor gateway, redirect in same tab to avoid popup blockers
      if (redirectInSameTab) {
        window.location.href = orderCreationUrl;
        return; // Don't poll for orderId as we're redirecting
      }

      // Open new tab first
      const newTab = window.open(orderCreationUrl, "_blank");

      if (!newTab) {
        window.parent.postMessage(
          { type: "kg-open-url", url: orderCreationUrl },
          "*"
        );
      }

      const actualOrderId = await pollForOrderId(
        checkoutDetails.orderId,
        checkoutDetails.integrationId
      );

      if (actualOrderId && setOrderId) {
        setOrderId(actualOrderId);
      }
    }
  };

  const handleSandboxPaymentMethodSelect = async () => {
    if (setIsSubmitted) setIsSubmitted(true);

    const channelMap = {
      upi: "UPI",
      netbanking: "NET_BANKING",
      "e-wallet": "E_WALLET",
    };

    const paymentPayload = {
      amount: checkoutDetails.amount,
      orderId: checkoutDetails.orderId,
      userId: checkoutDetails.userId,
      integrationId: checkoutDetails.integrationId,
      environment: checkoutDetails.environment,
      channel: channelMap[channel],
      userName: checkoutDetails.userName,
      userEmail: checkoutDetails?.userEmail,
      userMobileNumber: checkoutDetails?.userMobileNumber,
    };

    const encodedPayload = encodeURIComponent(JSON.stringify(paymentPayload));
    const orderCreationUrl = `${
      import.meta.env.VITE_API_BASE_URL
    }/payment-system/create-payment-order-sdk?payload=${encodedPayload}&source=sdk&timestamp=${Date.now()}`;

    // Open new tab first
    const newTab = window.open(orderCreationUrl, "_blank");

    if (!newTab) {
      window.parent.postMessage(
        { type: "kg-open-url", url: orderCreationUrl },
        "*"
      );
    }

    const actualOrderId = await pollForOrderId(
      checkoutDetails.orderId,
      checkoutDetails.integrationId
    );

    if (actualOrderId && setOrderId) {
      setOrderId(actualOrderId);
    }
  };

  const resetPaymentState = () => {
    setChannelSelected(false);
    setChannel("");
    setShowTestPage(false);
    setError("");
  };

  const resetChannelSelection = () => {
    setChannelSelected(false);
    setChannel("");
  };

  return {
    channelSelected,
    channel,
    showTestPage,
    error,
    setError,
    handleChannelSelect,
    handleSandboxPaymentMethodSelect,
    resetPaymentState,
    resetChannelSelection,
  };
};
