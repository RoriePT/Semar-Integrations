import { useEffect } from "react";

function GatewayPaymentPage({
  orderId,
  paymentLink,
  openInRegisteredWebsite = false,
}) {
  const registeredWebsiteLink = "https://mobimerch.in/payments-script";

  useEffect(() => {
    if (paymentLink && orderId) {
      const finalUrl = openInRegisteredWebsite
        ? registeredWebsiteLink
        : paymentLink;

      window.open(finalUrl, "_blank", "noopener,noreferrer");
    }
  }, [orderId, paymentLink, openInRegisteredWebsite]);

  return null;
}

export default GatewayPaymentPage;
