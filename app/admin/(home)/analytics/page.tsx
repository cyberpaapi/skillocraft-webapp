'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { axiosProtected } from '@/services/axiosService';

type CustomerType = 'total-customers' | 'cart-only' | 'with-purchases' | 'inactive';

interface Customer {
  id: string;
  name: string;
  email: string;
  status: string;
  lastActive: string;
}

export default function AnalyticsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const type = searchParams.get('type') as CustomerType;
  const count = searchParams.get('count');

  useEffect(() => {
    const fetchCustomers = async () => {
      if (!type) {
        console.log('No customer type provided');
        return;
      }
      
      try {
        console.log(`Fetching customer analysis data`);
        setIsLoading(true);
        
        // Fetch all customer analysis data
        const response = await axiosProtected.get('http://localhost:4000/adminpanel/customer-analysis');
        console.log('API Response:', response.data);
        
        if (response.data?.success) {
          const data = response.data.data;
          
          // Define customer type
          type CustomerData = {
            id: string;
            name: string;
            email: string;
            purchaseCount: number;
            totalSpent: number;
            cartItemCount: number;
            lastPurchaseDate?: string;
            joinedDate: string;
          };

          // Map the type to the corresponding data property with proper typing
          const dataMapping: Record<CustomerType, CustomerData[]> = {
            'total-customers': [
              ...(data.customersWithCartOnly || []) as CustomerData[],
              ...(data.customersWithPurchases || []) as CustomerData[],
              ...(data.inactiveCustomers || []) as CustomerData[]
            ],
            'cart-only': (data.customersWithCartOnly || []) as CustomerData[],
            'with-purchases': (data.customersWithPurchases || []) as CustomerData[],
            'inactive': (data.inactiveCustomers || []) as CustomerData[]
          };
          
          const customersData = dataMapping[type] || [];
          console.log('Filtered customers data:', customersData);
          
          // Transform the data to match our Customer interface
          const formattedCustomers = customersData.map(customer => ({
            id: customer.id,
            name: customer.name,
            email: customer.email,
            status: customer.purchaseCount > 0 ? 'active' : 'inactive',
            lastActive: customer.lastPurchaseDate || customer.joinedDate,
            purchaseCount: customer.purchaseCount,
            totalSpent: customer.totalSpent,
            cartItemCount: customer.cartItemCount
          }));
          
          setCustomers(formattedCustomers);
          
          // Show a success toast with the count
          const count = customersData.length;
          toast.success(`Found ${count} ${type.replace('-', ' ')}`);
        } else {
          throw new Error(response.data?.message || 'Failed to fetch customer analysis data');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        const axiosError = error as { response?: { data?: unknown; status?: number } };
        
        console.error('Error in fetchCustomers:', {
          message: errorMessage,
          response: axiosError.response?.data,
          status: axiosError.response?.status
        });
        
        toast.error(`Failed to load customer data: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (type) {
      console.log('Fetching customer analysis data...');
      fetchCustomers();
    } else {
      console.warn('No customer type provided in URL');
    }
  }, [type]);

  const getTitle = () => {
    switch (type) {
      case 'total-customers':
        return 'All Customers';
      case 'cart-only':
        return 'Customers with Cart Only';
      case 'with-purchases':
        return 'Customers with Purchases';
      case 'inactive':
        return 'Inactive Customers';
      default:
        return 'Customer Analytics';
    }
  };

  if (!type) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-xl font-semibold mb-4">No customer type selected</h2>
        <Button onClick={() => router.push('/admin/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => router.back()}
          className="shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{getTitle()}</h1>
          {count && (
            <p className="text-sm text-muted-foreground">
              Total: {parseInt(count).toLocaleString()} customers
            </p>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : customers.length > 0 ? (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {customers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {customer.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {customer.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            customer.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {customer.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(customer.lastActive).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No customers found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}