'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { axiosHomePublic, axiosHomeProtected } from '@/services/axiosHomeService';
import { useAuth } from '@/context/AuthContext';
import { useModal } from '@/context/ModalContext';
import { toast } from 'sonner';
import { IoCalendarOutline, IoTimeOutline, IoLocationOutline, IoArrowBack } from 'react-icons/io5';
import { FiUsers, FiTag, FiCheck } from 'react-icons/fi';
import { Loader2 } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  imageLink?: string;
  date: string;
  time: string;
  venue: string;
  price: string;
  category: string;
  featured: boolean;
  status: string;
  _count?: { EventRegistration: number };
}

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

const DUMMY_EVENTS: Event[] = [
  { id: '1', title: 'Professional Baking Masterclass', shortDescription: 'Learn professional baking techniques from an award-winning pastry chef.', description: 'Join us for an immersive hands-on baking masterclass covering croissants, sourdough, pastries, and celebration cakes. All skill levels welcome — materials provided.', date: 'Sat, 12 Apr 2025', time: '10:00 AM', venue: 'Grand Culinary Hall, Mumbai', price: '999', category: 'Baking', featured: true, status: 'ACTIVE' },
  { id: '2', title: 'Artisan Perfume Creation', shortDescription: 'Craft your own signature fragrance using premium natural oils.', description: 'Discover the art of perfumery in this intimate workshop. You will blend your own custom perfume using ethically sourced ingredients and leave with a 30ml bottle of your creation.', date: 'Sat, 15 Apr 2025', time: '2:00 PM', venue: 'The Scent Studio, Delhi', price: '1499', category: 'Perfume', featured: false, status: 'ACTIVE' },
  { id: '3', title: 'Home Décor & Craft Workshop', shortDescription: 'Transform everyday materials into beautiful home décor pieces.', description: 'A fun, creative workshop where you will learn macramé, clay sculpting, and upcycling techniques. Take home 3 handmade décor pieces you make yourself.', date: 'Sat, 18 May 2025', time: '11:00 AM', venue: 'Creative Hub, Bangalore', price: '799', category: 'Art', featured: false, status: 'ACTIVE' },
  { id: '4', title: 'Advanced Baking Techniques', shortDescription: 'Level up your baking with advanced professional methods.', description: 'This intermediate-to-advanced workshop focuses on laminated doughs, advanced sugar work, and plating desserts like a professional pastry chef.', date: 'Sat, 12 Apr 2025', time: '3:00 PM', venue: 'Online (Zoom)', price: '599', category: 'Baking', featured: false, status: 'ACTIVE' },
];

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isLoggedIn } = useAuth();
  const { openModal } = useModal();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axiosHomePublic.get(`/events/${id}`)
      .then(({ data }) => {
        const e = data?.data || data;
        if (e?.id) setEvent(e);
        else throw new Error('not found');
      })
      .catch(() => {
        const dummy = DUMMY_EVENTS.find(e => e.id === id);
        if (dummy) setEvent(dummy);
        else toast.error('Event not found');
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id || !isLoggedIn) return;
    axiosHomeProtected.get(`/events/${id}/check-registered`)
      .then(({ data }) => setRegistered(data.data?.registered || false))
      .catch(() => {});
  }, [id, isLoggedIn]);

  const addToCart = async () => {
    if (!isLoggedIn) { openModal('login'); return; }
    setAddingToCart(true);
    try {
      await axiosHomeProtected.post('/event-cart', { eventId: id });
      toast.success('Added to cart!');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const markRegistered = () => {
    setRegistered(true);
    if (event) setEvent({ ...event, _count: { EventRegistration: (event._count?.EventRegistration || 0) + 1 } });
  };

  const handleRegister = async () => {
    if (!isLoggedIn) {
      openModal('login');
      return;
    }
    const price = parseFloat(event?.price || '0');
    setRegistering(true);
    try {
      // Free event — register directly
      if (!(price > 0)) {
        await axiosHomeProtected.post(`/events/${id}/register`);
        markRegistered();
        toast.success('Successfully registered for the event!');
        setRegistering(false);
        return;
      }

      // Paid event — Razorpay checkout
      const { data: orderData } = await axiosHomeProtected.post('/razorpay/event-order', { eventId: id });
      const { orderId, amount, currency, keyId } = orderData.data;
      await loadRazorpayScript();
      const rzp = new (window as any).Razorpay({
        key: keyId,
        amount,
        currency,
        order_id: orderId,
        name: 'Skillocraft',
        description: event?.title || 'Event registration',
        image: '/logo.png',
        theme: { color: '#f97316' },
        handler: async (response: any) => {
          try {
            const { data: verify } = await axiosHomeProtected.post('/razorpay/verify-event', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              eventId: id,
            });
            if (verify.status === 1) {
              markRegistered();
              toast.success('Payment successful — you are registered!');
            } else {
              toast.error('Payment verification failed. Contact support.');
            }
          } catch (e: any) {
            toast.error(e?.response?.data?.message || 'Payment verification failed');
          } finally {
            setRegistering(false);
          }
        },
        modal: { ondismiss: () => setRegistering(false) },
      });
      rzp.open();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Registration failed');
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center p-6">
        <p className="text-gray-500 text-lg mb-4">Event not found.</p>
        <Link href="/live" className="text-primary font-semibold hover:underline">Browse all events</Link>
      </div>
    );
  }

  const isFree = !event.price || event.price === '0';
  const imageUrl = event.imageLink ? `${API_BASE}${event.imageLink}` : '/events_1.png';

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="relative h-72 sm:h-96 overflow-hidden">
        <Image src={imageUrl} alt={event.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute top-4 left-4">
          <Link href="/live" className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-3 py-2 rounded-xl hover:bg-white/30 transition-colors">
            <IoArrowBack size={16} />
            Back
          </Link>
        </div>
        <div className="absolute bottom-6 left-0 right-0 px-6">
          <span className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full mb-2">{event.category}</span>
          {event.featured && (
            <span className="inline-block ml-2 bg-amber-400 text-slate-900 text-xs font-semibold px-3 py-1 rounded-full mb-2">Featured</span>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">{event.title}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1 space-y-6">
            <p className="text-gray-600 text-base leading-relaxed">{event.shortDescription}</p>

            {/* Details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <IoCalendarOutline size={20} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Date</p>
                  <p className="text-sm font-semibold text-gray-900">{event.date}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <IoTimeOutline size={20} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Time</p>
                  <p className="text-sm font-semibold text-gray-900">{event.time}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <IoLocationOutline size={20} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Venue</p>
                  <p className="text-sm font-semibold text-gray-900">{event.venue}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <FiUsers size={20} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Registered</p>
                  <p className="text-sm font-semibold text-gray-900">{event._count?.EventRegistration ?? 0} attendees</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">About This Event</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{event.description}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <FiTag size={16} className="text-primary" />
                <span className="text-2xl font-bold text-gray-900">
                  {isFree ? 'Free' : `₹${event.price}`}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-5">
                {isFree ? 'This event is free to attend.' : `One-time registration fee of ₹${event.price}.`}
              </p>

              {registered ? (
                <div className="w-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2">
                  <FiCheck size={16} />
                  You&apos;re Registered!
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={handleRegister}
                    disabled={registering}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-colors"
                  >
                    {registering ? <><Loader2 size={16} className="animate-spin" /> Processing...</> : (isFree ? 'Register Now' : `Pay ₹${event.price} & Register`)}
                  </button>
                  {!isFree && (
                    <button
                      onClick={addToCart}
                      disabled={addingToCart}
                      className="w-full border-2 border-primary text-primary hover:bg-primary/5 font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-colors"
                    >
                      {addingToCart ? 'Adding…' : 'Add to Cart'}
                    </button>
                  )}
                </div>
              )}

              {!isLoggedIn && !registered && (
                <p className="text-center text-xs text-gray-400 mt-3">
                  <button onClick={() => openModal('login')} className="text-primary hover:underline font-medium">Sign in</button> to register
                </p>
              )}

              <div className="mt-5 pt-5 border-t border-gray-100 space-y-2 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Category</span><span className="font-medium text-gray-700">{event.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date</span><span className="font-medium text-gray-700">{event.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time</span><span className="font-medium text-gray-700">{event.time}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
