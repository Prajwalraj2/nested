// components/domain/RichTextLayout.tsx

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

type RichTextLayoutProps = {
  page: Page;
  domain: Domain;
};

export function RichTextLayout({ page, domain }: RichTextLayoutProps) {
  return (
    <div className="min-h-screen bg-[#2f2f2f] text-white">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <span>{domain.name}</span>
            <span>/</span>
            <span className="text-white">{page.title}</span>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">{page.title}</h1>
        </div>

        {/* Rich Text Content */}
        <div className="bg-[#3a3a3a] rounded-lg p-8 border border-gray-600">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">📝 Rich Text Content</h2>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm">
              Edit Content
            </button>
          </div>

          {/* Sample Rich Text Content */}
          <div className="prose prose-invert max-w-none">
            <h3 className="text-2xl font-bold mb-4 text-blue-400">
              🌟 What is {page.title}?
            </h3>
            
            <p className="text-gray-300 leading-relaxed mb-6">
              This is a sample rich text page for <strong>{page.title}</strong>. 
              In a real implementation, this content would be managed through a 
              powerful rich text editor like Lexical, allowing for dynamic content 
              creation and editing.
            </p>

            <h4 className="text-xl font-semibold mb-3 text-green-400">
              🚀 Key Features:
            </h4>
            
            <ul className="list-disc list-inside space-y-2 text-gray-300 mb-6">
              <li>Rich text editing with Lexical editor</li>
              <li>Support for headings, paragraphs, and lists</li>
              <li>Image and media embedding</li>
              <li>Code blocks and formatting</li>
              <li>Link management</li>
              <li>Table support</li>
            </ul>

            <h4 className="text-xl font-semibold mb-3 text-purple-400">
              💡 Why is this Important?
            </h4>
            
            <p className="text-gray-300 leading-relaxed mb-6">
              Rich text content allows for detailed explanations, tutorials, 
              guides, and comprehensive documentation that goes beyond simple 
              tabular data. This is perfect for:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-[#4a4a4a] p-4 rounded border border-gray-600">
                <h5 className="font-semibold text-yellow-400 mb-2">📚 Educational Content</h5>
                <p className="text-sm text-gray-400">
                  Step-by-step guides, tutorials, and learning materials.
                </p>
              </div>
              <div className="bg-[#4a4a4a] p-4 rounded border border-gray-600">
                <h5 className="font-semibold text-yellow-400 mb-2">💼 Business Guidance</h5>
                <p className="text-sm text-gray-400">
                  Freelancing tips, client management, and business strategies.
                </p>
              </div>
            </div>

            <blockquote className="border-l-4 border-blue-500 pl-4 py-2 bg-[#4a4a4a] rounded-r">
              <p className="text-gray-300 italic">
                "Rich text content provides the flexibility to create engaging, 
                informative, and well-structured content that complements your 
                tabular data perfectly."
              </p>
            </blockquote>
          </div>

          {/* Editor Preview */}
          <div className="mt-8 p-4 bg-gray-800 rounded border border-gray-600">
            <p className="text-sm text-gray-400 mb-2">
              🚀 <strong>Coming Soon:</strong> Lexical Editor Integration
            </p>
            <div className="text-xs text-gray-500">
              Full-featured rich text editor with plugins, formatting options, 
              and collaborative editing capabilities.
            </div>
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
