'use client';

import { useState, useEffect } from 'react';
import { ControllerRenderProps, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { staffRoleFormSchema, type StaffRoleFormValues } from '@/schema/staff-role.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { axiosProtected } from '@/services/axiosService';

export interface StaffAccess {
  id: string;
  routeName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  StaffRole: {
    id: string;
    name: string;
    description: string | null;
  } | null;
}

interface StaffRoleFormProps {
  onSubmit: (values: StaffRoleFormValues) => Promise<void>;
  isSubmitting?: boolean;
  defaultValues?: Partial<StaffRoleFormValues> & { staffAccessList?: StaffAccess[] };
}

export function StaffRoleForm({ onSubmit, isSubmitting = false, defaultValues }: StaffRoleFormProps) {
  const [staffAccessList, setStaffAccessList] = useState<StaffAccess[]>(defaultValues?.staffAccessList || []);
  const [isFetchingAccess, setIsFetchingAccess] = useState(!defaultValues?.staffAccessList?.length);

  const form = useForm<StaffRoleFormValues>({
    resolver: zodResolver(staffRoleFormSchema),
    defaultValues: {
      name: '',
      description: '',
      staffAccessIds: [],
      ...defaultValues,
    },
  });

  // Fetch staff access list if not provided
  useEffect(() => {
    if (staffAccessList.length === 0) {
      const fetchStaffAccess = async () => {
        try {
          const response = await axiosProtected.get('/adminpanel/staff-access');
          if (response.data.status === 1) {
            setStaffAccessList(response.data.data);
          }
        } catch (error) {
          console.error('Error fetching staff access:', error);
        } finally {
          setIsFetchingAccess(false);
        }
      };

      fetchStaffAccess();
    } else {
      setIsFetchingAccess(false);
    }
  }, []);

  const handleCheckboxChange = (field:ControllerRenderProps<StaffRoleFormValues, 'staffAccessIds'>, accessId: string, checked: boolean) => {
    const currentValues = field.value || [];
    if (checked) {
      field.onChange([...currentValues, accessId]);
    } else {
      field.onChange(currentValues.filter((id: string) => id !== accessId));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Content Manager"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter role description"
                      className="min-h-[100px]"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="staffAccessIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Permissions *</FormLabel>
                {isFetchingAccess ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : staffAccessList.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {staffAccessList.map((access) => (
                      <div key={access.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`permission-${access.id}`}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(field, access.id, checked as boolean)
                          }
                          checked={field.value?.includes(access.id)}
                          disabled={isSubmitting}
                        />
                        <Label
                          htmlFor={`permission-${access.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {access.routeName}
                        </Label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No permissions available</p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isFetchingAccess}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {defaultValues?.name ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                defaultValues?.name ? 'Update Role' : 'Create Role'
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
