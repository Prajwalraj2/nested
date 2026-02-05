// app/domain/page.tsx
// 
// Domain Index Page - Shows all published domains organized by category
// Uses Services Layer for data fetching
// Includes ISR for optimal performance

import Link from 'next/link';
import { getUserCountryFromCookies } from '@/lib/server-country';
import { DomainService, CategoryService, type DomainWithCategory, type CategoryFull } from '@/services';

// ============================================
// ISR Configuration
// ============================================

/** Revalidate page every 60 seconds */
export const revalidate = 60;

/** Force dynamic rendering due to geo-targeting (cookie-based) */
export const dynamic = 'force-dynamic';

// ============================================
// Data Organization Helper
// ============================================

type ColumnData = {
  [key: number]: {
    category: CategoryFull | { name: string; slug: string; icon: string; description: string };
    domains: DomainWithCategory[];
  }[];
};

function organizeDomainsIntoColumns(
  domains: DomainWithCategory[],
  categories: CategoryFull[]
): ColumnData {
  const columnData: ColumnData = { 1: [], 2: [], 3: [] };
  
  // Add all categories to their respective columns
  categories.forEach(category => {
    const categoryDomains = domains
      .filter(domain => domain.category?.id === category.id)
      .sort((a, b) => a.orderInCategory - b.orderInCategory);
    
    columnData[category.columnPosition].push({
      category,
      domains: categoryDomains,
    });
  });

  // Add uncategorized domains to column 1
  const uncategorizedDomains = domains.filter(domain => !domain.category);
  if (uncategorizedDomains.length > 0) {
    columnData[1].push({
      category: {
        name: 'Other Domains',
        slug: 'other',
        icon: '📂',
        description: 'Miscellaneous domains',
      },
      domains: uncategorizedDomains,
    });
  }

  return columnData;
}

// ============================================
// Main Page Component
// ============================================

export default async function DomainIndexPage() {
  const userCountry = await getUserCountryFromCookies();
  
  // Fetch data using services (parallel execution)
  const [domains, categories] = await Promise.all([
    DomainService.getAll(userCountry),
    CategoryService.getActive(),
  ]);

  // Organize domains by category and column
  const columnData = organizeDomainsIntoColumns(domains, categories);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* 3-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(columnNumber => (
            <div key={columnNumber} className="space-y-6">
              {columnData[columnNumber].map((categoryGroup, index) => (
                <CategoryCard 
                  key={categoryGroup.category.slug || `uncategorized-${index}`}
                  category={categoryGroup.category}
                  domains={categoryGroup.domains}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {domains.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏗️</div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              No Domains Available
            </h3>
            <p className="text-slate-500">
              Check back soon as we add new domains to explore.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// Category Card Component
// ============================================

type CategoryCardProps = {
  category: CategoryFull | { name: string; slug: string; icon: string; description: string };
  domains: DomainWithCategory[];
};

function CategoryCard({ category, domains }: CategoryCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Category Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{'icon' in category ? category.icon : '📁'}</span>
          <div>
            <h3 className="text-xl font-bold text-white">
              {category.name}
            </h3>
            {category.description && (
              <p className="text-blue-100 text-sm mt-1">
                {category.description}
              </p>
            )}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-blue-100 text-sm">
            {domains.length} domain{domains.length !== 1 ? 's' : ''}
          </span>
          <div className="text-blue-100 text-xs bg-white/20 px-2 py-1 rounded">
            {category.slug}
          </div>
        </div>
      </div>

      {/* Domains List */}
      <div className="p-6">
        {domains.length > 0 ? (
          <div className="space-y-3">
            {domains.map((domain, index) => (
              <DomainCard key={domain.id} domain={domain} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400">
            <div className="text-3xl mb-2">🔍</div>
            <p className="text-sm">No domains in this category yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// Domain Card Component
// ============================================

type DomainCardProps = {
  domain: DomainWithCategory;
  index: number;
};

function DomainCard({ domain, index }: DomainCardProps) {
  return (
    <Link 
      href={`/domain/${domain.slug}`}
      className="block group"
    >
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group-hover:shadow-md">
        <div className="flex items-center space-x-3">
          {/* Order Badge */}
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
            {index + 1}
          </div>
          
          {/* Domain Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
              {domain.name}
            </h4>
            <p className="text-sm text-slate-500 mt-1">
              /{domain.slug}
            </p>
          </div>

          {/* Arrow Icon */}
          <div className="flex-shrink-0 text-slate-400 group-hover:text-blue-500 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
