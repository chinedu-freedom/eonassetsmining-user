"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, User, Mail, Phone, Share2, Calendar, Info } from "lucide-react";

export default function MyProfilePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] overflow-y-auto [&::-webkit-scrollbar]:hidden">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center gap-2.5 sticky top-0 z-20 shadow-sm border-b border-gray-100">
        <button 
          onClick={() => router.back()}
          className="w-7 h-7 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors text-gray-600"
        >
          <ArrowLeft size={16} />
        </button>
        <h1 className="text-[#1e3a8a] text-[15px] font-bold">My Profile</h1>
      </div>

      <div className="px-4 py-4 max-w-[480px] mx-auto w-full space-y-4">
        
        {/* Main Details Card */}
        <div className="bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="flex flex-col divide-y divide-gray-50">
            {/* Full Name */}
            <div className="p-4">
              <div className="text-gray-400 text-[10px] font-medium tracking-wide uppercase mb-1.5">Full Name</div>
              <div className="flex items-center gap-3">
                <User size={16} className="text-[#3b82f6] fill-[#3b82f6]/20" />
                <span className="text-[#0f172a] text-[14px]">Spark</span>
              </div>
            </div>

            {/* Email Address */}
            <div className="p-4">
              <div className="text-gray-400 text-[10px] font-medium tracking-wide uppercase mb-1.5">Email Address</div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-[#3b82f6] fill-[#3b82f6]/20" />
                <span className="text-[#0f172a] text-[14px]">chinedufreedom10@gmail.com</span>
              </div>
            </div>

            {/* Phone Number */}
            <div className="p-4">
              <div className="text-gray-400 text-[10px] font-medium tracking-wide uppercase mb-1.5">Phone Number</div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-[#3b82f6] fill-[#3b82f6]/20" />
                <span className="text-[#0f172a] text-[14px]">09130266581</span>
              </div>
            </div>

            {/* Country */}
            <div className="p-4">
              <div className="text-gray-400 text-[10px] font-medium tracking-wide uppercase mb-1.5">Country</div>
              <div className="flex items-center gap-3 pl-[28px]">
                <span className="text-[#0f172a] text-[14px]">Nigeria</span>
              </div>
            </div>

            {/* Referral Code */}
            <div className="p-4">
              <div className="text-gray-400 text-[10px] font-medium tracking-wide uppercase mb-1.5">Referral Code</div>
              <div className="flex items-center gap-3">
                <Share2 size={16} className="text-[#3b82f6]" />
                <span className="text-[#0f172a] text-[14px]">7MQ4AL</span>
              </div>
            </div>

            {/* Member Since */}
            <div className="p-4">
              <div className="text-gray-400 text-[10px] font-medium tracking-wide uppercase mb-1.5">Member Since</div>
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-[#3b82f6]" />
                <span className="text-[#0f172a] text-[14px]">May 27, 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-[#eff6ff] rounded-[12px] p-4 border border-blue-100 flex items-start gap-3">
          <div className="mt-0.5 shrink-0">
            <div className="w-[18px] h-[18px] bg-[#93c5fd] rounded-full flex items-center justify-center text-[#1e3a8a]">
              <Info size={12} strokeWidth={3} />
            </div>
          </div>
          <p className="text-[#1e3a8a] text-[13px] leading-snug">
            Profile information cannot be edited. Contact support if you need to make changes.
          </p>
        </div>

      </div>
    </div>
  );
}
