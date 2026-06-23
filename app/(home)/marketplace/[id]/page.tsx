'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { axiosHomePublic, axiosHomeProtected } from '@/services/axiosHomeService';
import { useAuth } from '@/context/AuthContext';
import { useModal } from '@/context/ModalContext';
import { toast } from 'sonner';
import { ArrowLeft, Star, ShoppingCart, Zap, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { imgSrc } from '@/lib/imgSrc';
import type { MarketplaceProduct } from '../page';

// ─── Dummy fallback ───────────────────────────────────────────────────────────

const DUMMY_PRODUCTS: MarketplaceProduct[] = [
  { id: "mp-1", name: "Professional Baking Kit – Silicone Mould Set (12 Pieces)", images: ["/courses_1.png", "/courses_2.png", "/courses_3.png", "/courses_4.png"], price: "699", originalPrice: "1499", discount: "53", category: "Baking", highlights: [{ key: "Type", value: "Baking Kit" }, { key: "Used For", value: "Cake & Muffin Baking" }, { key: "Material", value: "Food-grade Silicone" }, { key: "Pack", value: "12 Moulds" }], description: "Upgrade your baking game with our Premium Silicone Mould Set. These food-grade silicone moulds are perfect for baking cakes, muffins, bread, chocolates, and ice. Non-stick, flexible and easy to clean. Dishwasher safe and oven-safe up to 230°C. Ideal for both beginners and professional bakers.", specifications: "Material: Food Grade Silicone\nDimensions: 25×17×3 cm per mould\nOven Safe: Up to 230°C\nDishwasher Safe: Yes\nColor: Red/Black", importantNote: "The customer hereby represents and undertakes that they are of legal age for purchase and use of this product. Handle with care and keep away from direct flame. Not suitable for children under 12.", deliveryInfo: "Delivery by Monday | Free", _dummy: true },
  { id: "mp-2", name: "Artisan Perfume Making Starter Kit", images: ["/courses_3.png", "/courses_4.png", "/courses_1.png", "/courses_2.png"], price: "1299", originalPrice: "2499", discount: "48", category: "Skincare", highlights: [{ key: "Type", value: "Perfume Kit" }, { key: "Includes", value: "10 Premium Fragrance Oils" }, { key: "Material", value: "Natural Botanical Extracts" }, { key: "Pack", value: "Complete Kit" }], description: "Create your own signature perfume at home with our Artisan Perfume Making Kit. This comprehensive kit includes everything you need to craft beautiful, long-lasting fragrances. Perfect for gifting or personal use.", specifications: "Includes: 10 Fragrance Oils, Carrier Oil, Bottles, Pipettes\nFragrance Types: Floral, Woody, Fresh, Oriental\nBottle Size: 30ml", importantNote: "Keep away from eyes. Store in a cool dry place. Patch test recommended before use.", deliveryInfo: "Delivery by Tuesday | Free", _dummy: true },
  { id: "mp-3", name: "Handmade Jewellery Starter Pack (20 Piece Set)", images: ["/courses_5.png", "/courses_6.png", "/courses_1.png", "/courses_3.png"], price: "549", originalPrice: "999", discount: "45", category: "Artificial Jewellery", highlights: [{ key: "Type", value: "DIY Jewellery Kit" }, { key: "Material", value: "Mixed (Wire, Beads, Charms)" }, { key: "Pack", value: "Set of 20" }, { key: "Skill Level", value: "Beginner Friendly" }], description: "Discover the joy of making your own beautiful jewellery with this comprehensive starter pack. Includes everything you need to create earrings, necklaces, and bracelets.", specifications: "Pieces: 20 items\nIncludes: Wire, Beads, Charms, Tools\nDifficulty: Beginner", importantNote: "Small parts included. Keep away from children under 3 years.", deliveryInfo: "Delivery by Wednesday | Free", _dummy: true },
  { id: "mp-4", name: "Professional Makeup Brush Set (15 Brushes)", images: ["/courses_2.png", "/courses_1.png", "/courses_4.png", "/courses_5.png"], price: "799", originalPrice: "1599", discount: "50", category: "Skincare", highlights: [{ key: "Type", value: "Makeup Brushes" }, { key: "Material", value: "Vegan Synthetic Bristles" }, { key: "Pack", value: "15 Brushes + Case" }, { key: "Suitable For", value: "All Skin Types" }], description: "Achieve flawless professional makeup application with this 15-piece vegan brush set. Each brush is designed for precise application of foundation, blush, eyeshadow, and more.", specifications: "Brush Count: 15\nBristle Material: Vegan Synthetic\nHandle Material: Wood\nIncludes: Carrying Pouch", importantNote: "Wash brushes before first use. Clean regularly for best results.", deliveryInfo: "Delivery by Thursday | Free", _dummy: true },
];

// ─── Main page ────────────────────────────────────────────────────────────────

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) { resolve(); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
}

