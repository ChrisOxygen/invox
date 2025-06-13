import { FiFileText, FiLayout } from "react-icons/fi";
import { LuPalette } from "react-icons/lu";

// Constants for the invoice feature
export const INVOICE_STATUS = {
  DRAFT: "draft",
  SENT: "sent",
  PAID: "paid",
};
export const INVOICE_PAYMENT_METHODS = {
  BANK_TRANSFER: "bank_transfer",
  CREDIT_CARD: "credit_card",
  PAYPAL: "paypal",
};

// dummy data for invoices
// Invoice dummy data for a freelance agency
export const INVOICE_DUMMY_DATA = {
  // Invoice details
  invoice: {
    number: "#INV-2024-001",
    date: "2024-06-15",
    dueDate: "2024-07-15",
  },

  // Agency (from) details
  agency: {
    name: "Creative Digital Studio",
    address: "456 Innovation Street, Design District, NYC 10001",
    phone: "0809989877",
    email: "info@creativedigitalstudio.com",
    website: "www.creativedigitalstudio.com",
    // Payment details
    payment: {
      accountNumber: "12234566",
      accountName: "Creative Digital Studio LLC",
      bankName: "Chase Bank NYC",
    },
  },

  // Client (to) details
  client: {
    name: "TechStart Solutions",
    contactPerson: "Sarah Johnson",
    address: "789 Business Plaza, Suite 200, Manhattan, NY 10005",
    email: "sarah@techstartsolutions.com",
    phone: "+1 (555) 123-4567",
  },

  // Services provided
  services: [
    {
      id: 1,
      description: "Brand Identity Design & Logo Creation",
      price: 1500.0,
      quantity: 1,
      total: 1500.0,
    },
    {
      id: 2,
      description: "Website Design & Development (Responsive)",
      price: 3500.0,
      quantity: 1,
      total: 3500.0,
    },
    {
      id: 3,
      description: "Social Media Graphics Package (10 posts)",
      price: 80.0,
      quantity: 10,
      total: 800.0,
    },
    {
      id: 4,
      description: "SEO Optimization & Content Strategy",
      price: 1200.0,
      quantity: 1,
      total: 1200.0,
    },
    {
      id: 5,
      description: "Digital Marketing Campaign Setup",
      price: 950.0,
      quantity: 1,
      total: 950.0,
    },
  ],

  // Financial calculations
  financial: {
    subtotal: 7950.0,
    taxRate: 8.25, // 8.25% tax
    taxAmount: 655.88,
    total: 8605.88,
  },

  // Terms and additional info
  terms: {
    message: "Thank you for choosing Creative Digital Studio for your project!",
    conditions:
      "Payment is due within 30 days. Late payments may incur a 1.5% monthly service charge.",
    notes:
      "This invoice covers the complete digital transformation package as outlined in our project agreement dated May 15, 2024.",
  },
};

export const INVOICE_TABS = [
  {
    title: "Details",
    icon: FiFileText,
  },
  {
    title: "Layout",
    icon: FiLayout,
  },
  {
    title: "Theme",
    icon: LuPalette,
  },
];

export const DUMMY_CLIENTS = [
  {
    id: "670a1b2c3d4e5f6789012345",
    BusinessName: "TechStart Solutions",
    contactPersonName: "Sarah Johnson",
    address: "789 Business Plaza, Suite 200, Manhattan, NY 10005",
    email: "sarah@techstartsolutions.com",
  },
  {
    id: "670a1b2c3d4e5f6789012346",
    BusinessName: "Digital Marketing Pro",
    contactPersonName: "Michael Chen",
    address: "456 Innovation Drive, Austin, TX 78701",
    email: "michael@digitalmarketingpro.com",
  },
  {
    id: "670a1b2c3d4e5f6789012347",
    BusinessName: "Creative Studios LLC",
    contactPersonName: "Emma Rodriguez",
    address: "123 Design Street, Los Angeles, CA 90210",
    email: "emma@creativestudios.com",
  },
  {
    id: "670a1b2c3d4e5f6789012348",
    BusinessName: "E-Commerce Plus",
    contactPersonName: "David Thompson",
    address: "321 Commerce Avenue, Miami, FL 33101",
    email: "david@ecommerceplus.com",
  },
  {
    id: "670a1b2c3d4e5f6789012349",
    BusinessName: "Consulting Partners",
    contactPersonName: "Lisa Wang",
    email: "lisa@consultingpartners.com",
  },
  {
    id: "670a1b2c3d4e5f678901234a",
    BusinessName: "Mobile App Innovations",
    contactPersonName: "James Wilson",
    email: "james@mobileappinnovations.com",
  },
  {
    id: "670a1b2c3d4e5f678901234b",
    BusinessName: "Healthcare Solutions Inc",
    address: "234 Medical Center Drive, Boston, MA 02101",
    email: "amanda@healthcaresolutions.com",
  },
  {
    id: "670a1b2c3d4e5f678901234c",
    BusinessName: "Green Energy Co",
    contactPersonName: "Robert Martinez",
    address: "678 Renewable Road, Denver, CO 80202",
    email: "robert@greenergyco.com",
  },
  {
    id: "670a1b2c3d4e5f678901234d",
    BusinessName: "Food & Beverage Distributors",
    contactPersonName: "Jennifer Lee",
    address: "135 Distribution Way, Atlanta, GA 30303",
    email: "jennifer@foodbevdist.com",
  },
  {
    id: "670a1b2c3d4e5f678901234e",
    BusinessName: "Real Estate Ventures",
    address: "789 Property Plaza, Seattle, WA 98101",
    email: "christopher@realestateventures.com",
  },
];
