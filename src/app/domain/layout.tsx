import { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "@/components/sidebar/app-sidebar"
import BreadcrumbDemo from "@/components/bread/bread"
import { Separator } from "@/components/ui/separator"
import AppHeader from "@/components/header/AppHeader";
import { PageContextProvider } from "@/contexts/PageContextProvider";

export default function DomainLayout({ children }: { children: ReactNode }) {
  return (
    // ============================================
    // NEW: PageContextProvider wraps everything
    // This provides unified data to all navigation components
    // (header, sidebar, breadcrumb) from a SINGLE API call
    // ============================================
    <PageContextProvider>
      <SidebarProvider>
        <AppSidebar />
        <main>
          <div className="flex items-center gap-2 p-4 m-4 border rounded-lg bg-background z-10">
          <SidebarTrigger className="text-4xl text-gray-500 hover:text-gray-700 cursor-pointer"/>
          <Separator  
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          <BreadcrumbDemo />
          </div>
          {/* <AppHeader /> */}
          {children}
        </main>
      </SidebarProvider>
    </PageContextProvider>
  );
}

// ============================================
// OLD LAYOUT (before API consolidation)
// ============================================
// Previously, each component made its own API call:
// - AppHeader → /api/header-domains
// - AppSidebar → /api/sidebar + /api/page-sidebar
// - BreadcrumbDemo → /api/breadcrumb
//
// Total: 4 API calls per page load
//
// Now with PageContextProvider:
// - All components share data from ONE /api/page-context call
// - Total: 1 API call per page load