export default function MarketplaceProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { openModal } = useModal();
  const queryClient = useQueryClient();

  const [product, setProduct] = useState<MarketplaceProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [orderForm, setOrderForm] = useState({ recipientName: '', phone: '', addressLine: '', city: '', state: '', pinCode: '', country: '' });
  const [hasSavedAddress, setHasSavedAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<MarketplaceProduct[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load the customer's saved address (if any) to prefill checkout
  useEffect(() => {
    if (!isLoggedIn) return;
    axiosHomeProtected.get('/accounts/addresses')
      .then(({ data }) => {
        const list = data?.data || data?.addresses || data || [];
        const addr = Array.isArray(list) ? list[0] : null;
        if (addr) {
          setOrderForm((prev) => ({
            ...prev,
            addressLine: addr.address || '',
            city: addr.city || '',
            state: addr.state || '',
            pinCode: addr.pinCode || '',
            country: addr.country || '',
          }));
          setHasSavedAddress(true);
        }
      })
      .catch(() => {});
  }, [isLoggedIn]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axiosHomePublic.get(`/marketplace-products/${id}`)
      .then(({ data }) => {
        setProduct(data?.data || data);
      })
      .catch(() => {
        const dummy = DUMMY_PRODUCTS.find(p => p.id === id) || DUMMY_PRODUCTS[0];
        setProduct(dummy);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    axiosHomePublic.get('/marketplace-products?limit=8')
      .then(({ data }) => setRelatedProducts(data?.data || data?.products || []))
      .catch(() => setRelatedProducts(DUMMY_PRODUCTS));
  }, []);

  const openCheckout = () => {
    if (!isLoggedIn) { openModal('login'); return; }
    setCheckoutOpen(true);
  };

  const addToCart = async () => {
    if (!isLoggedIn) { openModal('login'); return; }
    setAddingToCart(true);
    try {
      await axiosHomeProtected.post('/marketplace-cart', { productId: id, quantity });
      // Refresh the navbar cart badge so it reflects the new item immediately
      queryClient.invalidateQueries({ queryKey: ['navbar-data'] });
      toast.success('Added to cart!');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const setOrderField = (k: keyof typeof orderForm, v: string) =>
    setOrderForm((prev) => ({ ...prev, [k]: v }));

  const saveAddressIfNew = async () => {
    // Save the address for next time (only when not already on file)
    if (hasSavedAddress) return;
    if (!orderForm.addressLine.trim() || !/^\d{6}$/.test(orderForm.pinCode.trim())) return;
    try {
      await axiosHomeProtected.post('/accounts/address', {
        address: orderForm.addressLine.trim(),
        city: orderForm.city.trim() || undefined,
        state: orderForm.state.trim() || undefined,
        pinCode: orderForm.pinCode.trim(),
        country: orderForm.country.trim() || undefined,
      });
    } catch {
      // non-critical
    }
  };

  const placeOrder = async () => {
    if (!orderForm.addressLine.trim() || !orderForm.pinCode.trim()) {
      toast.error('Please enter your delivery address and pincode');
      return;
    }
    setPlacing(true);
    try {
      // Create the Razorpay order on the backend
      const { data: orderData } = await axiosHomeProtected.post('/razorpay/marketplace-order', {
        productId: id,
        quantity,
        recipientName: orderForm.recipientName,
        phone: orderForm.phone,
        addressLine: orderForm.addressLine,
        city: orderForm.city,
        state: orderForm.state,
        pinCode: orderForm.pinCode,
        country: orderForm.country,
      });
      const { orderId, amount, currency, keyId, totalAmount } = orderData.data;

      await loadRazorpayScript();
      const rzp = new (window as any).Razorpay({
        key: keyId,
        amount,
        currency,
        order_id: orderId,
        name: 'Skillocraft',
        description: product?.name || 'Marketplace order',
        image: '/logo.png',
        theme: { color: '#f97316' },
        handler: async (response: any) => {
          try {
            const { data: verify } = await axiosHomeProtected.post('/razorpay/verify-marketplace', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              productId: id,
              quantity,
              recipientName: orderForm.recipientName,
              phone: orderForm.phone,
              addressLine: orderForm.addressLine,
              city: orderForm.city,
              state: orderForm.state,
              pinCode: orderForm.pinCode,
              country: orderForm.country,
              totalAmount,
            });
            if (verify.status === 1) {
              await saveAddressIfNew();
              toast.success('Payment successful — your order is placed!');
              setCheckoutOpen(false);
              router.push('/thankyou');
            } else {
              toast.error('Payment verification failed. Contact support.');
            }
          } catch (e: any) {
            toast.error(e?.response?.data?.message || 'Payment verification failed');
          } finally {
            setPlacing(false);
          }
        },
        modal: { ondismiss: () => setPlacing(false) },
      });
      rzp.open();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to start payment');
      setPlacing(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={40} /></div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Product not found.</p>
        <Link href="/marketplace" className="text-primary hover:underline">Back to Marketplace</Link>
      </div>
    );
  }

  const originalPrice = parseFloat(product.originalPrice || product.price);
  const salePrice = parseFloat(product.price);
  const discountPct = product.discount || String(Math.round((1 - salePrice / originalPrice) * 100));
  const images = product.images?.length ? product.images.map((im) => imgSrc(im, '/courses_1.png')) : ['/courses_1.png'];

  const relatedByCategory = relatedProducts.filter(p => p.category === product.category && p.id !== product.id);
  const bakingProducts = relatedProducts.filter(p => p.category?.toLowerCase().includes('baking') && p.id !== product.id);

  return (
    <div className="bg-white min-h-screen">

      {/* ── Back button ───────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors">
          <ArrowLeft size={15} /> Back to Marketplace
        </button>
      </div>

      {/* ── Main product section ──────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Left: Image gallery ─────────────────────────────────────── */}
          <div className="lg:w-[45%] flex flex-col sm:flex-row gap-3">
            {/* Thumbnail strip */}
            <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-visible">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`flex-none w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${i === activeImg ? 'border-primary shadow-md' : 'border-gray-200 hover:border-gray-400'}`}
                >
                  <div className="relative w-full h-full">
                    <Image src={src} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
                  </div>
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="flex-1 relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
              {images.map((src, i) => (
                <div key={i} className={`absolute inset-0 transition-opacity duration-300 ${i === activeImg ? 'opacity-100' : 'opacity-0'}`}>
                  <Image src={src} alt={product.name} fill className="object-contain p-4" />
                </div>
              ))}
              {parseInt(discountPct) > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow">
                  {discountPct}% OFF
                </div>
              )}
              {images.length > 1 && (
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                  {images.map((_, i) => (
                    <button key={i} onClick={() => setActiveImg(i)} className={`rounded-full transition-all ${i === activeImg ? 'w-4 h-2 bg-primary' : 'w-2 h-2 bg-gray-300'}`} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Product details ──────────────────────────────────── */}
          <div className="flex-1 space-y-5">

            {/* Title + badge */}
            <div>
              <h1 className="text-lg sm:text-2xl font-semibold text-gray-900 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <button className="text-xs text-primary hover:underline">Be the first to Review this product</button>
                <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded border border-emerald-200">
                  ✓ Assured
                </span>
              </div>
            </div>

            {/* Stars (static for UI) */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5 bg-amber-50 px-2 py-1 rounded">
                {[1,2,3,4,5].map(s => <Star key={s} size={12} className={s <= 4 ? "fill-amber-400 text-amber-400" : "text-gray-300"} />)}
              </div>
              <span className="text-xs text-gray-400">4.0 (0 ratings)</span>
            </div>

            {/* Price */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-bold text-gray-900">₹{salePrice.toLocaleString()}</span>
                {originalPrice > salePrice && (
                  <>
                    <span className="text-base text-gray-400 line-through">₹{originalPrice.toLocaleString()}</span>
                    <span className="text-base text-green-600 font-semibold">{discountPct}% off</span>
                  </>
                )}
              </div>
              {product.deliveryInfo && (
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-semibold">Delivery :</span> {product.deliveryInfo}
                </p>
              )}
            </div>

            {/* Highlights */}
            {product.highlights && product.highlights.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">Highlights</h3>
                <ul className="space-y-1.5">
                  {product.highlights.map((h, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-700">
                      <span className="text-gray-400 flex-shrink-0 mt-0.5">•</span>
                      <span><span className="text-gray-500">{h.key}:</span> {h.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA buttons */}
            <div className="flex items-center gap-3 flex-wrap pt-2">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2.5 text-gray-600 hover:bg-gray-50">−</button>
                <span className="px-4 text-sm font-semibold">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-2.5 text-gray-600 hover:bg-gray-50">+</button>
              </div>
              <button
                onClick={addToCart}
                disabled={addingToCart}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm shadow-md disabled:opacity-60"
              >
                <ShoppingCart size={16} />
                {addingToCart ? 'Adding…' : 'Add to cart'}
              </button>
              <button
                onClick={openCheckout}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm shadow-md"
              >
                <Zap size={16} />
                Buy Now
              </button>
            </div>

            {/* Category */}
            <p className="text-xs text-gray-400">Category: <span className="text-primary font-medium">{product.category}</span></p>
          </div>
        </div>
      </div>

      {/* ── Description ──────────────────────────────────────────────── */}
      {product.description && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 border-t border-gray-100">
          <h2 className="text-base font-bold text-gray-900 mb-3">Description</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
        </div>
      )}

      {/* ── Specifications + Important Note ──────────────────────────── */}
      {(product.specifications || product.importantNote) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 border-t border-gray-100">
          {product.specifications && (
            <>
              <h2 className="text-base font-bold text-gray-900 mb-3">Specifications</h2>
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                {product.specifications.split('\n').map((line, i) => {
                  const [key, ...vals] = line.split(':');
                  return vals.length ? (
                    <div key={i} className="flex gap-2 py-1.5 border-b border-gray-100 last:border-0 text-sm">
                      <span className="text-gray-500 w-36 flex-shrink-0">{key.trim()}</span>
                      <span className="text-gray-900">{vals.join(':').trim()}</span>
                    </div>
                  ) : (
                    <p key={i} className="text-sm text-gray-600 py-1">{line}</p>
                  );
                })}
              </div>
            </>
          )}
          {product.importantNote && (
            <div className="border border-amber-200 bg-amber-50 rounded-xl p-5">
              <h3 className="text-sm font-bold text-amber-800 mb-2">Important Note</h3>
              <p className="text-sm text-amber-700 leading-relaxed">{product.importantNote}</p>
            </div>
          )}
        </div>
      )}

      {/* ── Related products by category (horizontal scroll) ──────────── */}
      {relatedByCategory.length > 0 && (
        <section className="px-4 sm:px-6 py-8 border-t border-gray-100">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5">
            {product.category} <span className="text-primary">Top Selling</span> Product
          </h2>
          <RelatedScroll products={relatedByCategory} />
        </section>
      )}

      {/* ── Baking Top Selling (bottom section like in mockup) ──────────── */}
      {bakingProducts.length > 0 && (
        <section className="px-4 sm:px-6 py-8 bg-orange-50/40 border-t border-gray-100">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5">
            Baking <span className="text-primary">Top Selling</span> Product
          </h2>
          <RelatedScroll products={bakingProducts} />
        </section>
      )}

      {/* ── Checkout (Razorpay) ──────────────────────────────────────── */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto" onClick={() => setCheckoutOpen(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md my-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-semibold text-gray-800">Delivery Details</h3>
              <button onClick={() => setCheckoutOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              {quantity} × <span className="font-medium">{product.name}</span> — ₹{(parseFloat(product.price) * quantity).toLocaleString()}
            </p>

            {hasSavedAddress && !editingAddress ? (
              <div className="space-y-3">
                <div className="border border-gray-200 rounded-xl p-3 bg-gray-50">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Deliver to</p>
                  <p className="text-sm text-gray-800">{orderForm.addressLine}</p>
                  <p className="text-sm text-gray-600">
                    {[orderForm.city, orderForm.state, orderForm.pinCode].filter(Boolean).join(', ')}
                  </p>
                  <button onClick={() => setEditingAddress(true)} className="mt-2 text-xs text-primary font-semibold hover:underline">Edit address</button>
                </div>
                <button onClick={placeOrder} disabled={placing} className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 rounded-lg disabled:opacity-60">
                  {placing ? 'Processing…' : `Confirm & Pay ₹${(parseFloat(product.price) * quantity).toLocaleString()}`}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input value={orderForm.recipientName} onChange={(e) => setOrderField('recipientName', e.target.value)} placeholder="Full name" className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                  <input value={orderForm.phone} onChange={(e) => setOrderField('phone', e.target.value)} placeholder="Phone" className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                </div>
                <textarea value={orderForm.addressLine} onChange={(e) => setOrderField('addressLine', e.target.value)} placeholder="Address *" rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
                <div className="grid grid-cols-3 gap-3">
                  <input value={orderForm.city} onChange={(e) => setOrderField('city', e.target.value)} placeholder="City" className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                  <input value={orderForm.state} onChange={(e) => setOrderField('state', e.target.value)} placeholder="State" className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                  <input value={orderForm.pinCode} onChange={(e) => setOrderField('pinCode', e.target.value)} placeholder="Pincode *" className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                </div>
                <button onClick={placeOrder} disabled={placing} className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 rounded-lg disabled:opacity-60">
                  {placing ? 'Processing…' : `Pay ₹${(parseFloat(product.price) * quantity).toLocaleString()}`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Related products scroll ──────────────────────────────────────────────────

function RelatedScroll({ products }: { products: MarketplaceProduct[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => ref.current?.scrollBy({ left: dir === "left" ? -220 : 220, behavior: "smooth" });

  return (
    <div className="relative">
      <button onClick={() => scroll("left")} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 bg-white shadow-md rounded-full p-1.5">
        <ChevronLeft size={16} className="text-gray-600" />
      </button>
      <div ref={ref} className="flex gap-4 overflow-x-auto pb-2 px-1" style={{ scrollbarWidth: "none" }}>
        {products.map((p, i) => (
          <Link key={p.id} href={p._dummy ? "#" : `/marketplace/${p.id}`} className="flex-none w-36 sm:w-44 group">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
              <Image src={p.images?.[0] || `/courses_${(i % 6) + 1}.png`} alt={p.name} fill sizes="176px" className="object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <p className="text-xs font-semibold text-gray-800 mt-1.5 line-clamp-2">{p.name}</p>
            <p className="text-xs text-primary font-bold mt-0.5">From ₹{parseFloat(p.price).toLocaleString()}</p>
            <span className="mt-1 inline-block text-xs bg-primary/10 text-primary font-medium px-2 py-0.5 rounded">Grab Now</span>
          </Link>
        ))}
      </div>
      <button onClick={() => scroll("right")} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 bg-white shadow-md rounded-full p-1.5">
        <ChevronRight size={16} className="text-gray-600" />
      </button>
    </div>
  );
}
