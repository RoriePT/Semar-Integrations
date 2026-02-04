import AdminManagement from "../pages/Dashboard/pages/Admin/AdminManagement/index.tsx";
import MerchantManagement from "../pages/Dashboard/pages/Admin/MerchantManagement/index.tsx";

import AgentManagement from "../pages/Dashboard/pages/Admin/AgentManagement/index.tsx";
import Channels from "../pages/Dashboard/pages/Admin/Channels/index.tsx";
import CommissionsAndProfits from "../pages/Dashboard/pages/Admin/CommissionsAndProfits/index.tsx";
import EndUsers from "../pages/Dashboard/pages/Admin/EndUsers/index.tsx";
import FundRecordManagement from "../pages/Dashboard/pages/Admin/FundRecordManagement/index.tsx";
import Gateways from "../pages/Dashboard/pages/Admin/Gateways/index.tsx";
import MemberManagement from "../pages/Dashboard/pages/Admin/MemberManagement/index.tsx";
import MyAccount from "../pages/Dashboard/pages/Admin/MyAccount/index.tsx";
import Payins from "../pages/Dashboard/pages/Admin/OrderManagement/Payins/index.tsx";
import Payouts from "../pages/Dashboard/pages/Admin/OrderManagement/Payouts/index.tsx";
import TopUpOrders from "../pages/Dashboard/pages/Admin/OrderManagement/TopUpOrders/index.tsx";
import WithdrawalOrders from "../pages/Dashboard/pages/Admin/OrderManagement/WithdrawalOrders/index.tsx";
import SettlementOrders from "../pages/Dashboard/pages/Admin/OrderManagement/SettlementOrders/index.tsx";
import OrganisationManagement from "../pages/Dashboard/pages/Admin/OrganisationManagement/index.tsx";
import Overview from "../pages/Dashboard/pages/Admin/Overview/index.tsx";
import SystemConfig from "../pages/Dashboard/pages/Admin/SystemConfig/index.tsx";
import TeamManagement from "../pages/Dashboard/pages/Admin/TeamManagement/index.tsx";
import UpiVendorManagement from "../pages/Dashboard/pages/Admin/UpiVendorManagement/index.tsx";
import NotFound from "../pages/NotFound/index.tsx";
import PayinOrder from "../pages/OrderDetails/PayinOrder/index.tsx";
import PayoutOrder from "../pages/OrderDetails/PayoutOrder/index.tsx";

const AdminDashboardRoutes = [
  {
    path: "overview",
    element: <Overview />,
  },
  {
    path: "payins",
    element: <Payins />,
  },
  {
    path: "payouts",
    element: <Payouts />,
  },
  {
    path: "admin-management",
    element: <AdminManagement />,
  },
  {
    path: "merchant-management",
    element: <MerchantManagement />,
  },
  {
    path: "teams",
    element: <TeamManagement />,
  },
  {
    path: "organisations",
    element: <OrganisationManagement />,
  },
  {
    path: "member-management",
    element: <MemberManagement />,
  },
  {
    path: "agent-management",
    element: <AgentManagement />,
  },
  {
    path: "upi-vendor-management",
    element: <UpiVendorManagement />,
  },
  {
    path: "fund-record-management",
    element: <FundRecordManagement />,
  },
  {
    path: "channels",
    element: <Channels />,
  },
  {
    path: "gateways",
    element: <Gateways />,
  },
  {
    path: "withdrawal-orders",
    element: <WithdrawalOrders />,
  },
  {
    path: "topup-orders",
    element: <TopUpOrders />,
  },
  {
    path: "settlement-orders",
    element: <SettlementOrders />,
  },
  {
    path: "commissions-and-profits",
    element: <CommissionsAndProfits />,
  },
  {
    path: "end-users",
    element: <EndUsers />,
  },
  {
    path: "system-config",
    element: <SystemConfig />,
  },
  {
    path: "my-account",
    element: <MyAccount />,
  },
  {
    path: "payin-order/:id",
    element: <PayinOrder />,
  },
  {
    path: "payout-order/:id",
    element: <PayoutOrder />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default AdminDashboardRoutes;
