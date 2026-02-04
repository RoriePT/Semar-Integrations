import { useEffect, useState } from "react";

import APIs from "../services/api";

import { PaymentStatusResponse } from "../types/payment";

const usePaymentStatusPolling = ({ environment, interval = 2000 }) => {
  const [status, setStatus] = useState<PaymentStatusResponse['status']>("PENDING");
  const [isPolling, setIsPolling] = useState(true);
  const [orderId, setPaymentOrderId] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");

  const handleReset = () => {
    setStatus("PENDING");
    setIsPolling(true);
    setPaymentOrderId("");
  };

  const fetchPaymentStatus = async () => {
    try {
      const response = await APIs.fetchPaymentStatus(orderId, environment);
      
      const status = response.data?.status || response.status;
      
      if (status === "SUCCESS" || status === "FAILED" || status === "SUBMITTED") {
        setStatus(status);
        setRedirectUrl(response.data?.redirectUrl || "");
        setIsPolling(false);
      }
    } catch (err) {
      setIsPolling(false);
    }
  };

  useEffect(() => {
    if (isPolling && orderId) {
      const intervalId = setInterval(() => {
        fetchPaymentStatus();
      }, interval);

      return () => clearInterval(intervalId);
    }
  }, [orderId, interval, isPolling]);

  return {
    status,
    setPaymentOrderId,
    setStatus,
    paymentOrderId: orderId,
    handleReset,
    redirectUrl,
  };
};

export default usePaymentStatusPolling;
