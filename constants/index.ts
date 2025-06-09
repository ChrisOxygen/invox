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

export const USER_BUSINESS_TYPES = [
  { value: "freelancer", label: "Freelancer/Creative" },
  { value: "consultant", label: "Consultant" },
  { value: "service-provider", label: "Service Provider" },
  { value: "small-business", label: "Small Business Owner" },
  { value: "agency", label: "Agency" },
  { value: "other", label: "Other Business" },
];

export const AVAILABLE_COUNTRIES = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "ng", label: "Nigeria" },
  { value: "jp", label: "Japan" },
  { value: "other", label: "Other" },
];

export const CURRENCIES = [
  { value: "usd", label: "USD - US Dollar", emoji: "💵" },
  { value: "eur", label: "EUR - Euro", emoji: "💶" },
  { value: "gbp", label: "GBP - British Pound", emoji: "💷" },
  { value: "jpy", label: "JPY - Japanese Yen", emoji: "💴" },
  { value: "cad", label: "CAD - Canadian Dollar", emoji: "🍁" },
  { value: "aud", label: "AUD - Australian Dollar", emoji: "🇦🇺" },
  { value: "ngn", label: "NGN - Nigerian Naira", emoji: "🇳🇬" },
];

export const PAYMENT_METHODS = [
  {
    id: "paypal",
    name: "PayPal",
    description: "PayPal, credit cards",
  },
  {
    id: "bank-transfer",
    name: "Bank Transfer",
    description: "Wire transfer, ACH",
  },
  {
    id: "wise",
    name: "Wise",
    description: "International payments",
  },
  {
    id: "nigerian-bank",
    name: "Nigerian Bank Transfer",
    description: "Local bank transfers",
  },
];
