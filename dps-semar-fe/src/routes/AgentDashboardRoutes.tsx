import ReferralCodes from "../pages/Dashboard/pages/Agent/ReferralCodes";
import ReferralList from "../pages/Dashboard/pages/Agent/ReferralList";
import MyAccount from "../pages/Dashboard/pages/Agent/MyAccount";
import NotFound from "../pages/NotFound";
import PayinOrder from "../pages/OrderDetails/PayinOrder";
import PayoutOrder from "../pages/OrderDetails/PayoutOrder";
import MyWithdrawals from "../pages/Dashboard/pages/Agent/MyWithdrawals";
import MyCommissions from "../pages/Dashboard/pages/Agent/MyCommissions";
import Overview from "../pages/Dashboard/pages/Agent/Overview";
import FundRecordManagement from "../pages/Dashboard/pages/Agent/FundRecordManagement";
import MyOrganisation from "../pages/Dashboard/pages/Agent/MyOrganisation";

const AgentDashboardRoutes = [
  {
    path: "overview",
    element: <Overview />,
  },
  {
    path: "referral-codes",
    element: <ReferralCodes />,
  },
  {
    path: "referrals",
    element: <ReferralList />,
  },
  {
    path: "my-withdrawals",
    element: <MyWithdrawals />,
  },
  {
    path: "my-commissions",
    element: <MyCommissions />,
  },
  {
    path: "fund-record-management",
    element: <FundRecordManagement />,
  },
  {
    path: "my-organisation",
    element: <MyOrganisation />,
  },
  {
    path: "my-account",
    element: <MyAccount />,
  },

  {
    path: "*",
    element: <NotFound />,
  },
];

export default AgentDashboardRoutes;
