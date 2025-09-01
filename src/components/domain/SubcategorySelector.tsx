// src/components/domain/SubcategorySelector.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Types
type DomainWithPages = {
  id: string;
  name: string;
  slug: string;
  pageType: string;
  pages: PageWithContent[];
};

type PageWithContent = {
  id: string;
  title: string;
  slug: string;
  contentType: string;
  content: any[];
  subPages: any[];
};

// Main Subcategory Selector Component
export function SubcategorySelector({ domain, page }: { 
  domain: DomainWithPages; 
  page?: PageWithContent;
}) {
  const pathname = usePathname();
  const subcategories = page?.subPages || domain.pages;
  
  // Build the current path prefix for nested URLs using the actual current path
  // This ensures we get the full hierarchical path correctly
  const pathPrefix = pathname;

//   console.log("subcategories", subcategories);

  //Output on visiting /domain/webdev
  /*
        subcategories [
        {
            id: 'cf291ab4-430a-4cb1-85c1-1a702ff79355',
            title: 'With Code Web Dev',
            slug: 'with-code',
            contentType: 'section_based',
            domainId: '40383f19-4c6b-4a5b-9836-329c93537032',
            parentId: null,
            order: 1,
            createdAt: 2025-08-30T06:01:49.798Z,
            content: [],
            subPages: []
        },
        {
            id: '0908e39d-5362-4cdd-a40c-15b9a126c1d0',
            title: 'No-Code Web Dev',
            slug: 'no-code',
            contentType: 'section_based',
            domainId: '40383f19-4c6b-4a5b-9836-329c93537032',
            parentId: null,
            order: 2,
            createdAt: 2025-08-30T06:01:49.835Z,
            content: [],
            subPages: []
        }
        ]
    // On visiting /domain/appdev
    subcategories [
        {
            id: 'b8746404-9425-4a28-93f0-3ec6142cafb0',
            title: 'Android App Development',
            slug: 'android',
            contentType: 'section_based',
            domainId: '6256b07e-7617-4db6-b95c-a67add345bac',
            parentId: null,
            order: 1,
            createdAt: 2025-08-30T06:01:49.849Z,
            content: [],
            subPages: []
        },
        {
            id: '94cec920-bbf8-4bca-9284-41a19fc34a23',
            title: 'iOS App Development',
            slug: 'ios',
            contentType: 'section_based',
            domainId: '6256b07e-7617-4db6-b95c-a67add345bac',
            parentId: null,
            order: 2,
            createdAt: 2025-08-30T06:01:49.854Z,
            content: [],
            subPages: []
        },
        {
            id: 'c1cb4f52-1438-458d-8199-df0a4ba98b46',
            title: 'Cross-Platform Development',
            slug: 'cross-platform',
            contentType: 'section_based',
            domainId: '6256b07e-7617-4db6-b95c-a67add345bac',
            parentId: null,
            order: 3,
            createdAt: 2025-08-30T06:01:49.857Z,
            content: [],
            subPages: []
        }
        ]
  */

  const title = page?.title || domain.name;

//   console.log("title", title);  // title 🌐 Web Development
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-3">{title}</h1>
          <p className="text-lg text-slate-600">
            Choose a specialization area to explore:
          </p>
        </div>
      </div>

      {/* Subcategory Cards Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subcategories.map(subcategory => (
            <SubcategoryCard
              key={subcategory.id}
              subcategory={subcategory}
              domain={domain}
              pathPrefix={pathPrefix}
            />
          ))}
        </div>

        {/* If there are no subcategories, show a message */}
        {subcategories.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              Coming Soon
            </h3>
            <p className="text-slate-500">
              Subcategories are being added for this domain.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Individual Subcategory Card
function SubcategoryCard({ subcategory, domain, pathPrefix }: {
  subcategory: any;
  domain: DomainWithPages;
  pathPrefix: string;
}) {
  return (
    <Link
      href={`${pathPrefix}/${subcategory.slug}`}
      className="group block"
    >
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 group-hover:border-blue-300">
        {/* Icon/Title */}
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl mr-4">
            🚀
          </div>
          <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
            {subcategory.title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-slate-600 mb-4">
          Explore {subcategory.title.toLowerCase()} resources, tools, and opportunities.
        </p>

        {/* Arrow */}
        <div className="flex justify-end">
          <div className="text-slate-400 group-hover:text-blue-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
