'use client';

import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";
import { ChangeEvent } from "react";
import InputGroup from "@/components/common/input-group";

interface DataTableSearchProps<TData> {
  table: Table<TData>;
}

export function DataTableSearch<TData>({
  table,
}: DataTableSearchProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <InputGroup>
          <Input
            placeholder="Search by name"
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
        </InputGroup>
      </div>
    </div>
  );
}
