'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { StaffRoleForm } from '@/components/forms/staff-role-form';
import { axiosProtected } from '@/services/axiosService';
import { Button } from '@/components/ui/button';

interface StaffRoleFormValues {
  name: string;
  description?: string;
  staffAccessIds: string[]; // or number[] depending on your ID type
}

export default function CreateStaffRolePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values:StaffRoleFormValues) => {
    setIsLoading(true);
    try {
      const response = await axiosProtected.post('/staff-roles', {
        name: values.name,
        description: values.description,
        staffAccessIds: values.staffAccessIds,
      });

      if (response.data.status === 1) {
        toast.success('Staff role created successfully');
        router.push('/admin/users/staff-role');
      } else {
        throw new Error(response.data.message || 'Failed to create staff role');
      }
    } catch (error: unknown) {
      console.error('Error creating staff role:', error);
      const errorMessage = error as { response?: { data?: { message?: string } } };
      toast.error(errorMessage.response?.data?.message || 'Failed to create staff role');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Create Staff Role</h1>
          <p className="text-muted-foreground">Add a new staff role with specific permissions</p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Staff Roles
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <StaffRoleForm 
            onSubmit={handleSubmit} 
            isSubmitting={isLoading}
          />
        </div>
      </div>
    </div>
  );
}