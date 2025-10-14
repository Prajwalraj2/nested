// src/components/table/DataTable.tsx

'use client';

import React, { useState } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnResizeMode,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { X } from 'lucide-react';

import { DataTablePagination } from './DataTablePagination';
import { DataTableViewOptions } from './DataTableViewOptions';
import { DataTableFacetedFilter } from './DataTableFacetedFilter';
import type { TableSchema, TableData, ColumnType } from '@/types/table';

/**
 * Professional DataTable Component
 * 
 * Features:
 * - Advanced sorting (single/multi-column)
 * - Global search functionality
 * - Column-specific filtering
 * - Column visibility toggle
 * - Responsive pagination
 * - Professional shadcn/ui styling
 * - Type-specific cell rendering
 * - Export capabilities
 * - Mobile-responsive design
 */

type DataTableProps = {
  schema: TableSchema;
  data: TableData;
  title?: string;
  description?: string;
  className?: string;
};

export function DataTable({
  schema,
  data,
  title,
  description,
  className
}: DataTableProps) {
  // Table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState('');
  // const [columnResizeMode] = useState<ColumnResizeMode>('onChange');

  // Generate TanStack Table columns from schema
  const columns: ColumnDef<any>[] = React.useMemo(() => {
    return schema.columns.map((col) => ({
      accessorKey: col.id,
      id: col.id,
      header: ({ column }) => {
        return (
          <div className="flex items-center space-x-2 select-none">
            <button
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="flex items-center hover:text-blue-400 transition-colors text-left font-medium"
            >
              <span>{col.name}</span>
              {column.getIsSorted() === "desc" ? (
                <span className="ml-2 text-blue-400">↓</span>
              ) : column.getIsSorted() === "asc" ? (
                <span className="ml-2 text-blue-400">↑</span>
              ) : (
                <span className="ml-2 opacity-50">↕</span>
              )}
            </button>
            
            {/* Column Resizer - Basic Implementation - COMMENTED OUT FOR NOW */}
            {/* <div
              className="w-1 h-4 bg-gray-500 cursor-col-resize opacity-0 hover:opacity-100 transition-opacity ml-2"
              title="Drag to resize column"
            /> */}
          </div>
        );
      },
      cell: ({ getValue, row }) => {
        const value = getValue();
        // Debug logging - remove after testing
        if (col.name === 'Description' || col.id.includes('description')) {
          console.log('Description column detected:', {
            columnName: col.name,
            columnId: col.id,
            columnType: col.type,
            value: value
          });
        }
        return formatCellValue(value, col.type, row.original, col.name);
      },
      enableSorting: col.sortable,
      enableColumnFilter: col.filterable,
      // COLUMN RESIZING - COMMENTED OUT FOR NOW
      // enableResizing: true,
      // size: col.type === 'description' ? 280 : col.type === 'link' ? 200 : 150,
      // minSize: 120,
      // maxSize: col.type === 'description' ? 350 : 400,
      filterFn: col.type === 'badge' 
        ? (row, id, value) => {
            // Custom filter for badge columns - supports multiple selection
            if (!value || value.length === 0) return true;
            const cellValue = String(row.getValue(id));
            return value.includes(cellValue);
          }
        : col.type === 'text' || col.type === 'description' 
          ? 'includesString' 
          : 'auto',
    }));
  }, [schema.columns]);

  // Initialize table
  const table = useReactTable({
    data: data.rows,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    // COLUMN RESIZING - COMMENTED OUT FOR NOW
    // columnResizeMode,
    // enableColumnResizing: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // Helper function to detect badge columns and generate filter options
  const getBadgeColumnFilters = () => {
    const badgeColumns = schema.columns.filter(col => col.type === 'badge');
    
    return badgeColumns.map(col => {
      // Get unique values from actual data
      const uniqueValues = new Set();
      data.rows.forEach(row => {
        if (row[col.id]) {
          uniqueValues.add(row[col.id]);
        }
      });
      
      // Convert to options format
      const options = Array.from(uniqueValues).map(value => ({
        label: String(value),
        value: String(value)
      }));
      
      return {
        column: table.getColumn(col.id),
        title: col.name,
        options
      };
    }).filter(filter => filter.column); // Only include if column exists
  };

  const badgeFilters = getBadgeColumnFilters();

  return (
    <div className={`space-y-4 ${className}`}>
      

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 sm:space-x-2">
        
        {/* Search Input + Badge Filters */}
        <div className="flex flex-1 space-x-2">
          <Input
            placeholder="Search all columns..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(String(event.target.value))}
            className="max-w-sm bg-[#3a3a3a] border-gray-600 text-white placeholder:text-gray-400"
          />
          
          {/* Badge Column Filters */}
          {badgeFilters.map((filter) => (
            <DataTableFacetedFilter
              key={filter.title}
              column={filter.column}
              title={filter.title}
              options={filter.options}
            />
          ))}
          
          {/* Reset Filters Button */}
          {(columnFilters.length > 0 || globalFilter) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                table.resetColumnFilters();
                setGlobalFilter('');
              }}
              className="bg-[#3a3a3a] border-gray-600 text-white hover:bg-[#4a4a4a]"
            >
              Reset <X className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          {/* Column Visibility */}
          <DataTableViewOptions table={table} schema={schema} />

        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border border-gray-600 bg-[#3a3a3a] overflow-auto">
        <Table 
          // COLUMN RESIZING STYLES - COMMENTED OUT FOR NOW
          // style={{ 
          //   width: table.getTotalSize(),
          //   tableLayout: 'fixed'
          // }}
        >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow 
                key={headerGroup.id}
                className="border-gray-600 hover:bg-[#4a4a4a]"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead 
                      key={header.id}
                      className="text-gray-200 bg-[#4a4a4a] relative"
                      // COLUMN RESIZING STYLES - COMMENTED OUT FOR NOW
                      // style={{
                      //   width: header.getSize(),
                      //   minWidth: header.column.columnDef.minSize,
                      //   maxWidth: header.column.columnDef.maxSize,
                      // }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-gray-600 hover:bg-[#3a3a3a] text-white"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell 
                      key={cell.id}
                      className="text-gray-100 relative overflow-hidden"
                      // COLUMN RESIZING STYLES - COMMENTED OUT FOR NOW
                      // style={{
                      //   width: cell.column.getSize(),
                      //   minWidth: cell.column.columnDef.minSize,
                      //   maxWidth: cell.column.columnDef.maxSize,
                      // }}
                    >
                      <div className="overflow-hidden">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-400"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <DataTablePagination table={table} />

    </div>
  );
}


// Enhanced cell value formatting with interactive elements
function formatCellValue(value: any, type: ColumnType, rowData: any, columnName?: string): React.JSX.Element {
  if (value === null || value === undefined || value === '') {
    return <span className="text-gray-500">-</span>;
  }

  switch (type) {
    case 'link':
      const linkText = String(value);
      const displayLink = linkText
        .replace(/^https?:\/\//, '')  // Remove protocol
        .replace(/^www\./, '')        // Remove www
        .substring(0, 40) + (linkText.length > 40 ? '...' : ''); // Truncate if too long
      
      return (
        <a 
          href={String(value)} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 underline hover:underline-offset-4 transition-all duration-200 max-w-xs block"
          title={linkText}
        >
          {displayLink}
        </a>
      );
    
    case 'email':
      return (
        <a 
          href={`mailto:${value}`}
          className="text-blue-400 hover:text-blue-300 underline hover:underline-offset-4 transition-all duration-200"
        >
          {String(value)}
        </a>
      );
    
    case 'badge':
      const badgeColors = [
        'bg-blue-600 text-blue-100',
        'bg-green-600 text-green-100', 
        'bg-yellow-600 text-yellow-100',
        'bg-purple-600 text-purple-100',
        'bg-red-600 text-red-100'
      ];
      const colorIndex = String(value).toLowerCase().charCodeAt(0) % badgeColors.length;
      
      return (
        <Badge className={`${badgeColors[colorIndex]} hover:opacity-80 transition-opacity rounded-sm text-sm`}>
          {String(value)}
        </Badge>
      );
    
    case 'currency':
      const num = parseFloat(value);
      return (
        <span className="font-medium text-green-400 font-mono">
          {isNaN(num) ? String(value) : `$${num.toFixed(2)}`}
        </span>
      );
    
    case 'date':
      const date = new Date(value);
      return (
        <span className="text-gray-300 font-mono">
          {isNaN(date.getTime()) ? String(value) : date.toLocaleDateString()}
        </span>
      );
    
    case 'boolean':
      return (
        <div className="flex items-center">
          <span className={`w-2 h-2 rounded-full mr-2 ${value ? 'bg-green-400' : 'bg-red-400'}`}></span>
          <span className={`font-medium ${value ? 'text-green-400' : 'text-red-400'}`}>
            {value ? 'Yes' : 'No'}
          </span>
        </div>
      );
    
    case 'rating':
      const rating = parseFloat(value);
      if (!isNaN(rating)) {
        const stars = Math.round(rating);
        return (
          <div className="flex items-center">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <span 
                  key={star}
                  className={`text-sm ${star <= stars ? 'text-yellow-400' : 'text-gray-600'}`}
                >
                  ⭐
                </span>
              ))}
            </div>
            <span className="ml-2 text-gray-300 text-sm font-mono">{rating.toFixed(1)}</span>
          </div>
        );
      }
      return <span className="text-gray-300">{String(value)}</span>;
    
    case 'description':
      const text = String(value);
      const shortText = text.length > 50 ? text.substring(0, 50) + '...' : text;
      
      // Always show popover for consistency
      return (
        <div className="max-w-[250px]">
          <Popover>
            <PopoverTrigger asChild>
              <button className="text-left text-gray-300 hover:text-white transition-colors cursor-pointer w-full">
                <div className="truncate text-sm leading-5 py-1">{shortText}</div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-[#2a2a2a] border-gray-600 text-white">
              <div>
                <p className="text-sm text-gray-300 leading-relaxed">{text}</p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      );
    
    case 'number':
      const number = parseFloat(value);
      return (
        <span className="font-medium text-gray-300 font-mono">
          {isNaN(number) ? String(value) : number.toLocaleString()}
        </span>
      );
    
    case 'phone':
      return (
        <a 
          href={`tel:${value}`}
          className="text-blue-400 hover:text-blue-300 underline hover:underline-offset-4 transition-all duration-200 font-mono"
        >
          {String(value)}
        </a>
      );
    
    default:
      const textValue = String(value);
      // Fallback truncation for any long text content
      if (textValue.length > 100) {
        return (
          <div className="max-w-[200px]">
            <span 
              className="text-gray-300 text-sm block truncate cursor-help" 
              title={textValue}
            >
              {textValue}
            </span>
          </div>
        );
      }
      
      return (
        <span className="text-gray-300 max-w-xs truncate block" title={textValue}>
          {textValue}
        </span>
      );
  }
}

// Helper function to format dates
function formatDate(dateString?: string): string {
  if (!dateString) return 'Unknown';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } catch {
    return 'Unknown';
  }
}
