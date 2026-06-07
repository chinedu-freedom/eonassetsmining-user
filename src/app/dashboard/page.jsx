"use client";

import { useState } from "react";
import { Globe, MessageCircle, Eye, EyeOff, Wallet, CreditCard, Volume2, HelpCircle, CheckSquare, Users, Loader, Download, Gift, Calendar, Activity, ArrowDown, DollarSign, BadgeCheck, BarChart2, ChevronRight } from "lucide-react";
import Image from "next/image";

const activities = [
  { type: "deposit", name: "", text: "deposited", amount: "+$1,910", iconBg: "bg-green-100", iconCol: "text-green-600", Icon: ArrowDown },
  { type: "profit", name: "henry***", text: "earned profit", amount: "+$138", iconBg: "bg-emerald-100", iconCol: "text-emerald-600", Icon: DollarSign },
  { type: "bonus", name: "nancy***", text: "claimed bonus", amount: "+$87", iconBg: "bg-orange-100", iconCol: "text-orange-500", Icon: Gift },
  { type: "deposit", name: "alex***", text: "deposited", amount: "+$500", iconBg: "bg-green-100", iconCol: "text-green-600", Icon: ArrowDown },
  { type: "profit", name: "mike***", text: "earned profit", amount: "+$42", iconBg: "bg-emerald-100", iconCol: "text-emerald-600", Icon: DollarSign },
];
const doubledActivities = [...activities, ...activities];

