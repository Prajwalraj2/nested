// src/components/table/DataTableViewOptions.tsx

'use client';

import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import type { TableSchema, ColumnType } from '@/types/table';
import { Settings2 } from 'lucide-react';

/**
 * DataTable View Options Component
 * 
 * Column visibility toggle with:
 * - Individual column show/hide
 * - Professional dropdown interface
 * - Dark theme styling
 * - Accessible controls
 */

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
  schema: TableSchema;
}

export function DataTableViewOptions<TData>({
  table,
  schema,
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex bg-[#3a3a3a] border-gray-600 text-white hover:bg-[#4a4a4a]"
        >
          <Settings2 /> View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="min-w-[200px] bg-[#3a3a3a] border-gray-600"
      >
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            // Find the column in schema to get the proper name
            const schemaColumn = schema.columns.find(col => col.id === column.id);
            const displayName = schemaColumn?.name || column.id;
            
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="text-white hover:bg-[#4a4a4a] focus:bg-[#4a4a4a]"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                <span className="flex items-center space-x-2">
                  <span className="whitespace-nowrap">{displayName}</span>
                </span>
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

