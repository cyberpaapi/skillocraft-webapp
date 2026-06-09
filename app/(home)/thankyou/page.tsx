'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Thank You!</h1>
        <p className="text-gray-600 mb-6">
          Your order has been placed successfully. We have sent you an email with all the details.
        </p>
        
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/courses">
              Continue Learning
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            asChild
          >
            <Link href="/">
              Back to Home
            </Link>
          </Button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Need help?{' '}
            <Link href="/contact" className="text-primary hover:underline">
              Contact our support
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}