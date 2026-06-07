"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Users } from "lucide-react";

export default function TeamListPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(1);

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] overflow-y-auto [&::-webkit-scrollbar]:hidden pb-24">
      {/* Header */}
      <div className="bg-[#f8f9fa] px-4 py-4 flex items-center gap-3 sticky top-0 z-20">
        <button 
          onClick={() => router.back()}
          className="w-9 h-9 bg-white border border-gray-200 rounded-[10px] flex items-center justify-center transition-colors text-gray-700 shadow-sm hover:bg-gray-50 shrink-0"
        >
          <ArrowLeft size={16} />
        </button>
        <h1 className="text-[#1e3a8a] text-[18px] font-bold">Team List</h1>
      </div>

      <div className="px-4 max-w-[480px] mx-auto w-full flex-1 flex flex-col">
        
        {/* Tabs */}
        <div className="bg-[#f1f5f9] p-1.5 rounded-[12px] flex mt-2 mb-16">
          {[1, 2, 3].map((level) => (
            <button
              key={level}
              onClick={() => setActiveTab(level)}
              className={`flex-1 py-2.5 text-[13px] font-medium rounded-[8px] transition-all ${
                activeTab === level 
                  ? 'bg-white text-[#1e3a8a] shadow-sm' 
                  : 'text-[#64748b] hover:text-[#334155]'
              }`}
            >
              Level {level}
            </button>
          ))}
        </div>

        {/* Empty State Content */}
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

      </div>
    </div>
  );
}
