'use client';

import Link from "next/link"
import { useBreadcrumbDataFromContext } from "@/contexts/PageContextProvider"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function BreadcrumbDemo() {
  const { data, loading, error } = useBreadcrumbDataFromContext();

  // Don't render anything if no breadcrumbs or loading
  if (loading || error || data.items.length === 0) {
    return null;
  }

  // If we don't need to collapse, render all items normally
  if (!data.shouldCollapse) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          {data.items.map((item, index) => (
            <div key={item.url} className="flex items-center">
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {index === data.items.length - 1 ? (
                  // Last item is current page (not clickable)
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  // All other items are clickable links
                  <BreadcrumbLink asChild>
                    <Link href={item.url}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // Render collapsed version: First > ... > Last
  const { visibleItems } = data;
  if (!visibleItems) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* First item (Domains) */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={visibleItems.first.url}>{visibleItems.first.label}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* Separator */}
        <BreadcrumbSeparator />

        {/* Collapsed items dropdown */}
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 cursor-pointer">
              <BreadcrumbEllipsis className="size-4" />
              <span className="sr-only">Show more breadcrumbs</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {visibleItems.collapsed.map((item) => (
                <DropdownMenuItem key={item.url} asChild className="cursor-pointer">
                  <Link href={item.url}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>

        {/* Separator */}
        <BreadcrumbSeparator />

        {/* Last item (Current page) */}
        <BreadcrumbItem>
          <BreadcrumbPage>{visibleItems.last.label}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
