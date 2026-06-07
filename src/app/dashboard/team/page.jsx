"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Mail } from "lucide-react";

export default function TeamPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] overflow-y-auto [&::-webkit-scrollbar]:hidden pb-24">
      {/* Header */}
      <div className="bg-[#f8f9fa] px-4 py-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()}
            className="w-9 h-9 bg-[#2b354e] rounded-[10px] flex items-center justify-center text-white hover:bg-[#1e2538] transition-colors shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-[#1e3a8a] text-[20px] font-bold">Team</h1>
        </div>
        <button 
          onClick={() => router.push('/dashboard/invite')}
          className="w-9 h-9 bg-[#3b82f6] rounded-[10px] flex items-center justify-center text-white shadow-sm hover:bg-[#2563eb] transition-colors"
        >
          <Mail size={16} fill="currentColor" />
        </button>
      </div>

      <div className="px-4 space-y-4 max-w-[480px] mx-auto w-full">
        
        {/* Team Data Overview */}
        <div className="bg-[#111827] rounded-[16px] p-5 text-white shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-[14px]">Team Data Overview</h2>
            <div className="bg-white/10 px-3 py-1 rounded-full text-[11px] text-white/80">
              today
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center">
              <div className="text-[28px] font-bold mb-1 leading-none">0</div>
              <div className="text-white/70 text-[11px]">New Members</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-[28px] font-bold mb-1 leading-none">0.00</div>
              <div className="text-white/70 text-[11px]">New Earnings</div>
            </div>
          </div>
        </div>

        {/* Earnings Analysis */}
        <div className="bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[#1e3a8a] font-bold text-[14px]">Earnings Analysis</h2>
            <div className="text-gray-400 text-[11px]">today</div>
          </div>

          <div className="flex items-center justify-between mb-8">
            {/* Donut Chart Placeholder */}
            <div className="relative w-32 h-32 ml-4">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Background track */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="12"
                />
              </svg>
            </div>

            {/* Legend */}
            <div className="space-y-3 mr-4">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-[4px] bg-[#fecdd3]"></div>
                <span className="text-[#334155] text-[12px]">Level 1 (0)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-[4px] bg-[#93c5fd]"></div>
                <span className="text-[#334155] text-[12px]">Level 2 (0)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-[4px] bg-[#fde047]"></div>
                <span className="text-[#334155] text-[12px]">Level 3 (0)</span>
              </div>
            </div>
          </div>

          {/* Bottom Link */}
          <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
            <div className="text-[#64748b] text-[13px]">
              Accumulated Team: <span className="text-[#0f172a] font-bold">0</span>
            </div>
            <button 
              onClick={() => router.push('/dashboard/team/list')}
              className="text-[#3b82f6] text-[13px] hover:underline"
            >
              View Team List
            </button>
          </div>
        </div>

        {/* Effective User Data */}
        <div className="bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-5">
          <h2 className="text-[#1e3a8a] font-bold text-[14px] mb-6">Effective User Data</h2>

          <div className="space-y-6">
            {/* Level 1 */}
            <div>
              <h3 className="text-[#334155] text-[13px] font-bold mb-4">Level 1</h3>
              <div className="grid grid-cols-3 text-center">
                <div>
                  <div className="text-[#1e3a8a] text-[16px] font-bold mb-1">0/0</div>
                  <div className="text-gray-400 text-[10px]">Valid Members</div>
                </div>
                <div>
                  <div className="text-[#1e3a8a] text-[16px] font-bold mb-1">10%</div>
                  <div className="text-gray-400 text-[10px]">Commission</div>
                </div>
                <div>
                  <div className="text-[#1e3a8a] text-[16px] font-bold mb-1">0.00</div>
                  <div className="text-gray-400 text-[10px]">Total Earnings</div>
                </div>
              </div>
            </div>
            
            <div className="h-px bg-gray-50 w-full"></div>

            {/* Level 2 */}
            <div>
              <h3 className="text-[#334155] text-[13px] font-bold mb-4">Level 2</h3>
              <div className="grid grid-cols-3 text-center">
                <div>
                  <div className="text-[#1e3a8a] text-[16px] font-bold mb-1">0/0</div>
                  <div className="text-gray-400 text-[10px]">Valid Members</div>
                </div>
                <div>
                  <div className="text-[#1e3a8a] text-[16px] font-bold mb-1">2%</div>
                  <div className="text-gray-400 text-[10px]">Commission</div>
                </div>
                <div>
                  <div className="text-[#1e3a8a] text-[16px] font-bold mb-1">0.00</div>
                  <div className="text-gray-400 text-[10px]">Total Earnings</div>
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-50 w-full"></div>

            {/* Level 3 */}
            <div>
              <h3 className="text-[#334155] text-[13px] font-bold mb-4">Level 3</h3>
              <div className="grid grid-cols-3 text-center">
                <div>
                  <div className="text-[#1e3a8a] text-[16px] font-bold mb-1">0/0</div>
                  <div className="text-gray-400 text-[10px]">Valid Members</div>
                </div>
                <div>
                  <div className="text-[#1e3a8a] text-[16px] font-bold mb-1">1%</div>
                  <div className="text-gray-400 text-[10px]">Commission</div>
                </div>
                <div>
                  <div className="text-[#1e3a8a] text-[16px] font-bold mb-1">0.00</div>
                  <div className="text-gray-400 text-[10px]">Total Earnings</div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
