"use client";

import { useState } from "react";
import { ArrowLeft, Wallet, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { useFetchData } from "@/hooks/useApi";

export default function MiningPlansPage() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [balanceSource, setBalanceSource] = useState("main"); // "main" or "gift"
  const [investmentAmount, setInvestmentAmount] = useState("");

  const { data: plansRes, isLoading } = useFetchData("/plans", ["plans"]);
  const plans = Array.isArray(plansRes?.data) ? plansRes.data : [];

  const balances = {
    main: 0.60,
    gift: 4.50
  };

  const handleMineClick = (plan) => {
    setSelectedPlan(plan);
    setBalanceSource("main");
    setInvestmentAmount("");
  };

  const closeModal = () => {
    setSelectedPlan(null);
  };

  // Calculations
  const amount = parseFloat(investmentAmount) || 0;
  const dailyIncome = selectedPlan ? (amount * Number(selectedPlan.daily_income)) / 100 : 0;
  const totalReturn = selectedPlan ? (dailyIncome * selectedPlan.duration) : 0;

  // Format currency helper
  const formatCurrency = (val) => {
    return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] overflow-y-auto  [&::-webkit-scrollbar]:hidden relative">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 flex justify-between items-center shadow-sm z-10 sticky top-0 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <h1 className="text-[#1e3a8a] text-[15px] font-bold">Products</h1>
        </div>
        <Link href="/dashboard/investments" className="w-8 h-8 bg-[#4082F6] rounded-xl flex items-center justify-center text-white hover:bg-blue-600 transition-colors shadow-sm">
          <Wallet size={14} />
        </Link>
      </div>

      {/* Plans List */}
      <div className="px-4 pt-4 pb-4 space-y-3 max-w-[480px] mx-auto w-full">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-[#3b82f6]" />
            <p className="text-sm font-medium">Loading mining plans...</p>
          </div>
        ) : plans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <p className="text-sm font-medium">No mining plans available.</p>
          </div>
        ) : plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-[16px] p-[16px] border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5 w-1/3">
                {/* Plan Icon */}
                <div className="w-[42px] h-[42px] bg-[#020617] rounded-full flex items-center justify-center shadow-inner relative overflow-hidden shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-transparent"></div>
                  {/* Inner glowing card representation */}
                  {plan.image ? (
                    <img src={plan.image} alt={plan.name} className="w-full h-full object-cover z-10" />
                  ) : (
                    <div className="w-[18px] h-[26px] border border-blue-400/50 rounded flex flex-col items-center justify-center bg-[#0f172a] z-10 shadow-[0_0_8px_rgba(59,130,246,0.5)]">
                      <span className="text-blue-400 text-[9px] font-bold leading-none">{plan.duration}</span>
                      <span className="text-white text-[4px] opacity-80 uppercase mt-0.5">Days</span>
                    </div>
                  )}
                </div>

                <h2 className="text-[#0f172a] font-bold text-[15px]">{plan.name}</h2>
              </div>

              <div className="text-center w-1/3">
                <span className="text-[#1e3a8a] font-bold text-[12px]">{plan.duration} days</span>
              </div>

              <div className="text-right w-1/3">
                <div className="text-[#22c55e] font-bold text-[20px] leading-none mb-1 tracking-tight">{Number(plan.daily_income).toFixed(1)}%</div>
                <div className="text-gray-400 text-[10px]">daily</div>
              </div>
            </div>

            <div className="text-right mb-3">
              <p className="text-[10px] text-gray-400 font-medium tracking-tight">
                Min: <span className="text-[#3b82f6] font-bold">{formatCurrency(Number(plan.min_investment))}</span> | Max: <span className="text-[#3b82f6] font-bold">{formatCurrency(Number(plan.max_investment))}</span>
              </p>
            </div>

            <button
              onClick={() => handleMineClick(plan)}
              className="w-full bg-[#4082F6] text-white font-semibold py-2 rounded-[10px] hover:bg-blue-600 transition-colors text-[13px] shadow-sm"
            >
              Mine
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center">
          <div
            className="bg-white w-full max-w-[480px] rounded-t-[24px] sm:rounded-[24px] overflow-hidden flex flex-col animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200"
            style={{ maxHeight: '90vh' }}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-start p-4 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-[42px] h-[42px] bg-[#020617] rounded-full flex items-center justify-center shadow-inner relative overflow-hidden shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-transparent"></div>
                  {selectedPlan.image ? (
                    <img src={selectedPlan.image} alt={selectedPlan.name} className="w-full h-full object-cover z-10" />
                  ) : (
                    <div className="w-[18px] h-[26px] border border-blue-400/50 rounded flex flex-col items-center justify-center bg-[#0f172a] z-10 shadow-[0_0_8px_rgba(59,130,246,0.5)]">
                      <span className="text-blue-400 text-[9px] font-bold leading-none">{selectedPlan.duration}</span>
                      <span className="text-white text-[4px] opacity-80 uppercase mt-0.5">Days</span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-[#0f172a] text-[15px] leading-tight">{selectedPlan.name}</h3>
                  <p className="text-gray-500 text-[11px] mt-0.5">{selectedPlan.duration} days • {Number(selectedPlan.daily_income).toFixed(1)}% daily</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <div className="overflow-y-auto p-4 space-y-5 [&::-webkit-scrollbar]:hidden">

              <div className="flex justify-between items-center bg-[#f8f9fa] rounded-[12px] p-3 border border-gray-100">
                <div className="text-center">
                  <div className="text-[#22c55e] font-bold text-[13px]">{Number(selectedPlan.daily_income).toFixed(1)}%</div>
                  <div className="text-gray-400 text-[9px] mt-0.5">Daily Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-[#3b82f6] font-bold text-[13px]">{selectedPlan.duration} days</div>
                  <div className="text-gray-400 text-[9px] mt-0.5">Revenue Days</div>
                </div>
                <div className="text-center">
                  <div className="text-[#3b82f6] font-bold text-[13px]">{(Number(selectedPlan.daily_income) * selectedPlan.duration).toFixed(1)}%</div>
                  <div className="text-gray-400 text-[9px] mt-0.5">Total Yield</div>
                </div>
              </div>

              {/* Balance Source */}
              <div>
                <label className="block text-gray-500 text-[11px] mb-2">Select Balance Source</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setBalanceSource("main")}
                    className={`flex-1 py-2.5 rounded-[12px] border flex flex-col items-center justify-center gap-1 transition-all ${balanceSource === "main"
                        ? "border-[#3b82f6] bg-[#eff6ff]"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                      }`}
                  >
                    <span className="text-[9px] text-gray-500 font-medium uppercase tracking-wider">Main Balance</span>
                    <span className="text-[13px] text-[#0f172a] font-bold">{formatCurrency(balances.main)}</span>
                  </button>
                  <button
                    onClick={() => setBalanceSource("gift")}
                    className={`flex-1 py-2.5 rounded-[12px] border flex flex-col items-center justify-center gap-1 transition-all ${balanceSource === "gift"
                        ? "border-[#3b82f6] bg-[#eff6ff]"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                      }`}
                  >
                    <span className="text-[9px] text-gray-500 font-medium uppercase tracking-wider">Gift Balance</span>
                    <span className="text-[13px] text-[#0f172a] font-bold">{formatCurrency(balances.gift)}</span>
                  </button>
                </div>
              </div>

              {/* Investment Amount */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="text-gray-500 text-[11px]">Investment Amount</label>
                  <span className="text-gray-400 text-[9px]">Min: {formatCurrency(Number(selectedPlan.min_investment))} | Max: {formatCurrency(Number(selectedPlan.max_investment))}</span>
                </div>
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full border border-gray-200 rounded-[12px] px-4 py-3 text-[13px] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-all"
                />
              </div>

              {/* Earnings Breakdown */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                  <span className="text-gray-500 text-[11px]">Daily Income</span>
                  <span className="text-[#22c55e] text-[13px] font-bold">{formatCurrency(dailyIncome)}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                  <span className="text-gray-500 text-[11px]">Total Return</span>
                  <span className="text-[#0f172a] text-[13px] font-bold">{formatCurrency(totalReturn)}</span>
                </div>
                <div className="flex justify-between items-center pb-1">
                  <span className="text-gray-500 text-[11px]">Capital Return</span>
                  <span className="text-[#3b82f6] text-[13px] font-bold">Yes</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-50 bg-white flex flex-col items-center gap-3">
              <div className="text-[11px] text-gray-500">
                Available Balance: <span className="text-[#f59e0b] font-bold">{formatCurrency(balances[balanceSource])}</span>
              </div>
              <button className="w-full bg-[#4082F6] text-white font-semibold py-3.5 rounded-[12px] hover:bg-blue-600 transition-colors text-[14px] shadow-sm">
                Invest Now
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
