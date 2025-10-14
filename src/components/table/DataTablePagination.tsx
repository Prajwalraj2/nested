// src/components/table/DataTablePagination.tsx

'use client';

import { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

/**
 * DataTable Pagination Component
 * 
 * Professional pagination controls with:
 * - Page size selector
 * - Navigation buttons
 * - Page info display
 * - Responsive design
 * - Dark theme styling
 */

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between px-2">
      
      {/* Left side - Page Size Selector */}
      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium text-gray-300">Rows per page</p>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="h-8 w-[70px] bg-[#3a3a3a] border-gray-600 text-white">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent 
            side="top" 
            className="bg-[#3a3a3a] border-gray-600"
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem 
                key={pageSize} 
                value={`${pageSize}`}
                className="text-white hover:bg-[#4a4a4a] focus:bg-[#4a4a4a]"
              >
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Right side - Page Info + Navigation */}
      <div className="flex items-center space-x-6">
        {/* Page Info */}
        <div className="flex w-[100px] items-center justify-center text-sm font-medium text-gray-300">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex items-center space-x-2">
          {/* First Page */}
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex bg-[#3a3a3a] border-gray-600 text-white hover:bg-[#4a4a4a]"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          
          {/* Previous Page */}
          <Button
            variant="outline"
            className="h-8 w-8 p-0 bg-[#3a3a3a] border-gray-600 text-white hover:bg-[#4a4a4a]"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          
          {/* Next Page */}
          <Button
            variant="outline"
            className="h-8 w-8 p-0 bg-[#3a3a3a] border-gray-600 text-white hover:bg-[#4a4a4a]"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          
          {/* Last Page */}
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex bg-[#3a3a3a] border-gray-600 text-white hover:bg-[#4a4a4a]"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
