"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Loader2 } from "lucide-react";
import { useFetchData } from "@/hooks/useApi";

export default function TeamPage() {
  const router = useRouter();
  
  const { data: teamRes, isLoading } = useFetchData("/users/team", ["team-stats"]);
  const { data: settingsRes } = useFetchData("/settings", ["platform-settings"]);
  const settings = settingsRes?.settings || {};
  
  const stats = teamRes?.data;
  const overview = stats?.overview || { new_members_today: 0, new_earnings_today: 0, total_team: 0 };
  const levels = stats?.levels || [
    { level: 1, total_members: 0, valid_members: 0, commission_rate: 0, total_earnings: 0 },
    { level: 2, total_members: 0, valid_members: 0, commission_rate: 0, total_earnings: 0 },
    { level: 3, total_members: 0, valid_members: 0, commission_rate: 0, total_earnings: 0 },
    { level: 4, total_members: 0, valid_members: 0, commission_rate: 0, total_earnings: 0 }
  ];
  
  const l1 = levels[0];
  const l2 = levels[1];
  const l3 = levels[2];
  const l4 = levels[3];

  const total = overview.total_team || 1; 
  const p1 = (l1.total_members / total) * 100;
  const p2 = (l2.total_members / total) * 100;
  const p3 = (l3.total_members / total) * 100;

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] overflow-y-auto [&::-webkit-scrollbar]:hidden ">
      {/* Header */}
      <div className="bg-[#f8f9fa] px-4 py-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 bg-[#2b354e] rounded-[10px] flex items-center justify-center text-white hover:bg-[#1e2538] transition-colors shadow-sm cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-[#4c1d95] text-[20px] font-bold">Team</h1>
        </div>
        <button
          onClick={() => router.push('/dashboard/invite')}
          className="w-9 h-9 bg-[#8b5cf6] rounded-[10px] flex items-center justify-center text-white shadow-sm hover:bg-[#8b5cf6] transition-colors"
        >
          <Mail size={16} fill="currentColor" />
        </button>
      </div>

      <div className="px-4 space-y-4 max-w-[480px] mx-auto w-full pb-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#8b5cf6] mb-3" />
            <span className="text-[12px] text-gray-500 font-medium">Loading team data...</span>
          </div>
        ) : (
          <>
            {/* Team Data Overview */}
            <div className="bg-[#111827] rounded-[16px] p-5 text-white shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-[14px]">Team Data Overview</h2>
                <div className="bg-white/10 px-3 py-1 rounded-full text-[11px] text-white/80">
                  today
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center">
                  <div className="text-[28px] font-bold mb-1 leading-none">{overview.new_members_today}</div>
                  <div className="text-white/70 text-[11px]">New Members</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-[28px] font-bold mb-1 leading-none">{settings.currency_symbol || "$"}{Number(overview.new_earnings_today).toFixed(2)}</div>
                  <div className="text-white/70 text-[11px]">New Earnings</div>
                </div>
              </div>
            </div>

            {/* Earnings Analysis */}
            <div className="bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-5">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[#4c1d95] font-bold text-[14px]">Earnings Analysis</h2>
                <div className="text-gray-400 text-[11px]">today</div>
              </div>

              <div className="flex items-center justify-between mb-8">
                {/* Donut Chart */}
                <div className="relative w-32 h-32 ml-4">
                  <div 
                    className="w-full h-full rounded-full transition-all duration-700" 
                    style={{ 
                      background: overview.total_team === 0 
                        ? '#f1f5f9' 
                        : `conic-gradient(#fecdd3 0% ${p1}%, #93c5fd ${p1}% ${p1+p2}%, #fde047 ${p1+p2}% ${p1+p2+p3}%, #10b981 ${p1+p2+p3}% 100%)` 
                    }}
                  >
                    <div className="absolute inset-3 bg-white rounded-full shadow-inner"></div>
                  </div>
                </div>

                {/* Legend */}
                <div className="space-y-3 mr-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-[4px] bg-[#fecdd3]"></div>
                    <span className="text-[#334155] text-[12px] font-medium">Level 1 ({l1.total_members})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-[4px] bg-[#93c5fd]"></div>
                    <span className="text-[#334155] text-[12px] font-medium">Level 2 ({l2.total_members})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-[4px] bg-[#fde047]"></div>
                    <span className="text-[#334155] text-[12px] font-medium">Level 3 ({l3.total_members})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-[4px] bg-[#10b981]"></div>
                    <span className="text-[#334155] text-[12px] font-medium">Level 4 ({l4.total_members})</span>
                  </div>
                </div>
              </div>

              {/* Bottom Link */}
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <div className="text-[#64748b] text-[13px]">
                  Accumulated Team: <span className="text-[#0f172a] font-bold">{overview.total_team}</span>
                </div>
                <button
                  onClick={() => router.push('/dashboard/team/list')}
                  className="text-[#8b5cf6] text-[13px]  cursor-pointer hover:underline font-medium"
                >
                  View Team List
                </button>
              </div>
            </div>

            {/* Effective User Data */}
            <div className="bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-5">
              <h2 className="text-[#4c1d95] font-bold text-[14px] mb-6">Effective User Data</h2>

              <div className="space-y-6">
                {/* Level 1 */}
                <div>
                  <h3 className="text-[#334155] text-[13px] font-bold mb-4">Level 1</h3>
                  <div className="grid grid-cols-4 text-center">
                    <div>
                      <div className="text-[#4c1d95] text-[16px] font-bold mb-1">{l1.valid_members}/{l1.total_members}</div>
                      <div className="text-gray-400 text-[10px]">Valid Members</div>
                    </div>
                    <div>
                      <div className="text-[#4c1d95] text-[16px] font-bold mb-1">{l1.commission_rate}%</div>
                      <div className="text-gray-400 text-[10px]">Commission</div>
                    </div>
                    <div>
                      <div className="text-[#4c1d95] text-[16px] font-bold mb-1">{settings.currency_symbol || "$"}{Number(l1.total_deposits || 0).toFixed(2)}</div>
                      <div className="text-gray-400 text-[10px]">Total Deposit</div>
                    </div>
                    <div>
                      <div className="text-[#4c1d95] text-[16px] font-bold mb-1">{settings.currency_symbol || "$"}{Number(l1.total_earnings).toFixed(2)}</div>
                      <div className="text-gray-400 text-[10px]">Total Earnings</div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-50 w-full"></div>

                {/* Level 2 */}
                <div>
                  <h3 className="text-[#334155] text-[13px] font-bold mb-4">Level 2</h3>
                  <div className="grid grid-cols-4 text-center">
                    <div>
                      <div className="text-[#4c1d95] text-[16px] font-bold mb-1">{l2.valid_members}/{l2.total_members}</div>
                      <div className="text-gray-400 text-[10px]">Valid Members</div>
                    </div>
                    <div>
                      <div className="text-[#4c1d95] text-[16px] font-bold mb-1">{l2.commission_rate}%</div>
                      <div className="text-gray-400 text-[10px]">Commission</div>
                    </div>
                    <div>
                      <div className="text-[#4c1d95] text-[16px] font-bold mb-1">{settings.currency_symbol || "$"}{Number(l2.total_deposits || 0).toFixed(2)}</div>
                      <div className="text-gray-400 text-[10px]">Total Deposit</div>
                    </div>
                    <div>
                      <div className="text-[#4c1d95] text-[16px] font-bold mb-1">{settings.currency_symbol || "$"}{Number(l2.total_earnings).toFixed(2)}</div>
                      <div className="text-gray-400 text-[10px]">Total Earnings</div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-50 w-full"></div>

                {/* Level 3 */}
                <div>
                  <h3 className="text-[#334155] text-[13px] font-bold mb-4">Level 3</h3>
                  <div className="grid grid-cols-4 text-center">
                    <div>
                      <div className="text-[#4c1d95] text-[16px] font-bold mb-1">{l3.valid_members}/{l3.total_members}</div>
                      <div className="text-gray-400 text-[10px]">Valid Members</div>
                    </div>
                    <div>
                      <div className="text-[#4c1d95] text-[16px] font-bold mb-1">{l3.commission_rate}%</div>
                      <div className="text-gray-400 text-[10px]">Commission</div>
                    </div>
                    <div>
                      <div className="text-[#4c1d95] text-[16px] font-bold mb-1">{settings.currency_symbol || "$"}{Number(l3.total_deposits || 0).toFixed(2)}</div>
                      <div className="text-gray-400 text-[10px]">Total Deposit</div>
                    </div>
                    <div>
                      <div className="text-[#4c1d95] text-[16px] font-bold mb-1">{settings.currency_symbol || "$"}{Number(l3.total_earnings).toFixed(2)}</div>
                      <div className="text-gray-400 text-[10px]">Total Earnings</div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-50 w-full"></div>

                {/* Level 4 */}
                <div>
                  <h3 className="text-[#334155] text-[13px] font-bold mb-4">Level 4</h3>
                  <div className="grid grid-cols-4 text-center">
                    <div>
                      <div className="text-[#4c1d95] text-[16px] font-bold mb-1">{l4.valid_members}/{l4.total_members}</div>
                      <div className="text-gray-400 text-[10px]">Valid Members</div>
                    </div>
                    <div>
                      <div className="text-[#4c1d95] text-[16px] font-bold mb-1">{l4.commission_rate}%</div>
                      <div className="text-gray-400 text-[10px]">Commission</div>
                    </div>
                    <div>
                      <div className="text-[#4c1d95] text-[16px] font-bold mb-1">{settings.currency_symbol || "$"}{Number(l4.total_deposits || 0).toFixed(2)}</div>
                      <div className="text-gray-400 text-[10px]">Total Deposit</div>
                    </div>
                    <div>
                      <div className="text-[#4c1d95] text-[16px] font-bold mb-1">{settings.currency_symbol || "$"}{Number(l4.total_earnings).toFixed(2)}</div>
                      <div className="text-gray-400 text-[10px]">Total Earnings</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
}
