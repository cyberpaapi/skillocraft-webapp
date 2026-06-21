'use client';

import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Mail, Phone, Calendar, MapPin, Edit, Package, Heart, ShoppingCart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { axiosProtected } from '@/services/axiosService';
import Image from 'next/image';
import { Customer, Order, WishlistItem, CartItem } from '@/types';

export interface CustomerAPIResponse {
  status: number;
  message: string;
  data: {
    customer: Customer;
    orders: Order[];
    wishlist: WishlistItem[];
    cart: CartItem[];
  };
}

export default function CustomerDetailsPage() {
  const router = useRouter();
  const { id } = useParams();

  const { data: customerData, isLoading, error } = useQuery<CustomerAPIResponse>({
    queryKey: ['customer', id],
    queryFn: async () => {
      try {
        const response = await axiosProtected.get(`/adminpanel/customers/${id}`);
        return response.data;
      } catch (err: unknown) {
        const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to fetch customer details';
        toast.error(message);
        throw err;
      }
    },
    enabled: !!id,
  });

  const customer = customerData?.data.customer;
  const orders = customerData?.data.orders || [];
  const wishlist = customerData?.data.wishlist || [];
  const cart = customerData?.data.cart || [];

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Customers
        </Button>
        <div className="space-y-8">
          <Skeleton className="h-10 w-64 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center space-y-4">
                    <Skeleton className="h-32 w-32 rounded-full" />
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="mt-8 space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-2">
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Customer not found</h1>
        <Button onClick={() => router.push('/admin/users/customers')}>
          Back to Customers
        </Button>
      </div>
    );
  }

  const statusColors = {
    ACTIVE: 'bg-green-100 text-green-800',
    INACTIVE: 'bg-gray-100 text-gray-800',
    SUSPENDED: 'bg-red-100 text-red-800',
  };

  const paymentTypeColors = {
    NETBNKING: 'bg-blue-100 text-blue-800',
    CREDITCARD: 'bg-purple-100 text-purple-800',
    DEBITCARD: 'bg-green-100 text-green-800',
    UPI: 'bg-orange-100 text-orange-800',
    WALLET: 'bg-yellow-100 text-yellow-800',
  };

  const orderStatusColors = {
    ACTIVE: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
    REFUNDED: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="container mx-auto py-8">
      <Button 
        variant="ghost" 
        onClick={() => router.back()} 
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Customers
      </Button>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{customer.name}</h1>
          <p className="text-muted-foreground">Customer ID: {customer.id}</p>
        </div>
        <Badge className={`${statusColors[customer.status]} capitalize`}>
          {customer.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${customer.user.id}`} alt={customer.name} />
                  <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-xl font-semibold">{customer.name}</h3>
                  <p className="text-muted-foreground">{customer.user.role}</p>
                </div>
              </div>
              
              <div className="mt-8 space-y-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{customer.user.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{customer.user.contact}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Joined {new Date(customer.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {customer.address.length > 0 && (
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-sm">
                      {customer.address[0].street}, {customer.address[0].city}<br />
                      {customer.address[0].state}, {customer.address[0].country} {customer.address[0].postalCode}
                    </span>
                  </div>
                )}
              </div>

              <Button className="w-full mt-6">
                <Edit className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Tabs */}
        <div className="md:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
              <TabsTrigger value="wishlist">Wishlist ({wishlist.length})</TabsTrigger>
              <TabsTrigger value="cart">Cart ({cart.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{customer.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{customer.user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{customer.user.contact}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className={`font-medium ${statusColors[customer.status]} capitalize`}>
                        {customer.status}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Member Since</p>
                      <p className="font-medium">{new Date(customer.createdAt).toLocaleDateString()}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Total Orders</span>
                      </div>
                      <span className="font-semibold">{orders.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Wishlist Items</span>
                      </div>
                      <span className="font-semibold">{wishlist.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Cart Items</span>
                      </div>
                      <span className="font-semibold">{cart.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Spent</span>
                      <span className="font-semibold">
                        ₹{orders.reduce((sum, order) => sum + parseFloat(order.paidAmount), 0).toFixed(2)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="orders" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>
                    All orders placed by this customer
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No orders found</p>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">Order #{order.id.slice(-8)}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge className={`${orderStatusColors[order.status]} capitalize`}>
                              {order.status}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2">
                            {order.course.map((course) => (
                              <div key={course.id} className="flex items-center space-x-3">
                                {course.image && (
                                  <Image
                                    src={course.image}
                                    alt={course.name}
                                    width={40}
                                    height={40}
                                    className="rounded-md object-cover"
                                  />
                                )}
                                <div>
                                  <p className="font-medium text-sm">{course.name}</p>
                                  <p className="text-sm text-muted-foreground">₹{course.price}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex justify-between items-center pt-3 border-t">
                            <div className="space-y-1">
                              <div className="text-sm">
                                <span className="text-muted-foreground">Payment:</span>{' '}
                                <Badge className={`${paymentTypeColors[order.paymentType]} capitalize text-xs`}>
                                  {order.paymentType.replace('_', ' ')}
                                </Badge>
                              </div>
                              {order.discountCoupon && (
                                <p className="text-sm text-muted-foreground">
                                  Discount: {order.discountCoupon.amount}{order.discountCoupon.amountType === 'PERCENT' ? '%' : ' off'}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="font-medium">₹{order.paidAmount}</p>
                              <p className="text-sm text-muted-foreground">Paid</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wishlist" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Wishlist</CardTitle>
                  <CardDescription>
                    Courses this customer has saved to their wishlist
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {wishlist.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No items in wishlist</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {wishlist.map((item) => (
                        <div key={item.id} className="border rounded-lg p-4 flex items-center space-x-4">
                          {item.course.image && (
                            <Image
                              src={item.course.image}
                              alt={item.course.name}
                              width={60}
                              height={60}
                              className="rounded-md object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-medium">{item.course.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Added {new Date(item.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">₹{item.course.price}</div>
                            <Badge className={`${statusColors[item.course.status]} capitalize text-xs`}>
                              {item.course.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cart" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Shopping Cart</CardTitle>
                  <CardDescription>
                    Courses currently in the customer cart
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {cart.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Cart is empty</p>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={item.id} className="border rounded-lg p-4 flex items-center space-x-4">
                          {item.course.image && (
                            <Image
                              src={item.course.image}
                              alt={item.course.name}
                              width={60}
                              height={60}
                              className="rounded-md object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-medium">{item.course.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Added {new Date(item.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">₹{item.course.price}</div>
                            <Badge className={`${statusColors[item.course.status]} capitalize text-xs`}>
                              {item.course.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                      <div className="pt-4 border-t">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Total:</span>
                          <span className="font-bold text-lg">
                            ₹{cart.reduce((sum, item) => sum + parseFloat(item.course.price), 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
