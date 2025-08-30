// src/components/domain/SectionBasedLayout.tsx

import Link from 'next/link';

// Types
type DomainWithPages = {
  id: string;
  name: string;
  slug: string;
  pageType: string;
  pages: any[];
};

type PageWithContent = {
  id: string;
  title: string;
  slug: string;
  contentType: string;
  content: any[];
  subPages: any[];
};

// Main Section-Based Layout Component (like your screenshots)
export function SectionBasedLayout({ domain, page }: {
  domain: DomainWithPages;
  page?: PageWithContent;
}) {
  const title = page?.title || domain.name;
  const contentBlocks = page?.content || [];
  
  // NEW: Group content blocks into columns dynamically
  const columns = groupBlocksIntoColumns(contentBlocks);
  
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold mb-2">{title}</h1>
        </div>
      </div>

      {/* Main Content - Row-based Layout */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {contentBlocks.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">
              Content Coming Soon
            </h3>
            <p className="text-slate-400">
              This domain's sections are being configured.
            </p>
          </div>
        ) : (
          renderSectionsByRows(columns)
        )}
      </div>
    </div>
  );
}

// Section Column Component
function SectionColumn({ section }: { section: any }) {
  return (
    <div className="bg-slate-800/40 rounded-lg border border-slate-700/50 p-6 hover:bg-slate-800/60 hover:border-slate-600/60 transition-all duration-300 shadow-lg hover:shadow-xl">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center">
        <span className="mr-3 text-2xl">{section.icon}</span>
        <span className="border-b-2 border-blue-500/60 pb-1">{section.title}</span>
      </h2>
      
      <div className="space-y-3">
        {section.items.map((item: any, index: number) => (
          <SectionItem key={index} item={item} />
        ))}
      </div>
    </div>
  );
}

// Section Item Component
function SectionItem({ item }: { item: any }) {
  return (
    <Link href={item.url || '#'} className="flex items-center space-x-3 py-3 px-4 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-md transition-all duration-200 group">
      <span className="text-lg flex-shrink-0 group-hover:scale-110 transition-transform">{item.icon || '📄'}</span>
      <span className="text-sm leading-relaxed group-hover:underline">
        {item.title} <span className="text-xs text-slate-500">{item.url}</span>
      </span>
    </Link>
  );
}

// NEW: Dynamic function to group ContentBlocks into 3 columns
function groupBlocksIntoColumns(blocks: any[]): { [key: number]: any[] } {
  const columns: { [key: number]: any[] } = { 1: [], 2: [], 3: [] };
  
  // Group SECTION_HEADER and SECTION_LINKS pairs
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    
    if (block.type === 'SECTION_HEADER') {
      const content = typeof block.content === 'string' 
        ? JSON.parse(block.content) 
        : block.content;
        
      const { title, icon, column = 1, columnOrder = 0 } = content;
      
      // Look for corresponding SECTION_LINKS block
      let links: any[] = [];
      const nextBlock = blocks[i + 1];
      
      if (nextBlock?.type === 'SECTION_LINKS') {
        const nextContent = typeof nextBlock.content === 'string' 
          ? JSON.parse(nextBlock.content) 
          : nextBlock.content;
        links = nextContent.links || [];
        i++; // Skip the SECTION_LINKS block since we processed it
      }
      
      // Add section to appropriate column
      columns[column].push({
        title,
        icon: icon || '📁',
        items: links.map((link: any) => ({
          title: link.title,
          icon: link.icon || '📄',
          url: link.url || '#'
        })),
        columnOrder
      });
    }
  }
  
  // Sort each column by columnOrder
  Object.keys(columns).forEach(col => {
    columns[parseInt(col)].sort((a, b) => a.columnOrder - b.columnOrder);
  });
  
  return columns;
}

// NEW: Function to render sections organized by rows with proper spacing
function renderSectionsByRows(columns: { [key: number]: any[] }) {
  // First, organize sections by rows (columnOrder)
  const rowData: { [key: number]: { [key: number]: any } } = {};
  
  // Collect all sections and group by row (columnOrder)
  Object.keys(columns).forEach(colNum => {
    columns[parseInt(colNum)].forEach(section => {
      const row = section.columnOrder || 1;
      if (!rowData[row]) rowData[row] = {};
      rowData[row][parseInt(colNum)] = section;
    });
  });
  
  // Get sorted row numbers
  const sortedRows = Object.keys(rowData).map(r => parseInt(r)).sort((a, b) => a - b);
  
  return (
    <div>
      {sortedRows.map((rowNumber, rowIndex) => (
        <div key={rowNumber}>
          {/* Add visual separator between rows (not before first row) */}
          {rowIndex > 0 && (
            <div className="w-full h-px bg-slate-700/30 my-20"></div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(columnNumber => (
              <div key={columnNumber}>
                {rowData[rowNumber][columnNumber] && (
                  <SectionColumn section={rowData[rowNumber][columnNumber]} />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
