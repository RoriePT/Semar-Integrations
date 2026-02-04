import MyAccount from "../pages/Dashboard/pages/UpiVendor/MyAccount";
import Payins from "../pages/Dashboard/pages/UpiVendor/MyOrders/Payins";
import MyUpiIds from "../pages/Dashboard/pages/UpiVendor/MyUpiIds";
import Overview from "../pages/Dashboard/pages/UpiVendor/Overview";
import BulletinBoard from "../pages/Dashboard/pages/UpiVendor/BulletinBoard";
import SettlementOrders from "../pages/Dashboard/pages/UpiVendor/SettlementOrders";
import FundRecordManagement from "../pages/Dashboard/pages/UpiVendor/FundRecordManagement";
import NotFound from "../pages/NotFound";

const UpiVendorDashboardRoutes = [
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
    path: "my-upi-ids",
    element: <MyUpiIds />,
  },
  {
    path: "settlement-orders",
    element: <SettlementOrders />,
  },
  {
    path: "fund-record-management",
    element: <FundRecordManagement />,
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

export default UpiVendorDashboardRoutes;
