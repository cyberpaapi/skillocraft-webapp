'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { axiosProtected } from '@/services/axiosService';
import DataTable from '@/components/tables/revenue/DataTable';
import { columns, RevenueData } from '@/components/tables/revenue/column';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RevenuePage() {
  // State for date range
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  // Initialize date range to last 30 days
  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0]; // YYYY-MM-DD format
    };
    
    setDateRange({
      startDate: formatDate(thirtyDaysAgo),
      endDate: formatDate(today),
    });
  }, []);

  // Fetch revenue data
  const { data: revenueData, isLoading } = useQuery({
    queryKey: ['revenue', dateRange.startDate, dateRange.endDate],
    queryFn: async ({ queryKey }) => {
      const [, startDate, endDate] = queryKey as [string, string, string];
      
      if (!startDate || !endDate) {
        return null;
      }
      
      try {
        const params = new URLSearchParams({
          startDate,
          endDate,
        });
        
        const url = `/adminpanel/revenue?${params.toString()}`;

        const response = await axiosProtected.get<{ 
          status: number;
          message: string;
          data: RevenueData;
        }>(url);
        
        return response.data;
      } catch (error) {
        const err = error as { response?: { data?: { message?: string } } };
        toast.error(err.response?.data?.message || 'Failed to fetch revenue data');
        return null;
      }
    },
    enabled: !!dateRange.startDate && !!dateRange.endDate,
    refetchOnWindowFocus: false,
  });

  // Handle date range change
  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Revenue Report</h1>
          <p className="text-muted-foreground">View revenue statistics and analytics</p>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Overall Stats */}
      {revenueData?.data?.overallStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{revenueData.data.overallStats.totalOrders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{revenueData.data.overallStats.totalCourses}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(revenueData.data.overallStats.totalRevenue)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(revenueData.data.overallStats.averageOrderValue)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Daily Revenue Table */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Daily Revenue Breakdown</h2>
          <DataTable 
            columns={columns} 
            data={revenueData?.data?.dailyStats || []} 
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}