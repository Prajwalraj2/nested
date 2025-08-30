// components/domain/TableLayout.tsx

type Domain = {
  id: string;
  name: string;
  slug: string;
};

type Page = {
  id: string;
  title: string;
  slug: string;
  contentType: string;
  content: any[];
  subPages: any[];
};

type TableLayoutProps = {
  page: Page;
  domain: Domain;
};

export function TableLayout({ page, domain }: TableLayoutProps) {
  return (
    <div className="min-h-screen bg-[#2f2f2f] text-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <span>{domain.name}</span>
            <span>/</span>
            <span className="text-white">{page.title}</span>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">{page.title}</h1>
        </div>

        {/* Table Placeholder */}
        <div className="bg-[#3a3a3a] rounded-lg p-6 border border-gray-600">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">📊 Table Content</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm">
                Add Data
              </button>
              <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-sm">
                Upload CSV
              </button>
            </div>
          </div>

          {/* Mock Table */}
          <div className="border border-gray-600 rounded">
            <div className="bg-[#4a4a4a] px-4 py-3 border-b border-gray-600">
              <div className="grid grid-cols-4 gap-4 text-sm font-medium">
                <div>Name</div>
                <div>Category</div>
                <div>Link</div>
                <div>Description</div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-600">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="px-4 py-3 hover:bg-[#3a3a3a]">
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="font-medium">Sample Item {i}</div>
                    <div className="text-gray-400">Category</div>
                    <div className="text-blue-400">example.com</div>
                    <div className="text-gray-300 truncate">
                      This is a sample description for item {i}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Table Features Preview */}
          <div className="mt-4 text-sm text-gray-400">
            <p>🚀 <strong>Coming Soon:</strong> Advanced table features including sorting, filtering, searching, column management, and CSV import!</p>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-8 p-4 bg-gray-800 rounded text-xs">
          <p><strong>Page ID:</strong> {page.id}</p>
          <p><strong>Content Type:</strong> {page.contentType}</p>
          <p><strong>Content Blocks:</strong> {page.content?.length || 0}</p>
          <p><strong>Sub Pages:</strong> {page.subPages?.length || 0}</p>
        </div>
      </div>
    </div>
  );
}
