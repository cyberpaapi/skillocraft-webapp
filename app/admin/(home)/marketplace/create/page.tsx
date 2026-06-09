'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { axiosProtected } from '@/services/axiosService';
import { toast } from 'sonner';
import { ArrowLeft, Plus, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface Highlight { key: string; value: string; }

const CATEGORIES = ['Baking', 'Skincare', 'Artificial Jewellery', 'Hand Craft', 'Makeup', 'Cooking', 'Healthcare', 'Other'];

export default function CreateMarketplaceProductPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState('Delivery by Monday | Free');
  const [description, setDescription] = useState('');
  const [specifications, setSpecifications] = useState('');
  const [importantNote, setImportantNote] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [highlights, setHighlights] = useState<Highlight[]>([{ key: 'Type', value: '' }, { key: 'Material', value: '' }]);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const discount = price && originalPrice
    ? String(Math.round((1 - parseFloat(price) / parseFloat(originalPrice)) * 100))
    : '0';

  const addHighlight = () => setHighlights(h => [...h, { key: '', value: '' }]);
  const removeHighlight = (i: number) => setHighlights(h => h.filter((_, idx) => idx !== i));
  const updateHighlight = (i: number, field: 'key' | 'value', val: string) =>
    setHighlights(h => h.map((item, idx) => idx === i ? { ...item, [field]: val } : item));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 4) { toast.error('Maximum 4 images allowed'); return; }
    const newFiles = [...images, ...files];
    setImages(newFiles);
    setImagePreviews(newFiles.map(f => URL.createObjectURL(f)));
  };

  const removeImage = (i: number) => {
    const newFiles = images.filter((_, idx) => idx !== i);
    setImages(newFiles);
    setImagePreviews(newFiles.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price || !category) { toast.error('Name, price and category are required'); return; }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('category', category);
      formData.append('price', price);
      formData.append('originalPrice', originalPrice || price);
      formData.append('discount', discount);
      formData.append('deliveryInfo', deliveryInfo);
      formData.append('description', description);
      formData.append('specifications', specifications);
      formData.append('importantNote', importantNote);
      formData.append('status', status);
      formData.append('highlights', JSON.stringify(highlights.filter(h => h.key && h.value)));
      images.forEach((file) => formData.append('images', file));

      await axiosProtected.post('/adminpanel/marketplace-product', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Product created successfully!');
      router.push('/admin/marketplace');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to create product';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="flex items-center gap-1.5">
          <ArrowLeft size={16} /> Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Add Marketplace Product</h1>
          <p className="text-muted-foreground text-sm">Fill in the product details below</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Basic Info */}
        <Card>
          <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Professional Baking Kit – Silicone Mould Set"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as 'ACTIVE' | 'INACTIVE')}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader><CardTitle>Pricing</CardTitle><CardDescription>Set the selling price and original MRP</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price (₹) *</label>
                <input
                  type="number"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="699"
                  min="0"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Original MRP (₹)</label>
                <input
                  type="number"
                  value={originalPrice}
                  onChange={e => setOriginalPrice(e.target.value)}
                  placeholder="1499"
                  min="0"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
            {price && originalPrice && parseFloat(originalPrice) > parseFloat(price) && (
              <div className="flex items-center gap-2 text-sm bg-green-50 text-green-700 px-3 py-2 rounded-lg">
                <span className="font-semibold">{discount}% discount</span>
                <span className="text-green-500">will be shown to customers</span>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Info</label>
              <input
                type="text"
                value={deliveryInfo}
                onChange={e => setDeliveryInfo(e.target.value)}
                placeholder="Delivery by Monday | Free"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader><CardTitle>Product Images</CardTitle><CardDescription>Upload up to 4 images. First image will be the main image.</CardDescription></CardHeader>
          <CardContent>
            <div className="flex gap-3 flex-wrap">
              {imagePreviews.map((src, i) => (
                <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                  {i === 0 && <span className="absolute bottom-1 left-1 bg-primary text-white text-[9px] px-1 rounded">Main</span>}
                </div>
              ))}
              {imagePreviews.length < 4 && (
                <label className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                  <Plus size={20} className="text-gray-400" />
                  <span className="text-xs text-gray-400 mt-1">Add image</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                </label>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Highlights */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div><CardTitle>Highlights</CardTitle><CardDescription>Key product attributes shown to customers</CardDescription></div>
              <Button type="button" variant="outline" size="sm" onClick={addHighlight} className="flex items-center gap-1">
                <Plus size={14} /> Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {highlights.map((h, i) => (
              <div key={i} className="flex gap-3 items-center">
                <input
                  type="text"
                  value={h.key}
                  onChange={e => updateHighlight(i, 'key', e.target.value)}
                  placeholder="e.g. Type"
                  className="w-1/3 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <input
                  type="text"
                  value={h.value}
                  onChange={e => updateHighlight(i, 'value', e.target.value)}
                  placeholder="e.g. Knife Set"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <Button type="button" variant="ghost" size="sm" onClick={() => removeHighlight(i)} className="p-1 text-red-400 hover:text-red-600">
                  <X size={14} />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Description & Specs */}
        <Card>
          <CardHeader><CardTitle>Description & Specifications</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
                placeholder="Detailed product description..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specifications</label>
              <textarea
                value={specifications}
                onChange={e => setSpecifications(e.target.value)}
                rows={4}
                placeholder={"Material: Silicone\nDimensions: 25x17cm\nOven Safe: Yes"}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none font-mono"
              />
              <p className="text-xs text-gray-400 mt-1">One spec per line in &quot;Key: Value&quot; format</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Important Note</label>
              <textarea
                value={importantNote}
                onChange={e => setImportantNote(e.target.value)}
                rows={3}
                placeholder="Any safety warnings, legal disclaimers or usage notes..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={submitting} className="min-w-[140px]">
            {submitting ? <><Loader2 size={16} className="animate-spin mr-2" /> Creating…</> : 'Create Product'}
          </Button>
        </div>
      </form>
    </div>
  );
}
