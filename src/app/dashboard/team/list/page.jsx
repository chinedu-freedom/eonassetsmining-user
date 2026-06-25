"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Users, Loader2 } from "lucide-react";
import { useFetchData } from "@/hooks/useApi";

export default function TeamListPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(1);

  const { data: teamListRes, isLoading } = useFetchData(`/users/me/team/list?level=${activeTab}`, ["team-list", activeTab]);
  const teamList = teamListRes?.data || [];

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] overflow-y-auto [&::-webkit-scrollbar]:hidden ">
      {/* Header */}
      <div className="bg-[#f8f9fa] px-4 py-4 flex items-center gap-3 sticky top-0 z-20">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 bg-white border border-gray-200 rounded-[10px] flex items-center justify-center transition-colors text-gray-700 shadow-sm hover:bg-gray-50 shrink-0 cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <h1 className="text-[#4c1d95] text-[18px] font-bold">Team List</h1>
      </div>

      <div className="px-4 max-w-[480px] mx-auto w-full flex-1 flex flex-col pb-10">

        {/* Tabs */}
        <div className="bg-[#f1f5f9] p-1.5 rounded-[12px] flex mt-2 mb-6">
          {[1, 2, 3, 4].map((level) => (
            <button
              key={level}
              onClick={() => setActiveTab(level)}
              className={`flex-1 py-2.5 text-[13px] font-medium rounded-[8px] transition-all ${activeTab === level
                  ? 'bg-white text-[#4c1d95] shadow-sm'
                  : 'text-[#64748b] hover:text-[#334155]'
                }`}
            >
              Level {level}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center flex-1 min-h-[300px]">
            <Loader2 className="w-8 h-8 animate-spin text-[#8b5cf6] mb-3" />
            <span className="text-[12px] text-gray-500 font-medium">Loading team members...</span>
          </div>
        ) : teamList.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 min-h-[300px]">
            <div className="relative mb-4">
              {/* Simple overlapping users icon effect */}
              <Users size={64} className="text-[#cbd5e1] opacity-60 ml-4" />
              <Users size={48} className="text-[#e2e8f0] opacity-40 absolute top-2 right-8" />
            </div>
            <p className="text-[#64748b] text-[14px]">
              No members in Level {activeTab} yet
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {teamList.map((user) => (
              <div key={user.id} className="bg-white rounded-[16px] p-4 flex items-center justify-between shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-[48px] h-[48px] rounded-full bg-gradient-to-br from-[#0d9488] to-[#2563eb] flex items-center justify-center text-white font-bold text-[20px] shrink-0">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  
                  {/* User Info */}
                  <div>
                    <h3 className="text-[#0f172a] font-bold text-[15px]">{user.username}</h3>
                    <p className="text-[#64748b] text-[12px] mt-0.5">
                      Joined {new Date(user.joined_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className={`text-[12px] font-bold mt-1 ${user.status === 'Active' ? 'text-[#059669]' : 'text-gray-400'}`}>
                      {user.status}
                    </p>
                  </div>
                </div>

                {/* Financials */}
                <div className="text-right flex flex-col items-end justify-center">
                  <div className="text-[#4c1d95] font-bold text-[15px] leading-tight">
                    ${Number(user.balance).toFixed(2)}
                  </div>
                  <div className="text-gray-400 text-[10px] mb-1.5">Balance</div>
                  
                  <div className="text-[#f59e0b] font-bold text-[13px] leading-tight mt-0.5">
                    ${Number(user.deposited_amount || 0).toFixed(2)}
                  </div>
                  <div className="text-gray-400 text-[10px] mb-1.5">Deposited</div>

                  <div className="text-[#059669] font-bold text-[13px] leading-tight mt-0.5">
                    ${Number(user.invested_amount || 0).toFixed(2)}
                  </div>
                  <div className="text-gray-400 text-[10px]">Invested</div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
