// src/components/domain/SectionBasedLayout.tsx

import Link from 'next/link';

// Types
type Domain = {
  id: string;
  name: string;
  slug: string;
  pageType: string;
};

type Page = {
  id: string;
  title: string;
  slug: string;
  contentType: string;
  sections?: any; // JSON field containing section configuration
};

type ChildPage = {
  id: string;
  title: string;
  slug: string;
  contentType: string;
  parentId: string | null;
};

type Section = {
  title: string;
  column: number;
  order: number;
  pageIds: string[];
};

// Main Section-Based Layout Component
export function SectionBasedLayout({ 
  domain, 
  page, 
  childPages = [] 
}: {
  domain: Domain;
  page?: Page;
  childPages?: ChildPage[];
}) {
  const title = page?.title || domain.name;
  const sections: Section[] = page?.sections || [];
  
  // Organize sections into columns
  const columns = organizeSectionsIntoColumns(sections, childPages, domain);
  
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold mb-2">{title}</h1>
        </div>
      </div>

      {/* Main Content - 3-Column Layout */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {sections.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">
              Sections Coming Soon
            </h3>
            <p className="text-slate-400">
              This page's sections are being configured. Create some pages and organize them into sections.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(columnNumber => (
              <div key={columnNumber} className="space-y-8">
                {columns[columnNumber]?.map((section, index) => (
                  <SectionColumn 
                    key={`${columnNumber}-${index}`}
                    section={section}
                    domain={domain}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Section Column Component
function SectionColumn({ section, domain }: { 
  section: any;
  domain: Domain;
}) {
  return (
    <div className="bg-slate-800/40 rounded-lg border border-slate-700/50 p-6 hover:bg-slate-800/60 hover:border-slate-600/60 transition-all duration-300 shadow-lg hover:shadow-xl">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center">
        <span className="mr-3 text-2xl">📁</span>
        <span className="border-b-2 border-blue-500/60 pb-1">{section.title}</span>
      </h2>
      
      <div className="space-y-3">
        {section.pages.map((page: ChildPage) => (
          <SectionItem 
            key={page.id} 
            page={page}
            domain={domain}
          />
        ))}
      </div>
      
      {section.pages.length === 0 && (
        <div className="text-center py-4 text-slate-500">
          <div className="text-2xl mb-2">📄</div>
          <div className="text-sm">No pages in this section</div>
        </div>
      )}
    </div>
  );
}

// Section Item Component
function SectionItem({ page, domain }: { 
  page: ChildPage;
  domain: Domain;
}) {
  // Build URL based on domain type and page hierarchy
  const buildPageUrl = (page: ChildPage, domain: Domain): string => {
    if (domain.pageType === 'direct') {
      // For direct domains: /domain/slug/page-slug
      return `/domain/${domain.slug}/${page.slug}`;
    } else {
      // For hierarchical domains: we need to build the full path
      // This is a simplified version - in real implementation you'd need to traverse the hierarchy
      return `/domain/${domain.slug}/${page.slug}`;
    }
  };

  const pageUrl = buildPageUrl(page, domain);
  
  // Get icon based on content type
  const getPageIcon = (contentType: string): string => {
    const icons: Record<string, string> = {
      'table': '📊',
      'rich_text': '📝',
      'subcategory_list': '📂',
      'section_based': '📋',
      'narrative': '📄',
      'mixed_content': '🎨'
    };
    return icons[contentType] || '📄';
  };

  return (
    <Link 
      href={pageUrl} 
      className="flex items-center space-x-3 py-3 px-4 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-md transition-all duration-200 group"
    >
      <span className="text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
        {getPageIcon(page.contentType)}
      </span>
      <div className="flex-1">
        <div className="text-sm leading-relaxed group-hover:underline font-medium">
          {page.title}
        </div>
        <div className="text-xs text-slate-500">
          {pageUrl}
        </div>
      </div>
    </Link>
  );
}

// NEW: Organize sections into 3-column layout
function organizeSectionsIntoColumns(
  sections: Section[], 
  childPages: ChildPage[], 
  domain: Domain
): { [key: number]: any[] } {
  const columns: { [key: number]: any[] } = { 1: [], 2: [], 3: [] };
  
  // Process each section
  sections.forEach(section => {
    // Find pages for this section
    const sectionPages = section.pageIds
      .map(pageId => childPages.find(page => page.id === pageId))
      .filter(Boolean) as ChildPage[];
    
    // Add section to appropriate column
    columns[section.column].push({
      title: section.title,
      order: section.order,
      pages: sectionPages
    });
  });
  
  // Sort each column by order
  Object.keys(columns).forEach(col => {
    columns[parseInt(col)].sort((a, b) => a.order - b.order);
  });
  
  return columns;
}
