import { FaAddressCard, FaFolderPlus, FaQrcode, FaRegNewspaper, FaMoneyCheckAlt, FaClipboardList } from "react-icons/fa";
import { GrOverview } from "react-icons/gr";

const upiVendorRoutes = [
  {
    label: "Overview",
    route: "upi-vendor/overview",
    children: [],
    haveIcon: true,
    icon: GrOverview,
  },
  {
    label: "Bulletin Board",
    route: "upi-vendor/bulletin-board",
    children: [],
    haveIcon: true,
    icon: FaRegNewspaper,
  },
  {
    label: "Payin History",
    route: "upi-vendor/my-payins",
    children: [],
    haveIcon: true,
    icon: FaFolderPlus,
  },
  {
    label: "My UPI IDs",
    route: "upi-vendor/my-upi-ids",
    children: [],
    haveIcon: true,
    icon: FaQrcode,
  },
  {
    label: "Settlement Orders",
    route: "upi-vendor/settlement-orders",
    children: [],
    haveIcon: true,
    icon: FaMoneyCheckAlt,
  },
  {
    label: "Fund Records",
    route: "upi-vendor/fund-record-management",
    children: [],
    haveIcon: true,
    icon: FaClipboardList,
  },
  {
    label: "My Account",
    route: "upi-vendor/my-account",
    children: [],
    haveIcon: true,
    icon: FaAddressCard,
  },
];

export default upiVendorRoutes;
