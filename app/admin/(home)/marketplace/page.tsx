'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosProtected } from '@/services/axiosService';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Eye, Loader2, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MarketplaceProduct {
  id: string;
  name: string;
  images: string[];
  price: string;
  originalPrice: string;
  discount: string;
  category: string;
  status: string;
  createdAt: string;
}

const DUMMY: MarketplaceProduct[] = [
  { id: "mp-1", name: "Professional Baking Kit – Silicone Mould Set", images: ["/courses_1.png"], price: "699", originalPrice: "1499", discount: "53", category: "Baking", status: "ACTIVE", createdAt: new Date().toISOString() },
  { id: "mp-2", name: "Artisan Perfume Making Starter Kit", images: ["/courses_3.png"], price: "1299", originalPrice: "2499", discount: "48", category: "Skincare", status: "ACTIVE", createdAt: new Date().toISOString() },
  { id: "mp-3", name: "Handmade Jewellery Starter Pack", images: ["/courses_5.png"], price: "549", originalPrice: "999", discount: "45", category: "Artificial Jewellery", status: "ACTIVE", createdAt: new Date().toISOString() },
  { id: "mp-4", name: "Professional Makeup Brush Set", images: ["/courses_2.png"], price: "799", originalPrice: "1599", discount: "50", category: "Skincare", status: "INACTIVE", createdAt: new Date().toISOString() },
];

export default function AdminMarketplacePage() {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: products, isLoading } = useQuery<MarketplaceProduct[]>({
    queryKey: ['admin-marketplace-products'],
    queryFn: async () => {
      try {
        const res = await axiosProtected.get('/adminpanel/marketplace-product');
        return res.data?.data || res.data?.products || [];
      } catch {
        return DUMMY;
      }
    },
    refetchOnWindowFocus: false,
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    try {
      setDeletingId(id);
      await axiosProtected.delete(`/adminpanel/marketplace-product/${id}`);
      toast.success('Product deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-marketplace-products'] });
    } catch {
      toast.error('Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Marketplace Products</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage products shown on the marketplace</p>
        </div>
        <Link href="/admin/marketplace/create">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : !products?.length ? (
          <div className="text-center py-16 text-muted-foreground">
            <Tag size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No products yet</p>
            <p className="text-sm mt-1">Add your first marketplace product to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Product</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Price</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Discount</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={product.images?.[0] || '/courses_1.png'}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-medium text-gray-900 line-clamp-2 max-w-xs">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <span className="font-semibold text-gray-900">₹{parseFloat(product.price).toLocaleString()}</span>
                        {product.originalPrice && (
                          <span className="text-xs text-gray-400 line-through ml-1">₹{parseFloat(product.originalPrice).toLocaleString()}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-green-600 font-semibold">{product.discount}% off</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        product.status === 'ACTIVE'
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        {product.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/marketplace/${product.id}`} target="_blank">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-primary">
                            <Eye size={15} />
                          </Button>
                        </Link>
                        <Link href={`/admin/marketplace/${product.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-primary">
                            <Pencil size={15} />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
                          onClick={() => handleDelete(product.id)}
                          disabled={deletingId === product.id}
                        >
                          {deletingId === product.id
                            ? <Loader2 size={15} className="animate-spin" />
                            : <Trash2 size={15} />}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
