"use client";

import { useState, useEffect } from "react";
import { axiosHomeProtected } from "@/services/axiosHomeService";
import { Copy, CheckCheck, Users, TrendingUp, Share2 } from "lucide-react";
import { FaFacebook, FaTwitter, FaWhatsapp } from "react-icons/fa6";
import Link from "next/link";

interface ReferralData {
  referralCode: string;
  referredCount: number;
  totalEarnings: number;
  earningsPercent: number;
  discountPercent: number;
  referredUsers: { name: string; orderCount: number; earnings: number }[];
}

export default function ReferralDashboard() {
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    axiosHomeProtected
      .get("/referral/my-data")
      .then((r) => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const referralLink =
    typeof window !== "undefined" && data?.referralCode
      ? `${window.location.origin}?ref=${data.referralCode}`
      : "";

  const copyCode = () => {
    if (!data?.referralCode) return;
    navigator.clipboard.writeText(data.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <section className="relative py-12">
        <div className="container mx-auto space-y-4">
          <div className="animate-pulse h-32 bg-gray-200 rounded-3xl" />
          <div className="animate-pulse h-48 bg-gray-200 rounded-3xl" />
        </div>
      </section>
    );
  }

  if (!data) return null;

  return (
    <section className="relative py-12">
      <div className="container mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="lg:text-4xl md:text-3xl text-2xl font-bold text-secondary">
            Your Referral Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Share your code, earn {data.earningsPercent}% on every referred
            purchase
          </p>
        </div>

        {/* Referral Code Card */}
        <div className="bg-secondary text-white md:px-12 p-8 rounded-3xl text-center space-y-4">
          <p className="text-sm opacity-75">Your unique referral code</p>
          <div className="flex items-center justify-center gap-4">
            <span className="text-4xl font-bold tracking-widest font-mono">
              {data.referralCode}
            </span>
            <button
              onClick={copyCode}
              className="p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
              title="Copy code"
            >
              {copied ? (
                <CheckCheck className="w-5 h-5 text-green-300" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-xs opacity-60">
            Friends get {data.discountPercent}% off when they use this code
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-100/60 rounded-2xl p-6 flex items-center gap-5">
            <span className="inline-flex flex-shrink-0 items-center justify-center size-12 bg-white border border-gray-200 rounded-full">
              <Users className="w-6 h-6 text-secondary" />
            </span>
            <div>
              <p className="text-sm text-gray-500">Friends Referred</p>
              <p className="text-3xl font-bold text-secondary">
                {data.referredCount}
              </p>
            </div>
          </div>
          <div className="bg-gray-100/60 rounded-2xl p-6 flex items-center gap-5">
            <span className="inline-flex flex-shrink-0 items-center justify-center size-12 bg-white border border-gray-200 rounded-full">
              <TrendingUp className="w-6 h-6 text-primary" />
            </span>
            <div>
              <p className="text-sm text-gray-500">Total Earnings</p>
              <p className="text-3xl font-bold text-primary">
                ₹{data.totalEarnings.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>

        {/* How You Earn */}
        <div className="bg-gray-100/60 md:px-12 p-6 rounded-3xl">
          <h3 className="text-lg font-semibold text-secondary mb-5">
            How you earn
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: 1,
                title: "Share your code",
                desc: `Send code ${data.referralCode} to friends`,
              },
              {
                step: 2,
                title: "Friend signs up & buys",
                desc: `They get ${data.discountPercent}% off their purchase`,
              },
              {
                step: 3,
                title: "You get paid",
                desc: `Earn ${data.earningsPercent}% of their purchase value`,
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex items-start gap-3">
                <span className="inline-flex flex-shrink-0 items-center justify-center size-8 bg-primary text-white rounded-full text-sm font-bold">
                  {step}
                </span>
                <div>
                  <p className="font-semibold text-sm">{title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Share Section */}
        <div className="bg-gray-100/60 md:px-12 p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">
              Share your referral link with friends
            </p>
            <p className="text-xs text-gray-500 mt-1 font-mono">
              {referralLink}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={copyCode}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-xl text-sm font-medium hover:bg-secondary/90 transition-colors"
            >
              {copied ? (
                <CheckCheck className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied ? "Copied!" : "Copy Link"}
            </button>
            <Link
              href={`https://wa.me/?text=Use my referral code ${data.referralCode} on Skillocraft and get ${data.discountPercent}% off! ${referralLink}`}
              target="_blank"
              className="p-2.5 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors"
              title="Share on WhatsApp"
            >
              <FaWhatsapp className="w-4 h-4" />
            </Link>
            <Link
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`}
              target="_blank"
              className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              title="Share on Facebook"
            >
              <FaFacebook className="w-4 h-4" />
            </Link>
            <Link
              href={`https://twitter.com/intent/tweet?text=Use my Skillocraft referral code ${data.referralCode} and get ${data.discountPercent}% off!&url=${encodeURIComponent(referralLink)}`}
              target="_blank"
              className="p-2.5 rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition-colors"
              title="Share on Twitter"
            >
              <FaTwitter className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Referred Users Table (only if any) */}
        {data.referredUsers.length > 0 && (
          <div className="bg-gray-100/60 rounded-3xl overflow-hidden">
            <div className="md:px-12 px-6 pt-6 pb-3">
              <h3 className="text-lg font-semibold text-secondary">
                Referred Friends
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 text-xs uppercase bg-gray-200/50">
                    <th className="md:px-12 px-6 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Purchases</th>
                    <th className="px-4 py-3 font-medium text-right">
                      Your Earnings
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/60">
                  {data.referredUsers.map((u, i) => (
                    <tr key={i} className="hover:bg-gray-200/30">
                      <td className="md:px-12 px-6 py-3 font-medium">
                        {u.name}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {u.orderCount}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-primary">
                        ₹{u.earnings.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
