import InputGroup from "@/components/common/input-group";
import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";
import { ChangeEvent } from "react";


interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableSearch<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <InputGroup>
          <Input
            placeholder="Search by title"
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
          />
          {/* <Select
            onValueChange={(value) =>
              table.getColumn("status")?.setFilterValue(value)
            }
            defaultValue={
              (table.getColumn("status")?.getFilterValue() as string) ?? ""
            }>
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
            </SelectContent>
          </Select> */}
        </InputGroup>
      </div>
    </div>
  );
}
