import { IconType } from "react-icons/lib";
import adminRoutes from "./adminRoutes";
import agentRoutes from "./agentRoutes";
import memberRoutes from "./memberRoutes";
import merchantRoutes from "./merchantRoutes";
import upiVendorRoutes from "./upiVendorRoutes";

interface RouteChild {
  label: string;
  route: string | null;
  children: RouteChild[];
  haveIcon?: boolean;
  icon?: IconType;
}

interface DashboardRoutes {
  [key: string]: RouteChild[];
}

const dashboardRoutes: DashboardRoutes = {
  ADMIN: adminRoutes,
  MEMBER: memberRoutes,
  MERCHANT: merchantRoutes,
  UPI_VENDOR: upiVendorRoutes,
  SUB_MERCHANT: [
    {
      label: "Overview",
      route: "merchant/overview",
      children: [],
    },
    {
      label: "My Account",
      route: "merchant/my-account",
      children: [],
    },
  ],
  AGENT: agentRoutes,
};

export default dashboardRoutes;
