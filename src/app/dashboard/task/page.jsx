"use client";

import { ArrowLeft, Gift, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TaskPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] overflow-y-auto [&::-webkit-scrollbar]:hidden">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-3 shadow-sm z-10 relative">
        <button 
          onClick={() => router.back()}
          className="w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors"
        >
          <ArrowLeft size={18} className="text-[#1e3a8a]" />
        </button>
        <h1 className="text-[#1e3a8a] font-bold text-[18px]">Task</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Stats Card */}
        <div className="bg-[#3b82f6] rounded-[16px] p-5 text-white shadow-sm flex justify-between items-center text-center">
          <div className="flex flex-col gap-1 items-center">
            <span className="text-[24px] font-bold leading-none">2</span>
            <span className="text-[11px] text-blue-100">Total Tasks</span>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <span className="text-[24px] font-bold leading-none">0</span>
            <span className="text-[11px] text-blue-100">Ready</span>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <span className="text-[24px] font-bold leading-none">0</span>
            <span className="text-[11px] text-blue-100">Claimed</span>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <span className="text-[24px] font-bold leading-none">0</span>
            <span className="text-[11px] text-blue-100">Today's Invites</span>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {/* Task 1 */}
          <div className="bg-white rounded-[16px] p-4 shadow-sm border border-gray-100 flex gap-3">
            <div className="w-12 h-12 bg-[#e0e7ff] rounded-[12px] flex items-center justify-center shrink-0">
              <Gift className="text-[#6366f1]" size={20} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-[14px] font-bold text-[#1e293b] leading-tight mb-1.5">Invite 1 registered Users to claim</h3>
                  <div className="flex items-center gap-2 text-[12px]">
                    <span className="text-[#f59e0b] font-bold">$3.00</span>
                    <span className="text-gray-500">1 invites today</span>
                  </div>
                </div>
                <button className="bg-gray-100 text-gray-400 px-2.5 py-1.5 rounded-[8px] text-[11px] font-bold flex items-center gap-1.5 shrink-0 ml-2">
                  <Lock size={12} />
                  Locked
                </button>
              </div>
              <div className="relative w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-3 mb-2">
                <div className="absolute top-0 left-0 h-full bg-[#f59e0b] w-[0%]"></div>
              </div>
              <div className="text-[11px] text-gray-500 font-medium">0/1 today (0%)</div>
            </div>
          </div>

          {/* Task 2 */}
          <div className="bg-white rounded-[16px] p-4 shadow-sm border border-gray-100 flex gap-3">
            <div className="w-12 h-12 bg-[#e0e7ff] rounded-[12px] flex items-center justify-center shrink-0">
              <Gift className="text-[#6366f1]" size={20} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-[14px] font-bold text-[#1e293b] leading-tight mb-1.5">Invite 10 users</h3>
                  <div className="flex items-center gap-2 text-[12px]">
                    <span className="text-[#f59e0b] font-bold">$10.00</span>
                    <span className="text-gray-500">10 invites today</span>
                  </div>
                </div>
                <button className="bg-gray-100 text-gray-400 px-2.5 py-1.5 rounded-[8px] text-[11px] font-bold flex items-center gap-1.5 shrink-0 ml-2">
                  <Lock size={12} />
                  Locked
                </button>
              </div>
              <div className="relative w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-3 mb-2">
                <div className="absolute top-0 left-0 h-full bg-[#f59e0b] w-[0%]"></div>
              </div>
              <div className="text-[11px] text-gray-500 font-medium">0/10 today (0%)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
