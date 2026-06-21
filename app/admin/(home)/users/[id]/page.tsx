'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Mail, Phone, Calendar, MapPin, Edit } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { User } from '@/types';

// Mock function to generate user data
const generateMockUser = (id: string): User => {
  const idNumber = parseInt(id.split('-')[1] || '0', 10) || 0;
  return {
    id,
    name: `User ${idNumber || '0'}`,
    email: `user${idNumber || '0'}@example.com`,
    role: idNumber % 3 === 0 ? 'admin' : 'customer',
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    status: ['active', 'inactive', 'suspended'][Math.floor(Math.random() * 3)] as 'active' | 'inactive' | 'suspended',
  };
};

export default function UserDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch user data
    const fetchUser = async () => {
      try {
        // In a real app, you would fetch from your API
        // const response = await fetch(`/api/admin/users/${id}`);
        // const data = await response.json();
        
        // For demo purposes, we'll use mock data
        setTimeout(() => {
          setUser(generateMockUser(id as string));
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching user:', error);
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
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

  if (!user) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">User not found</h1>
        <Button onClick={() => router.push('/admin/users')}>
          Back to Users
        </Button>
      </div>
    );
  }

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    suspended: 'bg-red-100 text-red-800',
  };

  return (
    <div className="container mx-auto py-8">
      <Button 
        variant="ghost" 
        onClick={() => router.back()} 
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
      </Button>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
          <p className="text-muted-foreground">User ID: {user.id}</p>
        </div>
        <Badge className={`${statusColors[user.status]} capitalize`}>
          {user.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <p className="text-muted-foreground">{user.role}</p>
                </div>
              </div>
              
              <div className="mt-8 space-y-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">San Francisco, CA</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
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
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Information</CardTitle>
                  <CardDescription>
                    Detailed information about the user
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p>{user.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p>{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Role</p>
                      <p>{user.role}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge className={`${statusColors[user.status]} capitalize`}>
                        {user.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Member Since</p>
                      <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Active</p>
                      <p>2 hours ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Users recent actions and events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex items-start pb-4 border-b">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {item === 1 && 'Updated profile information'}
                            {item === 2 && 'Completed a course'}
                            {item === 3 && 'Logged in from new device'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item} day{item !== 1 ? 's' : ''} ago
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage user account settings and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Email Notifications</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="marketing" className="h-4 w-4" defaultChecked />
                          <label htmlFor="marketing" className="text-sm">Marketing emails</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="product" className="h-4 w-4" defaultChecked />
                          <label htmlFor="product" className="text-sm">Product updates</label>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2">Account Actions</h4>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          Reset Password
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          Deactivate Account
                        </Button>
                        <Button variant="destructive" size="sm" className="w-full justify-start">
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                  <CardDescription>
                    View and manage billing details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Current Plan</h4>
                      <p className="text-muted-foreground">Pro Plan - ₹29/month</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Billing Cycle</h4>
                      <p className="text-muted-foreground">Monthly</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Next Billing Date</h4>
                      <p className="text-muted-foreground">
                        {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="pt-4 border-t">
                      <Button variant="outline" size="sm" className="mr-2">
                        Update Payment Method
                      </Button>
                      <Button variant="outline" size="sm">
                        View Invoices
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
