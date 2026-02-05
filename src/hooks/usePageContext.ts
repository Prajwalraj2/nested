'use client';

/**
 * Unified Page Context Hook
 * 
 * Single hook that provides ALL navigation data:
 * - Header data (for navigation dropdown)
 * - Sidebar data (for domain navigation)
 * - Page sidebar data (for page navigation)
 * - Breadcrumb data (for navigation trail)
 * 
 * This REPLACES 4 separate hooks:
 * - useHeaderData
 * - useSidebarData
 * - usePageSidebarData
 * - useBreadcrumbData
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { usePathname } from 'next/navigation';

// ============================================
// Types (consolidated from all old hooks)
// ============================================

export type HeaderDomain = {
  id: string;
  name: string;
  slug: string;
  url: string;
};

export type HeaderCategory = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
};

export type HeaderCategoryGroup = {
  category: HeaderCategory;
  domains: HeaderDomain[];
};

export type HeaderData = {
  columnData: { [key: number]: HeaderCategoryGroup[] };
  totalDomains: number;
  totalCategories: number;
};

export type SidebarPage = {
  id: string;
  title: string;
  slug: string;
  contentType: string;
  parentId: string | null;
  order: number;
  url: string;
};

export type SidebarDomain = {
  id: string;
  name: string;
  slug: string;
  pageType: string;
  url: string;
  pages: SidebarPage[];
  categoryId: string | null;
  categoryOrder: number;
  columnPosition: number;
};

export type SidebarCategory = {
  id: string;
  name: string;
  slug: string;
  columnPosition: number;
  categoryOrder: number;
  isActive: boolean;
};

export type SidebarData = {
  domains: SidebarDomain[];
  categories: SidebarCategory[];
};

export type PageSidebarSection = {
  title: string;
  column: number;
  order: number;
  pages: PageSidebarPage[];
};

export type PageSidebarPage = {
  id: string;
  title: string;
  slug: string;
  contentType: string;
  parentId: string | null;
  order: number;
  url: string;
  hasChildren: boolean;
  children: PageSidebarPage[];
};

export type PageSidebarData = {
  type: 'direct_domain' | 'hierarchical_page';
  domain: {
    name: string;
    slug: string;
  };
  page?: {
    name: string;
    slug: string;
  };
  sections: PageSidebarSection[];
};

export type BreadcrumbItem = {
  label: string;
  url: string;
  type: 'root' | 'domain' | 'page';
  contentType?: string;
};

export type BreadcrumbData = {
  items: BreadcrumbItem[];
  shouldCollapse: boolean;
  visibleItems: {
    first: BreadcrumbItem;
    collapsed: BreadcrumbItem[];
    last: BreadcrumbItem;
  } | null;
};

export type PageContextData = {
  header: HeaderData;
  sidebar: SidebarData;
  pageSidebar: PageSidebarData | null;
  breadcrumb: BreadcrumbData;
  currentPage?: {
    id: string;
    title: string;
    contentType: string;
  };
};

export type SidebarMode = 'domain' | 'page';

// ============================================
// Helper Functions
// ============================================

/**
 * Process breadcrumbs to determine collapse behavior
 */
function processBreadcrumbs(items: BreadcrumbItem[]): BreadcrumbData {
  const shouldCollapse = items.length > 3;

  if (!shouldCollapse) {
    return {
      items,
      shouldCollapse: false,
      visibleItems: null
    };
  }

  const first = items[0];
  const last = items[items.length - 1];
  const collapsed = items.slice(1, -1);

  return {
    items,
    shouldCollapse: true,
    visibleItems: { first, collapsed, last }
  };
}

/**
 * Create fallback breadcrumbs when API fails
 */
function createFallbackBreadcrumbs(pathname: string): BreadcrumbData {
  const segments = pathname.split('/').filter(Boolean);
  const items: BreadcrumbItem[] = [];

  items.push({
    label: 'Domains',
    url: '/domain',
    type: 'root'
  });

  if (segments.length >= 2) {
    const domainSlug = segments[1];
    items.push({
      label: formatSlugToTitle(domainSlug),
      url: `/domain/${domainSlug}`,
      type: 'domain'
    });

    let currentPath = `/domain/${domainSlug}`;
    for (let i = 2; i < segments.length; i++) {
      const pageSlug = segments[i];
      currentPath += `/${pageSlug}`;
      
      items.push({
        label: formatSlugToTitle(pageSlug),
        url: currentPath,
        type: 'page'
      });
    }
  }

  return processBreadcrumbs(items);
}

