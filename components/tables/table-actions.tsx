'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AlertModal } from '@/components/ui/alert-modal';
import { axiosProtected } from '@/services/axiosService';

interface TableActionsProps {
  id: string;
  categoryId?: string;
  onDelete?: () => void;
  apiPath: string;
  redirectPath: string;
  successMessage?: string;
  errorMessage?: string;
  children: React.ReactNode;
}

export function TableActions({
  id,
  categoryId,
  onDelete,
  apiPath,
  redirectPath,
  successMessage = 'Item deleted successfully',
  errorMessage = 'Failed to delete item',
  children
}: TableActionsProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axiosProtected.delete(`${apiPath}/${id}`);
      toast.success(successMessage);
      
      if (onDelete) {
        onDelete();
      } else {
        if (categoryId) {
          router.push(`${redirectPath}/${categoryId}`);
        } else {
          router.push(redirectPath);
          router.refresh();
        }
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <div onClick={() => setOpen(true)}>
        {children}
      </div>
      
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        loading={loading}
        title="Are you sure?"
        description="This action cannot be undone."
      />
    </>
  );
}
