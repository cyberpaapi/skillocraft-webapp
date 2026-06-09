import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash2, Eye } from 'lucide-react';
import { Banner, Status } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

export const columns: ColumnDef<Banner>[] = [
  {
    accessorKey: 'name',
    header: 'Course Name',
    cell: ({ row }) => (
      <div className="font-medium">{String(row.getValue('name'))}</div>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => (
      <div className="text-muted-foreground line-clamp-2">
        {String(row.getValue('description'))}
      </div>
    ),
  },
  {
    accessorKey: 'bannerLocation',
    header: 'Banner Location',
    cell: ({ row }) => (
      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
        {String(row.getValue('bannerLocation'))}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as Status;
      
      interface StatusConfig {
        label: string;
        className: string;
      }
      
      const statusConfig: Record<Status, StatusConfig> = {
        ACTIVE: {
          label: 'Active',
          className: 'bg-green-100 text-green-800',
        },
        INACTIVE: {
          label: 'Inactive',
          className: 'bg-yellow-100 text-yellow-800',
        },
      };
      
      const defaultConfig: StatusConfig = { 
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
              <DropdownMenuItem className="cursor-pointer">
              <Link prefetch={false} href={`/admin/banners/${row.original.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
