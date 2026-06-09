'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { axiosProtected } from '@/services/axiosService';
import { toast } from 'sonner';
import { ArrowLeft, Plus, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface Highlight { key: string; value: string; }

const CATEGORIES = ['Baking', 'Skincare', 'Artificial Jewellery', 'Hand Craft', 'Makeup', 'Cooking', 'Healthcare', 'Other'];

const DUMMY_PRODUCT = { id: "mp-1", name: "Professional Baking Kit – Silicone Mould Set", images: ["/courses_1.png"], price: "699", originalPrice: "1499", discount: "53", category: "Baking", deliveryInfo: "Delivery by Monday | Free", description: "Perfect starter baking kit.", specifications: "Material: Silicone\nOven Safe: Yes", importantNote: "Keep away from flame.", status: "ACTIVE", highlights: [{ key: "Type", value: "Baking Kit" }, { key: "Material", value: "Silicone" }] };

export default function EditMarketplaceProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState('');
  const [description, setDescription] = useState('');
  const [specifications, setSpecifications] = useState('');
  const [importantNote, setImportantNote] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;
    axiosProtected.get(`/adminpanel/marketplace-product/${id}`)
      .then(({ data }) => {
        const p = data?.data || data;
        setName(p.name || '');
        setCategory(p.category || CATEGORIES[0]);
        setPrice(p.price || '');
        setOriginalPrice(p.originalPrice || '');
        setDeliveryInfo(p.deliveryInfo || '');
        setDescription(p.description || '');
        setSpecifications(p.specifications || '');
        setImportantNote(p.importantNote || '');
        setStatus(p.status || 'ACTIVE');
        setHighlights(p.highlights || []);
        setExistingImages(p.images || []);
      })
      .catch(() => {
        const p = DUMMY_PRODUCT;
        setName(p.name); setCategory(p.category); setPrice(p.price); setOriginalPrice(p.originalPrice);
        setDeliveryInfo(p.deliveryInfo); setDescription(p.description); setSpecifications(p.specifications);
        setImportantNote(p.importantNote); setStatus(p.status as 'ACTIVE'); setHighlights(p.highlights);
        setExistingImages(p.images);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const discount = price && originalPrice
    ? String(Math.round((1 - parseFloat(price) / parseFloat(originalPrice)) * 100))
    : '0';

  const addHighlight = () => setHighlights(h => [...h, { key: '', value: '' }]);
  const removeHighlight = (i: number) => setHighlights(h => h.filter((_, idx) => idx !== i));
  const updateHighlight = (i: number, field: 'key' | 'value', val: string) =>
    setHighlights(h => h.map((item, idx) => idx === i ? { ...item, [field]: val } : item));

  const handleNewImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const total = existingImages.length + newImages.length + files.length;
    if (total > 4) { toast.error('Maximum 4 images allowed'); return; }
    setNewImages(prev => [...prev, ...files]);
    setNewPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeExisting = (i: number) => setExistingImages(imgs => imgs.filter((_, idx) => idx !== i));
  const removeNew = (i: number) => {
    setNewImages(prev => prev.filter((_, idx) => idx !== i));
    setNewPreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) { toast.error('Name and price are required'); return; }
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
      formData.append('existingImages', JSON.stringify(existingImages));
      newImages.forEach(f => formData.append('images', f));

      await axiosProtected.put(`/adminpanel/marketplace-product/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Product updated successfully!');
      router.push('/admin/marketplace');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update product';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-primary" size={32} /></div>;
  }

  const totalImages = existingImages.length + newPreviews.length;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="flex items-center gap-1.5">
          <ArrowLeft size={16} /> Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Marketplace Product</h1>
          <p className="text-muted-foreground text-sm">Update product details below</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        <Card>
          <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={status} onChange={e => setStatus(e.target.value as 'ACTIVE' | 'INACTIVE')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Pricing</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price (₹) *</label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} min="0" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Original MRP (₹)</label>
                <input type="number" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)} min="0" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
            {price && originalPrice && parseFloat(originalPrice) > parseFloat(price) && (
              <div className="text-sm bg-green-50 text-green-700 px-3 py-2 rounded-lg font-semibold">{discount}% discount shown to customers</div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Info</label>
              <input type="text" value={deliveryInfo} onChange={e => setDeliveryInfo(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Product Images</CardTitle><CardDescription>Up to 4 images. First image is the main display image.</CardDescription></CardHeader>
          <CardContent>
            <div className="flex gap-3 flex-wrap">
              {existingImages.map((src, i) => (
                <div key={`existing-${i}`} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 group">
                  <div className="relative w-full h-full">
                    <img src={src.startsWith('http') ? src : `${process.env.NEXT_PUBLIC_API_URL}${src}`} alt="" className="w-full h-full object-cover" />
                  </div>
                  <button type="button" onClick={() => removeExisting(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={12} />
                  </button>
                  {i === 0 && <span className="absolute bottom-1 left-1 bg-primary text-white text-[9px] px-1 rounded">Main</span>}
                </div>
              ))}
              {newPreviews.map((src, i) => (
                <div key={`new-${i}`} className="relative w-24 h-24 rounded-xl overflow-hidden border border-primary/40 group">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeNew(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={12} />
                  </button>
                  <span className="absolute bottom-1 left-1 bg-amber-400 text-slate-900 text-[9px] px-1 rounded">New</span>
                </div>
              ))}
              {totalImages < 4 && (
                <label className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                  <Plus size={20} className="text-gray-400" />
                  <span className="text-xs text-gray-400 mt-1">Add image</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleNewImages} />
                </label>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div><CardTitle>Highlights</CardTitle></div>
              <Button type="button" variant="outline" size="sm" onClick={addHighlight}><Plus size={14} /> Add</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {highlights.map((h, i) => (
              <div key={i} className="flex gap-3 items-center">
                <input type="text" value={h.key} onChange={e => updateHighlight(i, 'key', e.target.value)} placeholder="e.g. Type" className="w-1/3 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <input type="text" value={h.value} onChange={e => updateHighlight(i, 'value', e.target.value)} placeholder="e.g. Knife Set" className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <Button type="button" variant="ghost" size="sm" onClick={() => removeHighlight(i)} className="p-1 text-red-400 hover:text-red-600"><X size={14} /></Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Description & Specifications</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specifications</label>
              <textarea value={specifications} onChange={e => setSpecifications(e.target.value)} rows={4} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none font-mono" />
              <p className="text-xs text-gray-400 mt-1">One spec per line in &quot;Key: Value&quot; format</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Important Note</label>
              <textarea value={importantNote} onChange={e => setImportantNote(e.target.value)} rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={submitting} className="min-w-[140px]">
            {submitting ? <><Loader2 size={16} className="animate-spin mr-2" /> Saving…</> : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
