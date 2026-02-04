import { useEffect, useRef, useState } from "react";

import usePaymentStatusPolling from "./usePaymentStatusPolling";
import useWindowMessage from "./useWindowMessage";
import APIs from "../services/api";

import { CheckoutDetails } from "../types/payment";

export const usePaymentStatus = (checkoutDetails: CheckoutDetails, environmentParam: string, setIsOpened?: (value: boolean) => void, isMemberPaymentPage?: boolean) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [gatewayPageOpen, setGatewayPageOpen] = useState(false);
  const [url] = useState("");
  const [paymentMethodType] = useState<"GATEWAY" | "MEMBER">("MEMBER");
  const newTabRef = useRef<Window>();
  const [tabRefChanged, setTabRefChanged] = useState(false);

  const {
    status,
    setPaymentOrderId,
    setStatus,
    redirectUrl,
    paymentOrderId,
    handleReset,
  } = usePaymentStatusPolling({
    environment: checkoutDetails?.environment || environmentParam,
  });
 
  const getOrderDetails = async (orderId: string) => {
    if (!orderId) return;

    const data = await APIs.getOrderDetails(
      orderId,
      checkoutDetails.environment
    );

    if (data.isError) {
      console.error('Error getting order details:', data.error);
      return null;
    }

    const result = {
      orderId: data.data?.orderId,
      kingsgateOrderId: data.data?.kingsgateOrderId,
      status: data.data?.status,
      user: {
        id: data.data?.user?.id,
        name: data.data?.user?.name,
      },
      transactionId: data.data?.transactionDetails?.id,
      amount: data.data?.transactionDetails?.amount,
      paymentMethod: data.data?.transactionDetails?.paymentMethod,
      transactionTime: data.data?.transactionDetails?.time,
    };

    return result;
  };

  const handleCallbacks = async () => {
    if (redirectUrl) window.location.href = redirectUrl;

    if (status === "SUCCESS") {
      if (newTabRef?.current) newTabRef?.current?.close();
      setIsSubmitted(true);

      // For member payment page, don't call handleClose() - just show success message
      if (isMemberPaymentPage) {
        // Stop polling by setting status to prevent further API calls
        // Success message will be shown by the component
        return;
      }

      const result = await getOrderDetails(paymentOrderId);

      setTimeout(() => {
        handleClose();

        window.parent.postMessage(
          { type: "payment-success", details: result },
          "*"
        );
      }, 3000);
    }

    if (status === "SUBMITTED") {
      if (newTabRef?.current) newTabRef?.current?.close();
      setIsSubmitted(true);

      // For member payment page or UPI vendor gateway, don't call handleClose() - just show submitted message
      if (isMemberPaymentPage) {
        // Stop polling by setting status to prevent further API calls
        // Submitted message will be shown by the component
        return;
      }

      const result = await getOrderDetails(paymentOrderId);

      setTimeout(() => {
        handleClose();

        window.parent.postMessage(
          { type: "payment-submitted", details: result },
          "*"
        );
      }, 3000);
    }

    if (status === "FAILED") {
      if (newTabRef?.current) newTabRef?.current?.close();
      setIsSubmitted(true);

      const result = await getOrderDetails(paymentOrderId);

      setTimeout(() => {
        handleClose();
        window.parent.postMessage(
          { type: "payment-failure", details: result },
          "*"
        );
      }, 3000);
    }
  };

  const handleClose = () => {
    window.parent.postMessage(
      { type: "cancelled", orderId: checkoutDetails.orderId },
      "*"
    );
    if (setIsOpened) {
      setIsOpened(false);
    }
  };

  const handleReceiptUploaded = async (txnId: string) => {
    await APIs.submitPayment(
      orderId,
      txnId,
      checkoutDetails.environment || environmentParam
    );
    setIsSubmitted(true);
    setPaymentOrderId(orderId);
  };

  useWindowMessage(async (data) => {
    if (data.type === "callback") {
      setIsSubmitted(true);
      setOrderId(data.orderId);
      setPaymentOrderId(data.orderId); // Start polling with this orderId
    }

    if (data.type === "checkout") {
      setOrderId("");
    }

    if (data.type === "test-submit") {
      setIsSubmitted(true);
      setTimeout(() => {
        setStatus(data.status);
      }, 5000);
      window.focus();
    }
  });

  useEffect(() => {
    handleCallbacks();
  }, [status]);

  useEffect(() => {
    handleReset();
    setIsSubmitted(false);
    setStatus("PENDING");
    setOrderId("");
  }, []);

  useEffect(() => {
    if (newTabRef?.current) {
      setIsSubmitted(true);
      setGatewayPageOpen(false);
    }
  }, [newTabRef?.current, tabRefChanged]);

  useEffect(() => {
    if (orderId && orderId !== "") {
      setPaymentOrderId(orderId);
    }
  }, [orderId]);

  return {
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
  };
}; 