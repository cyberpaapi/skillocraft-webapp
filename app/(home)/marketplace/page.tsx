"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiSearch, FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { axiosHomePublic } from "@/services/axiosHomeService";
import { imgSrc } from "@/lib/imgSrc";
import { Loader2 } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MarketplaceProduct {
  id: string;
  name: string;
  images: string[];
  price: string;
  originalPrice: string;
  discount: string;
  category: string;
  highlights?: { key: string; value: string }[];
  description?: string;
  specifications?: string;
  importantNote?: string;
  deliveryInfo?: string;
  status?: string;
  _dummy?: boolean;
}

// ─── Dummy data (fallback when API unavailable) ────────────────────────────────

const DUMMY_PRODUCTS: MarketplaceProduct[] = [
  { id: "mp-1", name: "Professional Baking Kit – Silicone Mould Set", images: ["/courses_1.png", "/courses_2.png"], price: "699", originalPrice: "1499", discount: "53", category: "Baking", highlights: [{ key: "Type", value: "Baking Kit" }, { key: "Material", value: "Silicone" }, { key: "Pack", value: "12 Moulds" }], description: "Perfect starter baking kit for home bakers.", _dummy: true },
  { id: "mp-2", name: "Artisan Perfume Making Starter Kit", images: ["/courses_3.png", "/courses_4.png"], price: "1299", originalPrice: "2499", discount: "48", category: "Skincare", highlights: [{ key: "Type", value: "Perfume Kit" }, { key: "Material", value: "Premium Oils" }, { key: "Pack", value: "10 Fragrances" }], description: "Create your own signature perfume at home.", _dummy: true },
  { id: "mp-3", name: "Handmade Jewellery Starter Pack", images: ["/courses_5.png", "/courses_6.png"], price: "549", originalPrice: "999", discount: "45", category: "Artificial Jewellery", highlights: [{ key: "Type", value: "Jewellery Making" }, { key: "Material", value: "Mixed" }, { key: "Pack", value: "Set of 20" }], description: "Everything you need to make beautiful handmade jewellery.", _dummy: true },
  { id: "mp-4", name: "Professional Makeup Brush Set", images: ["/courses_2.png", "/courses_1.png"], price: "799", originalPrice: "1599", discount: "50", category: "Skincare", highlights: [{ key: "Type", value: "Makeup Brush" }, { key: "Material", value: "Vegan Bristles" }, { key: "Pack", value: "15 Brushes" }], description: "Professional grade makeup brushes for flawless application.", _dummy: true },
  { id: "mp-5", name: "Macramé Craft Kit for Beginners", images: ["/courses_4.png", "/courses_3.png"], price: "449", originalPrice: "899", discount: "50", category: "Hand Craft", highlights: [{ key: "Type", value: "Macramé" }, { key: "Material", value: "Cotton Rope" }, { key: "Pack", value: "Complete Kit" }], description: "Learn macramé with this complete beginner kit.", _dummy: true },
  { id: "mp-6", name: "Cake Decorating Tools Professional Set", images: ["/courses_6.png", "/courses_5.png"], price: "899", originalPrice: "1799", discount: "50", category: "Baking", highlights: [{ key: "Type", value: "Decorating Set" }, { key: "Material", value: "Stainless Steel" }, { key: "Pack", value: "48 Pieces" }], description: "Professional cake decorating for home bakers.", _dummy: true },
  { id: "mp-7", name: "Natural Skincare Ingredients Bundle", images: ["/courses_1.png", "/courses_6.png"], price: "1099", originalPrice: "1999", discount: "45", category: "Skincare", highlights: [{ key: "Type", value: "DIY Skincare" }, { key: "Material", value: "Natural" }, { key: "Pack", value: "8 Ingredients" }], description: "Make your own natural skincare products at home.", _dummy: true },
  { id: "mp-8", name: "Candle Making Kit Deluxe", images: ["/courses_3.png", "/courses_2.png"], price: "649", originalPrice: "1299", discount: "50", category: "Hand Craft", highlights: [{ key: "Type", value: "Candle Making" }, { key: "Material", value: "Soy Wax" }, { key: "Pack", value: "Complete Kit" }], description: "Create beautiful scented candles at home.", _dummy: true },
  { id: "mp-9", name: "Vitamin C Glow Serum Kit", images: ["/courses_4.png", "/courses_1.png"], price: "849", originalPrice: "1699", discount: "50", category: "Skincare", highlights: [{ key: "Type", value: "Serum" }, { key: "Material", value: "Vitamin C" }, { key: "Pack", value: "30ml" }], description: "Brighten and even out your skin tone with this DIY serum.", _dummy: true },
  { id: "mp-10", name: "Rose Clay Face Mask Bundle", images: ["/courses_5.png", "/courses_3.png"], price: "599", originalPrice: "1099", discount: "45", category: "Skincare", highlights: [{ key: "Type", value: "Face Mask" }, { key: "Material", value: "Rose Clay" }, { key: "Pack", value: "6 Masks" }], description: "Deep cleansing rose clay masks for radiant skin.", _dummy: true },
  { id: "mp-11", name: "Professional Lip Colour Set", images: ["/courses_2.png", "/courses_5.png"], price: "449", originalPrice: "899", discount: "50", category: "Makeup", highlights: [{ key: "Type", value: "Lip Colour" }, { key: "Material", value: "Vegan Formula" }, { key: "Pack", value: "12 Shades" }], description: "Long-lasting lip colour set for every occasion.", _dummy: true },
  { id: "mp-12", name: "Argan Oil Hair Treatment Kit", images: ["/courses_6.png", "/courses_4.png"], price: "749", originalPrice: "1499", discount: "50", category: "Skincare", highlights: [{ key: "Type", value: "Hair Care" }, { key: "Material", value: "Argan Oil" }, { key: "Pack", value: "Complete Kit" }], description: "Restore shine and strength to damaged hair naturally.", _dummy: true },
];

