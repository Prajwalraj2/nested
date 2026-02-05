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
import { useSidebarDataFromContext, usePageSidebarDataFromContext } from '@/contexts/PageContextProvider'

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
  } = useSidebarDataFromContext();

  const { sidebarMode } = usePageSidebarDataFromContext();

  return (
    <Sidebar side="left" collapsible="offcanvas" variant="floating">
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
    </Sidebar>
  )
}
