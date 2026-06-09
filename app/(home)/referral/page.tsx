"use client";

import { useAuth } from "@/context/AuthContext";
import ReferralDashboard from "@/components/referal/ReferralDashboard";
import HowItWorks from "@/components/referal/HowItWorks";
import ReviewReferral from "@/components/referal/Review";

export default function Referral() {
  const { isLoggedIn, isLoading } = useAuth();

  return (
    <div className="overflow-x-hidden bg-[url(/bg/common.jpg)] bg-cover bg-top">
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin size-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : isLoggedIn ? (
        <>
          <ReferralDashboard />
          <ReviewReferral />
        </>
      ) : (
        <>
          <HowItWorks />
          <ReviewReferral />
        </>
      )}
    </div>
  );
}
