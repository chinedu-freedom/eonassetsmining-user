"use client";

import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Bitcoin, 
  DollarSign, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  Headset, 
  Rocket,
  Image as ImageIcon,
  Zap,
  Activity,
  X
} from "lucide-react";

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] overflow-y-auto [&::-webkit-scrollbar]:hidden">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center gap-2.5 sticky top-0 z-20 shadow-sm border-b border-gray-100">
        <button 
          onClick={() => router.back()}
          className="w-7 h-7 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors text-gray-600"
        >
          <ArrowLeft size={16} />
        </button>
        <h1 className="text-[#1e3a8a] text-[14px] font-bold">About Us</h1>
      </div>

      <div className="px-4 py-3 max-w-[480px] mx-auto w-full space-y-4">
        
        {/* Hero Section */}
        <div className="relative bg-[#3b82f6] rounded-[20px] pt-6 pb-12 px-4 text-center text-white overflow-hidden shadow-sm">
          {/* Floating icons background effect */}
          <div className="absolute top-4 left-4 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Bitcoin size={12} />
          </div>
          <div className="absolute top-1/2 left-3 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <DollarSign size={10} />
          </div>
          <div className="absolute top-6 right-6 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Layers size={10} />
          </div>
          <div className="absolute bottom-8 right-4 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Zap size={10} />
          </div>

          <div className="inline-flex items-center gap-1 bg-white/20 px-2.5 py-1 rounded-full text-[9px] font-bold backdrop-blur-sm mb-3">
            <ShieldCheck size={10} /> Trusted Platform
          </div>
          
          <h2 className="text-[20px] font-black mb-1.5 leading-tight">Welcome to EonAssets</h2>
          <p className="text-[10px] text-white/90 leading-relaxed max-w-[250px] mx-auto mb-1">
            Your trusted partner for smart investments. We blend deep liquidity, smart automation, and an easy-to-use interface so anyone can grow consistently.
          </p>
        </div>

        {/* Stats Section - Translating it up to overlap the hero */}
        <div className="grid grid-cols-3 gap-1.5 -mt-8 px-2 relative z-10">
          <div className="bg-white rounded-[12px] py-2.5 px-1 text-center shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] border border-gray-100">
            <div className="text-[#1e3a8a] text-[14px] font-bold mb-0.5">50K+</div>
            <div className="text-[8px] font-bold text-gray-400 tracking-wider">USERS</div>
          </div>
          <div className="bg-white rounded-[12px] py-2.5 px-1 text-center shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] border border-gray-100">
            <div className="text-[#1e3a8a] text-[14px] font-bold mb-0.5">$10M+</div>
            <div className="text-[8px] font-bold text-gray-400 tracking-wider">VOLUME</div>
          </div>
          <div className="bg-white rounded-[12px] py-2.5 px-1 text-center shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] border border-gray-100">
            <div className="text-[#1e3a8a] text-[14px] font-bold mb-0.5">99.9%</div>
            <div className="text-[8px] font-bold text-gray-400 tracking-wider">UPTIME</div>
          </div>
        </div>

        {/* Our Journey */}
        <div className="mt-4">
          <div className="flex items-center gap-1.5 mb-2.5 pl-1">
            <div className="w-5 h-5 bg-[#eff6ff] rounded-[6px] flex items-center justify-center text-[#3b82f6]">
              <ImageIcon size={10} />
            </div>
            <h3 className="text-[#1e3a8a] font-bold text-[13px]">Our Journey</h3>
          </div>
          {/* Main large placeholder */}
          <div className="w-full h-[200px] bg-white rounded-[16px] flex items-center justify-center border border-gray-200 shadow-sm overflow-hidden relative group cursor-pointer">
            <div className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center gap-2 group-hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400">
                <ImageIcon size={14} />
              </div>
              <span className="text-[10px] font-medium text-gray-500">Journey Image Area</span>
            </div>
          </div>
        </div>

        {/* 4 Grid Images */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[4/3] bg-white rounded-[12px] flex items-center justify-center border border-gray-200 shadow-sm relative group cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center gap-1.5 group-hover:bg-gray-100 transition-colors">
                <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400">
                  <ImageIcon size={12} />
                </div>
                <span className="text-[9px] font-medium text-gray-500">Promo Image {i}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Why Choose EonAssets */}
        <div className="mt-6">
          <h3 className="text-[#1e3a8a] font-bold text-[14px] text-center mb-3">Why Choose EonAssets?</h3>
          
          <div className="space-y-2">
            {/* Card 1 */}
            <div className="bg-white rounded-[12px] p-3 border border-[#3b82f6]/30 shadow-sm">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 bg-[#dcfce7] rounded-[8px] flex items-center justify-center text-[#16a34a] shrink-0">
                  <ShieldCheck size={14} />
                </div>
                <div>
                  <div className="text-[8px] font-bold text-gray-400 tracking-wider mb-0.5 uppercase">SECURITY</div>
                  <h4 className="text-[#0f172a] font-bold text-[12px] mb-1">Bank-Grade Protection</h4>
                  <p className="text-gray-500 text-[10px] leading-relaxed">
                    Protected with military-grade encryption, multi-signature wallets, and 24/7 monitoring.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-[12px] p-3 border border-gray-100 shadow-sm">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 bg-[#eff6ff] rounded-[8px] flex items-center justify-center text-[#3b82f6] shrink-0">
                  <Cpu size={14} />
                </div>
                <div>
                  <div className="text-[8px] font-bold text-gray-400 tracking-wider mb-0.5 uppercase">TECHNOLOGY</div>
                  <h4 className="text-[#0f172a] font-bold text-[12px] mb-1">Smart Automation</h4>
                  <p className="text-gray-500 text-[10px] leading-relaxed">
                    AI-powered bots monitor markets 24/7, rebalance strategies, and alert you to opportunities.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-[12px] p-3 border border-gray-100 shadow-sm">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 bg-[#f3e8ff] rounded-[8px] flex items-center justify-center text-[#9333ea] shrink-0">
                  <Headset size={14} />
                </div>
                <div>
                  <div className="text-[8px] font-bold text-gray-400 tracking-wider mb-0.5 uppercase">SUPPORT</div>
                  <h4 className="text-[#0f172a] font-bold text-[12px] mb-1">Global Support Team</h4>
                  <p className="text-gray-500 text-[10px] leading-relaxed">
                    Support agents available around the clock through in-app chat, Telegram, and email.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Meet Our Team */}
        <div className="mt-6 text-center">
          <h3 className="text-[#1e3a8a] font-bold text-[14px] mb-1">Meet Our Team</h3>
          <p className="text-gray-500 text-[11px] mb-4">The experts behind your success</p>

          <div className="flex justify-between items-center px-1">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#f97316] rounded-full flex items-center justify-center text-white mb-1.5 shadow-sm">
                <Bitcoin size={24} />
              </div>
              <div className="text-[#0f172a] font-bold text-[11px] mb-0.5">John Smith</div>
              <div className="text-gray-400 text-[9px]">CEO & Founder</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white mb-1.5 shadow-sm">
                <X size={24} strokeWidth={2.5} />
              </div>
              <div className="text-[#0f172a] font-bold text-[11px] mb-0.5">Sarah Johnson</div>
              <div className="text-gray-400 text-[9px]">CTO</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#eab308] rounded-full flex items-center justify-center text-black mb-1.5 shadow-sm">
                <div className="relative">
                  <div className="w-4 h-4 rotate-45 border-2 border-black box-border"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-black rounded-[1px]"></div>
                </div>
              </div>
              <div className="text-[#0f172a] font-bold text-[11px] mb-0.5">Mike Williams</div>
              <div className="text-gray-400 text-[9px]">Operations</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 mb-2 bg-[#2563eb] rounded-[16px] p-4 text-center text-white shadow-md relative overflow-hidden">
          {/* Decorative background shapes */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full blur-xl translate-y-1/2 -translate-x-1/4"></div>
          
          <div className="relative z-10">
            <h3 className="text-[14px] font-bold mb-1.5">Ready to Grow With EonAssets?</h3>
            <p className="text-white/90 text-[10px] leading-relaxed mb-4 max-w-[240px] mx-auto">
              Complete your profile, activate a plan, and start collecting daily rewards.
            </p>
            <button 
              onClick={() => router.push('/dashboard/mining')}
              className="bg-white text-[#2563eb] flex items-center justify-center gap-1.5 w-full py-2.5 rounded-[10px] text-[12px] font-bold hover:bg-gray-50 active:scale-[0.98] transition-all shadow-sm"
            >
              <Rocket size={14} /> Start Earning Now
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
