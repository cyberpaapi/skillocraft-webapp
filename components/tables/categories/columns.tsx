import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash2, Eye } from 'lucide-react';
import { Category, Status, SubCategory } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { TableActions } from '../table-actions';

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: 'name',
    header: 'Category Name',
    cell: ({ row }) => (
      <div className="font-medium">{String(row.getValue('name'))}</div>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => (
      <div className="text-muted-foreground line-clamp-2">
        {String(row.getValue('description') || 'No description')}
      </div>
    ),
  },
  {
    accessorKey: 'subCategory',
    header: 'Sub Categories',
    cell: ({ row }) => {
      const subCategories = row.getValue('subCategory') as SubCategory[];
      return (
        <span className="text-sm text-muted-foreground">
          {subCategories?.length || 0} subcategories
        </span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as Status;
      
      const statusConfig: Record<Status, { label: string; className: string }> = {
        ACTIVE: {
          label: 'Active',
          className: 'bg-green-100 text-green-800',
        },
        INACTIVE: {
          label: 'Inactive',
          className: 'bg-yellow-100 text-yellow-800',
        },
      };
      
      const defaultConfig = { 
        label: String(status), 
        className: 'bg-gray-100 text-gray-800' 
      };
      
      const config = statusConfig[status] || defaultConfig;
      
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
          {config.label}
        </span>
      );
    },
    filterFn: (row, id, value: string[]) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'updatedAt',
    header: 'Last Modified',
    cell: ({ row }) => {
      const date = new Date(row.getValue('updatedAt'));
      return (
        <div className="text-sm text-muted-foreground">
          {date.toLocaleDateString()}
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/admin/categories/${row.original.id}`} className="flex items-center w-full cursor-pointer">
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Link>
              </DropdownMenuItem>
              <TableActions
                id={row.original.id}
                apiPath="/categories"
                redirectPath="/admin/categories"
                successMessage="Category deleted successfully"
                errorMessage="Failed to delete category"
              >
                <DropdownMenuItem 
                  className="text-red-600 cursor-pointer"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </TableActions>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
