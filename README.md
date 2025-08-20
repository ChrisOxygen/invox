# 🧾 Invox - Professional Invoice Management System

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.8.2-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.8-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)

> A comprehensive, modern invoice management system built with Next.js 15, featuring beautiful UI, PDF generation, and advanced business analytics.

## ✨ Features

### 🎯 **Core Invoice Management**

- **Professional Invoice Creation** - Multiple templates with theme support (Classic, Modern, Elegant, Bold)
- **Real-time PDF Generation** - High-quality PDF export with exact template matching using React-PDF
- **Advanced Item Management** - Dynamic item addition with quantity, pricing, and total calculations
- **Smart Auto-save** - Real-time form state management with visual save indicators
- **Multi-status Workflow** - Draft → Sent → Paid status progression with proper tracking

### 👥 **Client & Business Management**

- **Comprehensive Client Profiles** - Contact management with business details and address information
- **Business Setup Wizard** - Guided onboarding with business profile, payment methods, and branding
- **Payment Gateway Integration** - Support for PayPal, Wise, Bank Transfer, and Nigerian Bank accounts
- **Brand Customization** - Logo upload, signature management, and custom business information

### 📊 **Advanced Analytics Dashboard**

- **Real-time Metrics** - Revenue tracking, invoice status distribution, and client growth analytics
- **Interactive Charts** - Bar charts for revenue trends and radial charts for status visualization
- **Growth Indicators** - Month-over-month comparisons with trend analysis (UP/DOWN/FLAT)
- **Comprehensive Statistics** - Total revenue, paid/pending invoices, client counts with percentage changes

### 🔐 **Authentication & Security**

- **NextAuth.js Integration** - Secure authentication with multiple providers
- **Role-based Access** - User-specific data isolation and business profile management
- **Session Management** - Persistent login with automatic session refresh

### 🎨 **Design System Excellence**

- **Em-based Scaling** - Perfect zoom functionality with proportional scaling across all components
- **Radix UI Components** - Professional component library with accessibility-first design
- **Advanced Animations** - Smooth transitions, loading states, and micro-interactions
- **Responsive Design** - Mobile-first approach with breakpoint-specific optimizations

### 🔄 **State Management & Performance**

- **TanStack Query** - Sophisticated caching, background updates, and optimistic updates
- **React Hook Form** - Performant form handling with Zod validation
- **Context Architecture** - Feature-based state management with proper separation of concerns
- **Error Boundaries** - Graceful error handling with user-friendly fallbacks

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- MongoDB database (local or cloud)
- Cloudinary account (for image uploads)

### Installation

```bash
# Clone the repository
git clone https://github.com/ChrisOxygen/invox.git
cd invox

# Install dependencies
npm install

# Environment setup
cp .env.example .env.local

# Configure your environment variables
# DATABASE_URL=your_mongodb_connection_string
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=your_secret_key
# CLOUDINARY_CLOUD_NAME=your_cloudinary_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret

# Set up the database
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application running.

## 🏗️ Architecture

### **Project Structure**

```
invox/
├── app/                          # Next.js 15 App Router
│   ├── (external routes)/        # Public pages (auth, landing)
│   ├── app/                      # Protected dashboard routes
│   ├── api/                      # API routes and auth configuration
│   └── globals.css               # Global styles with CSS custom properties
├── components/                   # Reusable UI components
│   ├── ui/                       # Radix UI wrapper components
│   └── toast-templates/          # Custom notification system
├── features/                     # Feature-based modular architecture
│   ├── auth/                     # Authentication logic and components
│   ├── business/                 # Business profile management
│   ├── clients/                  # Client management system
│   ├── dashboard/                # Analytics and dashboard components
│   ├── invoice/                  # Invoice creation and management
│   ├── items/                    # Item/product management
│   ├── onboarding/              # User onboarding flow
│   └── payments/                # Payment method management
├── hooks/                       # Global custom hooks
├── lib/                         # Utility libraries and configurations
├── prisma/                      # Database schema and client
├── shared/                      # Shared types, validators, and utilities
└── types/                       # TypeScript type definitions
```

### **Technology Stack**

#### **Frontend**

- **Next.js 15** - React framework with App Router and Server Components
- **TypeScript** - Type-safe development with strict type checking
- **TailwindCSS 4.1** - Utility-first CSS framework with custom design system
- **Radix UI** - Unstyled, accessible component primitives
- **React Hook Form** - Performant forms with built-in validation
- **TanStack Query** - Powerful data synchronization and caching
- **React PDF** - Client-side PDF generation with template matching

#### **Backend & Database**

- **Prisma ORM** - Type-safe database client with MongoDB support
- **MongoDB** - NoSQL database for flexible data modeling
- **NextAuth.js** - Complete authentication solution
- **Cloudinary** - Image and file upload management

#### **Developer Experience**

- **ESLint** - Code linting with Next.js recommended rules
- **TypeScript 5** - Latest TypeScript features and improvements
- **Zod** - Runtime type validation and schema parsing

## 📖 Key Features Deep Dive

### **Invoice Templates & PDF Generation**

The application features a sophisticated PDF generation system that creates pixel-perfect documents matching the web interface:

- **Template Engine** - Multiple professional templates with theme support
- **React-PDF Integration** - Server-side PDF generation with exact styling
- **Multi-page Support** - Automatic page breaks for large item lists
- **Brand Integration** - Logo, signature, and business information embedding

### **Advanced Dashboard Analytics**

Comprehensive business intelligence with real-time metrics:

- **Revenue Analytics** - Monthly trends, growth percentages, and YoY comparisons
- **Invoice Distribution** - Status-based breakdowns with visual representations
- **Client Growth Tracking** - New client acquisition and retention metrics
- **Interactive Visualizations** - Charts using Recharts with responsive design

### **Scalable Design System**

Enterprise-grade UI architecture:

- **Em-based Scaling** - Perfect zoom functionality maintaining proportions
- **Component Composition** - Radix UI primitives with custom styling
- **Data Attributes** - Consistent theming with `data-slot` patterns
- **Responsive Breakpoints** - Mobile-first with progressive enhancement

### **Onboarding Experience**

Guided setup process for new users:

- **8-Step Wizard** - Progressive disclosure of configuration options
- **Business Profile Setup** - Complete business information collection
- **Payment Method Configuration** - Multiple gateway support with validation
- **Brand Customization** - Logo upload and signature capture

## 🔧 Development

### **Running in Development**

```bash
# Start development server with hot reload
npm run dev

