import TopUp from "../components/Users/Member/Components/TopUp";
import BulletinBoard from "../pages/Dashboard/pages/Member/BulletinBoard";
import FundRecordManagement from "../pages/Dashboard/pages/Member/FundRecordManagement";
import MyAccount from "../pages/Dashboard/pages/Member/MyAccount";
import MyCommissions from "../pages/Dashboard/pages/Member/MyCommissions";
import Payins from "../pages/Dashboard/pages/Member/MyOrders/Payins";
import Payouts from "../pages/Dashboard/pages/Member/MyOrders/Payouts";
import TopUps from "../pages/Dashboard/pages/Member/MyOrders/TopUps";
import MyTeam from "../pages/Dashboard/pages/Member/MyTeam";

import Overview from "../pages/Dashboard/pages/Member/Overview";

import ReferralCodes from "../pages/Dashboard/pages/Member/ReferralCodes";
import ReferralList from "../pages/Dashboard/pages/Member/ReferralList";
import NotFound from "../pages/NotFound";
import PayinOrder from "../pages/OrderDetails/PayinOrder";
import PayoutOrder from "../pages/OrderDetails/PayoutOrder";

const MemberDashboardRoutes = [
  {
    path: "overview",
    element: <Overview />,
  },
  {
    path: "bulletin-board",
    element: <BulletinBoard />,
  },
  {
    path: "my-payins",
    element: <Payins />,
  },
  {
    path: "my-payouts",
    element: <Payouts />,
  },
  {
    path: "my-topups",
    element: <TopUps />,
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
    path: "my-account",
    element: <MyAccount />,
  },
  // {
  //   path: "my-withdrawals",
  //   element: <MyWithdrawals />,
  // },
  {
    path: "my-commissions",
    element: <MyCommissions />,
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
    path: "fund-record-management",
    element: <FundRecordManagement />,
  },
  {
    path: "my-team",
    element: <MyTeam />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default MemberDashboardRoutes;
