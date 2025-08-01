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
    url: "/app",
    icon: HiOutlineHome,
  },
  {
    title: "Clients",
    url: "/app/clients",
    icon: TbUsers,
  },
  {
    title: "Items",
    url: "/app/items",
    icon: FiShoppingBag,
  },
  {
    title: "Invoices",
    url: "/app/invoices",
    icon: RxFileText,
  },
  {
    title: "Payments Received",
    url: "/app/payments-received",
    icon: BiMoneyWithdraw,
  },
];
export const DASHBOARD_SECONDARY_NAV = [
  {
    title: "Support",
    url: "/app/support",
    icon: PiLifebuoy,
  },
  {
    title: "Feedback",
    url: "/app/feedback",
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

export const DUE_DATE_PRESETS = [
  {
    value: "net_15",
    label: "Net 15",
    description: "Payment due in 15 days",
  },
  {
    value: "net_30",
    label: "Net 30",
    description: "Payment due in 30 days",
  },
  {
    value: "net_45",
    label: "Net 45",
    description: "Payment due in 45 days",
  },
  {
    value: "net_60",
    label: "Net 60",
    description: "Payment due in 60 days",
  },
  {
    value: "due_on_receipt",
    label: "Due on Receipt",
    description: "Payment due immediately upon receipt",
  },
  {
    value: "due_end_of_month",
    label: "Due End of Month",
    description: "Payment due at the end of current month",
  },
  {
    value: "due_end_of_next_month",
    label: "Due End of Next Month",
    description: "Payment due at the end of next month",
  },
  {
    value: "custom",
    label: "Custom Date",
    description: "Choose a specific due date",
  },
];

export const INVOICES_CHART_DATA = {
  months: [
    { month: "January", sent: 186, paid: 80 },
    { month: "February", sent: 142, paid: 95 },
    { month: "March", sent: 168, paid: 120 },
    { month: "April", sent: 195, paid: 140 },
    { month: "May", sent: 220, paid: 165 },
    { month: "June", sent: 205, paid: 185 },
    { month: "July", sent: 240, paid: 200 },
    { month: "August", sent: 215, paid: 175 },
    { month: "September", sent: 185, paid: 160 },
    { month: "October", sent: 225, paid: 190 },
    { month: "November", sent: 210, paid: 180 },
    { month: "December", sent: 195, paid: 170 },
  ],

  weeks: [
    { week: "Week 1", sent: 52, paid: 35 },
    { week: "Week 2", sent: 48, paid: 28 },
    { week: "Week 3", sent: 55, paid: 42 },
    { week: "Week 4", sent: 61, paid: 38 },
  ],

  days: [
    { day: "Monday", sent: 15, paid: 8 },
    { day: "Tuesday", sent: 12, paid: 9 },
    { day: "Wednesday", sent: 18, paid: 11 },
    { day: "Thursday", sent: 14, paid: 7 },
    { day: "Friday", sent: 16, paid: 12 },
    { day: "Saturday", sent: 8, paid: 5 },
    { day: "Sunday", sent: 6, paid: 3 },
  ],
};

export const FAQ_DATA = [
  {
    question: "How quickly can I create my first invoice?",
    answer:
      "You can create and send your first professional invoice in under 2 minutes. Simply choose a template, add your client details and services, and hit send. No setup required.",
  },
  {
    question: "What payment methods can my clients use?",
    answer:
      "Invox supports all major payment methods including credit cards, debit cards, bank transfers, and popular digital wallets. Your clients can pay however they prefer.",
  },
  {
    question: "Do you charge transaction fees?",
    answer:
      "We keep our pricing transparent with no hidden fees. Standard payment processing rates apply (2.9% + 30¢ for card payments), but there are no additional transaction fees from Invox.",
  },
  {
    question: "Can I track which invoices have been viewed or paid?",
    answer:
      "Absolutely. You'll receive real-time notifications when clients view your invoices, and our dashboard shows the status of all your invoices at a glance - draft, sent, viewed, or paid.",
  },
  {
    question: "Is there a free trial available?",
    answer:
      "Yes! You can start with our free plan that includes up to 5 invoices per month. No credit card required to get started, and you can upgrade anytime as your business grows.",
  },
];

export const NAVIGATION_LINKS = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/about",
    label: "About",
  },
  {
    href: "/#testimonials",
    label: "Testimonials",
  },
  {
    href: "/contact",
    label: "Contact",
  },
];
