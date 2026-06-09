import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Trash2, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Order } from '@/types';
import Link from 'next/link';

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: 'id',
    header: 'Order ID',
    cell: ({ row }) => (
      <div className="font-medium">{String(row.getValue('id'))}</div>
    ),
  },
  {
    accessorKey: 'customer',
    header: 'Customer',
    cell: ({ row }) => {
      const customer = row.original.customer;
      return customer?.user?.email ? (
        <div className="font-medium">{customer.user.email}</div>
      ) : (
        <div className="text-muted-foreground">Unknown</div>
      );
    },
  },
  {
    accessorKey: 'totalAmount',
    header: 'Total Amount',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('totalAmount') || '0');
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'paidAmount',
    header: 'Paid Amount',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('paidAmount') || '0');
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'transactionId',
    header: 'Transaction ID',
    cell: ({ row }) => (
      <div className="font-mono text-sm">{String(row.getValue('transactionId'))}</div>
    ),
  },
  {
    accessorKey: 'paymentType',
    header: 'Payment Type',
    cell: ({ row }) => {
      const paymentType = row.getValue('paymentType') as string;
      const formattedType = paymentType.replace('_', ' ');
      
      const paymentTypeColors: Record<string, string> = {
        DEBITCARD: 'bg-blue-100 text-blue-800',
        CREDITCARD: 'bg-green-100 text-green-800',
        NETBNKING: 'bg-purple-100 text-purple-800',
        UPI: 'bg-orange-100 text-orange-800',
        WALLET: 'bg-yellow-100 text-yellow-800',
      };
      
      const className = paymentTypeColors[paymentType] || 'bg-gray-100 text-gray-800';
      
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
          {formattedType}
        </span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      
      const statusConfig: Record<string, { label: string; className: string }> = {
        ACTIVE: {
          label: 'Active',
          className: 'bg-green-100 text-green-800',
        },
        COMPLETED: {
          label: 'Completed',
          className: 'bg-blue-100 text-blue-800',
        },
        CANCELLED: {
          label: 'Cancelled',
          className: 'bg-red-100 text-red-800',
        },
        REFUNDED: {
          label: 'Refunded',
          className: 'bg-yellow-100 text-yellow-800',
        },
      };
      
      const config = statusConfig[status] || { 
        label: status, 
        className: 'bg-gray-100 text-gray-800' 
      };
      
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
          {config.label}
        </span>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created Date',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
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
                  href={`/admin/orders/${row.original.id}`}
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
