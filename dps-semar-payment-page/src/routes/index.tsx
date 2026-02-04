import { createBrowserRouter } from "react-router-dom";

import PaymentPage from "../components/CheckoutPage/index.tsx";

const router = createBrowserRouter([
  {
    path: "/checkout/:integrationId",
    element: <PaymentPage />,
  },
  {
    path: "/gateway-callback",
    element: <PaymentPage gatewayCallback={true} />,
  },
  {
    path: "/payment/:orderId",
    element: <PaymentPage memberPayment={true} />,
  },
  {
    path: "/upi-vendor-gateway/:orderId",
    element: <PaymentPage upiVendorGateway={true} />,
  },
]);

export { router };
