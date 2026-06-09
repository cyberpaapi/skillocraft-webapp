import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { User } from '@/types';

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <div className="font-medium">{String(row.getValue('name'))}</div>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const statusClasses = {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-gray-100 text-gray-800',
        suspended: 'bg-red-100 text-red-800',
      };
      
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'
        }`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Joined',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original;
      let viewUrl = '';
      
      switch (user.role) {
        case 'admin':
          viewUrl = `/admin/users/admins/${user.id}`;
          break;
        case 'customer':
          viewUrl = `/admin/users/customers/${user.id}`;
          break;
        case 'staff':
          viewUrl = `/admin/users/staff/${user.id}`;
          break;
        default:
          viewUrl = `/admin/users/${user.id}`;
      }
      
      return (
        <div className="text-right">
          <a 
            href={viewUrl}
            className="text-sm font-medium text-primary hover:underline"
          >
            View
          </a>
        </div>
      );
    },
  },
];
