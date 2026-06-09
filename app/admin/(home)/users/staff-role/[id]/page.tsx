'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Edit, UserCog, Shield, Users, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { axiosProtected } from '@/services/axiosService';
import { toast } from 'sonner';

interface StaffRole {
  id: string;
  name: string;
  description?: string;
  staffAccess: Array<{
    id: string;
    name: string;
    routeUrl: string;
    method: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function StaffRoleDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [role, setRole] = useState<StaffRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRoleDetails = async () => {
      try {
        const { data } = await axiosProtected.get(`/staff-roles/${id}`);
        if (data.status === 1) {
          setRole(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch role details');
        }
      } catch (error) {
        console.error('Error fetching role details:', error);
        toast.error('Failed to load role details');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchRoleDetails();
    }
  }, [id]);

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!role) {
    return <div className="p-6">Role not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Roles
          </Button>
          <h1 className="mt-4 text-3xl font-bold tracking-tight">Role Details</h1>
        </div>
        <Button
          onClick={() => router.push(`/admin/users/staff-role/${id}/edit`)}
          className="gap-2"
        >
          <Edit className="h-4 w-4" />
          Edit Role
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Basic Info Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <UserCog className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="text-2xl">{role.name}</CardTitle>
                <CardDescription>Role Information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {role.description && (
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="mt-1">{role.description}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Created At</p>
                <p>{new Date(role.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p>{new Date(role.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Permissions Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Permissions</CardTitle>
                <CardDescription>Access rights for this role</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {role.staffAccess.length > 0 ? (
              <div className="space-y-4">
                <div className="rounded-md border">
                  <div className="grid grid-cols-3 gap-4 p-4 font-medium border-b">
                    <div>Name</div>
                    <div>Route</div>
                    <div>Method</div>
                  </div>
                  {role.staffAccess.map((access) => (
                    <div
                      key={access.id}
                      className="grid grid-cols-3 gap-4 p-4 border-b last:border-b-0 hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-2">
                        <ListChecks className="h-4 w-4 text-muted-foreground" />
                        {access.name}
                      </div>
                      <div className="text-muted-foreground">
                        {access.routeUrl}
                      </div>
                      <div>
                        <Badge
                          variant={
                            access.method === 'GET'
                              ? 'outline'
                              : access.method === 'POST'
                              ? 'secondary'
                              : access.method === 'PUT' || access.method === 'PATCH'
                              ? 'default'
                              : 'destructive'
                          }
                        >
                          {access.method}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Users className="h-10 w-10 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">No permissions assigned</h3>
                <p className="text-sm text-muted-foreground">
                  This role does not have any specific permissions yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}