'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  FiShoppingBag, 
  FiCheckCircle, 
  FiClock, 
  FiXCircle, 
  FiTruck, 
  FiDollarSign 
} from 'react-icons/fi';
import { axiosHomeProtected } from '@/services/axiosHomeService';

interface Course {
  id: string;
  name: string;
  price: string;
  image?: string;
}

interface DiscountCoupon {
  id: string;
  couponId: string;
  amount: string;
  amountType: 'PERCENTAGE' | 'FIXED';
}

interface Order {
  id: string;
  customerId: string;
  totalAmount: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  createdAt: string;
  updatedAt: string;
  course: Course[];
  discountCoupon?: DiscountCoupon;
}

const statusIcons = {
  PENDING: <FiClock className="text-yellow-500" />,
  PROCESSING: <FiClock className="text-blue-500" />,
  SHIPPED: <FiTruck className="text-blue-500" />,
  DELIVERED: <FiCheckCircle className="text-green-500" />,
  CANCELLED: <FiXCircle className="text-red-500" />,
  REFUNDED: <FiDollarSign className="text-purple-500" />,
} as const;

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-purple-100 text-purple-800',
} as const;

const OrdersList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosHomeProtected.get<{ 
          status: number; 
          message: string; 
          data: Order[] 
        }>('/orders');
        
        if (response.data?.data) {
          setOrders(response.data.data);
        } else {
          setError('No orders found');
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <FiShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Error loading orders</h3>
        <p className="mt-1 text-gray-500">{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <FiShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">No orders yet</h3>
        <p className="mt-1 text-gray-500">When you place an order, you will find its status and details here.</p>
        <div className="mt-6">
          <Link
            href="/courses"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {orders.map((order) => (
          <li key={order.id} className="p-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                  statusColors[order.status] || 'bg-gray-100'
                }`}>
                  {statusIcons[order.status] || <FiShoppingBag className="h-5 w-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Order #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <div className="flex items-center mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      statusColors[order.status] || 'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">${order.totalAmount}</p>
                <p className="text-sm text-gray-500">
                  {order.course.length} {order.course.length === 1 ? 'course' : 'courses'}
                </p>
              </div>
            </div>

            {order.course.length > 0 && (
              <div className="mt-4 border-t border-gray-100 pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Courses</h4>
                <ul className="space-y-3">
                  {order.course.map((course) => (
                    <li key={course.id} className="flex items-center">
                      <div className="flex-shrink-0 h-16 w-16 bg-gray-200 rounded-md overflow-hidden">
                        {course.image ? (
                          <img
                            src={course.image.startsWith('http') ? course.image : `${process.env.NEXT_PUBLIC_API_URL}${course.image}`}
                            alt={course.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-gray-300 flex items-center justify-center">
                            <FiShoppingBag className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <h5 className="text-sm font-medium text-gray-900">{course.name}</h5>
                        <p className="text-sm text-gray-500">₹{course.price}</p>
                      </div>
                      <div className="ml-4">
                        <Link
                          href={`/courses/${course.id}`}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          View Course
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {order.discountCoupon && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Discount ({order.discountCoupon.couponId}):</span>
                  <span className="font-medium">
                    {order.discountCoupon.amountType === 'PERCENTAGE' 
                      ? `${order.discountCoupon.amount}%` 
                      : `-$${order.discountCoupon.amount}`}
                  </span>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrdersList;
