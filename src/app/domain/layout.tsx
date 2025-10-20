import { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "@/components/sidebar/app-sidebar"
import BreadcrumbDemo from "@/components/bread/bread"
import { Separator } from "@/components/ui/separator"

export default function DomainLayout({ children }: { children: ReactNode }) {
  // Temporary layout while sidebar is being rebuilt
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <div className="flex items-center gap-2 p-4 m-4 border rounded-lg sticky top-2 bg-background z-10">
        <SidebarTrigger className="text-4xl text-gray-500 hover:text-gray-700 cursor-pointer"/>
        <Separator  
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
        <BreadcrumbDemo />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
