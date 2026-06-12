"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import LiveHeroCarousel from "@/components/live/LiveHeroCarousel";
import { FiSearch, FiMapPin, FiStar, FiChevronDown, FiChevronUp, FiX } from "react-icons/fi";
import { IoCalendarOutline } from "react-icons/io5";
import { axiosHomePublic } from "@/services/axiosHomeService";

const INDIAN_CITIES = [
  { name: "Mumbai",     emoji: "🏛️" },
  { name: "Delhi-NCR",  emoji: "🕌" },
  { name: "Bengaluru",  emoji: "🏰" },
  { name: "Hyderabad",  emoji: "🕍" },
  { name: "Chandigarh", emoji: "🏗️" },
  { name: "Ahmedabad",  emoji: "🏯" },
  { name: "Pune",       emoji: "🏛️" },
  { name: "Chennai",    emoji: "⛩️" },
  { name: "Kolkata",    emoji: "🏟️" },
  { name: "Kochi",      emoji: "🌴" },
];

const GENRES = ["Live", "Banking", "Baking", "Perfume", "Makeup", "Cooking", "Healthcare", "Art"];

const UPCOMING_EVENTS = [
  { id: 1, tile: 1, title: "Professional Baking Masterclass", category: "Baking", rating: 9.6, votes: "5.12K", image: "", date: "Sat, 12 Apr" },
  { id: 2, tile: 4, title: "Artisan Perfume Creation", category: "Perfume", rating: 7.6, votes: "3.12K", image: "", date: "Sat, 15 Apr" },
  { id: 3, tile: 7, title: "Home Décor & Craft Workshop", category: "Art", rating: 8.2, votes: "9.12K", image: "", date: "Sat, 18 May" },
];

const ONLINE_EVENTS = [
  { id: 1, tile: 1, title: "Advanced Baking Techniques", category: "Baking", date: "Sat, 12 Apr", image: "" },
  { id: 2, tile: 4, title: "Perfume Blending Basics", category: "Perfume", date: "Sat, 15 Apr", image: "" },
  { id: 3, tile: 6, title: "Banking & Finance Essentials", category: "Banking", date: "Sat, 18 May", image: "" },
];

const EXPLORE_EVENTS = [
  { id: 1, tile: 5, title: "Professional Baking Masterclass", category: "Baking", rating: 9.6, votes: "5.12K", image: "", date: "Sat, 12 Apr" },
  { id: 2, tile: 9, title: "Artisan Perfume Creation", category: "Perfume", rating: 7.6, votes: "3.12K", image: "", date: "Sat, 15 Apr" },
  { id: 3, tile: 6, title: "Home Décor & Craft Workshop", category: "Art", rating: 8.2, votes: "9.12K", image: "", date: "Sat, 18 May" },
];

const OUTDOOR_EVENTS = [
  { id: 1, tile: 2, title: "Live Cooking Festival", category: "Cooking", date: "Sat, 12 Apr", image: "" },
  { id: 2, tile: 7, title: "Art & Craft Outdoor Fair", category: "Art", date: "Sat, 15 Apr", image: "" },
  { id: 3, tile: 3, title: "Wellness & Health Camp", category: "Healthcare", date: "Sat, 18 May", image: "" },
  { id: 4, tile: 8, title: "Music & Performance Night", category: "Live", date: "Sat, 18 May", image: "" },
];

const CREATORS = [
  { id: 1, name: "Reshmi Yadav", role: "Professional Baker & Pastry Expert", bio: "Award-winning pastry chef with 15+ years of experience in baking and confectionery arts.", initial: "R" },
  { id: 2, name: "Nishant Dave", role: "Fragrance Expert & Perfumer", bio: "Certified master perfumer who has created over 50 signature fragrances for top brands.", initial: "N" },
  { id: 3, name: "Dakshya Shastri", role: "Art Instructor & Creative Director", bio: "Renowned artist and educator with an international portfolio spanning 12 countries.", initial: "D" },
];

interface GeneralFAQ { id: string; question: string; answer: string; }

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 text-left text-sm font-medium text-gray-800 hover:text-primary"
      >
        <span>{question}</span>
        {open ? <FiChevronUp size={16} className="text-primary flex-shrink-0 ml-2" /> : <FiChevronDown size={16} className="text-gray-400 flex-shrink-0 ml-2" />}
      </button>
      {open && (
        <p className="pb-3 text-sm text-gray-500 leading-relaxed">
          {answer}
        </p>
      )}
    </div>
  );
}

