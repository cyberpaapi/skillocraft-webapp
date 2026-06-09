'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { axiosProtected } from '@/services/axiosService';
import DataTable from '@/components/tables/order/DataTable';
import { columns } from '@/components/tables/order/column';
import { Order } from '@/types';

export default function OrdersPage() {
  // State for data and loading
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });
  
  // Update URL when pagination changes
  useEffect(() => {
    const params = new URLSearchParams({
      page: pagination.page.toString(),
      limit: pagination.limit.toString(),
    });
    
    // Update URL without causing a page reload
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  }, [pagination.page, pagination.limit]);
  
  // Initialize state from URL on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const page = parseInt(params.get('page') || '1', 10);
      const limit = parseInt(params.get('limit') || '10', 10);
      
      setPagination(prev => ({
        ...prev,
        page: isNaN(page) ? 1 : page,
        limit: isNaN(limit) ? 10 : limit,
      }));
    }
  }, []);

  // Fetch orders with pagination
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['orders', pagination.page, pagination.limit],
    queryFn: async ({ queryKey }) => {
      const [, page, limit] = queryKey as [string, number, number];
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString()
        });
        
        const url = `/adminpanel/orders?${params.toString()}`;

        const response = await axiosProtected.get<{ 
          status: number;
          message: string;
          data: {
            orders: Order[];
            pagination: {
              currentPage: number;
              totalPages: number;
              totalOrders: number;
              limit: number;
              hasNext: boolean;
              hasPrev: boolean;
            };
          };
        }>(url);
        
        return response.data;
      } catch (error) {
        const err = error as { response?: { data?: { message?: string } } };
        toast.error(err.response?.data?.message || 'Failed to fetch orders');
        return { 
          data: { 
            orders: [], 
            pagination: { 
              currentPage: 1, 
              totalPages: 1, 
              totalOrders: 0, 
              limit: pagination.limit, 
              hasNext: false, 
              hasPrev: false 
            } 
          } 
        };
      }
    },
    refetchOnWindowFocus: false,
  });

  // Update pagination when data is fetched
  useEffect(() => {
    if (ordersData?.data?.pagination) {
      const { currentPage, totalOrders, limit } = ordersData.data.pagination;
      setPagination(prev => ({
        ...prev,
        page: currentPage,
        total: totalOrders,
        limit: limit
      }));
    }
  }, [ordersData?.data?.pagination]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setPagination(prev => ({
      ...prev,
      page
    }));
  };

  // Handle page size change
  const handlePageSizeChange = (limit: number) => {
    setPagination(prev => ({
      ...prev,
      limit,
      page: 1 // Reset to first page when changing page size
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders and payments</p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="space-y-4">
          <DataTable 
            columns={columns} 
            data={ordersData?.data?.orders || []} 
            isLoading={isLoading}
          />
          
          <div className="flex items-center justify-between px-2">
            <div className="text-sm text-muted-foreground">
              {isLoading ? (
                'Loading...'
              ) : (
                `Showing ${ordersData?.data?.orders?.length || 0} of ${pagination.total} orders`
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1 || isLoading}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!ordersData?.data?.pagination?.hasNext || isLoading}
              >
                Next
              </Button>
              <select
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                value={pagination.limit}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                disabled={isLoading}
              >
                <option value="10">10 / page</option>
                <option value="20">20 / page</option>
                <option value="50">50 / page</option>
                <option value="100">100 / page</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
