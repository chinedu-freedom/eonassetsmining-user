"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ShieldCheck, Key, Lock, User, ArrowLeft, Trash2 } from "lucide-react";
import axiosInstance, { clearAuthToken } from "@/config/axiosInstance";
import { useFetchData } from "@/hooks/useApi";

export default function SettingsPage() {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { data: userRes } = useFetchData("/users/me", ["profile"]);
  const hasPin = !!userRes?.user?.has_withdrawal_pin;
  const isEmailVerified = !!userRes?.user?.email_verified;

  const menuItems = [
    {
      id: "profile",
      label: "My Profile",
      icon: User,
      iconBg: "bg-white/5",
      iconColor: "text-[#8b5cf6]",
      badge: null,
      href: "/dashboard/settings/profile"
    },
    {
      id: "payment",
      label: "Payment Settings",
      icon: Lock,
      iconBg: "bg-white/5",
      iconColor: "text-[#8b5cf6]",
      badge: hasPin 
        ? { text: "Set", bg: "bg-green-900/20", color: "text-green-400" }
        : { text: "Not Set", bg: "bg-amber-900/20", color: "text-amber-400" },
      href: "/dashboard/settings/payment"
    },
    {
      id: "login",
      label: "Login Settings",
      icon: Key,
      iconBg: "bg-white/5",
      iconColor: "text-[#8b5cf6]",
      badge: null,
      href: "/dashboard/settings/login"
    },
    {
      id: "auth",
      label: "Authentication",
      icon: ShieldCheck,
      iconBg: "bg-white/5",
      iconColor: "text-[#8b5cf6]",
      badge: isEmailVerified
        ? { text: "Verified", bg: "bg-emerald-900/20", color: "text-emerald-400" }
        : { text: "Unverified", bg: "bg-amber-900/20", color: "text-amber-400" },
      href: "/dashboard/settings/auth"
    }
  ];

  return (
    <div className="flex flex-col h-full bg-transparent overflow-y-auto [&::-webkit-scrollbar]:hidden ">
      {/* Header */}
      <div className="bg-[#131F37] px-4 py-3 flex items-center gap-2.5 sticky top-0 z-20 shadow-sm border-b border-white/5">
        <button
          onClick={() => router.back()}
          className="w-7 h-7 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors text-gray-300 cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <h1 className="text-white/90 text-[15px] font-bold">Settings</h1>
      </div>

      <div className="px-4 py-4 max-w-[480px] mx-auto w-full space-y-3">

        {/* Main Settings Group */}
        <div className="bg-[#131F37] rounded-[16px] border border-white/5 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => item.href && router.push(item.href)}
              className={`w-full flex items-center justify-between px-3.5 py-3 hover:bg-white/5 transition-colors ${index !== menuItems.length - 1 ? 'border-b border-white/5' : ''
                }`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center ${item.iconBg} ${item.iconColor}`}>
                  <item.icon size={16} />
                </div>
                <span className="text-white/90 text-[13px] font-medium">{item.label}</span>
              </div>

              <div className="flex items-center gap-2.5">
                {item.badge && (
                  <span className={`${item.badge.bg} ${item.badge.color} px-2.5 py-1 rounded-[6px] text-[10px] font-bold`}>
                    {item.badge.text}
                  </span>
                )}
                <ChevronRight size={16} className="text-gray-300" />
              </div>
            </button>
          ))}
        </div>

        {/* Delete Account */}
        <div className="bg-[#131F37] rounded-[16px] border border-white/5 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full flex items-center justify-between px-3.5 py-3 hover:bg-red-900/20 transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-[10px] flex items-center justify-center bg-red-900/20 text-red-400">
                <Trash2 size={16} />
              </div>
              <span className="text-red-400 text-[13px] font-medium">Delete Account</span>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </button>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div 
          onClick={() => setShowDeleteModal(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0B1426] border border-white/10 rounded-[20px] w-full max-w-[320px] p-5 shadow-xl animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-900/20 rounded-full flex items-center justify-center text-red-500 mb-4">
                <Trash2 size={24} />
              </div>
              <h3 className="text-white/90 text-[16px] font-bold mb-2">Delete Account</h3>
              <p className="text-gray-400 text-[13px] leading-relaxed mb-6">
                Are you sure you want to delete your account? This action is permanent and cannot be undone.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2.5 rounded-[12px] bg-white/10 text-gray-200 font-bold text-[13px] hover:bg-white/20 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      const res = await axiosInstance.delete('/users/me');
                      if (res.data?.success) {
                        clearAuthToken();
                        window.location.href = '/login';
                      }
                    } catch (error) {
                      console.error('Failed to delete account:', error);
                    }
                    setShowDeleteModal(false);
                  }}
                  className="flex-1 py-2.5 rounded-[12px] bg-red-500 text-white font-bold text-[13px] hover:bg-red-600 transition-colors shadow-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
