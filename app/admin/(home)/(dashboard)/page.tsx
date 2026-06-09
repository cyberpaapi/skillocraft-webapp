'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomerPieChart } from '@/components/charts/CustomerPieChart';
import { MonthlyRevenueChart } from '@/components/charts/MonthlyRevenueChart';
import { toast } from 'sonner';
import { axiosProtected } from '@/services/axiosService';
import { CustomerAnalysisChart } from '@/components/admin/CustomerAnalysisChart';

interface DashboardStats {
  total_customer: number;
  total_courses: number;
  total_orders: number;
  total_earnings: number;
  todays_earnings: number;
  customer_distribution: {
    customer_purchased: number;
    customer_not_purchased: number;
  };
  revenue: {
    january: number;
    february: number;
    march: number;
    april: number;
    may: number;
    june: number;
    july: number;
    august: number;
    september: number;
    october: number;
    november: number;
    december: number;
  };
}

function DashboardContent() {
  const [customerAnalysis, setCustomerAnalysis] = useState<{
  totalCustomers: number;
  customersWithCartOnly: number;
  customersWithPurchases: number;
  inactiveCustomers: number;
} | null>(null);

  const [stats, setStats] = useState<{
    name: string;
    value: string;
    change: string;
    changeType: 'positive' | 'negative' | 'neutral';
  }[]>([]);
  const [customerData, setCustomerData] = useState<{
    customer_purchased: number;
    customer_not_purchased: number;
  }>({ customer_purchased: 0, customer_not_purchased: 0 });
  const [revenueData, setRevenueData] = useState<DashboardStats['revenue'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerAnalysis = async () => {
      try {
        const response = await axiosProtected.get('/adminpanel/customer-analysis');
        if (response.data?.success) {
          setCustomerAnalysis(response.data.data.stats);
        } else {
          throw new Error(response.data?.message || 'Failed to fetch customer analysis');
        }
      } catch (error) {
        console.error('Error fetching customer analysis:', error);
        toast.error('Failed to load customer analysis data');
      }
    };

    fetchCustomerAnalysis();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      // Skip if we're on the auth page to prevent redirect loops
      if (typeof window !== 'undefined' && window.location.pathname.includes('/admin/auth')) {
        return;
      }

      try {
        setIsLoading(true);
        const response = await axiosProtected.get('/dashboard/stats');
        
        if (response.data.status === 1) {
          const data = response.data.Data;
          
          // Update stats cards
          setStats([
            { 
              name: 'Total Customers', 
              value: data.total_customer.toLocaleString(), 
              change: '+0%', 
              changeType: 'neutral' as const 
            },
            { 
              name: 'Total Courses', 
              value: data.total_courses.toString(), 
              change: '+0%', 
              changeType: 'neutral' as const 
            },
            { 
              name: 'Total Revenue', 
              value: `$${data.total_earnings.toLocaleString()}`, 
              change: data.todays_earnings > 0 ? `+${data.todays_earnings}%` : `${data.todays_earnings}%`, 
              changeType: data.todays_earnings >= 0 ? 'positive' : 'negative' as const 
            },
            { 
              name: 'Total Orders', 
              value: data.total_orders.toString(), 
              change: '+0%', 
              changeType: 'neutral' as const 
            },
          ]);

          // Update customer distribution
          setCustomerData(data.customer_distribution);
          
          // Update revenue data
          setRevenueData(data.revenue);
        } else {
          throw new Error(response.data.message || 'Failed to fetch dashboard stats');
        }
      } catch (error: unknown) {
        console.error('Error fetching dashboard data:', error);
        
        // Don't show error toast for 401 as we'll redirect to login
        const status = (error as { response?: { status?: number } })?.response?.status;
        if (status !== 401) {
          toast.error('Failed to load dashboard data');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Welcome back!</p>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CustomerPieChart data={customerData} />
        </Card>
        <Card>
          <MonthlyRevenueChart data={revenueData} />
        </Card>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array(4).fill(0).map((_, index) => (
            <Card key={index} className="px-4 py-5 sm:p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            </Card>
          ))
        ) : stats.map((stat) => (
          <Card key={stat.name} className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
            <dd className="mt-1 flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
              <div
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.change}
              </div>
            </dd>
          </Card>
        ))}
      </div>

      {/* Add this after your existing stats cards */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Customer Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          {customerAnalysis ? (
            <div className="h-[400px]">
              <CustomerAnalysisChart data={customerAnalysis} />
            </div>
          ) : (
            <div className="h-[400px] flex items-center justify-center">
              <p>Loading customer analysis data...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminDashboard() {
  return <DashboardContent />;
}