'use client';

import { useParams } from 'next/navigation';
import { ProductForm } from '@/components/forms/ProductForm';



export default function CreateProductPage() {
  const { id: courseId } = useParams<{ id: string }>();

  return <ProductForm courseId={courseId as string} />;
}
