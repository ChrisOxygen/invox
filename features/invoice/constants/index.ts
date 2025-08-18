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

export const DUMMY_SENT_INVOICE = {
  id: "64f8a1b2c3d4e5f6a7b8c9d0",
  invoiceNumber: "INV-2024-001",
  invoiceDate: "2024-08-01T00:00:00.000Z",
  paymentDueDate: "2024-09-01T00:00:00.000Z",

  subtotal: 17500.0,
  tax: 1750.0,
  taxType: "PERCENTAGE",
  discount: 500.0,
  discountType: "FIXED",
  total: 18750.0,

  invoiceItems: [
    {
      name: "Website Design Consultation",
      description: "Initial consultation and planning",
      quantity: 1,
      unitPrice: 500.0,
    },
    {
      name: "Logo Design",
      description: "Custom logo design with 3 revisions",
      quantity: 1,
      unitPrice: 750.0,
    },
    {
      name: "Homepage Development",
      description: "Responsive homepage design and development",
      quantity: 1,
      unitPrice: 800.0,
    },
    {
      name: "About Page Development",
      description: "Custom about page with team section",
      quantity: 1,
      unitPrice: 400.0,
    },
    {
      name: "Services Page Development",
      description: "Dynamic services showcase page",
      quantity: 1,
      unitPrice: 450.0,
    },
    {
      name: "Contact Page Development",
      description: "Contact form with validation",
      quantity: 1,
      unitPrice: 350.0,
    },
    {
      name: "Blog Setup",
      description: "Blog system setup and configuration",
      quantity: 1,
      unitPrice: 600.0,
    },
    {
      name: "SEO Optimization",
      description: "On-page SEO optimization",
      quantity: 5,
      unitPrice: 150.0,
    },
    {
      name: "Content Management System",
      description: "CMS integration and training",
      quantity: 1,
      unitPrice: 900.0,
    },
    {
      name: "Mobile Responsiveness",
      description: "Mobile-first design implementation",
      quantity: 1,
      unitPrice: 550.0,
    },
    {
      name: "Social Media Integration",
      description: "Social media widgets and links",
      quantity: 3,
      unitPrice: 100.0,
    },
    {
      name: "Google Analytics Setup",
      description: "Analytics configuration and reporting",
      quantity: 1,
      unitPrice: 200.0,
    },
    {
      name: "Security Configuration",
      description: "SSL and security hardening",
      quantity: 1,
      unitPrice: 300.0,
    },
    {
      name: "Performance Optimization",
      description: "Speed and performance improvements",
      quantity: 2,
      unitPrice: 250.0,
    },
    {
      name: "Database Design",
      description: "Custom database schema design",
      quantity: 1,
      unitPrice: 700.0,
    },
    {
      name: "User Authentication",
      description: "Login and registration system",
      quantity: 1,
      unitPrice: 800.0,
    },
    {
      name: "Payment Gateway Integration",
      description: "PayPal and Stripe integration",
      quantity: 1,
      unitPrice: 650.0,
    },
    {
      name: "Email Newsletter Setup",
      description: "Mailchimp integration and templates",
      quantity: 1,
      unitPrice: 300.0,
    },
    {
      name: "Backup System",
      description: "Automated backup configuration",
      quantity: 1,
      unitPrice: 200.0,
    },
    {
      name: "Documentation",
      description: "User manual and technical documentation",
      quantity: 1,
      unitPrice: 400.0,
    },
    {
      name: "Testing and QA",
      description: "Comprehensive testing across devices",
      quantity: 8,
      unitPrice: 75.0,
    },
    {
      name: "Domain Setup",
      description: "Domain registration and DNS configuration",
      quantity: 1,
      unitPrice: 150.0,
    },
    {
      name: "Hosting Configuration",
      description: "Web hosting setup and optimization",
      quantity: 1,
      unitPrice: 250.0,
    },
    {
      name: "Content Writing",
      description: "Professional copywriting services",
      quantity: 10,
      unitPrice: 80.0,
    },
    {
      name: "Image Optimization",
      description: "Image compression and formatting",
      quantity: 50,
      unitPrice: 5.0,
    },
    {
      name: "Font Selection",
      description: "Custom font selection and licensing",
      quantity: 3,
      unitPrice: 100.0,
    },
    {
      name: "Color Scheme Design",
      description: "Brand-consistent color palette",
      quantity: 1,
      unitPrice: 200.0,
    },
    {
      name: "Navigation Menu Design",
      description: "Intuitive navigation structure",
      quantity: 1,
      unitPrice: 300.0,
    },
    {
      name: "Footer Design",
      description: "Custom footer with company information",
      quantity: 1,
      unitPrice: 150.0,
    },
    {
      name: "Cookie Policy Setup",
      description: "GDPR-compliant cookie management",
      quantity: 1,
      unitPrice: 200.0,
    },
    {
      name: "Terms of Service Page",
      description: "Legal pages and privacy policy",
      quantity: 1,
      unitPrice: 250.0,
    },
    {
      name: "Site Map Generation",
      description: "XML sitemap for search engines",
      quantity: 1,
      unitPrice: 100.0,
    },
    {
      name: "Meta Tags Optimization",
      description: "SEO meta tags for all pages",
      quantity: 15,
      unitPrice: 25.0,
    },
    {
      name: "Training Session",
      description: "CMS training for content management",
      quantity: 2,
      unitPrice: 150.0,
    },
    {
      name: "Post-Launch Support",
      description: "30-day support and maintenance",
      quantity: 1,
      unitPrice: 500.0,
    },
  ],

  paymentAccountId: "64f8a1b2c3d4e5f6a7b8c9d1",
  paymentAccount: {
    id: "64f8a1b2c3d4e5f6a7b8c9d1",
    userId: "64f8a1b2c3d4e5f6a7b8c9d2",
    gatewayType: "PAYPAL",
    accountName: "Business PayPal Account",
    accountData: {
      email: "business@techsolutions.com",
      merchantId: "PAYPAL123456789",
    },
    isActive: true,
    isDefault: true,
    createdAt: "2024-01-15T10:00:00.000Z",
    updatedAt: "2024-08-01T10:00:00.000Z",
  },

  status: "SENT",
  isFavorite: false,

  businessId: "64f8a1b2c3d4e5f6a7b8c9d3",
  business: {
    id: "64f8a1b2c3d4e5f6a7b8c9d3",
    businessName: "TechSolutions Pro",
    businessType: "web_development",
    email: "contact@techsolutions.com",
    userId: "64f8a1b2c3d4e5f6a7b8c9d2",
    addressLine1: "123 Innovation Drive",
    addressLine2: "Suite 500",
    city: "San Francisco",
    state: "California",
    zipCode: "94105",
    phone: "+1 (555) 123-4567",
    logo: "/assets/techsolutions-logo.png",
    user: {
      id: "64f8a1b2c3d4e5f6a7b8c9d2",
      name: "Michael Rodriguez",
      email: "michael@techsolutions.com",
      emailVerified: true,
      hashedPassword: "$2a$12$hashedpasswordexample",
      image: "/assets/michael-avatar.jpg",
      country: "US",
      currency: "USD",
      signature: "/assets/michael-signature.png",
      onboardingCompleted: true,
      createdAt: "2023-12-01T00:00:00.000Z",
      updatedAt: "2024-08-01T00:00:00.000Z",
    },
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-08-01T00:00:00.000Z",
  },

  clientId: "64f8a1b2c3d4e5f6a7b8c9d4",
  client: {
    id: "64f8a1b2c3d4e5f6a7b8c9d4",
    BusinessName: "Retail Dynamics LLC",
    contactPersonName: "Sarah Johnson",
    address: "456 Commerce Street, New York, NY 10001",
    email: "sarah.johnson@retaildynamics.com",
    userId: "64f8a1b2c3d4e5f6a7b8c9d2",
    createdAt: "2024-02-01T00:00:00.000Z",
    updatedAt: "2024-08-01T00:00:00.000Z",
  },

  customNote:
    "Thank you for choosing TechSolutions Pro for your web development needs. We look forward to a successful partnership.",
  lateFeeTerms: "2% per month after 30 days from due date",

  sentAt: "2024-08-01T09:30:00.000Z",
  paidAt: null,

  createdAt: "2024-07-15T14:20:00.000Z",
  updatedAt: "2024-08-01T09:30:00.000Z",
};

