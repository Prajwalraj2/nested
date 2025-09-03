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
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex bg-[#3a3a3a] border-gray-600 text-white hover:bg-[#4a4a4a]"
        >
          👁️ View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-[150px] bg-[#3a3a3a] border-gray-600"
      >
        <DropdownMenuLabel className="text-gray-200">
          Toggle columns
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-600" />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize text-white hover:bg-[#4a4a4a] focus:bg-[#4a4a4a]"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