# Run type checking
npm run type-check

# Lint code
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

### **Database Operations**

```bash
# Generate Prisma client after schema changes
npx prisma generate

# Push schema changes to database
npx prisma db push

# Open Prisma Studio for data management
npx prisma studio

# Reset database (development only)
npx prisma db push --force-reset
```

### **Key Development Commands**

```bash
# Add new dependencies
npm install [package-name]

# Update all dependencies
npm update

# Clean install (remove node_modules and reinstall)
rm -rf node_modules package-lock.json
npm install
```

## 🎨 Design System

### **Color Themes**

- **Classic** - Professional blue and gray palette
- **Modern** - Contemporary slate and cyan combination
- **Elegant** - Sophisticated purple and violet tones
- **Bold** - High-contrast orange and amber scheme

### **Typography Scale**

- Responsive font sizing using `clamp()` functions
- Em-based scaling for perfect zoom behavior
- Font weights from 400 (normal) to 700 (bold)

### **Component Architecture**

All UI components follow consistent patterns:

- Radix UI primitives for accessibility
- Compound component design for flexibility
- Data attributes for styling hooks
- Forward ref patterns for DOM access

## 🚀 Deployment

### **Environment Variables**

Required environment variables for production:

```env
# Database
DATABASE_URL=mongodb://your_mongodb_url

# Authentication
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your_production_secret

# File Upload
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### **Build Process**

```bash
# Production build
npm run build

# Test production build locally
npm run start

# Deploy to your hosting platform
# (Vercel, Netlify, AWS, etc.)
```

## 📄 API Documentation

### **Authentication Endpoints**

- `POST /api/auth/signin` - User authentication
- `POST /api/auth/signout` - User logout
- `GET /api/auth/session` - Session information

### **Invoice Management**

- `GET /api/invoices` - List user invoices
- `POST /api/invoices` - Create new invoice
- `PUT /api/invoices/[id]` - Update invoice
- `DELETE /api/invoices/[id]` - Delete invoice

### **Client Management**

- `GET /api/clients` - List user clients
- `POST /api/clients` - Create new client
- `PUT /api/clients/[id]` - Update client
- `DELETE /api/clients/[id]` - Delete client

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Radix UI** - For exceptional component primitives
- **Vercel** - For Next.js framework and deployment platform
- **Prisma** - For the excellent database toolkit
- **TailwindCSS** - For the utility-first CSS framework
- **React PDF** - For client-side PDF generation capabilities

---

<div align="center">
  <p>Built with ❤️ by <strong>ChrisOxygen</strong></p>
  <p>
    <a href="https://github.com/ChrisOxygen/invox/issues">Report Bug</a> •
    <a href="https://github.com/ChrisOxygen/invox/issues">Request Feature</a> •
    <a href="https://github.com/ChrisOxygen/invox/discussions">Discussions</a>
  </p>
</div>