function formatSlugToTitle(slug: string): string {
  return slug
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// ============================================
// Main Hook
// ============================================

export function usePageContext() {
  const pathname = usePathname();
  
  // Combined state
  const [data, setData] = useState<PageContextData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state for sidebars (preserved from old hooks)
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set());
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());

  // Derived sidebar mode
  const sidebarMode = useMemo<SidebarMode>(() => {
    const pathSegments = pathname.split('/').filter(Boolean);
    if (pathSegments.length >= 3 && pathSegments[0] === 'domain') {
      return 'page';
    }
    return 'domain';
  }, [pathname]);

  // Fetch data
  const fetchPageContext = useCallback(async () => {
    // Skip fetch for non-domain paths that don't need full context
    if (!pathname.startsWith('/domain') && pathname !== '/') {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/page-context?path=${encodeURIComponent(pathname)}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch page context');
      }

      // Process breadcrumb data
      const breadcrumbData = processBreadcrumbs(result.breadcrumb?.items || []);

      setData({
        header: result.header || { columnData: { 1: [], 2: [], 3: [] }, totalDomains: 0, totalCategories: 0 },
        sidebar: result.sidebar || { domains: [], categories: [] },
        pageSidebar: result.pageSidebar,
        breadcrumb: breadcrumbData,
        currentPage: result.currentPage,
      });
    } catch (err) {
      console.error('Error fetching page context:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      
      // Set fallback data
      setData({
        header: { columnData: { 1: [], 2: [], 3: [] }, totalDomains: 0, totalCategories: 0 },
        sidebar: { domains: [], categories: [] },
        pageSidebar: null,
        breadcrumb: createFallbackBreadcrumbs(pathname),
        currentPage: undefined,
      });
    } finally {
      setLoading(false);
    }
  }, [pathname]);

  // Fetch on mount and when pathname changes
  useEffect(() => {
    fetchPageContext();
  }, [fetchPageContext]);

  // ============================================
  // Sidebar State Helpers (preserved from useSidebarData)
  // ============================================

  const toggleDomain = useCallback((domainId: string) => {
    setExpandedDomains(prev => {
      const newSet = new Set(prev);
      if (newSet.has(domainId)) {
        newSet.delete(domainId);
      } else {
        newSet.add(domainId);
      }
      return newSet;
    });
  }, []);

  const togglePage = useCallback((pageId: string) => {
    setExpandedPages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pageId)) {
        newSet.delete(pageId);
      } else {
        newSet.add(pageId);
      }
      return newSet;
    });
  }, []);

  const isDomainExpanded = useCallback((domainId: string) => {
    return expandedDomains.has(domainId);
  }, [expandedDomains]);

  const isPageExpanded = useCallback((pageId: string) => {
    return expandedPages.has(pageId);
  }, [expandedPages]);

  const isCurrentPage = useCallback((url: string) => {
    return pathname === url;
  }, [pathname]);

  const isDomainCurrent = useCallback((domain: SidebarDomain): boolean => {
    if (isCurrentPage(domain.url)) return true;
    return domain.pages.some(page => isCurrentPage(page.url));
  }, [isCurrentPage]);

  // ============================================
  // Return Values
  // ============================================

  return {
    // Data
    data,
    loading,
    error,
    pathname,
    sidebarMode,

    // Individual data sections (for backwards compatibility)
    header: data?.header || { columnData: { 1: [], 2: [], 3: [] }, totalDomains: 0, totalCategories: 0 },
    sidebar: data?.sidebar || { domains: [], categories: [] },
    pageSidebar: data?.pageSidebar,
    breadcrumb: data?.breadcrumb || { items: [], shouldCollapse: false, visibleItems: null },
    currentPage: data?.currentPage,

    // Sidebar UI state
    expandedDomains,
    expandedPages,
    
    // Sidebar actions
    toggleDomain,
    togglePage,
    
    // Sidebar helpers
    isDomainExpanded,
    isPageExpanded,
    isCurrentPage,
    isDomainCurrent,
    
    // Refresh function
    refetch: fetchPageContext,
  };
}

// ============================================
// OLD HOOKS THIS REPLACES
// ============================================
//
// 1. useHeaderData
//    - Fetched from /api/header-domains
//    - Returned: columnData, totalDomains, totalCategories
//
// 2. useSidebarData
//    - Fetched from /api/sidebar
//    - Returned: domains, categories, expandedDomains, toggleDomain, etc.
//
// 3. usePageSidebarData
//    - Fetched from /api/page-sidebar
//    - Returned: sidebarMode, pageData, expandedPages, togglePageExpansion, etc.
//
// 4. useBreadcrumbData
//    - Fetched from /api/breadcrumb
//    - Returned: breadcrumbs, shouldCollapse, visibleItems
//
// All these are now combined into a single usePageContext() hook
// that makes ONE API call instead of FOUR.

