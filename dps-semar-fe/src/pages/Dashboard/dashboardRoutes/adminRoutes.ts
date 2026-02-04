import { FaCreditCard, FaUserCog } from "react-icons/fa";
import {
  FaAddressCard,
  FaBuilding,
  FaBuildingUser,
  FaChartPie,
  FaClipboardList,
  FaGear,
  FaUser,
  FaUsers,
} from "react-icons/fa6";
import { GrChannel, GrOverview } from "react-icons/gr";
import { ImUser } from "react-icons/im";
import { IoMdHeadset } from "react-icons/io";
import { MdPayment } from "react-icons/md";

const adminRoutes = [
  {
    label: "Overview",
    route: "admin/overview",
    children: [],
    haveIcon: true,
    icon: GrOverview,
  },
  {
    label: "Order Management",
    route: null,
    haveIcon: true,
    icon: MdPayment,
    children: [
      {
        label: "Payin Orders",
        route: "admin/payins",
        children: [],
        haveIcon: false,
        icon: null,
      },
      {
        label: "Payout Orders",
        route: "admin/payouts",
        children: [],
        haveIcon: false,
        icon: null,
      },
      {
        label: "Withdrawal Orders",
        route: "admin/withdrawal-orders",
        children: [],
        haveIcon: false,
        icon: null,
      },
      {
        label: "Top up Orders",
        route: "admin/topup-orders",
        children: [],
        haveIcon: false,
        icon: null,
      },
      {
        label: "Settlement Orders",
        route: "admin/settlement-orders",
        children: [],
        haveIcon: false,
        icon: null,
      },
    ],
  },
  {
    label: "Merchant Management",
    route: "admin/merchant-management",
    children: [],
    haveIcon: true,
    icon: FaBuildingUser,
  },
  {
    label: "Member Management",
    route: "admin/member-management",
    children: [],
    haveIcon: true,
    icon: FaUser,
  },
  {
    label: "Admin Management",
    route: "admin/admin-management",
    children: [],
    haveIcon: true,
    icon: FaUserCog,
  },
  {
    label: "Agent Management",
    route: "admin/agent-management",
    children: [],
    haveIcon: true,
    icon: IoMdHeadset,
  },
  {
    label: "UPI Vendor Management",
    route: "admin/upi-vendor-management",
    children: [],
    haveIcon: true,
    icon: FaCreditCard,
  },
  {
    label: "End Users",
    route: "admin/end-users",
    children: [],
    haveIcon: true,
    icon: ImUser,
  },
  {
    label: "Fund Record Management",
    route: "admin/fund-record-management",
    children: [],
    haveIcon: true,
    icon: FaClipboardList,
  },
  {
    label: "Channels & Gateways",
    route: null,
    haveIcon: true,
    icon: GrChannel,
    children: [
      {
        label: "Channels",
        route: "admin/channels",
        children: [],
        haveIcon: false,
        icon: null,
      },
      {
        label: "Gateways",
        route: "admin/gateways",
        children: [],
        haveIcon: false,
        icon: null,
      },
    ],
  },
  {
    label: "Team Management",
    route: "admin/teams",
    children: [],
    haveIcon: true,
    icon: FaUsers,
  },
  {
    label: "Organisation Management",
    route: "admin/organisations",
    children: [],
    haveIcon: true,
    icon: FaBuilding,
  },

  {
    label: "System Config",
    route: "admin/system-config",
    children: [],
    haveIcon: true,
    icon: FaGear,
  },
  {
    label: "Commisions and Profits",
    route: "admin/commissions-and-profits",
    children: [],
    haveIcon: true,
    icon: FaChartPie,
  },
  {
    label: "My Account",
    route: "admin/my-account",
    children: [],
    haveIcon: true,
    icon: FaAddressCard,
  },
];

export default adminRoutes;
