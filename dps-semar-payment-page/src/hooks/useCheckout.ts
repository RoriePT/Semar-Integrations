import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

import APIs from "../services/api";

import { CheckoutDetails } from "../types/payment";

export const useCheckout = () => {
  const { integrationId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const apiMode = queryParams.get("apiMode");
  const orderIdParam = queryParams.get("orderId");
  const environmentParam = queryParams.get("environment");
  const paymentGatewayParam = queryParams.get("paymentGateway");

  const [error, setError] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);
  const [channels, setChannels] = useState([]);
  const [isOpened, setIsOpened] = useState(true);
  const [checkoutDetails, setCheckoutDetails] = useState<CheckoutDetails>({
    amount: "",
    orderId: "",
    userId: "",
    userEmail: "",
    userMobileNumber: "",
    integrationId: "",
    environment: "",
    userName: "",
  });

  const getCheckout = async () => {
    const data = await APIs.fetchCheckout(integrationId);

    if (data.isError) {
      setError(data.error);
    } else {
      const channelMap = {
        UPI: "upi",
        NET_BANKING: "netbanking",
        E_WALLET: "e-wallet",
      };
      const mappedChannels = data.channels?.map(
        (channel) => channelMap[channel] || channel
      ) || [];
      
      setChannels(mappedChannels);
      
      // Set basic checkout details from URL params since API only returns businessName and channels
      const updatedCheckoutDetails = {
        amount: "", // Will be set elsewhere
        orderId: orderIdParam || "",
        userId: "",
        userEmail: "",
        userMobileNumber: "",
        integrationId: integrationId || "",
        environment: environmentParam || "",
        userName: data.businessName || "",
      };
      
      setCheckoutDetails(updatedCheckoutDetails);
    }
    if (!apiMode) {
      setInitialLoading(false);
    }
  };

  const assignPaymentGatewayInApiMode = async () => {
    const redirectUrl = `${import.meta.env.VITE_API_BASE_URL}/payment-system/assign-payment-gateway`;
    
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = redirectUrl;
    
    const fields = {
      integrationId,
      systemOrderId: orderIdParam,
      environment: environmentParam,
      paymentGateway: paymentGatewayParam?.toLowerCase() || '',
    };
    
    Object.entries(fields).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });
    
    document.body.appendChild(form);
    form.submit();
  };

  useEffect(() => {
    getCheckout();
  }, [integrationId]);

  useEffect(() => {
    if (apiMode && orderIdParam) {
      assignPaymentGatewayInApiMode();
    }
  }, [apiMode]);

  return {
    error,
    initialLoading,
    channels,
    checkoutDetails,
    setCheckoutDetails,
    setInitialLoading,
    apiMode,
    orderIdParam,
    environmentParam,
    paymentGatewayParam,
    isOpened,
    setIsOpened,
  };
}; 