// app/domain/page.tsx

import { prisma } from '@/lib/prisma';
import Link from 'next/link';

// Types for better type safety
type DomainWithCategory = {
  id: string;
  name: string;
  slug: string;
  orderInCategory: number;
  isPublished: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
    description: string | null;
    columnPosition: number;
    categoryOrder: number;
  } | null;
};

export default async function DomainIndexPage() {
  // Fetch all published domains with their categories, properly ordered
  const domains = await prisma.domain.findMany({
    where: {
      isPublished: true,
    },
    include: {
      category: true,
    },
    orderBy: [
      { category: { columnPosition: 'asc' } },
      { category: { categoryOrder: 'asc' } },
      { orderInCategory: 'asc' },
    ],
  }) as DomainWithCategory[];

  // Also fetch categories to show empty ones
  const categories = await prisma.domainCategory.findMany({
    where: {
      isActive: true,
    },
    orderBy: [
      { columnPosition: 'asc' },
      { categoryOrder: 'asc' },
    ],
  });

  // Organize domains by category and column
  const columnData: { [key: number]: any[] } = { 1: [], 2: [], 3: [] };
  
  // First, add all categories to their respective columns
  categories.forEach(category => {
    const categoryDomains = domains.filter(domain => 
      domain.category?.id === category.id
    ).sort((a, b) => a.orderInCategory - b.orderInCategory);
    
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-800 mb-3">
              Explore Our Domains
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Discover a wide range of specialized domains, each offering unique expertise and opportunities.
            </p>
            <div className="flex items-center justify-center mt-4 space-x-4">
              <div className="flex items-center text-sm text-slate-500">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                {domains.length} Active Domains
              </div>
              <div className="flex items-center text-sm text-slate-500">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                {categories.length} Categories
              </div>
            </div>
          </div>
        </div>
      </div>

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

// Category Card Component
function CategoryCard({ category, domains }: { 
  category: any; 
  domains: DomainWithCategory[] 
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Category Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{category.icon || '📁'}</span>
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

// Individual Domain Card Component
function DomainCard({ domain, index }: { 
  domain: DomainWithCategory; 
  index: number;
}) {
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
