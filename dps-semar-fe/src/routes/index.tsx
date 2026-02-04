import { createBrowserRouter } from "react-router-dom";

import PageTitleHandler from "../components/PageTitleHandler";
import AboutUs from "../pages/AboutUs/index.tsx";
import Dashboard from "../pages/Dashboard";
import PrivacyPolicy from "../pages/PrivacyPolicy/index.tsx";
import SignInForm from "../pages/SignIn";
import SignUpForm from "../pages/SignUp/index.tsx";
import TermsAndConditions from "../pages/TermsAndConditions/index.tsx";
import AdminDashboardRoutes from "./AdminDashboardRoutes.tsx";
import AgentDashboardRoutes from "./AgentDashboardRoutes.tsx";
import MemberDashboardRoutes from "./MemberDashboardRoutes.tsx";
import MerchantDashboardRoutes from "./MerchantDashboardRoutes.tsx";
import UpiVendorDashboardRoutes from "./UpiVendorDashboardRoutes.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PageTitleHandler />,
    children: [
      {
        index: true,
        element: <SignInForm />,
      },
      {
        path: "sign-in",
        element: <SignInForm />,
      },
      {
        path: "sign-up",
        element: <SignUpForm />,
      },
      {
        path: "about-us",
        element: <AboutUs />,
      },
      {
        path: "privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "terms-and-conditions",
        element: <TermsAndConditions />,
      },
      {
        path: "admin",
        element: <Dashboard userRole="ADMIN" />,
        children: AdminDashboardRoutes,
      },
      {
        path: "member",
        element: <Dashboard userRole="MEMBER" />,
        children: MemberDashboardRoutes,
      },
      {
        path: "agent",
        element: <Dashboard userRole="AGENT" />,
        children: AgentDashboardRoutes,
      },
      {
        path: "merchant",
        element: <Dashboard userRole="MERCHANT" />,
        children: MerchantDashboardRoutes,
      },
      {
        path: "upi-vendor",
        element: <Dashboard userRole="UPI_VENDOR" />,
        children: UpiVendorDashboardRoutes,
      },
    ],
  },
]);

export { router };
