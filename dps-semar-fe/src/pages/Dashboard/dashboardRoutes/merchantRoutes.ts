import {
  FaAddressCard,
  FaClipboardList,
  FaCode,
  FaFolderMinus,
  FaFolderPlus,
  FaUsers,
} from "react-icons/fa";
import { GrOverview } from "react-icons/gr";
import { MdEdit } from "react-icons/md";
import { PiHandWithdrawFill } from "react-icons/pi";

const merchantRoutes = [
  {
    label: "Overview",
    route: "merchant/overview",
    children: [],
    haveIcon: true,
    icon: GrOverview,
  },
  {
    label: "My Payin Orders",
    route: "merchant/payins",
    children: [],
    haveIcon: true,
    icon: FaFolderPlus,
  },
  {
    label: "My Payout Orders",
    route: "merchant/payouts",
    children: [],
    haveIcon: true,
    icon: FaFolderMinus,
  },
  {
    label: "Sub Accounts",
    route: "merchant/sub-accounts",
    children: [],
    haveIcon: true,
    icon: FaUsers,
  },
  {
    label: "My Withdrawals",
    route: "merchant/my-withdrawals",
    children: [],
    haveIcon: true,
    icon: PiHandWithdrawFill,
  },
  {
    label: "Integration",
    route: "merchant/integration",
    children: [],
    haveIcon: true,
    icon: FaCode,
  },
  {
    label: "Fund Records",
    route: "merchant/fund-record-management",
    children: [],
    haveIcon: true,
    icon: FaClipboardList,
  },
  {
    label: "My Account",
    route: "merchant/my-account",
    children: [],
    haveIcon: true,
    icon: FaAddressCard,
  },
];

export default merchantRoutes;
