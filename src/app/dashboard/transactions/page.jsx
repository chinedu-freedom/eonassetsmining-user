"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  BarChart2, 
  FileText, 
  ListFilter, 
  Download, 
  Upload, 
  Gift,
  Inbox
} from "lucide-react";

export default function TransactionsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("All");

  const tabs = [
    { id: "All", label: "All", icon: ListFilter },
    { id: "Deposits", label: "Deposits", icon: Download },
    { id: "Withdrawals", label: "Withdrawals", icon: Upload },
    { id: "Commission", label: "Commission", icon: Gift },
  ];

  const transactions = [
    {
      id: 1,
      title: "Daily Check-in - Day 1",
      date: "27 May, 2026 • 10:12 AM",
      amount: "+$0.10",
      status: "SUCCESS",
      type: "Commission",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-500",
      icon: Gift
    },
    {
      id: 2,
      title: "Welcome Bonus",
      date: "27 May, 2026 • 10:11 AM",
      amount: "+$5.00",
      status: "SUCCESS",
      type: "Commission",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-500",
      icon: Gift
    }
  ];

  const filteredTransactions = activeTab === "All" 
    ? transactions 
    : transactions.filter(t => t.type === activeTab);

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] overflow-y-auto [&::-webkit-scrollbar]:hidden pb-24">
      
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center gap-2.5 sticky top-0 z-20 shadow-sm border-b border-gray-100">
        <button 
          onClick={() => router.back()}
          className="w-7 h-7 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors text-gray-600"
        >
          <ArrowLeft size={16} />
        </button>
        <h1 className="text-[#1e3a8a] text-[15px] font-bold">Transactions</h1>
      </div>

      <div className="px-4 py-4 max-w-[480px] mx-auto w-full space-y-4">
        
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-[16px] p-4 border border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] flex flex-col">
            <div className="w-8 h-8 bg-purple-100 rounded-[8px] flex items-center justify-center text-[#a855f7] mb-3">
              <BarChart2 size={16} />
            </div>
            <div className="text-[#0f172a] font-bold text-[18px] mb-0.5">$5.10</div>
            <div className="text-gray-400 text-[11px]">Total Volume</div>
          </div>
          
          <div className="bg-white rounded-[16px] p-4 border border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] flex flex-col">
            <div className="w-8 h-8 bg-[#dbeafe] rounded-[8px] flex items-center justify-center text-[#3b82f6] mb-3">
              <FileText size={16} />
            </div>
            <div className="text-[#0f172a] font-bold text-[18px] mb-0.5">2</div>
            <div className="text-gray-400 text-[11px]">Transactions</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 pt-1 [&::-webkit-scrollbar]:hidden -mx-4 px-4">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full whitespace-nowrap text-[12px] font-bold transition-all ${
                  isActive 
                    ? 'bg-[#2563eb] text-white shadow-[0_4px_10px_rgba(37,99,235,0.25)]' 
                    : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Icon size={14} className={isActive ? "text-white" : "text-gray-400"} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Transaction List */}
        <div className="mt-2">
          {filteredTransactions.length > 0 ? (
            <div className="space-y-2.5">
              {filteredTransactions.map(tx => (
                <div 
                  key={tx.id} 
                  onClick={() => {
                    const params = new URLSearchParams({
                      id: tx.id.toString(),
                      title: tx.title,
                      date: tx.date,
                      amount: tx.amount,
                      status: tx.status,
                      type: tx.type
                    });
                    router.push(`/dashboard/transactions/receipt?${params.toString()}`);
                  }}
                  className="bg-white rounded-[14px] p-3 border border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] flex items-center justify-between cursor-pointer hover:bg-gray-50 active:scale-[0.99] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center ${tx.iconBg} ${tx.iconColor}`}>
                      <tx.icon size={18} />
                    </div>
                    <div>
                      <div className="text-[#0f172a] font-bold text-[13px] mb-0.5">{tx.title}</div>
                      <div className="text-gray-400 text-[10px]">{tx.date}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className={`font-bold text-[13px] ${tx.amount.startsWith('+') ? 'text-[#10b981]' : 'text-red-500'}`}>
                      {tx.amount}
                    </div>
                    <div className="bg-[#dcfce7] text-[#16a34a] px-2 py-0.5 rounded text-[8px] font-bold tracking-widest">
                      {tx.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[16px] border-2 border-dashed border-gray-200 p-8 flex flex-col items-center justify-center text-center mt-4">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 mb-3">
                <Inbox size={24} />
              </div>
              <h3 className="text-[#1e3a8a] font-bold text-[14px] mb-1">No Transactions Yet</h3>
              <p className="text-gray-400 text-[11px]">Your transaction history will appear here</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
