'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaStar, FaTrashAlt, FaSpinner } from 'react-icons/fa';
import { IoCalendarOutline, IoTimeOutline, IoLocationOutline } from 'react-icons/io5';
import { useQuery } from '@tanstack/react-query';
import { axiosHomeProtected } from '@/services/axiosHomeService';
import { useInvalidateNavbarData } from '@/hooks/useInvalidateNavbarData';
import { useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';

type CartItem = {
  id: string;
  courseId: string;
  name: string;
  imageLink: string;
  shortDescription: string;
  price: string;
  originalPrice?: string;
  discountedPrice?: string | null;
  orderCount: number;
};

type CartResponse = {
  status: number;
  courses: CartItem[];
};

type EventRegistration = {
  id: string;
  amount: string;
  event: {
    id: string;
    title: string;
    date: string;
    time: string;
    venue: string;
    imageLink?: string;
    price: string;
  };
};

const TABS = [
  { key: 'courses', label: 'Courses', color: 'text-orange-500', activeBg: 'bg-orange-500', border: 'border-orange-500' },
  { key: 'marketplace', label: 'Marketplace', color: 'text-emerald-600', activeBg: 'bg-emerald-500', border: 'border-emerald-500' },
  { key: 'events', label: 'Live Events', color: 'text-blue-600', activeBg: 'bg-blue-500', border: 'border-blue-500' },
] as const;

type TabKey = typeof TABS[number]['key'];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) { resolve(); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
}