function EventCard({ event, showDate = false }: { event: typeof UPCOMING_EVENTS[0]; showDate?: boolean }) {
  return (
    <Link href={`/live/${event.id}`} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 group cursor-pointer block">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image src={`/events_${event.tile}.png`} alt={event.title} fill className="object-cover group-hover:scale-105 transition-transform" />
        {"rating" in event && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
            <FiStar size={11} className="text-amber-500 fill-amber-500" />
            <span className="text-xs font-semibold text-gray-800">{(event as typeof UPCOMING_EVENTS[0]).rating}/10</span>
            <span className="text-xs text-gray-500">{(event as typeof UPCOMING_EVENTS[0]).votes} Votes</span>
          </div>
        )}
        {showDate && (
          <div className="absolute bottom-3 left-3 bg-primary text-white rounded-lg px-2 py-1 text-xs font-medium flex items-center gap-1">
            <IoCalendarOutline size={11} />
            {event.date}
          </div>
        )}
      </div>
      <div className="p-4">
        <span className="text-xs font-semibold text-primary uppercase tracking-wide">{event.category}</span>
        <h3 className="mt-1 text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors line-clamp-2">{event.title}</h3>
        <p className="mt-1 text-xs text-gray-500 line-clamp-2">Learn from industry experts in this hands-on interactive workshop session.</p>
      </div>
    </Link>
  );
}

interface ApiEvent {
  id: string;
  title: string;
  shortDescription?: string;
  imageLink?: string;
  date: string;
  time: string;
  venue: string;
  price: string;
  category: string;
  featured: boolean;
  status: string;
}