const CATEGORY_TILES = [
  { name: "Baking", image: "/courses_1.png", color: "from-orange-500/80 to-amber-600/80" },
  { name: "Skincare", image: "/courses_2.png", color: "from-pink-500/80 to-rose-600/80" },
  { name: "Artificial Jewellery", image: "/courses_5.png", color: "from-violet-500/80 to-purple-600/80" },
  { name: "Hand Craft", image: "/courses_4.png", color: "from-teal-500/80 to-emerald-600/80" },
];

const HERO_BANNERS = [
  { id: 1, bg: "from-orange-900 to-amber-800", badge: "New Launch", title: "Start Your Own Perfume Brand", subtitle: "Professional Perfume Making Course at just ₹699/-", cta: "Join Now", image: "/courses_3.png" },
  { id: 2, bg: "from-primary to-indigo-700", badge: "Number One", title: "Skill-Tech Platform in India", subtitle: "Login and Start Your Learning Now", cta: "Login", image: "/courses_2.png" },
];

// ─── Small Product Card ────────────────────────────────────────────────────────

function ProductCard({ product, index }: { product: MarketplaceProduct; index: number }) {
  const img = product.images?.[0] || imgSrc(undefined, `/courses_${(index % 6) + 1}.png`);

  return (
    <Link href={`/marketplace/${product.id}`} className="block flex-none w-36 sm:w-44 group">
      <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
        <Image src={img} alt={product.name} fill sizes="176px" className="object-cover group-hover:scale-105 transition-transform duration-300" />
        {parseInt(product.discount) > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            {product.discount}% OFF
          </span>
        )}
      </div>
      <div className="mt-2 px-0.5">
        <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug">{product.name}</p>
        <p className="text-xs text-primary font-bold mt-1">From ₹{parseFloat(product.price).toLocaleString()}</p>
        <button className="mt-2 w-full text-xs font-semibold bg-primary/10 hover:bg-primary hover:text-white text-primary py-1.5 rounded-lg transition-colors">
          Grab Now
        </button>
      </div>
    </Link>
  );
}

