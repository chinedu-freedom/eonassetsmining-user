"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFetchData, usePost } from "@/hooks/useApi";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Loader2
} from "lucide-react";

export default function AuthenticationSettingsPage() {
  const router = useRouter();

  const { data: userProfile, isLoading: isProfileLoading, refetch } = useFetchData("/users/me");

  // 1 = unverified, 2 = enter code, 3 = verified
  const [step, setStep] = useState(1);
  const [code, setCode] = useState("");

  const { mutate: sendCode, isPending: isSending } = usePost("/users/me/send-verification");
  const { mutate: verifyCode, isPending: isVerifying } = usePost("/users/me/verify-email");

  useEffect(() => {
    if (userProfile?.user && userProfile.user.email_verified) {
      setStep(3);
    }
  }, [userProfile]);

  const handleSendCode = () => {
    sendCode({}, {
      onSuccess: (res) => {
        toast.success(res.message || "Verification code sent to your email!");
        setStep(2);
      }
    });
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (!code || code.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }
    verifyCode({ code }, {
      onSuccess: (res) => {
        toast.success(res.message || "Email verified successfully!");
        setStep(3);
        refetch();
      }
    });
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
        <h1 className="text-[#1e3a8a] text-[15px] font-bold">Authentication</h1>
      </div>

      <div className="px-4 py-4 max-w-[480px] mx-auto w-full">
        <div className="bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] p-6">

          {/* Top Status Area */}
          <div className="flex flex-col items-center text-center">
            {step < 3 ? (
              <div className="w-[72px] h-[72px] bg-[#fef3c7] rounded-full flex items-center justify-center text-[#d97706] mb-4">
                <ShieldAlert size={36} className="fill-[#d97706] text-[#fef3c7]" />
              </div>
            ) : (
              <div className="w-[72px] h-[72px] bg-[#d1fae5] rounded-full flex items-center justify-center text-[#059669] mb-4">
                <ShieldCheck size={36} className="fill-[#059669] text-[#d1fae5]" />
              </div>
            )}

            <h2 className="text-[#0f172a] text-[20px] font-bold mb-1.5">
              {step < 3 ? "Verify Your Email" : "Email Verified"}
            </h2>
            {isProfileLoading ? (
               <div className="h-4 bg-gray-200 rounded animate-pulse w-48 mb-4"></div>
            ) : (
               <p className="text-[#64748b] text-[14px] mb-4">
                 {userProfile?.user?.email}
               </p>
            )}

            {/* Pill Badge */}
            <div className="mb-8">
              {step < 3 ? (
                <div className="inline-flex items-center gap-1.5 bg-[#fef3c7] text-[#d97706] px-4 py-2 rounded-full text-[13px] font-bold">
                  <AlertTriangle size={16} className="fill-[#d97706] text-white" />
                  Unverified
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 bg-[#d1fae5] text-[#059669] px-4 py-2 rounded-full text-[13px] font-bold">
                  <CheckCircle2 size={16} className="fill-[#059669] text-white" />
                  Verified
                </div>
              )}
            </div>
          </div>

          {/* Action Area based on step */}
          {step === 1 && (
            <button
              onClick={handleSendCode}
              disabled={isSending}
              className="w-full bg-[#2563eb] hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center gap-2 text-white font-bold text-[15px] py-3.5 rounded-[12px] transition-colors shadow-sm"
            >
              {isSending ?  <Loader2 size={18} className="animate-spin" /> : "Send Verification Code"     }
            </button>
          )}

          {step === 2 && (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-[#334155] text-[13px] font-medium">Enter Verification Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="0 0 0 0 0 0"
                  className="w-full bg-[#f8fafc] border border-gray-200 rounded-[12px] px-4 py-4 text-[16px] text-center tracking-[0.4em] font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  maxLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full flex items-center justify-center gap-2 bg-[#2563eb] hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-[15px] py-3.5 rounded-[12px] transition-colors shadow-sm"
              >
                {isVerifying ? <Loader2 size={18} className="animate-spin" /> : "Verify"}
              </button>

              <div className="text-center pt-2">
                <p className="text-[13px] text-gray-500">
                  Didn't receive the code? 
                  <button 
                    type="button" 
                    onClick={handleSendCode} 
                    disabled={isSending}
                    className="text-[#3b82f6] hover:underline disabled:opacity-50 font-medium ml-1"
                  >
                    Resend
                  </button>
                </p>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
