import { HiOutlineHome } from "react-icons/hi2";
import { TbUsers } from "react-icons/tb";
import { FiShoppingBag } from "react-icons/fi";
import { RxFileText } from "react-icons/rx";
import { BiMoneyWithdraw } from "react-icons/bi";
import { PiLifebuoy } from "react-icons/pi";
import { VscFeedback } from "react-icons/vsc";

export const DASHBOARD_MAIN_NAV = [
  {
    title: "Home",
    url: "/",
    icon: HiOutlineHome,
  },
  {
    title: "Customers",
    url: "/customers",
    icon: TbUsers,
  },
  {
    title: "Items",
    url: "/items",
    icon: FiShoppingBag,
  },
  {
    title: "Invoices",
    url: "/invoices",
    icon: RxFileText,
  },
  {
    title: "Payments Received",
    url: "/payments-received",
    icon: BiMoneyWithdraw,
  },
];
export const DASHBOARD_SECONDARY_NAV = [
  {
    title: "Support",
    url: "/support",
    icon: PiLifebuoy,
  },
  {
    title: "Feedback",
    url: "/feedback",
    icon: VscFeedback,
  },
];
