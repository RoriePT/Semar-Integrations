import {
  FaAddressCard,
  FaBuilding,
  FaChartPie,
  FaClipboardList,
  FaGift,
} from "react-icons/fa";
import { GrOverview } from "react-icons/gr";
import { MdEdit } from "react-icons/md";
import { PiHandWithdrawFill } from "react-icons/pi";

const agentRoutes = [
  {
    label: "Overview",
    route: "agent/overview",
    children: [],
    haveIcon: true,
    icon: GrOverview,
  },
  // {
  //   label: "Referral Codes",
  //   route: "agent/referral-codes",
  //   children: [],
  //   haveIcon: true,
  //   icon: FaGift,
  // },
  {
    label: "My Withdrawals",
    route: "agent/my-withdrawals",
    children: [],
    haveIcon: true,
    icon: PiHandWithdrawFill,
  },
  {
    label: "My Commissions",
    route: "agent/my-commissions",
    children: [],
    haveIcon: true,
    icon: FaChartPie,
  },
  {
    label: "Fund Record Management",
    route: "agent/fund-record-management",
    children: [],
    haveIcon: true,
    icon: FaClipboardList,
  },
  {
    label: "My Organisation",
    route: "agent/my-organisation",
    children: [],
    haveIcon: true,
    icon: FaBuilding,
  },
  {
    label: "My Account",
    route: "agent/my-account",
    children: [],
    haveIcon: true,
    icon: FaAddressCard,
  },
];

export default agentRoutes;
