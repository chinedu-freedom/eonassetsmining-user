"use client";

import { useState } from "react";
import { Globe, MessageCircle, Eye, EyeOff, Wallet, CreditCard, Volume2, HelpCircle, CheckSquare, Users, Star } from "lucide-react";
import Image from "next/image";

export default function DashboardPage() {
  const [showBalance, setShowBalance] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] overflow-y-auto pb-24 [&::-webkit-scrollbar]:hidden">
      
      {/* Header */}
      <div className="bg-white px-5 pt-6 pb-4 flex justify-between items-center rounded-b-3xl shadow-sm z-10 relative">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#1e293b] rounded-full flex items-center justify-center p-1">
            {/* Logo placeholder, user has it or I can mock */}
            <div className="text-white text-[10px] font-bold">Eon</div>
          </div>
          <span className="text-[#1e293b] font-bold text-lg">EonAssets</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 bg-gray-100 px-3 py-2 rounded-full text-sm font-medium text-gray-700">
            <Globe size={16} className="text-[#3C3CF6]" />
            EN
          </button>
          <button className="bg-gray-100 p-2 rounded-full text-gray-700">
            <MessageCircle size={18} className="text-[#3C3CF6]" />
          </button>
        </div>
      </div>

      <div className="px-5 pt-5 pb-5 space-y-4">
        
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-[#1a233a] to-[#121829] rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <p className="text-gray-400 text-sm font-medium">Total Balance</p>
            <button className="bg-white/10 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 hover:bg-white/20 transition-colors">
              USD <span className="text-[10px]">▼</span>
            </button>
          </div>
          
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-3xl font-bold tracking-wider">
              {showBalance ? "$0.00" : "****"}
            </h2>
            <button 
              onClick={() => setShowBalance(!showBalance)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {showBalance ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 bg-white text-[#1a233a] py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors">
              <Wallet size={18} />
              Deposit
            </button>
            <button className="flex-1 bg-white/10 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-colors border border-white/10">
              <CreditCard size={18} />
              Withdraw
            </button>
          </div>
        </div>

        {/* Marquee Banner */}
        <div className="bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm border border-gray-100">
          <Volume2 className="text-[#3C3CF6] shrink-0" size={20} />
          <div className="overflow-hidden whitespace-nowrap w-full relative">
            <p className="text-sm text-gray-600 animate-[marquee_15s_linear_infinite] inline-block">
              Start mining today and grow your wealth with us. Welcome to EonAssets!
            </p>
          </div>
        </div>

        {/* Action Grid */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="grid grid-cols-4 gap-y-6">
            {/* Row 1 */}
            <div className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className="w-12 h-12 bg-[#eff2f9] rounded-2xl flex items-center justify-center group-hover:bg-[#e0e7ff] transition-colors">
                <Wallet className="text-[#3C3CF6]" size={24} />
              </div>
              <span className="text-xs text-gray-600 font-medium">My Assets</span>
            </div>

            <div className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className="w-12 h-12 bg-[#eff2f9] rounded-2xl flex items-center justify-center group-hover:bg-[#e0e7ff] transition-colors">
                <HelpCircle className="text-[#3C3CF6]" size={24} />
              </div>
              <span className="text-xs text-gray-600 font-medium">Info</span>
            </div>

            <div className="flex flex-col items-center gap-2 cursor-pointer group relative">
              <div className="absolute -top-2 right-1 bg-[#3C3CF6] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full z-10">
                NEW
              </div>
              <div className="w-12 h-12 bg-[#eff2f9] rounded-2xl flex items-center justify-center group-hover:bg-[#e0e7ff] transition-colors">
                <CheckSquare className="text-[#3C3CF6]" size={24} />
              </div>
              <span className="text-xs text-gray-600 font-medium">Task</span>
            </div>

            <div className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className="w-12 h-12 bg-[#eff2f9] rounded-2xl flex items-center justify-center group-hover:bg-[#e0e7ff] transition-colors">
                <Users className="text-[#3C3CF6]" size={24} />
              </div>
              <span className="text-xs text-gray-600 font-medium">My Team</span>
            </div>
            
            {/* Row 2 (Partial, to be continued) */}
             <div className="flex flex-col items-center gap-2 cursor-pointer group relative mt-2">
              <div className="absolute -top-2 right-1 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full z-10">
                HOT
              </div>
              <div className="w-12 h-12 bg-[#eff2f9] rounded-2xl flex items-center justify-center group-hover:bg-[#e0e7ff] transition-colors">
                <Star className="text-[#3C3CF6]" size={24} />
              </div>
              <span className="text-xs text-gray-600 font-medium">Daily</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
