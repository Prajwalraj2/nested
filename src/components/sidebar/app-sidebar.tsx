'use client';

import { ChevronUp, User2, Loader2 } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { SidebarDomain } from './SidebarDomain'
import { PageSidebar } from './PageSidebar'
import { useSidebarData } from '@/hooks/useSidebarData'
import { usePageSidebarData } from '@/hooks/usePageSidebarData'

export default function AppSidebar() {
  const {
    data,
    loading,
    error,
    toggleDomain,
    togglePage,
    isDomainExpanded,
    isPageExpanded,
    isCurrentPage,
    isPageOrDescendantCurrent,
    isDomainCurrent
  } = useSidebarData();

  const { sidebarMode } = usePageSidebarData();

  return (
    <Sidebar side="left" collapsible="offcanvas" variant="floating">
        {/* Header */}
        {/* <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <span className="font-semibold">Navigation</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader> */}

        {/* Content - Conditionally render based on sidebar mode */}
        {sidebarMode === 'domain' ? (
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Domains</SidebarGroupLabel>
              <SidebarGroupContent>

                  {/* Loading */}
                {loading && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="px-2 py-4 text-sm text-destructive">
                    Error loading navigation: {error}
                  </div>
                )}

                {/* Data with category spacing */}
                {data && data.domains && (
                  <SidebarMenu>
                    {data.domains.map((domain, index) => {
                      // Check if this is the first domain of a new category
                      const prevDomain = index > 0 ? data.domains[index - 1] : null;
                      const isNewCategory = !prevDomain || 
                        (prevDomain.categoryId !== domain.categoryId) ||
                        (prevDomain.columnPosition !== domain.columnPosition);
                      
                      return (
                        <div key={domain.id}>
                          {/* Add spacing between categories */}
                          {isNewCategory && index > 0 && (
                            <div className="h-4" />
                          )}
                          
                          <SidebarDomain
                            domain={domain}
                            isExpanded={isDomainExpanded(domain.id)}
                            isCurrent={isDomainCurrent(domain)}
                            onToggle={() => toggleDomain(domain.id)}
                            onPageToggle={togglePage}
                            isPageExpanded={isPageExpanded}
                            isCurrentPage={isCurrentPage}
                            isPageOrDescendantCurrent={isPageOrDescendantCurrent}
                          />
                        </div>
                      );
                    })}
                  </SidebarMenu>
                )}

                {/* No data */}
                {data && data.domains && data.domains.length === 0 && (
                  <div className="px-2 py-4 text-sm text-muted-foreground">
                    No domains available
                  </div>
                )}
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        ) : (
          <PageSidebar />
        )}


        {/* Footer */}
        {/* <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> User
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem>
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter> */}
    </Sidebar>
  )
}