import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Trash2, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Product } from '@/types';
import Link from 'next/link';

export const getProductColumns = (courseId: string): ColumnDef<Product>[] => [
  {
    accessorKey: 'name',
    header: 'Name',
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
    accessorKey: 'videoLink',
    header: 'Video',
    cell: ({ row }) => {
      const videoLink = row.getValue('videoLink');
      return (
        <div className="text-muted-foreground truncate max-w-xs">
          {videoLink ? (
            <a 
              href={String(videoLink)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              View Video
            </a>
          ) : 'No video'}
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <span 
          className={`px-2 py-1 text-xs rounded-full ${
            status === 'ACTIVE' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex justify-end space-x-2">
          <Link 
            href={`/admin/course/${courseId}/${row.original.id}`}
            className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">View</span>
          </Link>
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
                  href={`#`} // TODO: Update with edit link
                  className="flex items-center w-full px-2 py-1.5"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer p-0">
                <button 
                  className="flex items-center w-full px-2 py-1.5 text-red-600"
                  onClick={() => {
                    // TODO: Implement delete functionality
                    console.log('Delete product', product.id);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
