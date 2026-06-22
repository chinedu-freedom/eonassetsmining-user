"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Lock,
  Key,
  ShieldCheck,
  Trash2,
  ChevronRight
} from "lucide-react";
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
      iconBg: "bg-[#eff6ff]",
      iconColor: "text-[#3b82f6]",
      badge: null,
      href: "/dashboard/settings/profile"
    },
    {
      id: "payment",
      label: "Payment Settings",
      icon: Lock,
      iconBg: "bg-[#eff6ff]",
      iconColor: "text-[#3b82f6]",
      badge: hasPin 
        ? { text: "Set", bg: "bg-green-100", color: "text-green-700" }
        : { text: "Not Set", bg: "bg-[#fef3c7]", color: "text-[#d97706]" },
      href: "/dashboard/settings/payment"
    },
    {
      id: "login",
      label: "Login Settings",
      icon: Key,
      iconBg: "bg-[#eff6ff]",
      iconColor: "text-[#3b82f6]",
      badge: null,
      href: "/dashboard/settings/login"
    },
    {
      id: "auth",
      label: "Authentication",
      icon: ShieldCheck,
      iconBg: "bg-[#eff6ff]",
      iconColor: "text-[#3b82f6]",
      badge: isEmailVerified
        ? { text: "Verified", bg: "bg-[#d1fae5]", color: "text-[#059669]" }
        : { text: "Unverified", bg: "bg-[#fef3c7]", color: "text-[#d97706]" },
      href: "/dashboard/settings/auth"
    }
  ];

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] overflow-y-auto [&::-webkit-scrollbar]:hidden ">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center gap-2.5 sticky top-0 z-20 shadow-sm border-b border-gray-100">
        <button
          onClick={() => router.back()}
          className="w-7 h-7 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors text-gray-600"
        >
          <ArrowLeft size={16} />
        </button>
        <h1 className="text-[#1e3a8a] text-[15px] font-bold">Settings</h1>
      </div>

      <div className="px-4 py-4 max-w-[480px] mx-auto w-full space-y-3">

        {/* Main Settings Group */}
        <div className="bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => item.href && router.push(item.href)}
              className={`w-full flex items-center justify-between px-3.5 py-3 hover:bg-gray-50 transition-colors ${index !== menuItems.length - 1 ? 'border-b border-gray-50' : ''
                }`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center ${item.iconBg} ${item.iconColor}`}>
                  <item.icon size={16} />
                </div>
                <span className="text-[#334155] text-[13px] font-medium">{item.label}</span>
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
        <div className="bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full flex items-center justify-between px-3.5 py-3 hover:bg-red-50/50 transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-[10px] flex items-center justify-center bg-[#fee2e2] text-[#ef4444]">
                <Trash2 size={16} />
              </div>
              <span className="text-[#ef4444] text-[13px] font-medium">Delete Account</span>
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
            className="bg-white rounded-[20px] w-full max-w-[320px] p-5 shadow-xl animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-4">
                <Trash2 size={24} />
              </div>
              <h3 className="text-[#0f172a] text-[16px] font-bold mb-2">Delete Account</h3>
              <p className="text-gray-500 text-[13px] leading-relaxed mb-6">
                Are you sure you want to delete your account? This action is permanent and cannot be undone.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2.5 rounded-[12px] bg-gray-100 text-gray-700 font-bold text-[13px] hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
                        method: 'DELETE',
                        headers: {
                          'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                      });
                      if (res.ok) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
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