export default function DashboardPage() {
  const [showBalance, setShowBalance] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] overflow-y-auto  [&::-webkit-scrollbar]:hidden">
      
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 flex justify-between items-center rounded-b-[20px] shadow-sm z-10 relative">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] rounded-full flex items-center justify-center shadow-sm">
            <div className="text-white text-[9px] font-bold tracking-wider">Eon</div>
          </div>
          <span className="text-[#1e3a8a] font-bold text-[15px]">EonAssets</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 bg-white border border-gray-200 px-2.5 py-1 rounded-full text-[11px] font-bold text-[#1e3a8a] shadow-sm hover:bg-gray-50 transition-colors">
            <Globe size={13} className="text-[#3b82f6]" />
            EN
          </button>
          <button className="bg-[#eff6ff] p-1.5 rounded-full text-[#3b82f6] hover:bg-[#dbeafe] transition-colors">
            <MessageCircle size={16} />
          </button>
        </div>
      </div>

      <div className="px-4 pt-4 pb-4 space-y-3">
        
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] rounded-2xl p-[18px] text-white shadow-lg relative overflow-hidden border border-white/10">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
          
          <div className="flex justify-between items-start mb-2 relative z-10">
            <p className="text-white/80 text-[13px] font-medium">Total Balance</p>
            <button className="bg-white/10 px-2 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/10">
              USD <span className="text-[7px] opacity-70">▼</span>
            </button>
          </div>
          
          <div className="flex items-center gap-2 mb-5 relative z-10">
            <h2 className="text-[28px] font-bold tracking-wider leading-none">
              {showBalance ? "$0.00" : "****"}
            </h2>
            <button 
              onClick={() => setShowBalance(!showBalance)}
              className="text-white/60 hover:text-white transition-colors ml-1"
            >
              {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          <div className="flex gap-2.5 relative z-10">
            <button className="flex-1 bg-white text-[#1e3a8a] py-2 rounded-lg text-[13px] font-semibold flex items-center justify-center gap-1.5 hover:bg-gray-50 transition-colors shadow-md">
              <Wallet size={16} />
              Deposit
            </button>
            <button className="flex-1 bg-white/10 text-white py-2 rounded-lg text-[13px] font-semibold flex items-center justify-center gap-1.5 hover:bg-white/20 transition-colors border border-white/15 backdrop-blur-sm">
              <CreditCard size={16} />
              Withdraw
            </button>
          </div>
        </div>

        {/* Marquee Banner */}
        <div className="bg-white rounded-lg py-2 px-3 flex items-center gap-2 shadow-sm border border-gray-100">
          <Volume2 className="text-[#3b82f6] shrink-0" size={16} />
          <div className="overflow-hidden whitespace-nowrap w-full relative">
            <p className="text-[12px] text-gray-600 animate-[marquee_15s_linear_infinite] inline-block">
              Start mining today and grow your wealth with us. Welcome to EonAssets!
            </p>
          </div>
        </div>

        {/* Action Grid */}
        <div className="bg-white rounded-[18px] p-4 shadow-sm border border-gray-100">
          <div className="grid grid-cols-4 gap-y-5 gap-x-2">
            <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
              <div className="w-10 h-10 bg-[#eff6ff] rounded-xl flex items-center justify-center group-hover:bg-[#dbeafe] transition-colors shadow-sm">
                <Wallet className="text-[#3b82f6]" size={20} />
              </div>
              <span className="text-[10px] text-[#1e293b] font-medium">My Assets</span>
            </div>

            <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
              <div className="w-10 h-10 bg-[#eff6ff] rounded-xl flex items-center justify-center group-hover:bg-[#dbeafe] transition-colors shadow-sm">
                <HelpCircle className="text-[#3b82f6]" size={20} />
              </div>
              <span className="text-[10px] text-[#1e293b] font-medium">Info</span>
            </div>

            <div className="flex flex-col items-center gap-1.5 cursor-pointer group relative">
              <div className="absolute -top-1.5 right-1 bg-[#3b82f6] text-white text-[7px] font-bold px-1 py-[1px] rounded z-10 shadow-sm">
                NEW
              </div>
              <div className="w-10 h-10 bg-[#eff6ff] rounded-xl flex items-center justify-center group-hover:bg-[#dbeafe] transition-colors shadow-sm">
                <CheckSquare className="text-[#3b82f6]" size={20} />
              </div>
              <span className="text-[10px] text-[#1e293b] font-medium">Task</span>
            </div>

            <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
              <div className="w-10 h-10 bg-[#eff6ff] rounded-xl flex items-center justify-center group-hover:bg-[#dbeafe] transition-colors shadow-sm">
                <Users className="text-[#3b82f6]" size={20} />
              </div>
              <span className="text-[10px] text-[#1e293b] font-medium">My Team</span>
            </div>
            
            <div className="flex flex-col items-center gap-1.5 cursor-pointer group relative mt-1">
              <div className="absolute -top-1.5 right-0.5 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[7px] font-bold px-1 py-[1px] rounded z-10 shadow-sm animate-pulse">
                HOT
              </div>
              <div className="w-10 h-10 bg-[#eff6ff] rounded-xl flex items-center justify-center group-hover:bg-[#dbeafe] transition-colors shadow-sm">
                <Loader className="text-[#3b82f6]" size={20} />
              </div>
              <span className="text-[10px] text-[#1e293b] font-medium">Spin Wheel</span>
            </div>

            <div className="flex flex-col items-center gap-1.5 cursor-pointer group mt-1">
              <div className="w-10 h-10 bg-[#eff6ff] rounded-xl flex items-center justify-center group-hover:bg-[#dbeafe] transition-colors shadow-sm">
                <Download className="text-[#3b82f6]" size={20} />
              </div>
              <span className="text-[10px] text-[#1e293b] font-medium text-center leading-tight">Download App</span>
            </div>

            <div className="flex flex-col items-center gap-1.5 cursor-pointer group mt-1">
              <div className="w-10 h-10 bg-[#eff6ff] rounded-xl flex items-center justify-center group-hover:bg-[#dbeafe] transition-colors shadow-sm">
                <Gift className="text-[#3b82f6]" size={20} />
              </div>
              <span className="text-[10px] text-[#1e293b] font-medium">Treasure</span>
            </div>

            <div className="flex flex-col items-center gap-1.5 cursor-pointer group mt-1">
              <div className="w-10 h-10 bg-[#eff6ff] rounded-xl flex items-center justify-center group-hover:bg-[#dbeafe] transition-colors shadow-sm">
                <HelpCircle className="text-[#3b82f6]" size={20} />
              </div>
              <span className="text-[10px] text-[#1e293b] font-medium">Help</span>
            </div>
          </div>
        </div>

        {/* Daily Check-in */}
        <div className="bg-gradient-to-r from-[#3b82f6] to-[#2563eb] rounded-[16px] py-3 px-4 flex items-center justify-between text-white shadow-sm shadow-blue-500/20 cursor-pointer hover:shadow-md transition-all">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Calendar className="text-white" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-[14px]">Daily Check-in</h3>
              <p className="text-white/90 text-[11px] mt-0.5">Claim your daily rewards!</p>
            </div>
          </div>
          <div className="bg-white/20 px-3 py-1.5 rounded-full text-[12px] font-semibold flex items-center gap-1 hover:bg-white/30 transition-colors backdrop-blur-sm">
            Claim <ChevronRight size={14} />
          </div>
        </div>

        {/* Live Activity */}
        <div className="bg-white rounded-[18px] p-3.5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5">
              <Activity className="text-[#3b82f6]" size={16} />
              <h3 className="font-semibold text-[#1e3a8a] text-[14px]">Live Activity</h3>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-green-500 font-medium">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              Live
            </div>
          </div>

          <div className="h-[180px] overflow-hidden relative -mx-1">
            <div className="space-y-3 animate-[scrollVertical_15s_linear_infinite]">
              {doubledActivities.map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between bg-gray-50/50 p-1.5 rounded-lg">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 ${activity.iconBg} rounded-lg flex items-center justify-center`}>
                      <activity.Icon className={activity.iconCol} size={16} />
                    </div>
                    <div>
                      {activity.name && <p className="text-[13px] font-semibold text-[#1e293b] leading-tight mb-0.5">{activity.name}</p>}
                      <p className={`text-[${activity.name ? '11px' : '12px'}] text-gray-500 leading-tight ${activity.name ? '' : 'mb-0.5'}`}>{activity.text}</p>
                    </div>
                  </div>
                  <div className={`font-semibold ${activity.iconCol} text-[13px]`}>{activity.amount}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Partners & Exchanges */}
        <div className="mt-5 mb-2">
          <div className="flex items-center gap-1.5 mb-3 px-1">
            <BadgeCheck className="text-[#3b82f6]" size={16} />
            <h3 className="font-semibold text-[#1e3a8a] text-[14px]">Our Partners & Exchanges</h3>
          </div>
          
          <div className="bg-white rounded-[18px] p-3.5 shadow-sm border border-gray-100">
            <div className="grid grid-cols-4 gap-y-5 gap-x-2">
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-[14px] flex items-center justify-center shadow-sm">
                  <div className="w-7 h-7 bg-[#F3BA2F] rounded-full flex items-center justify-center text-white font-bold text-sm">B</div>
                </div>
                <span className="text-[10px] text-gray-500 font-medium">Binance</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-[14px] flex items-center justify-center shadow-sm">
                  <div className="w-7 h-7 bg-black rounded flex items-center justify-center text-[#F3BA2F] font-bold text-[10px]">BYBIT</div>
                </div>
                <span className="text-[10px] text-gray-500 font-medium">Bybit</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-[14px] flex items-center justify-center shadow-sm">
                  <div className="w-7 h-7 bg-[#0052FF] rounded-full flex items-center justify-center text-white font-bold text-sm">C</div>
                </div>
                <span className="text-[10px] text-gray-500 font-medium">Coinbase</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-[14px] flex items-center justify-center shadow-sm">
                  <div className="w-7 h-7 bg-[#24A17C] rounded flex items-center justify-center text-white font-bold text-sm">K</div>
                </div>
                <span className="text-[10px] text-gray-500 font-medium">KuCoin</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 mt-1">
                <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-[14px] flex items-center justify-center shadow-sm">
                  <div className="w-7 h-7 bg-[#E82127] rounded flex items-center justify-center text-white font-bold text-sm">T</div>
                </div>
                <span className="text-[10px] text-gray-500 font-medium">Tesla</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 mt-1">
                <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-[14px] flex items-center justify-center shadow-sm">
                  <div className="w-7 h-7 bg-[#1754FF] text-white rounded flex items-center justify-center font-bold text-[10px]">G</div>
                </div>
                <span className="text-[10px] text-gray-500 font-medium">Gate.io</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 mt-1">
                <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-[14px] flex items-center justify-center shadow-sm">
                  <div className="w-7 h-7 bg-[#2775CA] rounded-full flex items-center justify-center text-white font-bold text-sm">U</div>
                </div>
                <span className="text-[10px] text-gray-500 font-medium">USDC</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 mt-1">
                <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-[14px] flex items-center justify-center shadow-sm">
                  <div className="w-7 h-7 bg-[#26A17B] rounded-full flex items-center justify-center text-white font-bold text-sm">₮</div>
                </div>
                <span className="text-[10px] text-gray-500 font-medium">Tether</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Market */}
        <div className="bg-white rounded-[18px] p-3.5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-1.5">
              <BarChart2 className="text-[#3b82f6]" size={16} />
              <h3 className="font-semibold text-[#1e3a8a] text-[14px]">Live Market</h3>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-green-500 font-medium">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              Live
            </div>
          </div>

          <div className="space-y-3">
            {/* BTC */}
            <div className="flex items-center justify-between py-1 border-b border-gray-50 pb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#F7931A] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">₿</div>
                <div>
                  <p className="text-[13px] font-semibold text-[#1e293b] leading-tight mb-0.5">BTC</p>
                  <p className="text-[11px] text-gray-400 leading-tight">Bitcoin</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-[#1e293b] text-[13px] mb-0.5">$0.0000</div>
                <div className="bg-green-100 text-green-600 text-[9px] font-bold px-1 py-0.5 rounded ml-auto w-fit">+0.00%</div>
              </div>
            </div>

            {/* ETH */}
            <div className="flex items-center justify-between py-1 border-b border-gray-50 pb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#627EEA] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">⧫</div>
                <div>
                  <p className="text-[13px] font-semibold text-[#1e293b] leading-tight mb-0.5">ETH</p>
                  <p className="text-[11px] text-gray-400 leading-tight">Ethereum</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-[#1e293b] text-[13px] mb-0.5">$0.0000</div>
                <div className="bg-green-100 text-green-600 text-[9px] font-bold px-1 py-0.5 rounded ml-auto w-fit">+0.00%</div>
              </div>
            </div>

            {/* BNB */}
            <div className="flex items-center justify-between py-1 border-b border-gray-50 pb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#F3BA2F] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">B</div>
                <div>
                  <p className="text-[13px] font-semibold text-[#1e293b] leading-tight mb-0.5">BNB</p>
                  <p className="text-[11px] text-gray-400 leading-tight">BNB</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-[#1e293b] text-[13px] mb-0.5">$0.0000</div>
                <div className="bg-green-100 text-green-600 text-[9px] font-bold px-1 py-0.5 rounded ml-auto w-fit">+0.00%</div>
              </div>
            </div>

            {/* SOL */}
            <div className="flex items-center justify-between py-1 border-b border-gray-50 pb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-gradient-to-tr from-[#9945FF] to-[#14F195] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">S</div>
                <div>
                  <p className="text-[13px] font-semibold text-[#1e293b] leading-tight mb-0.5">SOL</p>
                  <p className="text-[11px] text-gray-400 leading-tight">Solana</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-[#1e293b] text-[13px] mb-0.5">$0.0000</div>
                <div className="bg-green-100 text-green-600 text-[9px] font-bold px-1 py-0.5 rounded ml-auto w-fit">+0.00%</div>
              </div>
            </div>

            {/* XRP */}
            <div className="flex items-center justify-between py-1 border-b border-gray-50 pb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-black font-bold text-sm shadow-sm">X</div>
                <div>
                  <p className="text-[13px] font-semibold text-[#1e293b] leading-tight mb-0.5">XRP</p>
                  <p className="text-[11px] text-gray-400 leading-tight">Ripple</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-[#1e293b] text-[13px] mb-0.5">$0.0000</div>
                <div className="bg-green-100 text-green-600 text-[9px] font-bold px-1 py-0.5 rounded ml-auto w-fit">+0.00%</div>
              </div>
            </div>

            {/* DOGE */}
            <div className="flex items-center justify-between py-1 border-b border-gray-50 pb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#C2A633] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">Ð</div>
                <div>
                  <p className="text-[13px] font-semibold text-[#1e293b] leading-tight mb-0.5">DOGE</p>
                  <p className="text-[11px] text-gray-400 leading-tight">Dogecoin</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-[#1e293b] text-[13px] mb-0.5">$0.0000</div>
                <div className="bg-green-100 text-green-600 text-[9px] font-bold px-1 py-0.5 rounded ml-auto w-fit">+0.00%</div>
              </div>
            </div>

            {/* ADA */}
            <div className="flex items-center justify-between py-1 border-b border-gray-50 pb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#0033AD] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">A</div>
                <div>
                  <p className="text-[13px] font-semibold text-[#1e293b] leading-tight mb-0.5">ADA</p>
                  <p className="text-[11px] text-gray-400 leading-tight">Cardano</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-[#1e293b] text-[13px] mb-0.5">$0.0000</div>
                <div className="bg-green-100 text-green-600 text-[9px] font-bold px-1 py-0.5 rounded ml-auto w-fit">+0.00%</div>
              </div>
            </div>

            {/* AVAX */}
            <div className="flex items-center justify-between py-1 pb-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#E84142] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">▲</div>
                <div>
                  <p className="text-[13px] font-semibold text-[#1e293b] leading-tight mb-0.5">AVAX</p>
                  <p className="text-[11px] text-gray-400 leading-tight">Avalanche</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-[#1e293b] text-[13px] mb-0.5">$0.0000</div>
                <div className="bg-green-100 text-green-600 text-[9px] font-bold px-1 py-0.5 rounded ml-auto w-fit">+0.00%</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
