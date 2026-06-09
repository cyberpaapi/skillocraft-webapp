// components/forms/SignupForm.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { signupSchema } from '@/lib/validation/authSchemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Mail, Lock, Loader2 } from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { registerCustomer } from '@/lib/api/auth';
import { RegisterRequest } from '@/types';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

type SignupInput = z.infer<typeof signupSchema>;

interface ApiError {
  response?: {
    data?: {
      error?: {
        details?: Array<{ path: string; message: string }>;
      };
      message?: string;
    };
  };
}

interface SignupFormProps {
  onSuccess?: () => void;
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState('+91'); // Default to India's country code
  const { login } = useAuth();
  
  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      contact: ''
    },
  });

  const onSubmit = async (values: SignupInput) => {
    try {
      setIsLoading(true);
      console.log('Signup submitted:', values);
      
      // Extract just the digits for the server
      const phoneDigits = phone.replace(/\D/g, '');
      // Ensure we're only sending the last 10 digits (without country code)
      const phoneNumber = phoneDigits.slice(-10);
      
      // Extract the part before @ from email to use as name
      const nameFromEmail = values.email.split('@')[0];
      
      const registerRequest: RegisterRequest = {
        name: nameFromEmail,
        contact: phoneNumber,
        email: values.email,
        password: values.password
      };
      const response = await registerCustomer(registerRequest);
      // Check if user has CUSTOMER role
            if (response.user.role === 'CUSTOMER') {
        // Call login from AuthContext which will handle setting cookies and user state
        login(response.accessToken, {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          contact: response.user.contact,
        }, response.refreshToken);
        // Call onSuccess callback to close the modal
        if (onSuccess) onSuccess();
        toast.success('Login successful');
            }else{
              toast.error('Access denied. This is a customer-only area.');
            }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error('Signup error:', error);
      
      if (apiError.response?.data?.error?.details) {
        // Handle validation errors
        const validationErrors = apiError.response.data.error.details;
        validationErrors.forEach((err: { path: string; message: string }) => {
          // Map the error to the form field
          const fieldName = err.path.split('.').pop(); // Get the last part of the path (field name)
          if (fieldName) {
            form.setError(fieldName as keyof SignupInput, {
              type: 'manual',
              message: err.message
            });
          } else {
            toast.error(err.message);
          }
        });
      } else {
        // Handle other errors
        const errorMessage = apiError.response?.data?.message || 'An error occurred during signup. Please try again.';
        toast.error(errorMessage);
      }
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
              <FormMessage className="text-red-500 text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contact"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <div className="flex items-center bg-white rounded-md border border-input pl-3">
                    <PhoneInput
                      international
                      defaultCountry="IN"
                      value={phone}
                      onChange={(value) => {
                        setPhone(value || '');
                        field.onChange(value);
                      }}
                      className="[&>input]:!ring-0 [&>input]:!ring-offset-0 [&>input]:!ring-transparent [&>input]:focus-visible:!ring-0 [&>input]:focus-visible:!ring-offset-0 [&>input]:focus-visible:!ring-transparent [&>input]:outline-none [&>input]:border-none [&>input]:focus:border-none [&>input]:focus:outline-none [&>input]:py-2 [&>input]:text-sm"
                      placeholder="+91 1234567890"
                      onBlur={() => {
                        // Ensure the input has a country code when blurred
                        if (phone && !phone.startsWith('+')) {
                          setPhone(`+${phone.replace(/\D/g, '')}`);
                        }
                      }}
                    />
                  </div>
                </div>
              </FormControl>
              <FormMessage className="text-red-500 text-xs" />
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
              <FormMessage className="text-red-500 text-xs" />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full h-9 text-sm" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing up...
            </>
          ) : (
            'Sign Up'
          )}
        </Button>
      </form>
    </Form>
  );
}
