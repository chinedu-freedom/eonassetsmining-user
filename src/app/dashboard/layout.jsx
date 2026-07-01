"use client";

import { Suspense } from "react";
import BottomNav from "@/components/BottomNav";
import DailyCheckinModal from "@/components/DailyCheckinModal";
import DepositModal from "@/components/DepositModal";
import { useFetchData } from "@/hooks/useApi";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { isLoading: isLoadingSettings } = useFetchData("/settings", ["platform-settings"]);
  const { data: userRes, isLoading: isLoadingProfile } = useFetchData("/users/me", ["user-profile"]);

  const user = userRes?.user;

  useEffect(() => {
    if (!isLoadingProfile && user && user.email_verified === false) {
      localStorage.setItem("registerEmail", user.email);
      router.replace("/auth/verify-email");
    }
  }, [user, isLoadingProfile, router]);

  if (isLoadingSettings || isLoadingProfile) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-[#8b5cf6] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user && user.email_verified === false) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0b1426] flex justify-center">
      <div className="w-full max-w-[480px] bg-[#f8f9fa] min-h-screen relative shadow-2xl overflow-hidden pb-[80px]">
        {children}
        <DailyCheckinModal />
        <Suspense fallback={null}>
          <DepositModal />
        </Suspense>
      </div>
      <BottomNav />
    </div>
  );
}