export default function ContentMain() {
  const router = useRouter();
  const { invalidateNavbarData } = useInvalidateNavbarData();
  const [activeTab, setActiveTab] = useState<TabKey>('courses');
  const [isProcessing, setIsProcessing] = useState(false);

  // Coupon / referral code state
  const [codeInput, setCodeInput] = useState('');
  const [applyingCode, setApplyingCode] = useState(false);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [discountLabel, setDiscountLabel] = useState('');
  const [codeError, setCodeError] = useState('');

  const { data: cartData, isLoading: cartLoading, refetch } = useQuery<CartResponse>({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await axiosHomeProtected.get('/cart');
      return res.data as CartResponse;
    },
    retry: 1,
  });

  const { data: eventsData, isLoading: eventsLoading } = useQuery<EventRegistration[]>({
    queryKey: ['my-event-registrations'],
    queryFn: async () => {
      const res = await axiosHomeProtected.get('/events/my-registrations');
      return res.data?.data || [];
    },
    retry: 1,
  });

  const handleRemove = async (itemId: string) => {
    try {
      await axiosHomeProtected.delete(`/cart/${itemId}`);
      refetch();
      invalidateNavbarData();
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const courseTotal = cartData?.courses?.reduce((s, i) => s + parseFloat(i.price), 0) ?? 0;
  const grandTotal = Math.max(0, courseTotal - discount);

  const applyCode = async () => {
    const code = codeInput.trim();
    setCodeError('');
    if (!code) { setCodeError('Enter a coupon or referral code'); return; }
    if (!cartData?.courses?.length) { setCodeError('Your cart is empty'); return; }
    setApplyingCode(true);
    try {
      const { data } = await axiosHomeProtected.post('/checkout/validate-code', {
        code,
        cartIds: cartData.courses.map(c => c.id),
      });
      if (data?.valid && data?.data?.applied) {
        setDiscount(Number(data.data.discount) || 0);
        setDiscountLabel(data.data.applied.label || 'Discount applied');
        setAppliedCode(code);
        toast.success('Code applied!');
      } else {
        setDiscount(0);
        setAppliedCode(null);
        setDiscountLabel('');
        setCodeError(data?.message || 'Invalid code');
      }
    } catch (err: any) {
      setCodeError(err?.response?.data?.message || 'Failed to apply code');
    } finally {
      setApplyingCode(false);
    }
  };

  const removeCode = () => {
    setAppliedCode(null);
    setDiscount(0);
    setDiscountLabel('');
    setCodeInput('');
    setCodeError('');
  };

  const handleCheckout = async () => {
    if (!cartData?.courses?.length) return;
    setIsProcessing(true);
    try {
      // Step 1: Create Razorpay order on backend (server computes the authoritative amount + discount)
      const { data: orderData } = await axiosHomeProtected.post('/razorpay/course-order', {
        cartIds: cartData.courses.map(c => c.id),
        code: appliedCode || undefined,
      });

      const { orderId, amount, currency, keyId, totalAmount: serverTotal } = orderData.data;
      const chargedTotal = serverTotal ?? grandTotal.toFixed(2);
      const cartIds = cartData.courses.map(c => c.id);

      // Step 2: Load Razorpay script
      await loadRazorpayScript();

      // Step 3: Open Razorpay checkout
      const rzp = new (window as any).Razorpay({
        key: keyId,
        amount,
        currency,
        order_id: orderId,
        name: 'Skillocraft',
        description: `${cartData.courses.length} course(s)`,
        image: '/logo.png',
        theme: { color: '#f97316' },
        handler: async (response: any) => {
          try {
            // Step 4: Verify payment on backend
            const { data: verifyData } = await axiosHomeProtected.post('/razorpay/verify-course', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              cartIds,
              totalAmount: chargedTotal,
            });
            if (verifyData.status === 1) {
              invalidateNavbarData();
              router.push('/thankyou');
            } else {
              toast.error('Payment verification failed. Contact support.');
            }
          } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Payment verification failed');
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => setIsProcessing(false),
        },
      });
      rzp.open();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to initiate payment');
      setIsProcessing(false);
    }
  };

  const getImgSrc = (link?: string) => {
    if (!link) return '/placeholder-course.jpg';
    return link.startsWith('http') ? link : `${API_BASE}${link}`;
  };

  const courses = cartData?.courses || [];
  const events = eventsData || [];
  const isLoading = cartLoading || eventsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  const activeTabConfig = TABS.find(t => t.key === activeTab)!;

  return (
    <div className="min-h-screen p-4 max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
      {/* Left Panel */}
      <div className="w-full lg:w-3/4 space-y-4">

        {/* Tab Bar */}
        <div className="flex gap-1 bg-gray-100 rounded-2xl p-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.key
                  ? `${tab.activeBg} text-white shadow`
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {tab.key === 'courses' && courses.length > 0 && (
                <span className={`ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full text-xs ${
                  activeTab === tab.key ? 'bg-white/30' : 'bg-gray-300 text-gray-600'
                }`}>
                  {courses.length}
                </span>
              )}
              {tab.key === 'events' && events.length > 0 && (
                <span className={`ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full text-xs ${
                  activeTab === tab.key ? 'bg-white/30' : 'bg-gray-300 text-gray-600'
                }`}>
                  {events.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content Box */}
        <div className={`rounded-3xl p-6 ${
          activeTab === 'courses' ? 'bg-orange-50' :
          activeTab === 'marketplace' ? 'bg-emerald-50' : 'bg-blue-50'
        }`}>

          {/* COURSES TAB */}
          {activeTab === 'courses' && (
            courses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No courses in your cart yet</p>
                <Link href="/courses" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                  Browse Courses
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-800">Courses ({courses.length})</h2>
                {courses.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl p-4 flex flex-col md:flex-row gap-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-full md:w-44 h-32 relative rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image src={getImgSrc(item.imageLink)} alt={item.name} fill className="object-cover" sizes="176px" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-base font-semibold text-gray-800">{item.name}</h3>
                        <button onClick={() => handleRemove(item.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1">
                          <FaTrashAlt size={13} />
                        </button>
                      </div>
                      <p className="text-gray-500 text-sm mt-1 line-clamp-2">{item.shortDescription}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-lg font-bold text-orange-500">
                          ₹{parseFloat(item.price).toFixed(2)}
                          {item.discountedPrice && item.originalPrice && (
                            <span className="ml-2 text-sm font-normal text-gray-400 line-through">₹{parseFloat(item.originalPrice).toFixed(2)}</span>
                          )}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <FaStar className="text-yellow-400" />
                          <span className="text-gray-600">4.8</span>
                          <span>·</span>
                          <span>{item.orderCount} students</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* MARKETPLACE TAB */}
          {activeTab === 'marketplace' && (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🛍️</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Marketplace Cart Coming Soon</h3>
              <p className="text-gray-500 text-sm mb-6">Browse our marketplace and add physical products to your cart.</p>
              <Link href="/marketplace" className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium">
                Browse Marketplace
              </Link>
            </div>
          )}

          {/* LIVE EVENTS TAB */}
          {activeTab === 'events' && (
            events.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">🎪</div>
                <p className="text-gray-500 mb-4">No events registered yet</p>
                <Link href="/live" className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                  Browse Events
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-800">Registered Events ({events.length})</h2>
                {events.map((reg) => (
                  <div key={reg.id} className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm">
                    <div className="w-32 h-20 relative rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      {reg.event.imageLink ? (
                        <Image src={getImgSrc(reg.event.imageLink)} alt={reg.event.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl bg-blue-50">🎪</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-800">{reg.event.title}</h3>
                      <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><IoCalendarOutline />{reg.event.date}</span>
                        <span className="flex items-center gap-1"><IoTimeOutline />{reg.event.time}</span>
                        <span className="flex items-center gap-1"><IoLocationOutline />{reg.event.venue}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm font-bold text-blue-600">
                          {!reg.event.price || reg.event.price === '0' ? 'Free' : `₹${reg.event.price}`}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Registered ✓</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {/* Order Summary */}
      <div className="w-full lg:w-1/4 space-y-4">
        <div className="bg-white rounded-2xl p-6 shadow-md sticky top-24">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Order Summary</h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
                Courses ({courses.length})
              </span>
              <span>₹{courseTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                Marketplace
              </span>
              <span>₹0.00</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
                Events ({events.length})
              </span>
              <span className="text-xs text-gray-400">(registered)</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  Discount{discountLabel ? ` (${discountLabel})` : ''}
                </span>
                <span>−₹{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t pt-3">
              <div className="flex justify-between font-semibold text-gray-800 text-base">
                <span>Total</span>
                <span className="text-primary">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Coupon / Referral code */}
          {courses.length > 0 && (
            <div className="mt-4">
              {appliedCode ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
                  <span className="text-sm text-emerald-700 font-medium truncate">
                    ✓ {appliedCode.toUpperCase()} applied
                  </span>
                  <button onClick={removeCode} className="text-xs text-emerald-700 hover:underline font-medium">
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={codeInput}
                      onChange={(e) => setCodeInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && applyCode()}
                      placeholder="Coupon or referral code"
                      className="flex-1 min-w-0 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                    <button
                      onClick={applyCode}
                      disabled={applyingCode}
                      className="px-4 py-2 bg-secondary text-white rounded-xl text-sm font-medium hover:bg-secondary/90 disabled:opacity-60 flex-shrink-0"
                    >
                      {applyingCode ? '...' : 'Apply'}
                    </button>
                  </div>
                  {codeError && <p className="text-xs text-red-500 mt-1.5">{codeError}</p>}
                </>
              )}
            </div>
          )}

          {courses.length > 0 && (
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className={`w-full mt-4 flex items-center justify-center gap-2 bg-primary text-white py-3 px-6 rounded-xl font-semibold text-sm transition-colors ${
                isProcessing ? 'opacity-60 cursor-not-allowed' : 'hover:bg-primary/90'
              }`}
            >
              {isProcessing ? (
                <><FaSpinner className="animate-spin" /> Processing...</>
              ) : (
                'Pay with Razorpay'
              )}
            </button>
          )}

          <p className="text-xs text-gray-400 mt-3 text-center">
            Secured by Razorpay · 256-bit encryption
          </p>
        </div>
      </div>
    </div>
  );
}
