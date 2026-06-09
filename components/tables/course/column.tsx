import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Trash2, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Course, CourseStatus } from '@/types';
import Link from 'next/link';


export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: 'name',
    header: 'Course Name',
    cell: ({ row }) => (
      <div className="font-medium">{String(row.getValue('name'))}</div>
    ),
  },
  {
    accessorKey: 'shortDescription',
    header: 'Description',
    cell: ({ row }) => (
      <div className="text-muted-foreground line-clamp-2">
        {String(row.getValue('shortDescription'))}
      </div>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const category = row.original.category;
      return category ? (
        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
          {category.name}
        </span>
      ) : null;
    },
  },
  {
    accessorKey: 'subCategory',
    header: 'Subcategory',
    cell: ({ row }) => {
      const subCategory = row.original.subCategory;
      return subCategory ? (
        <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
          {subCategory.name}
        </span>
      ) : null;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as CourseStatus;
      type StatusConfig = {
        label: string;
        className: string;
      };

      const statusConfig: Record<CourseStatus, StatusConfig> = {
        published: {
          label: 'Published',
          className: 'bg-green-100 text-green-800',
        },
        draft: {
          label: 'Draft',
          className: 'bg-yellow-100 text-yellow-800',
        },
        archived: {
          label: 'Archived',
          className: 'bg-gray-100 text-gray-800',
        },
      };
      
      const config: StatusConfig = statusConfig[status] || { 
        label: status, 
        className: 'bg-gray-100 text-gray-800' 
      };
      
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
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price') || '0');
      const formatted = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
      }).format(price);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'updatedAt',
    header: 'Last Modified',
    cell: ({ row }) => {
      const date = new Date(row.getValue('updatedAt'));
      return (
        <div className="text-sm text-muted-foreground">
          {date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
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
              <DropdownMenuItem className="cursor-pointer p-0">
                <Link 
                  href={`/admin/course/${row.original.id}`}
                  className="flex items-center w-full px-2 py-1.5"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Pencil className="mr-2 h-4 w-4" />
                Edit
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