export const COLOR_THEMES = {
  classic: {
    primary: "#000000", // Black
    primaryLight: "#333333", // Dark gray
    secondary: "#666666", // Medium gray
    background: "#ffffff", // White
    text: "#000000", // Black
    textLight: "#666666", // Medium gray
    border: "#cccccc", // Light gray
    accent: "#f8f9fa", // Very light gray
  },
  navy: {
    primary: "#1e3a8a", // Navy blue
    primaryLight: "#3b82f6", // Lighter blue
    secondary: "#64748b", // Slate gray
    background: "#ffffff", // White
    text: "#1e293b", // Dark slate
    textLight: "#64748b", // Slate gray
    border: "#cbd5e1", // Light slate
    accent: "#f1f5f9", // Very light slate
  },
  forest: {
    primary: "#166534", // Forest green
    primaryLight: "#22c55e", // Lighter green
    secondary: "#6b7280", // Cool gray
    background: "#ffffff", // White
    text: "#1f2937", // Dark gray
    textLight: "#6b7280", // Cool gray
    border: "#d1d5db", // Light gray
    accent: "#f9fafb", // Very light gray
  },
  burgundy: {
    primary: "#7c2d12", // Burgundy
    primaryLight: "#dc2626", // Lighter red
    secondary: "#78716c", // Warm gray
    background: "#ffffff", // White
    text: "#292524", // Dark warm gray
    textLight: "#78716c", // Warm gray
    border: "#d6d3d1", // Light warm gray
    accent: "#fafaf9", // Very light warm gray
  },
} as const;
