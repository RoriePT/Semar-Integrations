import {
  FaAddressCard,
  FaChartPie,
  FaClipboardList,
  FaFolderMinus,
  FaFolderPlus,
  FaGift,
  FaRegNewspaper,
  FaUsers,
} from "react-icons/fa";
import { GrOverview } from "react-icons/gr";
import { MdEdit } from "react-icons/md";
import { RiFolderUploadFill } from "react-icons/ri";

const memberRoutes = [
  {
    label: "Overview",
    route: "member/overview",
    children: [],
    haveIcon: true,
    icon: GrOverview,
  },
  {
    label: "Bulletin Board",
    route: "member/bulletin-board",
    children: [],
    haveIcon: true,
    icon: FaRegNewspaper,
  },
  {
    label: "My Payin Orders",
    route: "member/my-payins",
    children: [],
    haveIcon: true,
    icon: FaFolderPlus,
  },
  {
    label: "My Payout Orders",
    route: "member/my-payouts",
    children: [],
    haveIcon: true,
    icon: FaFolderMinus,
  },
  {
    label: "My Top ups",
    route: "member/my-topups",
    children: [],
    haveIcon: true,
    icon: RiFolderUploadFill,
  },
  {
    label: "Referral Codes",
    route: "member/referral-codes",
    haveIcon: true,
    icon: FaGift,
    children: [],
  },
  {
    label: "My Commissions",
    route: "member/my-commissions",
    children: [],
    haveIcon: true,
    icon: FaChartPie,
  },
  {
    label: "Fund Record Management",
    route: "member/fund-record-management",
    children: [],
    haveIcon: true,
    icon: FaClipboardList,
  },
  {
    label: "My Team",
    route: "member/my-team",
    children: [],
    haveIcon: true,
    icon: FaUsers,
  },
  {
    label: "My Account",
    route: "member/my-account",
    children: [],
    haveIcon: true,
    icon: FaAddressCard,
  },
];

export default memberRoutes;
