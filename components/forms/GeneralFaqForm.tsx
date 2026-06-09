'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { axiosProtected } from '@/services/axiosService';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CourseFaqForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target as HTMLInputElement;
      
    setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosProtected.post('/adminpanel/general-faqs', 
        {
          question: formData.question,
          answer: formData.answer
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      toast.success('FAQ created successfully');
      router.push('/admin/generalfaq');
      router.refresh();
    } catch (error: unknown) {
      console.error('Error creating FAQ:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(axiosError.response?.data?.message || 'Failed to create FAQ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6">
        <div className="space-y-2">
          <Label htmlFor="question">Question</Label>
          <Input
            id="question"
            name="question"
            value={formData.question}
            onChange={handleChange}
            placeholder="Enter question"
            required
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="answer">Answer</Label>
          <Textarea
            id="answer"
            name="answer"
            value={formData.answer}
            onChange={handleChange}
            placeholder="Enter answer"
            className="min-h-[100px]"
            required
            disabled={loading}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Create General FAQ'
          )}
        </Button>
      </div>
    </form>
  );
}