// ─── Horizontal scroll row ────────────────────────────────────────────────────

function HorizontalScroll({ products }: { products: MarketplaceProduct[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => scrollRef.current?.scrollBy({ left: dir === "left" ? -220 : 220, behavior: "smooth" });

  return (
    <div className="relative">
      <button onClick={() => scroll("left")} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 bg-white shadow-md rounded-full p-1.5 hover:bg-gray-50">
        <FiChevronLeft size={16} className="text-gray-600" />
      </button>
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-2 px-1" style={{ scrollbarWidth: "none" }}>
        {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
      </div>
      <button onClick={() => scroll("right")} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 bg-white shadow-md rounded-full p-1.5 hover:bg-gray-50">
        <FiChevronRight size={16} className="text-gray-600" />
      </button>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function MarketplacePage() {
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [skincareCarouselIdx, setSkincareCarouselIdx] = useState(0);
  const [offersCarouselIdx, setOffersCarouselIdx] = useState(0);

  useEffect(() => {
    axiosHomePublic.get("/marketplace-products?limit=100")
      .then(({ data }) => {
        const list: MarketplaceProduct[] = data?.data || data?.products || [];
        if (list.length > 0) setProducts(list);
        else setProducts(DUMMY_PRODUCTS);
      })
      .catch(() => setProducts(DUMMY_PRODUCTS))
      .finally(() => setLoading(false));
  }, []);

  // Skincare big-image carousel
  const skincare = products.filter(p => ["skincare", "makeup", "beauty", "skin"].some(k => p.category.toLowerCase().includes(k)));
  useEffect(() => {
    if (skincare.length < 2) return;
    const t = setInterval(() => setSkincareCarouselIdx(i => (i + 1) % skincare.length), 3000);
    return () => clearInterval(t);
  }, [skincare.length]);

  // Top offers big-image carousel
  const offers = [...products].sort((a, b) => parseInt(b.discount) - parseInt(a.discount));
  useEffect(() => {
    if (offers.length < 2) return;
    const t = setInterval(() => setOffersCarouselIdx(i => (i + 1) % Math.min(offers.length, 4)), 3500);
    return () => clearInterval(t);
  }, [offers.length]);

  const byCategory = useCallback((cat: string) => products.filter(p => p.category.toLowerCase().includes(cat.toLowerCase())), [products]);

  const bakingProducts = byCategory("baking");

  const filtered = search
    ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
    : [];

  return (
    <div className="bg-white min-h-screen">

      {/* ── Hero Banners ─────────────────────────────────────────────── */}
      <section className="w-full px-3 sm:px-5 py-4">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {HERO_BANNERS.map((banner) => (
            <div key={banner.id} className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${banner.bg} min-h-[140px] sm:min-h-[200px] flex items-end p-4 sm:p-6`}>
              <div className="absolute inset-0 opacity-20">
                <Image src={banner.image} alt="" fill className="object-cover" />
              </div>
              <div className="relative z-10">
                <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full mb-2">{banner.badge}</span>
                <h2 className="text-white font-bold text-sm sm:text-xl leading-tight mb-1">{banner.title}</h2>
                <p className="text-white/80 text-xs mb-3 hidden sm:block">{banner.subtitle}</p>
                <button className="bg-white text-gray-900 text-xs font-bold px-4 py-1.5 rounded-full hover:bg-amber-400 transition-colors">{banner.cta}</button>
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="mt-4 relative max-w-lg mx-auto">
          <FiSearch size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for product..."
            className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-sm"
          />
          {search && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 z-50 max-h-64 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="text-sm text-gray-400 p-4 text-center">No results found</p>
              ) : filtered.map(p => (
                <Link key={p.id} href={p._dummy ? "#" : `/marketplace/${p.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors" onClick={() => setSearch("")}>
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    <Image src={p.images?.[0] || "/courses_1.png"} alt={p.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">{p.name}</p>
                    <p className="text-xs text-primary font-semibold">₹{parseFloat(p.price).toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Category Tiles ───────────────────────────────────────────── */}
      <section className="px-3 sm:px-5 py-3">
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {CATEGORY_TILES.map((cat) => (
            <Link
              key={cat.name}
              href={`/marketplace?category=${encodeURIComponent(cat.name)}`}
              className="relative rounded-xl overflow-hidden group"
              style={{ height: "90px" }}
            >
              <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className={`absolute inset-0 bg-gradient-to-b ${cat.color}`} />
              <div className="absolute inset-0 flex items-center justify-center p-2">
                <span className="text-white font-bold text-xs sm:text-sm text-center leading-tight drop-shadow">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="flex justify-center gap-1.5 mt-2">
          {[0, 1, 2, 3].map(i => (
            <span key={i} className={`rounded-full ${i === 0 ? "w-4 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-gray-300"}`} />
          ))}
        </div>
      </section>

      {/* ── Best Selling Products ────────────────────────────────────── */}
      <section className="px-4 sm:px-6 py-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5">
          Our <span className="text-primary">Best Selling</span> Product
        </h2>
        {loading ? (
          <div className="flex items-center justify-center py-10"><Loader2 size={28} className="animate-spin text-primary" /></div>
        ) : (
          <HorizontalScroll products={[...products].sort((a, b) => parseInt(b.discount) - parseInt(a.discount)).slice(0, 10)} />
        )}
      </section>

      {/* ── Baking Top Selling ───────────────────────────────────────── */}
      {bakingProducts.length > 0 && (
        <section className="px-4 sm:px-6 py-6 bg-orange-50/40">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5">
            Baking <span className="text-primary">Top Selling</span> Product
          </h2>
          <HorizontalScroll products={bakingProducts.slice(0, 8)} />
        </section>
      )}

      {/* ── Skincare Top Selling (grid + big carousel image) ─────────── */}
      {skincare.length > 0 && (
        <section className="px-4 sm:px-6 py-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">
            Skincare <span className="text-primary">Top Selling</span> Product
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
            {/* Left: 2-col product grid */}
            <div className="sm:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {skincare.slice(0, 6).map((product, i) => (
                <Link key={product.id} href={`/marketplace/${product.id}`} className="group">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
                    <Image src={product.images?.[0] || `/courses_${(i % 6) + 1}.png`} alt={product.name} fill sizes="200px" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    {parseInt(product.discount) > 0 && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">{product.discount}% OFF</span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-gray-800 mt-1.5 line-clamp-2">{product.name}</p>
                  <p className="text-xs text-primary font-bold">From ₹{parseFloat(product.price).toLocaleString()}</p>
                </Link>
              ))}
            </div>
            {/* Right: Auto-rotating carousel image */}
            <Link href={skincare[skincareCarouselIdx] ? `/marketplace/${skincare[skincareCarouselIdx].id}` : "#"} className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg cursor-pointer block">
              {skincare.map((product, i) => (
                <div
                  key={product.id}
                  className={`absolute inset-0 transition-opacity duration-700 ${i === skincareCarouselIdx ? "opacity-100" : "opacity-0"}`}
                >
                  <Image
                    src={product.images?.[0] || `/courses_${(i % 6) + 1}.png`}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="font-bold text-sm leading-snug">{skincare[skincareCarouselIdx]?.name}</p>
                <p className="text-xs text-white/70 mt-0.5">From ₹{parseFloat(skincare[skincareCarouselIdx]?.price || "0").toLocaleString()}</p>
              </div>
              {/* Carousel dots */}
              <div className="absolute top-3 right-3 flex flex-col gap-1">
                {skincare.slice(0, 5).map((_, i) => (
                  <button key={i} onClick={(e) => { e.preventDefault(); setSkincareCarouselIdx(i); }} className={`w-1.5 rounded-full transition-all ${i === skincareCarouselIdx ? "h-4 bg-white" : "h-1.5 bg-white/50"}`} />
                ))}
              </div>
            </Link>
          </div>
          <div className="flex justify-center gap-1.5 mt-5">
            {[0, 1, 2, 3].map(i => <span key={i} className={`rounded-full ${i === 0 ? "w-4 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-gray-300"}`} />)}
          </div>
        </section>
      )}

      {/* ── Our Top Offers (big promo image LEFT, grid RIGHT) ─────────── */}
      <section className="px-4 sm:px-6 py-8 bg-amber-50/40">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">
          Our <span className="text-primary">Top Offers</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
          {/* LEFT: Big promo image (auto-rotating) */}
          <div className="flex flex-col gap-3">
            <Link href={offers[offersCarouselIdx] ? `/marketplace/${offers[offersCarouselIdx].id}` : "#"} className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-gray-900 shadow-lg cursor-pointer block">
              {offers.slice(0, 4).map((product, i) => (
                <div key={product.id} className={`absolute inset-0 transition-opacity duration-700 ${i === offersCarouselIdx ? "opacity-100" : "opacity-0"}`}>
                  <Image src={product.images?.[0] || `/courses_${(i % 6) + 1}.png`} alt={product.name} fill className="object-cover" />
                </div>
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute top-4 left-4 bg-red-500 text-white font-black text-xl px-3 py-1.5 rounded-xl shadow">
                {offers[offersCarouselIdx]?.discount}%<br />OFF
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="font-bold text-sm line-clamp-2">{offers[offersCarouselIdx]?.name}</p>
                <p className="text-xs text-white/70 mt-0.5">₹{offers[offersCarouselIdx]?.price} <span className="line-through text-white/50">₹{offers[offersCarouselIdx]?.originalPrice}</span></p>
              </div>
              {/* Carousel dots */}
              <div className="absolute top-3 right-3 flex flex-col gap-1">
                {offers.slice(0, 4).map((_, i) => (
                  <button key={i} onClick={(e) => { e.preventDefault(); setOffersCarouselIdx(i); }} className={`w-1.5 rounded-full transition-all ${i === offersCarouselIdx ? "h-4 bg-white" : "h-1.5 bg-white/50"}`} />
                ))}
              </div>
            </Link>
          </div>

          {/* RIGHT: 2×3 product grid */}
          <div className="sm:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {offers.slice(0, 6).map((product, i) => (
              <Link key={product.id} href={`/marketplace/${product.id}`} className="group">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
                  <Image src={product.images?.[0] || `/courses_${(i % 6) + 1}.png`} alt={product.name} fill sizes="200px" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">SALE</div>
                </div>
                <p className="text-xs font-semibold text-gray-800 mt-1.5 line-clamp-2">{product.name}</p>
                <p className="text-xs text-primary font-bold">From ₹{parseFloat(product.price).toLocaleString()}</p>
              </Link>
            ))}
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button className="flex items-center gap-1 text-sm text-primary font-semibold hover:underline">View All Offers <FiChevronRight size={16} /></button>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 py-10 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-6 text-center">
          {[
            { emoji: "🛒", label: "Order Processed", desc: "Browse and place your order" },
            { emoji: "✅", label: "Order Complete", desc: "Instant confirmation sent" },
            { emoji: "🚚", label: "Cash on Delivery", desc: "Pay when it arrives" },
          ].map((step) => (
            <div key={step.label} className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl shadow-sm">{step.emoji}</div>
              <p className="font-bold text-gray-800 text-xs sm:text-sm uppercase tracking-wide">{step.label}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
