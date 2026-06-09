import { ColumnDef } from '@tanstack/react-table';

export interface DailyRevenueStat {
  date: string;
  totalOrders: number;
  totalCourses: number;
  totalRevenue: number;
}

export interface RevenueData {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  overallStats: {
    totalOrders: number;
    totalCourses: number;
    totalRevenue: number;
    averageOrderValue: number;
  };
  dailyStats: DailyRevenueStat[];
}

export const columns: ColumnDef<DailyRevenueStat>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      const date = new Date(row.getValue('date'));
      return (
        <div className="font-medium">
          {date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </div>
      );
    },
  },
  {
    accessorKey: 'totalOrders',
    header: 'Total Orders',
    cell: ({ row }) => (
      <div className="text-center">{row.getValue('totalOrders')}</div>
    ),
  },
  {
    accessorKey: 'totalCourses',
    header: 'Total Courses',
    cell: ({ row }) => (
      <div className="text-center">{row.getValue('totalCourses')}</div>
    ),
  },
  {
    accessorKey: 'totalRevenue',
    header: 'Total Revenue',
    cell: ({ row }) => {
      const revenue = parseFloat(row.getValue('totalRevenue') || '0');
      const formatted = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
      }).format(revenue);

      return <div className="font-medium text-right">{formatted}</div>;
    },
  },
];
