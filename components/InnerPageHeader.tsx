"use client";

import ExternalNavMenu from "@/components/ExternalNavMenu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface PageHeaderProps {
  title: string;
  description: string;
}

interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrentPage?: boolean;
}

function InnerPageHeader({ title, description }: PageHeaderProps) {
  const pathname = usePathname();

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = pathname
      .split("/")
      .filter((segment) => segment !== "");
    const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", href: "/" }];

    let currentPath = "";
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Convert segment to readable label
      const label = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      if (index === pathSegments.length - 1) {
        // Last segment (current page)
        breadcrumbs.push({ label, href: currentPath, isCurrentPage: true });
      } else {
        breadcrumbs.push({ label, href: currentPath });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <section className="min-h-[300px] grid grid-rows-[80px_1fr] w-full bg-cover bg-center bg-[url('/assets/bg-scaled.webp')]">
      <ExternalNavMenu />
      <div className="row-start-2 lg:my-20 my-10  flex flex-col gap-6 sm:gap-8 items-center justify-center px-5 lg:px-0">
        <div className="flex flex-col gap-4 sm:gap-6 items-center text-center max-w-4xl mx-auto w-full">
          {/* Dynamic Breadcrumbs */}
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.href} className="flex items-center">
                  <BreadcrumbItem>
                    {crumb.isCurrentPage ? (
                      <BreadcrumbPage className="text-gray-900 font-medium">
                        {crumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link
                          href={crumb.href}
                          className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
                        >
                          {crumb.label}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && (
                    <BreadcrumbSeparator className="text-gray-500" />
                  )}
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>

          {/* Dynamic Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-center leading-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent drop-shadow-sm">
            {title}
          </h1>

          {/* Dynamic Description */}
          <p className="text-base sm:text-lg lg:text-xl text-gray-700 max-w-[600px] text-center leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}

export default InnerPageHeader;
