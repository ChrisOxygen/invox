"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

function DashboardBreadcrumb() {
  const pathname = usePathname();

  if (!pathname) {
    return null;
  }

  if (pathname === "/dashboard") {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbPage className="text-blue-700 font-semibold">
              Dashboard
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // create array of path segments
  const pathSegments = pathname.split("/").filter((segment) => segment);
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink
            href="/dashboard"
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
          >
            Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>
        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
          return (
            <Fragment key={href}>
              <BreadcrumbSeparator className="hidden md:block text-blue-300" />
              <BreadcrumbItem>
                {index === pathSegments.length - 1 ? (
                  <BreadcrumbPage className="text-blue-700 font-semibold">
                    {segment.charAt(0).toUpperCase() + segment.slice(1)}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={href}
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                  >
                    {segment.charAt(0).toUpperCase() + segment.slice(1)}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default DashboardBreadcrumb;
