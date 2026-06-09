'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { loginSchema } from '@/lib/validation/authSchemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { loginApi } from '@/lib/api/auth';
import { useAuth } from '@/context/AuthContext';
import type { LoginRequest } from '@/types';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { Loader2, Mail, Lock } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { login } = useAuth();
  const onSubmit = async (values: LoginFormData) => {
    setIsLoading(true);
    try {
      const loginRequest: LoginRequest = {
        email: values.email,
        password: values.password
      };
      const response = await loginApi(loginRequest);
      // Check if user has CUSTOMER role
      if (response.user.role == 'CUSTOMER') {
        // Call login from AuthContext which will handle setting cookies and user state
        login(response.accessToken, {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          contact: response.user.contact,
        }, response.refreshToken);
        toast.success('Login successful');
        if (onSuccess) onSuccess();
      }else{
        toast.error('Access denied. This is a customer-only area.');
      }
      
      
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Login failed';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input 
                    className={cn("bg-white pr-10 h-9 text-sm placeholder:text-sm placeholder:font-light", field.value && 'pr-8')} 
                    placeholder="Email" 
                    {...field} 
                  />
                  <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input
                    type="password"
                    className={cn("bg-white pr-10 h-9 text-sm placeholder:text-sm placeholder:font-light", field.value && 'pr-8')}
                    placeholder="Password"
                    {...field}
                  />
                  <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        {/* <Button type="submit" className="w-full">Login</Button> */}
        <Button type="submit" className="w-full h-9 text-sm" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </Button>
      </form>
    </Form>
  );
}
