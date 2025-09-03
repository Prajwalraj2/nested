// components/domain/TableLayout.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { DataTable } from '@/components/table/DataTable';
import type { TableSchema, TableData, ColumnType } from '@/types/table';

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

type TableWithData = {
  id: string;
  name: string;
  schema: TableSchema;
  data: TableData;
  settings?: any;
};

type TableLayoutProps = {
  page: Page;
  domain: Domain;
};

export function TableLayout({ page, domain }: TableLayoutProps) {
  const [tableData, setTableData] = useState<TableWithData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch table data for this page
  useEffect(() => {
    async function fetchTableData() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch table data from API
        const response = await fetch(`/api/domain/tables/by-page/${page.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('No table found for this page');
          } else {
            setError('Failed to load table data');
          }
          return;
        }

        const result = await response.json();
        setTableData(result.table);
      } catch (err) {
        console.error('Error fetching table data:', err);
        setError('Failed to load table data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchTableData();
  }, [page.id]);

  // Handle export functionality
  const handleExport = async (format: 'csv' | 'json', tableData: TableWithData) => {
    try {
      const response = await fetch(`/api/admin/tables/${tableData.id}/data?format=${format}&download=true`);
      
      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${page.slug}-table.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#2f2f2f] text-white">
        <div className="max-w-6xl mx-auto p-6">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
              <span>{domain.name}</span>
              <span>/</span>
              <span className="text-white">{page.title}</span>
            </div>
            <h1 className="text-3xl font-bold mb-4">{page.title}</h1>
          </div>

          <div className="bg-[#3a3a3a] rounded-lg p-6 border border-gray-600">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading table data...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#2f2f2f] text-white">
        <div className="max-w-6xl mx-auto p-6">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
              <span>{domain.name}</span>
              <span>/</span>
              <span className="text-white">{page.title}</span>
            </div>
            <h1 className="text-3xl font-bold mb-4">{page.title}</h1>
          </div>

          <div className="bg-[#3a3a3a] rounded-lg p-6 border border-gray-600">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="text-4xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold mb-2">Unable to Load Table</h3>
                <p className="text-gray-400">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No table data
  if (!tableData) {
    return (
      <div className="min-h-screen bg-[#2f2f2f] text-white">
        <div className="max-w-6xl mx-auto p-6">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
              <span>{domain.name}</span>
              <span>/</span>
              <span className="text-white">{page.title}</span>
            </div>
            <h1 className="text-3xl font-bold mb-4">{page.title}</h1>
          </div>

          <div className="bg-[#3a3a3a] rounded-lg p-6 border border-gray-600">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-2">No Table Data</h3>
                <p className="text-gray-400">This page doesn't have a table configured yet.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

        {/* Professional DataTable */}
        <DataTable
          schema={tableData.schema}
          data={tableData.data}
          title={tableData.name}
          description={`${tableData.data.rows.length} rows • ${tableData.schema.columns.length} columns`}
          onExport={(format) => handleExport(format, tableData)}
        />

        {/* Debug Info */}
        <div className="mt-8 p-4 bg-gray-800 rounded text-xs">
          <p><strong>Page ID:</strong> {page.id}</p>
          <p><strong>Content Type:</strong> {page.contentType}</p>
          <p><strong>Table ID:</strong> {tableData.id}</p>
          <p><strong>Schema Version:</strong> {tableData.schema.version}</p>
        </div>
      </div>
    </div>
  );
}
