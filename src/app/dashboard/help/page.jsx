"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  HelpCircle, 
  Search, 
  MessageCircle, 
  Send, 
  Phone, 
  Users, 
  Zap,
  Wallet,
  CreditCard,
  Clock,
  FileText,
  Download,
  Upload,
  ShieldCheck,
  ChevronDown
} from "lucide-react";

export default function HelpCenterPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      id: 1,
      title: "How do I make a deposit?",
      desc: "Learn about deposit methods...",
      icon: Download,
      iconBg: "bg-[#d1fae5]",
      iconColor: "text-[#059669]"
    },
    {
      id: 2,
      title: "How long do withdrawals take?",
      desc: "Withdrawal processing times...",
      icon: Upload,
      iconBg: "bg-[#fee2e2]",
      iconColor: "text-[#ef4444]"
    },
    {
      id: 3,
      title: "Is my account secure?",
      desc: "Security measures we use...",
      icon: ShieldCheck,
      iconBg: "bg-[#dbeafe]",
      iconColor: "text-[#2563eb]"
    },
    {
      id: 4,
      title: "How does the referral program work?",
      desc: "Earn commissions by inviting...",
      icon: Users,
      iconBg: "bg-[#f3e8ff]",
      iconColor: "text-[#9333ea]"
    }
  ];

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
        <h1 className="text-[#1e3a8a] text-[15px] font-bold">Help Center</h1>
      </div>

      <div className="px-4 py-6 max-w-[480px] mx-auto w-full space-y-6">
        
        {/* Top Hero */}
        <div className="flex flex-col items-center text-center">
          <div className="w-[60px] h-[60px] bg-[#2563eb] rounded-[18px] flex items-center justify-center mb-4 shadow-[0_4px_12px_rgba(37,99,235,0.3)]">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-[18px]">
              ?
            </div>
          </div>
          <h2 className="text-[#1e3a8a] text-[20px] font-bold mb-1.5">How can we help?</h2>
          <p className="text-[#64748b] text-[13px] leading-relaxed max-w-[260px]">
            Find answers to common questions or reach out to our support team
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for help..."
            className="w-full bg-white border border-gray-200 rounded-[14px] pl-10 pr-4 py-3.5 text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
          />
        </div>

        {/* Contact Support */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle size={14} className="text-[#3b82f6] fill-[#3b82f6]/20" />
            <h3 className="text-[#1e3a8a] text-[13px] font-bold">Contact Support</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] p-4 flex flex-col items-center text-center hover:bg-gray-50 transition-colors">
              <div className="w-[42px] h-[42px] bg-[#eff6ff] rounded-full flex items-center justify-center text-[#2563eb] mb-2.5">
                <Send size={20} className="fill-[#2563eb] -ml-0.5" />
              </div>
              <span className="text-[#0f172a] text-[13px] font-bold mb-0.5">Telegram</span>
              <span className="text-gray-500 text-[11px]">Fast response</span>
            </button>
            <button className="bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] p-4 flex flex-col items-center text-center hover:bg-gray-50 transition-colors">
              <div className="w-[42px] h-[42px] bg-[#dcfce7] rounded-full flex items-center justify-center text-[#16a34a] mb-2.5">
                <Phone size={20} className="fill-[#16a34a]" />
              </div>
              <span className="text-[#0f172a] text-[13px] font-bold mb-0.5">WhatsApp</span>
              <span className="text-gray-500 text-[11px]">24/7 support</span>
            </button>
          </div>
        </div>

        {/* Join Our Community */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Users size={14} className="text-[#3b82f6] fill-[#3b82f6]/20" />
            <h3 className="text-[#1e3a8a] text-[13px] font-bold">Join Our Community</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] p-4 flex flex-col items-center text-center hover:bg-gray-50 transition-colors">
              <div className="w-[42px] h-[42px] bg-[#eff6ff] rounded-[14px] flex items-center justify-center text-[#2563eb] mb-2.5">
                <Send size={20} className="fill-[#2563eb] -ml-0.5" />
              </div>
              <span className="text-[#0f172a] text-[13px] font-bold mb-0.5">Channel</span>
              <span className="text-gray-500 text-[11px]">News & Updates</span>
            </button>
            <button className="bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] p-4 flex flex-col items-center text-center hover:bg-gray-50 transition-colors">
              <div className="w-[42px] h-[42px] bg-[#eff6ff] rounded-[14px] flex items-center justify-center text-[#2563eb] mb-2.5">
                <Users size={20} className="fill-[#2563eb]" />
              </div>
              <span className="text-[#0f172a] text-[13px] font-bold mb-0.5">Group Chat</span>
              <span className="text-gray-500 text-[11px]">Community</span>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Zap size={14} className="text-[#3b82f6] fill-[#3b82f6]" />
            <h3 className="text-[#1e3a8a] text-[13px] font-bold">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: Wallet, label: "Deposit" },
              { icon: CreditCard, label: "Withdraw" },
              { icon: Wallet, label: "Wallet" },
              { icon: Clock, label: "History" }
            ].map((action, idx) => (
              <button key={idx} className="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] p-2.5 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                <div className="text-[#3b82f6]">
                  <action.icon size={18} className="fill-[#3b82f6]/20" />
                </div>
                <span className="text-gray-500 text-[10px] font-medium">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FileText size={14} className="text-[#3b82f6] fill-[#3b82f6]/20" />
            <h3 className="text-[#1e3a8a] text-[13px] font-bold">Frequently Asked Questions</h3>
          </div>
          <div className="space-y-2.5">
            {faqs.map(faq => (
              <button key={faq.id} className="w-full bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] p-3 flex items-center justify-between hover:bg-gray-50 transition-colors text-left">
                <div className="flex items-center gap-3.5">
                  <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 ${faq.iconBg} ${faq.iconColor}`}>
                    <faq.icon size={18} />
                  </div>
                  <div>
                    <h4 className="text-[#0f172a] text-[13px] font-bold mb-0.5">{faq.title}</h4>
                    <p className="text-gray-400 text-[11px]">{faq.desc}</p>
                  </div>
                </div>
                <ChevronDown size={16} className="text-gray-300 shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Support Banner */}
        <div className="bg-[#2563eb] rounded-[20px] p-6 text-center text-white shadow-[0_8px_20px_rgba(37,99,235,0.25)] relative overflow-hidden mt-8">
          {/* Decorative subtle circles */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full text-[11px] font-bold mb-4 backdrop-blur-sm border border-white/10">
              <div className="w-1.5 h-1.5 bg-[#4ade80] rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)]"></div>
              Online Now
            </div>
            
            <h3 className="text-[18px] font-bold mb-2">24/7 Customer Support</h3>
            <p className="text-white/80 text-[13px] leading-relaxed max-w-[280px]">
              Our dedicated support team is always ready to help you with any questions or concerns.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
