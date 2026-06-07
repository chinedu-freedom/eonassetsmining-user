"use client";

import { useState } from "react";
import { 
  User, 
  Globe, 
  MessageCircle, 
  ChevronDown, 
  ChevronUp,
  Eye, 
  EyeOff,
  Download, 
  Upload, 
  BarChart3,
  Wallet,
  CreditCard,
  BarChart2,
  Users,
  Info,
  Clock,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

export default function AccountPage() {
  const [currency, setCurrency] = useState("USD");
  const [showBalance, setShowBalance] = useState(true);

  const toggleCurrency = () => {
    setCurrency(prev => prev === "USD" ? "NGN" : "USD");
  };

  const balances = {
    USD: {
      total: "$5.10",
      deposit: "$0.00",
      withdraw: "$0.00",
      income: "$5.10"
    },
    NGN: {
      total: "₦6,938.78",
      deposit: "₦0.00",
      withdraw: "₦0.00",
      income: "₦6,938.78"
    }
  };

  const currentBalance = balances[currency];

  const menuItems = [
    { icon: Info, label: "About Us", href: "/dashboard/about", color: "text-[#3b82f6]", bg: "bg-[#eff6ff]" },
    { icon: Users, label: "Invite", href: "/dashboard/invite", color: "text-[#3b82f6]", bg: "bg-[#eff6ff]" },
    { icon: Clock, label: "Transactions", href: "/dashboard/transactions", color: "text-[#3b82f6]", bg: "bg-[#eff6ff]" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings", color: "text-[#3b82f6]", bg: "bg-[#eff6ff]" },
    { icon: Download, label: "Download App", href: "#", color: "text-[#3b82f6]", bg: "bg-[#eff6ff]" },
    { icon: HelpCircle, label: "Help Center", href: "/dashboard/help", color: "text-[#3b82f6]", bg: "bg-[#eff6ff]" },
    { icon: LogOut, label: "Logout", href: "#", color: "text-[#ef4444]", bg: "bg-[#fee2e2]" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] overflow-y-auto  [&::-webkit-scrollbar]:hidden">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 flex justify-between items-center z-10 sticky top-0 shadow-sm border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-[#3b82f6] rounded-full flex items-center justify-center text-white shadow-sm">
            <User size={20} fill="currentColor" className="opacity-80" />
          </div>
          <div>
            <h1 className="text-[#1e3a8a] text-[15px] font-bold leading-tight">Spark</h1>
            <p className="text-gray-400 text-[10px] mt-0.5">chinedufreedom10@gmail.com</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button className="flex items-center gap-1 bg-gray-50 px-2 py-1.5 rounded-lg text-[10px] font-bold text-gray-500 hover:bg-gray-100 transition-colors border border-gray-100">
            <Globe size={12} className="text-[#3b82f6]" /> EN
          </button>
          <button className="w-7 h-7 bg-gray-50 rounded-lg flex items-center justify-center text-[#3b82f6] hover:bg-gray-100 transition-colors border border-gray-100">
            <MessageCircle size={12} fill="currentColor" className="opacity-80" />
          </button>
        </div>
      </div>

      <div className="px-4 pt-4 pb-4 space-y-4 max-w-[480px] mx-auto w-full">
        
        {/* Total Balance Card */}
        <div className="bg-[#2563eb] rounded-[24px] p-1.5 shadow-[0_4px_14px_rgba(37,99,235,0.3)]">
          <div className="bg-[#3b82f6] rounded-[20px] p-[16px] text-white">
            {/* Top section */}
            <div className="flex justify-between items-start mb-1">
              <span className="text-[10px] text-white/90">Total Balance</span>
              <button 
                onClick={toggleCurrency}
                className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded text-[9px] font-bold hover:bg-white/30 transition-colors"
              >
                {currency} {currency === "USD" ? <ChevronDown size={10} /> : <ChevronUp size={10} />}
              </button>
            </div>

            {/* Main Balance */}
            <div className="flex items-center gap-2 mb-5">
              <span className="text-[24px] font-bold tracking-tight">
                {showBalance ? currentBalance.total : "****"}
              </span>
              <button 
                onClick={() => setShowBalance(!showBalance)}
                className="text-white/80 hover:text-white transition-colors p-1"
              >
                {showBalance ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-2.5">
              <button className="flex-1 bg-white text-[#1e3a8a] flex items-center justify-center gap-1.5 py-2 rounded-[10px] text-[11px] font-bold hover:bg-gray-50 transition-colors shadow-sm">
                <Wallet size={12} /> Deposit
              </button>
              <button className="flex-1 bg-white/20 text-white flex items-center justify-center gap-1.5 py-2 rounded-[10px] text-[11px] font-bold hover:bg-white/30 transition-colors border border-white/10">
                <CreditCard size={12} /> Withdraw
              </button>
            </div>
          </div>
        </div>

        {/* Account Overview */}
        <div className="bg-white rounded-[16px] p-[16px] border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-1.5 mb-3.5">
            <BarChart3 size={14} className="text-[#3b82f6]" />
            <h2 className="text-[#334155] font-bold text-[13px]">Account Overview</h2>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Total Deposit */}
            <div className="bg-[#f8f9fa] rounded-[12px] p-3 flex flex-col gap-2 border border-gray-50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#dcfce7] rounded-[8px] flex items-center justify-center text-[#16a34a]">
                  <Wallet size={12} />
                </div>
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Total Deposit</span>
              </div>
              <div className="text-[13px] font-bold text-[#0f172a] ml-1">{currentBalance.deposit}</div>
            </div>

            {/* Total Withdraw */}
            <div className="bg-[#f8f9fa] rounded-[12px] p-3 flex flex-col gap-2 border border-gray-50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#fee2e2] rounded-[8px] flex items-center justify-center text-[#ef4444]">
                  <CreditCard size={12} />
                </div>
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Total Withdraw</span>
              </div>
              <div className="text-[13px] font-bold text-[#0f172a] ml-1">{currentBalance.withdraw}</div>
            </div>

            {/* Total Income */}
            <div className="bg-[#f8f9fa] rounded-[12px] p-3 flex flex-col gap-2 border border-gray-50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#dbeafe] rounded-[8px] flex items-center justify-center text-[#3b82f6]">
                  <BarChart2 size={12} />
                </div>
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Total Income</span>
              </div>
              <div className="text-[13px] font-bold text-[#0f172a] ml-1">{currentBalance.income}</div>
            </div>

            {/* Team Members */}
            <div className="bg-[#f8f9fa] rounded-[12px] p-3 flex flex-col gap-2 border border-gray-50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#fef08a] rounded-[8px] flex items-center justify-center text-[#ca8a04]">
                  <Users size={12} />
                </div>
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Team Members</span>
              </div>
              <div className="text-[13px] font-bold text-[#0f172a] ml-1">0</div>
            </div>
          </div>
        </div>

        {/* Menu List */}
        <div className="bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
          {menuItems.map((item, index) => (
            <Link 
              key={index} 
              href={item.href}
              className={`flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors ${
                index !== menuItems.length - 1 ? 'border-b border-gray-50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-[10px] flex items-center justify-center ${item.bg} ${item.color}`}>
                  <item.icon size={14} />
                </div>
                <span className={`text-[13px] font-medium ${item.label === 'Logout' ? 'text-[#ef4444]' : 'text-[#334155]'}`}>
                  {item.label}
                </span>
              </div>
              <ChevronRight size={14} className="text-gray-300" />
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
