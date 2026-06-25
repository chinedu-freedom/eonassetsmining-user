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
  X,
  Euro,
  PoundSterling,
  JapaneseYen,
  Coins,
  Gem,
  Loader2
} from "lucide-react";

import { useFetchData } from "@/hooks/useApi";

export default function AboutPage() {
  const router = useRouter();

  const { data: slidersRes, isLoading: isLoadingSliders } = useFetchData("/sliders?display_location=about", ["about-sliders"]);
  
  const aboutImages = Array.isArray(slidersRes?.sliders) ? slidersRes.sliders : [];
  const sortedImages = [...aboutImages].sort((a, b) => a.display_order - b.display_order);
  
  const mainImage = sortedImages.length > 0 ? sortedImages[0] : null;
  const gridImages = sortedImages.slice(1, 5);

  const { data: teamRes, isLoading: isLoadingTeam } = useFetchData("/team-members", ["about-team-members"]);
  const teamMembers = Array.isArray(teamRes?.teamMembers) ? teamRes.teamMembers : [];

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] overflow-y-auto [&::-webkit-scrollbar]:hidden">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center gap-2.5 sticky top-0 z-20 shadow-sm border-b border-gray-100">
        <button 
          onClick={() => router.back()}
          className="w-7 h-7 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors text-gray-600 cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <h1 className="text-[#4c1d95] text-[14px] font-bold">About Us</h1>
      </div>

      <div className="px-4 py-3 max-w-[480px] mx-auto w-full space-y-4">
        
        {/* Hero Section */}
        <div className="relative bg-[#8b5cf6] rounded-[16px] pt-6 pb-12 px-4 text-center text-white overflow-hidden shadow-sm">
          <div className="inline-flex items-center gap-1 bg-white/20 px-2.5 py-1 rounded-full text-[9px] font-bold backdrop-blur-sm mb-3 relative z-10">
            <ShieldCheck size={10} /> Trusted Platform
          </div>
          
          <h2 className="text-[20px] font-black mb-1.5 leading-tight relative z-10">Welcome to Polychainapp</h2>
          <p className="text-[10px] text-white/90 leading-relaxed max-w-[250px] mx-auto mb-1 relative z-10">
            Your trusted partner for smart investments. We blend deep liquidity, smart automation, and an easy-to-use interface so anyone can grow consistently.
          </p>
        </div>

        {/* Stats Section - Translating it up to overlap the hero */}
        <div className="grid grid-cols-3 gap-1.5 -mt-8 px-2 relative z-10">
          <div className="bg-white rounded-[12px] py-2.5 px-1 text-center shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] border border-gray-100">
            <div className="text-[#4c1d95] text-[14px] font-bold mb-0.5">50K+</div>
            <div className="text-[8px] font-bold text-gray-400 tracking-wider">USERS</div>
          </div>
          <div className="bg-white rounded-[12px] py-2.5 px-1 text-center shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] border border-gray-100">
            <div className="text-[#4c1d95] text-[14px] font-bold mb-0.5">$10M+</div>
            <div className="text-[8px] font-bold text-gray-400 tracking-wider">VOLUME</div>
          </div>
          <div className="bg-white rounded-[12px] py-2.5 px-1 text-center shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] border border-gray-100">
            <div className="text-[#4c1d95] text-[14px] font-bold mb-0.5">99.9%</div>
            <div className="text-[8px] font-bold text-gray-400 tracking-wider">UPTIME</div>
          </div>
        </div>

        {/* Our Journey */}
        <div className="mt-4">
          <div className="flex items-center gap-1.5 mb-2.5 pl-1">
            <div className="w-5 h-5 bg-[#f5f3ff] rounded-[6px] flex items-center justify-center text-[#8b5cf6]">
              <ImageIcon size={10} />
            </div>
            <h3 className="text-[#4c1d95] font-bold text-[13px]">Our Journey</h3>
          </div>
          
          {isLoadingSliders ? (
            <div className="w-full h-[200px] bg-white rounded-[16px] flex flex-col items-center justify-center border border-gray-200 shadow-sm">
              <Loader2 className="w-6 h-6 animate-spin text-purple-500 mb-2" />
              <span className="text-[10px] text-gray-400">Loading our journey...</span>
            </div>
          ) : (
            <>
              {/* Main large placeholder */}
              <div className="w-full h-[200px] bg-white rounded-[16px] flex items-center justify-center border border-gray-200 shadow-sm overflow-hidden relative group cursor-pointer">
                {mainImage?.image ? (
                  <img src={mainImage.image} alt={mainImage.title || "Journey Image"} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center gap-2 group-hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400">
                      <ImageIcon size={14} />
                    </div>
                    <span className="text-[10px] font-medium text-gray-500">Journey Image Area</span>
                  </div>
                )}
              </div>

              {/* 4 Grid Images */}
              {gridImages.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {gridImages.map((img, idx) => (
                    <div key={img.id || idx} className="aspect-[4/3] bg-white rounded-[12px] flex items-center justify-center border border-gray-200 shadow-sm relative group cursor-pointer overflow-hidden">
                      {img.image ? (
                        <img src={img.image} alt={img.title || `Promo Image ${idx + 1}`} className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center gap-1.5 group-hover:bg-gray-100 transition-colors">
                          <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400">
                            <ImageIcon size={12} />
                          </div>
                          <span className="text-[9px] font-medium text-gray-500">Promo Image {idx + 1}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Why Choose Polychainapp */}
        <div className="mt-6">
          <h3 className="text-[#4c1d95] font-bold text-[14px] text-center mb-3">Why Choose Polychainapp?</h3>
          
          <div className="space-y-2">
            {/* Card 1 */}
            <div className="bg-white rounded-[12px] p-3 border border-[#8b5cf6]/30 shadow-sm">
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
                <div className="w-8 h-8 bg-[#f5f3ff] rounded-[8px] flex items-center justify-center text-[#8b5cf6] shrink-0">
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
          <h3 className="text-[#4c1d95] font-bold text-[16px]">Meet Our Team</h3>
          <p className="text-gray-500 font-medium text-[12px] mb-4">The experts behind your success</p>

          {isLoadingTeam ? (
            <div className="flex flex-col items-center justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-[#8b5cf6] mb-2" />
              <span className="text-[10px] text-gray-400">Loading team...</span>
            </div>
          ) : (
            <div className="flex justify-between items-start px-2">
              {teamMembers.slice(0, 3).map((member, idx) => (
                <div key={member.id || idx} className="flex flex-col items-center flex-1">
                  <div className="w-[60px] h-[60px] rounded-full mb-2 shadow-[0_4px_12px_rgba(0,0,0,0.08)] border-[3px] border-white bg-gray-100 flex items-center justify-center shrink-0 relative overflow-hidden">
                    {member.image ? (
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      idx === 0 ? (
                        <div className="w-full h-full bg-[#f97316] flex items-center justify-center text-white absolute inset-0">
                          <Bitcoin size={32} />
                        </div>
                      ) : idx === 1 ? (
                        <div className="w-full h-full bg-black flex items-center justify-center text-white absolute inset-0">
                          <X size={32} strokeWidth={2.5} />
                        </div>
                      ) : (
                        <div className="w-full h-full bg-[#eab308] flex items-center justify-center text-black absolute inset-0">
                          <div className="relative">
                            <div className="w-[22px] h-[22px] rotate-45 border-[2.5px] border-black box-border"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[6px] h-[6px] bg-black rounded-[1px]"></div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                  <div className="text-[#0f172a] font-bold text-[12px] mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis w-[90px] text-center">{member.name}</div>
                  <div className="text-gray-500 text-[10px] text-center w-[90px] leading-tight">{member.position}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-6 mb-2 bg-[#8b5cf6] rounded-[16px] p-4 text-center text-white shadow-md relative overflow-hidden">
          {/* Decorative background shapes */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full blur-xl translate-y-1/2 -translate-x-1/4"></div>
          
          <div className="relative z-10">
            <h3 className="text-[14px] font-bold mb-1.5">Ready to Grow With Polychainapp?</h3>
            <p className="text-white/90 text-[10px] leading-relaxed mb-4 max-w-[240px] mx-auto">
              Complete your profile, activate a plan, and start collecting daily rewards.
            </p>
            <button 
              onClick={() => router.push('/dashboard/mining')}
              className="cursor-pointer bg-white text-[#8b5cf6] flex items-center justify-center gap-1.5 w-full py-2.5 rounded-[10px] text-[12px] font-bold hover:bg-gray-50 active:scale-[0.98] transition-all shadow-sm"
            >
              <Rocket size={14} /> Start Earning Now
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
