"use client";

import { useState, useEffect } from "react";
import { axiosHomeProtected } from "@/services/axiosHomeService";
import { Copy, CheckCheck, Users, TrendingUp, Share2, Wallet, Clock, CheckCircle2, Edit3 } from "lucide-react";
import { FaFacebook, FaTwitter, FaWhatsapp } from "react-icons/fa6";
import Link from "next/link";

interface ReferralData {
  referralCode: string;
  upiId: string | null;
  referredCount: number;
  totalEarnings: number;
  settledAmount: number;
  pendingAmount: number;
  availableAmount: number;
  earningsPercent: number;
  discountPercent: number;
  referredUsers: { name: string; orderCount: number; earnings: number }[];
}

export default function ReferralDashboard() {
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  // UPI editing state
  const [editingUpi, setEditingUpi] = useState(false);
  const [upiInput, setUpiInput] = useState("");
  const [savingUpi, setSavingUpi] = useState(false);
  const [upiError, setUpiError] = useState("");

  // Payout state
  const [requestingPayout, setRequestingPayout] = useState(false);
  const [payoutMsg, setPayoutMsg] = useState("");

  const fetchData = () =>
    axiosHomeProtected
      .get("/referral/my-data")
      .then((r) => {
        setData(r.data);
        setUpiInput(r.data.upiId || "");
      })
      .catch(() => {})
      .finally(() => setLoading(false));

  useEffect(() => {
    fetchData();
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

  const copyLink = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const saveUpi = async () => {
    setUpiError("");
    if (!upiInput.trim()) { setUpiError("UPI ID cannot be empty"); return; }
    setSavingUpi(true);
    try {
      await axiosHomeProtected.patch("/referral/upi-id", { upiId: upiInput.trim() });
      setData(prev => prev ? { ...prev, upiId: upiInput.trim() } : prev);
      setEditingUpi(false);
    } catch {
      setUpiError("Failed to save UPI ID. Please try again.");
    } finally {
      setSavingUpi(false);
    }
  };

  const handlePayoutRequest = async () => {
    setPayoutMsg("");
    setRequestingPayout(true);
    try {
      await axiosHomeProtected.post("/referral/payout-request");
      setPayoutMsg("Payout request submitted! We'll process it within 3–5 business days.");
      fetchData();
    } catch (err: any) {
      setPayoutMsg(err?.response?.data?.error || "Failed to submit payout request.");
    } finally {
      setRequestingPayout(false);
    }
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

  if (!data) return (
    <section className="relative py-12">
      <div className="container mx-auto text-center text-gray-500 py-20">
        <p className="text-lg font-medium">Referral data not available.</p>
        <p className="text-sm mt-2">Please sign in as a customer to view your referral dashboard.</p>
      </div>
    </section>
  );

  return (
    <section className="relative py-12">
      <div className="container mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="lg:text-4xl md:text-3xl text-2xl font-bold text-secondary">
            Your Referral Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Share your code, earn {data.earningsPercent}% on every referred purchase
          </p>
        </div>

        {/* Referral Code Card */}
        <div className="bg-secondary text-white md:px-12 px-5 py-8 rounded-3xl text-center space-y-4">
          <p className="text-sm opacity-75">Your unique referral code</p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            <span className="text-xl sm:text-3xl md:text-4xl font-bold tracking-wide sm:tracking-widest font-mono break-all">
              {data.referralCode}
            </span>
            <button
              onClick={copyCode}
              className="p-2.5 sm:p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-colors flex-shrink-0"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-100/60 rounded-2xl p-6 flex items-center gap-5">
            <span className="inline-flex flex-shrink-0 items-center justify-center size-12 bg-white border border-gray-200 rounded-full">
              <Users className="w-6 h-6 text-secondary" />
            </span>
            <div>
              <p className="text-sm text-gray-500">Friends Referred</p>
              <p className="text-3xl font-bold text-secondary">{data.referredCount}</p>
            </div>
          </div>
          <div className="bg-gray-100/60 rounded-2xl p-6 flex items-center gap-5">
            <span className="inline-flex flex-shrink-0 items-center justify-center size-12 bg-white border border-gray-200 rounded-full">
              <TrendingUp className="w-6 h-6 text-primary" />
            </span>
            <div>
              <p className="text-sm text-gray-500">Total Earnings</p>
              <p className="text-3xl font-bold text-primary">₹{data.totalEarnings.toLocaleString("en-IN")}</p>
            </div>
          </div>
          <div className="bg-gray-100/60 rounded-2xl p-6 flex items-center gap-5">
            <span className="inline-flex flex-shrink-0 items-center justify-center size-12 bg-white border border-gray-200 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </span>
            <div>
              <p className="text-sm text-gray-500">Settled</p>
              <p className="text-3xl font-bold text-emerald-600">₹{data.settledAmount.toLocaleString("en-IN")}</p>
            </div>
          </div>
          <div className="bg-gray-100/60 rounded-2xl p-6 flex items-center gap-5">
            <span className="inline-flex flex-shrink-0 items-center justify-center size-12 bg-white border border-gray-200 rounded-full">
              <Wallet className="w-6 h-6 text-amber-600" />
            </span>
            <div>
              <p className="text-sm text-gray-500">Available</p>
              <p className="text-3xl font-bold text-amber-600">₹{data.availableAmount.toLocaleString("en-IN")}</p>
            </div>
          </div>
        </div>

        {/* Payout Section */}
        <div className="bg-gray-100/60 md:px-12 p-6 rounded-3xl space-y-4">
          <h3 className="text-lg font-semibold text-secondary">Payout Settings</h3>

          {/* UPI ID */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Your UPI ID</p>
            {editingUpi ? (
              <div className="flex items-center gap-3 flex-wrap">
                <input
                  type="text"
                  value={upiInput}
                  onChange={e => setUpiInput(e.target.value)}
                  placeholder="e.g. name@upi or 9876543210@paytm"
                  className="flex-1 min-w-48 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
                />
                <button
                  onClick={saveUpi}
                  disabled={savingUpi}
                  className="px-4 py-2 bg-secondary text-white rounded-xl text-sm font-medium hover:bg-secondary/90 disabled:opacity-60"
                >
                  {savingUpi ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => { setEditingUpi(false); setUpiInput(data.upiId || ""); setUpiError(""); }}
                  className="px-4 py-2 border border-gray-300 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono text-gray-700 bg-white border border-gray-200 px-4 py-2 rounded-xl">
                  {data.upiId || <span className="text-gray-400 italic">Not set</span>}
                </span>
                <button
                  onClick={() => setEditingUpi(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-secondary border border-secondary/30 rounded-xl hover:bg-secondary/5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  {data.upiId ? "Edit" : "Add UPI ID"}
                </button>
              </div>
            )}
            {upiError && <p className="text-xs text-red-500">{upiError}</p>}
          </div>

          {/* Request Payout Button */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <button
              onClick={handlePayoutRequest}
              disabled={requestingPayout || data.availableAmount <= 0 || !data.upiId || data.pendingAmount > 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {requestingPayout ? (
                <Clock className="w-4 h-4 animate-spin" />
              ) : (
                <Wallet className="w-4 h-4" />
              )}
              {requestingPayout ? "Submitting..." : `Request Payout ₹${data.availableAmount.toLocaleString("en-IN")}`}
            </button>
            {data.pendingAmount > 0 && (
              <p className="text-xs text-amber-600 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                ₹{data.pendingAmount.toLocaleString("en-IN")} payout already pending review
              </p>
            )}
            {!data.upiId && data.availableAmount > 0 && (
              <p className="text-xs text-gray-500">Add your UPI ID above to request a payout.</p>
            )}
          </div>
          {payoutMsg && (
            <p className={`text-sm rounded-xl px-4 py-2 ${payoutMsg.startsWith("Payout request submitted") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
              {payoutMsg}
            </p>
          )}
        </div>

        {/* How You Earn */}
        <div className="bg-gray-100/60 md:px-12 p-6 rounded-3xl">
          <h3 className="text-lg font-semibold text-secondary mb-5">How you earn</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: 1, title: "Share your code", desc: `Send code ${data.referralCode} to friends` },
              { step: 2, title: "Friend signs up & buys", desc: `They get ${data.discountPercent}% off their purchase` },
              { step: 3, title: "You get paid", desc: `Earn ${data.earningsPercent}% of their purchase value` },
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
            <p className="text-sm font-semibold">Share your referral link with friends</p>
            <p className="text-xs text-gray-500 mt-1 font-mono">{referralLink}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={copyLink}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-xl text-sm font-medium hover:bg-secondary/90 transition-colors"
            >
              {linkCopied ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {linkCopied ? "Copied!" : "Copy Link"}
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

        {/* Referred Users Table */}
        {data.referredUsers.length > 0 && (
          <div className="bg-gray-100/60 rounded-3xl overflow-hidden">
            <div className="md:px-12 px-6 pt-6 pb-3">
              <h3 className="text-lg font-semibold text-secondary">Referred Friends</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 text-xs uppercase bg-gray-200/50">
                    <th className="md:px-12 px-6 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Purchases</th>
                    <th className="px-4 py-3 font-medium text-right">Your Earnings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/60">
                  {data.referredUsers.map((u, i) => (
                    <tr key={i} className="hover:bg-gray-200/30">
                      <td className="md:px-12 px-6 py-3 font-medium">{u.name}</td>
                      <td className="px-4 py-3 text-gray-600">{u.orderCount}</td>
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
