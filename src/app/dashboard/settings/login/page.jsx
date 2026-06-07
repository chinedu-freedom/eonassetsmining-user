"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Shield,
  Lock,
  CheckCircle2,
  Eye,
  EyeOff,
  Info,
  Check
} from "lucide-react";

export default function SecuritySettingsPage() {
  const router = useRouter();

  // State for toggling password visibility
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic
  };

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
        <h1 className="text-[#1e3a8a] text-[15px] font-bold">Security</h1>
      </div>

      <div className="px-4 py-6 max-w-[480px] mx-auto w-full">

        {/* Top Icon Area */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-[60px] h-[60px] bg-[#2563eb] rounded-[18px] flex items-center justify-center text-white mb-3 shadow-[0_4px_12px_rgba(37,99,235,0.3)]">
            <Shield size={28} className="fill-white" />
          </div>
          <h2 className="text-[#1e3a8a] text-[18px] font-bold">Change Password</h2>
          <p className="text-[#64748b] text-[12.5px] mt-1">Update your account password</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] p-4 mb-4">
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-[#334155] mb-2">
                <Lock size={14} className="text-[#3b82f6]" />
                <label className="text-[12px] font-medium">Login Password</label>
              </div>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  placeholder="Enter your login password"
                  className="w-full bg-white border border-gray-200 rounded-[10px] pl-3.5 pr-10 py-2.5 text-[13px] text-gray-800 placeholder-[#94a3b8] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-[#334155] mb-2">
                <Lock size={14} className="text-[#3b82f6]" />
                <label className="text-[12px] font-medium">New Password</label>
              </div>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  placeholder="Enter your new password"
                  className="w-full bg-white border border-gray-200 rounded-[10px] pl-3.5 pr-10 py-2.5 text-[13px] text-gray-800 placeholder-[#94a3b8] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5 pb-2">
              <div className="flex items-center gap-1.5 text-[#334155] mb-2">
                <CheckCircle2 size={14} className="text-[#3b82f6]" />
                <label className="text-[12px] font-medium">Confirm Password</label>
              </div>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter your new password"
                  className="w-full bg-white border border-gray-200 rounded-[10px] pl-3.5 pr-10 py-2.5 text-[13px] text-gray-800 placeholder-[#94a3b8] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-[14px] py-3 rounded-[10px] transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              Save Changes
              <div className="w-[14px] h-[14px] bg-white rounded-full flex items-center justify-center">
                <Check size={10} className="text-[#2563eb] stroke-[4]" />
              </div>
            </button>
          </form>
        </div>

        {/* Requirements Box */}
        <div className="bg-[#eff6ff] rounded-[16px] border border-blue-100 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-[18px] h-[18px] bg-[#1e3a8a] rounded-full flex items-center justify-center text-white">
              <Info size={12} strokeWidth={3} />
            </div>
            <h3 className="text-[#1e3a8a] text-[13px] font-bold">Password Requirements</h3>
          </div>
          <ul className="space-y-2.5">
            {[
              "Minimum 8 characters",
              "Use a combination of letters and numbers",
              "Avoid using personal information",
              "Don't reuse old passwords"
            ].map((req, idx) => (
              <li key={idx} className="flex items-center gap-2.5 text-[#2563eb] text-[12px]">
                <Check size={14} className="shrink-0" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
