'use client';

import * as React from 'react';
import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface DataTableSearchProps<TData> {
  table: Table<TData>;
}

export function DataTableSearch<TData>({
  table,
}: DataTableSearchProps<TData>) {
  const [value, setValue] = React.useState('');
  const column = table.getColumn('name');

  if (!column) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <Input
        placeholder="Search subcategories..."
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          column.setFilterValue(event.target.value);
        }}
        className="h-8 w-[150px] lg:w-[250px]"
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={() => {
            setValue('');
            column.setFilterValue('');
          }}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  );
}
