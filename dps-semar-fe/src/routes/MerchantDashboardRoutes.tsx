import FundRecordManagement from "../pages/Dashboard/pages/Merchant/FundRecordManagement";
import Integration from "../pages/Dashboard/pages/Merchant/Integration";
import MyAccount from "../pages/Dashboard/pages/Merchant/MyAccount";
import MyWithdrawals from "../pages/Dashboard/pages/Merchant/MyWithdrawals";
import Overview from "../pages/Dashboard/pages/Merchant/Overview";

import PayinOrders from "../pages/Dashboard/pages/Merchant/PayinOrders";
import PayoutOrders from "../pages/Dashboard/pages/Merchant/PayoutOrders";
import SubAccounts from "../pages/Dashboard/pages/Merchant/SubAccounts";
import NotFound from "../pages/NotFound";
import PayinOrder from "../pages/OrderDetails/PayinOrder";
import PayoutOrder from "../pages/OrderDetails/PayoutOrder";

const MerchantDashboardRoutes = [
  {
    path: "overview",
    element: <Overview />,
  },
  {
    path: "payins",
    element: <PayinOrders />,
  },
  {
    path: "payouts",
    element: <PayoutOrders />,
  },
  {
    path: "sub-accounts",
    element: <SubAccounts />,
  },
  {
    path: "my-account",
    element: <MyAccount />,
  },
  {
    path: "my-withdrawals",
    element: <MyWithdrawals />,
  },
  {
    path: "integration",
    element: <Integration />,
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
    path: "*",
    element: <NotFound />,
  },
];

export default MerchantDashboardRoutes;