export default function LivePage() {
  const [activeGenre, setActiveGenre] = useState("Live");
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [apiEvents, setApiEvents] = useState<ApiEvent[]>([]);
  const [faqs, setFaqs] = useState<GeneralFAQ[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axiosHomePublic.get("/events?limit=100&status=ACTIVE")
      .then(({ data }) => {
        const list: ApiEvent[] = data?.data?.events || data?.data || [];
        setApiEvents(list);
      })
      .catch(() => {});
    axiosHomePublic.get("/general-faqs")
      .then(({ data }) => {
        const list: GeneralFAQ[] = data?.data || [];
        setFaqs(list);
      })
      .catch(() => {});
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setCityDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Collect all known cities: hardcoded + any extra cities extracted from event venues
  const venueCities = Array.from(
    new Set(
      apiEvents
        .map(e => {
          const parts = e.venue.split(",");
          return parts[parts.length - 1].trim();
        })
        .filter(c => c.length > 1 && c.length < 25)
    )
  );
  const allCities = [
    ...INDIAN_CITIES.map(c => c.name),
    ...venueCities.filter(c => !INDIAN_CITIES.some(ic => ic.name.toLowerCase() === c.toLowerCase())),
  ];

  const filterByCity = (events: (typeof UPCOMING_EVENTS | typeof ONLINE_EVENTS | ApiEvent[])[number][]) => {
    if (selectedCity === "All Cities") return events;
    return events.filter(e =>
      "venue" in e
        ? e.venue.toLowerCase().includes(selectedCity.toLowerCase())
        : true
    );
  };

  const filteredApiEvents = apiEvents.filter(e => {
    const matchCity = selectedCity === "All Cities" || e.venue.toLowerCase().includes(selectedCity.toLowerCase());
    const matchSearch = !search || e.title.toLowerCase().includes(search.toLowerCase());
    const matchGenre = activeGenre === "Live" || e.category.toLowerCase().includes(activeGenre.toLowerCase());
    return matchCity && matchSearch && matchGenre;
  });

  return (
    <div className="bg-white min-h-screen">
      <LiveHeroCarousel />

      {/* Search Bar */}
      <section className="bg-white border-b border-gray-100 sticky top-16 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for Event"
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            {/* City picker */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setCityDropdownOpen(o => !o)}
                className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 hover:border-primary hover:text-primary bg-gray-50 whitespace-nowrap"
              >
                <FiMapPin size={14} />
                <span>{selectedCity}</span>
                <FiChevronDown size={13} className={`transition-transform ${cityDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {cityDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                  <div className="px-4 pt-3 pb-2 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Select City</span>
                    <button onClick={() => setCityDropdownOpen(false)}><FiX size={14} className="text-gray-400" /></button>
                  </div>
                  <div className="max-h-72 overflow-y-auto py-1">
                    <button
                      onClick={() => { setSelectedCity("All Cities"); setCityDropdownOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-primary/5 transition-colors text-left ${selectedCity === "All Cities" ? "text-primary font-semibold bg-primary/5" : "text-gray-700"}`}
                    >
                      <span className="text-base">🌐</span>
                      All Cities
                    </button>
                    {allCities.map(city => {
                      const meta = INDIAN_CITIES.find(c => c.name === city);
                      return (
                        <button
                          key={city}
                          onClick={() => { setSelectedCity(city); setCityDropdownOpen(false); }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-primary/5 transition-colors text-left ${selectedCity === city ? "text-primary font-semibold bg-primary/5" : "text-gray-700"}`}
                        >
                          <span className="text-base">{meta?.emoji ?? "📍"}</span>
                          {city}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* City tiles row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {[{ name: "All Cities", emoji: "🌐" }, ...INDIAN_CITIES].map(city => (
            <button
              key={city.name}
              onClick={() => setSelectedCity(city.name)}
              className={`flex-shrink-0 flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl border-2 transition-all text-xs font-medium min-w-[72px] ${
                selectedCity === city.name
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-gray-100 bg-white text-gray-600 hover:border-primary/40 hover:bg-primary/5"
              }`}
            >
              <span className="text-2xl">{city.emoji}</span>
              <span>{city.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Upcoming <span className="text-primary">Events</span>
          {selectedCity !== "All Cities" && (
            <span className="ml-3 text-sm font-normal text-primary bg-primary/10 px-3 py-1 rounded-full">
              📍 {selectedCity}
              <button onClick={() => setSelectedCity("All Cities")} className="ml-1.5 hover:text-red-500">×</button>
            </span>
          )}
        </h2>
        {/* Real events from API */}
        {filteredApiEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
            {filteredApiEvents.map(event => (
              <Link key={event.id} href={`/live/${event.id}`} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 group block">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={event.imageLink?.startsWith("http") ? event.imageLink : event.imageLink ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}${event.imageLink}` : `/events_${(parseInt(event.id?.slice(-1) || "1") % 9) + 1}.png`}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute bottom-3 left-3 bg-primary text-white rounded-lg px-2 py-1 text-xs font-medium flex items-center gap-1">
                    <IoCalendarOutline size={11} />
                    {event.date}
                  </div>
                </div>
                <div className="p-4">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">{event.category}</span>
                  <h3 className="mt-1 text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors line-clamp-2">{event.title}</h3>
                  <p className="mt-1 text-xs text-gray-500 flex items-center gap-1"><FiMapPin size={10} />{event.venue}</p>
                  <p className="mt-1 text-xs font-bold text-primary">₹{event.price === "0" ? "Free" : event.price}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-6">
            {selectedCity !== "All Cities" ? (
              <div className="text-center py-12 text-gray-400">
                <FiMapPin size={32} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">No events in {selectedCity}</p>
                <p className="text-sm mt-1">Try selecting a different city or browse all events.</p>
                <button onClick={() => setSelectedCity("All Cities")} className="mt-3 text-sm text-primary font-semibold hover:underline">View all events →</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {UPCOMING_EVENTS.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Banner */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-900 py-8 relative overflow-hidden">
        <div className="absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-amber-400/30 to-transparent" />
        <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-amber-400/30 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative">
          <div className="inline-block bg-amber-400 text-slate-900 font-bold text-xs px-4 py-1 rounded-full mb-3">LIVE</div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white">
            Endless Learning <span className="text-amber-400">Anytime</span>. Anywhere!
          </h3>
        </div>
      </section>

      {/* Browse by Genre */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-xl font-bold text-gray-900 mb-5">
          Browse Event by <span className="text-primary">Genre</span>
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => setActiveGenre(genre)}
              className={`flex-shrink-0 px-5 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeGenre === genre
                  ? "bg-primary text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </section>

      {/* Explore New World */}
      {(() => {
        const exploreEvents = apiEvents.filter(e => e.category?.toLowerCase().includes("explore"));
        if (exploreEvents.length === 0) return null;
        return (
          <section className="bg-slate-800 py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <h2 className="text-xl font-bold text-white mb-6">
                Explore <span className="text-amber-400">New World</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {exploreEvents.map(event => (
                  <Link key={event.id} href={`/live/${event.id}`} className="bg-white/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-white/10 group block">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image src={event.imageLink?.startsWith("http") ? event.imageLink : event.imageLink ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}${event.imageLink}` : `/events_${(parseInt(event.id?.slice(-1) || "1") % 9) + 1}.png`} alt={event.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute bottom-3 left-3 bg-amber-400 text-slate-900 rounded-lg px-2 py-1 text-xs font-medium flex items-center gap-1"><IoCalendarOutline size={11} />{event.date}</div>
                    </div>
                    <div className="p-4"><span className="text-xs font-semibold text-amber-400 uppercase tracking-wide">{event.category}</span><h3 className="mt-1 text-sm font-semibold text-white group-hover:text-amber-400 transition-colors line-clamp-2">{event.title}</h3><p className="mt-1 text-xs text-white/60">₹{event.price === "0" ? "Free" : event.price}</p></div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* Online Live Events */}
      {(() => {
        const onlineEvents = apiEvents.filter(e => e.category?.toLowerCase().includes("online"));
        if (onlineEvents.length === 0) return null;
        return (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Online <span className="text-primary">Live Events</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {onlineEvents.map(event => (
                <Link key={event.id} href={`/live/${event.id}`} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 group block">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image src={event.imageLink?.startsWith("http") ? event.imageLink : event.imageLink ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}${event.imageLink}` : `/events_${(parseInt(event.id?.slice(-1) || "1") % 9) + 1}.png`} alt={event.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute bottom-3 left-3 bg-primary text-white rounded-lg px-2 py-1 text-xs font-medium flex items-center gap-1"><IoCalendarOutline size={11} />{event.date}</div>
                  </div>
                  <div className="p-4"><span className="text-xs font-semibold text-primary uppercase tracking-wide">{event.category}</span><h3 className="mt-1 text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors line-clamp-2">{event.title}</h3><p className="mt-1 text-xs font-bold text-primary">₹{event.price === "0" ? "Free" : event.price}</p></div>
                </Link>
              ))}
            </div>
          </section>
        );
      })()}

      {/* Outdoor Live Events */}
      {(() => {
        const outdoorEvents = apiEvents.filter(e => e.category?.toLowerCase().includes("outdoor"));
        if (outdoorEvents.length === 0) return null;
        return (
          <section className="bg-gray-50 py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Outdoor <span className="text-primary">Live Events</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {outdoorEvents.map(event => (
                  <Link key={event.id} href={`/live/${event.id}`} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 group block">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image src={event.imageLink?.startsWith("http") ? event.imageLink : event.imageLink ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}${event.imageLink}` : `/events_${(parseInt(event.id?.slice(-1) || "1") % 9) + 1}.png`} alt={event.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute bottom-3 left-3 bg-primary text-white rounded-lg px-2 py-1 text-xs font-medium flex items-center gap-1"><IoCalendarOutline size={11} />{event.date}</div>
                    </div>
                    <div className="p-4"><span className="text-xs font-semibold text-primary uppercase tracking-wide">{event.category}</span><h3 className="mt-1 text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors line-clamp-2">{event.title}</h3><p className="mt-1 text-xs text-gray-400 flex items-center gap-1"><FiMapPin size={10} />{event.venue}</p></div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* Popular Creators */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Popular <span className="text-primary">Creator</span> of Skillocraft
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CREATORS.map((creator) => (
            <div key={creator.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm text-center hover:shadow-md transition-shadow">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                {creator.initial}
              </div>
              <h3 className="font-bold text-gray-900 text-sm">{creator.name}</h3>
              <p className="text-xs text-primary font-medium mt-1">{creator.role}</p>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">{creator.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Pictures of <span className="text-primary">Successful Events</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl overflow-hidden relative">
                <Image src={`/events_${i + 1}.png`} alt={`Event gallery ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      {faqs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <h2 className="text-xl font-bold text-gray-900 mb-5">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {[faqs.slice(0, Math.ceil(faqs.length / 2)), faqs.slice(Math.ceil(faqs.length / 2))].map((group, gi) => (
              <div key={gi} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                {group.map((faq) => <FAQItem key={faq.id} question={faq.question} answer={faq.answer} />)}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
