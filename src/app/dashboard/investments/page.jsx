"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Wallet } from "lucide-react";
import Link from "next/link";
import { useFetchData } from "@/hooks/useApi";

export default function MyInvestmentsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("active"); // "active" or "completed"
  const { data: settingsRes } = useFetchData("/settings", ["platform-settings"]);
  const settings = settingsRes?.settings || {};

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] overflow-y-auto  [&::-webkit-scrollbar]:hidden">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 flex justify-between items-center shadow-sm z-10 sticky top-0 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-[#4c1d95] text-[15px] font-bold">My Investments</h1>
        </div>
        <Link href="/dashboard/mining" className="w-8 h-8 bg-[#8b5cf6] rounded-md flex items-center justify-center text-white hover:bg-purple-600 transition-colors shadow-sm cursor-pointer">
          <Plus size={16} />
        </Link>
      </div>

      <div className="px-4 pt-4 space-y-4 max-w-[480px] mx-auto w-full">
        {/* Tabs */}
        <div className="flex p-1 bg-white rounded-[12px] border border-gray-100 shadow-sm">
          <button
            onClick={() => setActiveTab("active")}
            className={`flex-1 py-2 rounded-[8px] text-[13px] font-bold transition-colors ${activeTab === "active"
                ? "bg-[#8b5cf6] text-white"
                : "text-[#334155] hover:bg-gray-50"
              }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`flex-1 py-2 rounded-[8px] text-[13px] font-bold transition-colors ${activeTab === "completed"
                ? "bg-[#8b5cf6] text-white"
                : "text-[#334155] hover:bg-gray-50"
              }`}
          >
            Completed
          </button>
        </div>

        {/* Stats Card */}
        <div className="bg-[#8b5cf6] rounded-lg px-4 py-2 text-white shadow-[0_4px_14px_rgba(59,130,246,0.3)] flex justify-between items-center">
          <div className="text-center flex-1">
            <div className="text-[18px] font-bold tracking-tight">{settings.currency_symbol || "$"}0.00</div>
            <div className="text-[10px] text-white/80">Total Invested</div>
          </div>
          <div className="text-center flex-1 border-x border-white/20">
            <div className="text-[18px] font-bold tracking-tight">0</div>
            <div className="text-[10px] text-white/80 capitalize">{activeTab}</div>
          </div>
          <div className="text-center flex-1">
            <div className="text-[18px] font-bold tracking-tight">{settings.currency_symbol || "$"}0.00</div>
            <div className="text-[10px] text-white/80">Est. Monthly</div>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center pt-24 pb-12 gap-3">
          <div className="w-14 h-14 bg-[#e2e8f0] rounded-2xl flex items-center justify-center border-4 border-white shadow-sm relative">
            <div className="absolute top-0 right-0 w-2 h-2 bg-white rounded-bl-sm"></div>
            <Wallet size={24} className="text-[#94a3b8]" />
          </div>
          <span className="text-[13px] text-[#94a3b8]">
            No {activeTab === "active" ? "Active" : "Completed"} investments
          </span>
        </div>
      </div>
    </div>
  );
}
