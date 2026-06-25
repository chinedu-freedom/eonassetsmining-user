"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Wallet, X, Loader2, Zap, Clock, ShieldCheck, Cpu, TrendingUp, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useFetchData } from "@/hooks/useApi";
import { toast } from "react-hot-toast";

export default function MiningPlansPage() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [balanceSource, setBalanceSource] = useState("main"); // "main" or "gift"
  const [investmentAmount, setInvestmentAmount] = useState("");

  const { data: plansRes, isLoading } = useFetchData("/plans", ["plans"]);
  const { data: userRes } = useFetchData("/users/me", ["user"]);
  const plans = Array.isArray(plansRes?.data) 
    ? [...plansRes.data].sort((a, b) => {
        if (a.created_at && b.created_at) {
          return new Date(a.created_at) - new Date(b.created_at);
        }
        return a.id - b.id;
      })
    : [];
  const router = useRouter();

  const balances = {
    main: Number(userRes?.user?.balance || 0),
    gift: Number(userRes?.user?.gift_balance || 0)
  };

  const [isInvesting, setIsInvesting] = useState(false);

  const handleInvest = async () => {
    if (!selectedPlan || !investmentAmount) {
      toast.error("Please enter an investment amount");
      return;
    }
    
    setIsInvesting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/plans/invest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          planId: selectedPlan.id,
          amount: parseFloat(investmentAmount),
          source: balanceSource
        })
      });

      const data = await res.json();
      
      if (res.ok && data.success) {
        toast.success(data.message || "Investment successful!");
        setSelectedPlan(null);
        setInvestmentAmount("");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(data.error || "Investment failed");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsInvesting(false);
    }
  };

  const handleMineClick = (plan) => {
    if (userRes?.user && !userRes.user.email_verified) {
      toast.error("Please verify your email to perform this action");
      router.push("/dashboard/settings/auth");
      return;
    }
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
          <Link href="/dashboard" className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer">
            <ArrowLeft size={16} />
          </Link>
          <h1 className="text-[#4c1d95] text-[15px] font-bold">Mining Contracts</h1>
        </div>
        <Link href="/dashboard/investments" className="w-8 h-8 bg-[#8b5cf6] rounded-md flex items-center justify-center text-white hover:bg-purple-600 transition-colors shadow-sm cursor-pointer">
          <Wallet size={14} />
        </Link>
      </div>

      {/* <div className="px-4 mt-3 mb-2">
        <h2 className="text-[18px] font-bold text-[#0f172a]">Investment Plans</h2>
        <p className="text-[12px] text-gray-500 mt-0.5">Select a plan to start earning daily profits.</p>
      </div> */}

      {/* Plans List */}
      <div className="px-4 pt-2 pb-24 space-y-3 max-w-[480px] mt-2 mx-auto w-full">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-[#8b5cf6]" />
            <p className="text-sm font-medium">Loading plans...</p>
          </div>
        ) : plans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <p className="text-sm font-medium">No plans available.</p>
          </div>
        ) : plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex flex-col gap-3">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#f5f3ff] border border-purple-50 flex items-center justify-center overflow-hidden shrink-0">
                  {plan.image ? (
                    <img src={plan.image} alt={plan.name} className="w-full h-full object-cover" />
                  ) : (
                    <Cpu className="text-[#8b5cf6]" size={20} />
                  )}
                </div>
                <div>
                  <h2 className="text-[#0f172a] font-bold text-[15px]">{plan.name}</h2>
                  <p className="text-gray-500 text-[11px] font-medium">{plan.duration} Days Contract</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[#22c55e] font-bold text-[18px] leading-none mb-1">{Number(plan.daily_income).toFixed(1)}%</div>
                {/* <div className="text-gray-400 text-[10px] font-medium uppercase tracking-wide">Daily Profit</div> */}
                <div className="text-[10px] text-gray-500 leading-tight">
                {/* <div className="text-[10px] text-gray-500 mt-1.5 leading-tight"> */}
                  Min: <span className="text-[#0f172a] font-semibold">{formatCurrency(Number(plan.min_investment))}</span><br/>
                  Max: <span className="text-[#0f172a] font-semibold">{formatCurrency(Number(plan.max_investment))}</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => handleMineClick(plan)}
              className="cursor-pointer w-full bg-[#8b5cf6] text-white font-medium py-2.5 rounded-lg hover:bg-purple-600 transition-colors text-[13px] shadow-sm"
            >
             Mine
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-sm">
          <div
            className="bg-white w-full max-w-[800px] rounded-t-[24px] overflow-hidden flex flex-col animate-in slide-in-from-bottom-full duration-300 ease-out shadow-2xl"
            style={{ maxHeight: '90vh' }}
          >
            {/* Drag Handle */}
            <div className="w-full flex justify-center pt-3 pb-1">
              <div className="w-12 h-1 bg-gray-200 rounded-full"></div>
            </div>

            {/* Modal Header */}
            <div className="flex justify-between items-start px-4 pb-4 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-[42px] h-[42px] bg-[#020617] rounded-full flex items-center justify-center shadow-inner relative overflow-hidden shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-transparent"></div>
                  {selectedPlan.image ? (
                    <img src={selectedPlan.image} alt={selectedPlan.name} className="w-full h-full object-cover z-10" />
                  ) : (
                    <div className="w-[18px] h-[26px] border border-purple-400/50 rounded flex flex-col items-center justify-center bg-[#0f172a] z-10 shadow-[0_0_8px_rgba(59,130,246,0.5)]">
                      <span className="text-purple-400 text-[9px] font-bold leading-none">{selectedPlan.duration}</span>
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
                className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <div className="overflow-y-auto p-4 space-y-6 [&::-webkit-scrollbar]:hidden">

              <div className="flex justify-between items-center py-4 border-y border-gray-100">
                <div className="text-center w-1/3">
                  <div className="text-[#22c55e] font-bold text-[14px]">{Number(selectedPlan.daily_income).toFixed(1)}%</div>
                  <div className="text-gray-400 text-[10px] mt-1">Daily Rate</div>
                </div>
                <div className="text-center w-1/3 border-x border-gray-50">
                  <div className="text-[#8b5cf6] font-bold text-[14px]">{selectedPlan.duration} days</div>
                  <div className="text-gray-400 text-[10px] mt-1">Revenue Days</div>
                </div>
                <div className="text-center w-1/3">
                  <div className="text-[#8b5cf6] font-bold text-[14px]">{(Number(selectedPlan.daily_income) * selectedPlan.duration).toFixed(1)}%</div>
                  <div className="text-gray-400 text-[10px] mt-1">Total Yield</div>
                </div>
              </div>

              {/* Balance Source */}
              <div>
                <label className="block text-gray-500 text-[12px] mb-3">Select Balance Source</label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setBalanceSource("main")}
                    className={`flex-1 py-4 rounded-[12px] border flex flex-col items-center justify-center gap-1.5 transition-all ${balanceSource === "main"
                        ? "border-[#8b5cf6] bg-[#f8faff] text-[#8b5cf6]"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                      }`}
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-wider">EARNING BALANCE</span>
                    <span className="text-[15px] text-[#0f172a] font-bold">{formatCurrency(balances.main)}</span>
                  </button>
                  <button
                    onClick={() => setBalanceSource("gift")}
                    className={`flex-1 py-4 rounded-[12px] border flex flex-col items-center justify-center gap-1.5 transition-all ${balanceSource === "gift"
                        ? "border-[#8b5cf6] bg-[#f8faff] text-[#8b5cf6]"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                      }`}
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-wider">GIFT BALANCE</span>
                    <span className="text-[15px] text-[#0f172a] font-bold">{formatCurrency(balances.gift)}</span>
                  </button>
                </div>
              </div>

              {/* Investment Amount */}
              <div>
                <div className="flex justify-between items-end mb-3">
                  <label className="text-gray-500 text-[12px]">Investment Amount</label>
                  <span className="text-gray-400 text-[10px]">Min: {formatCurrency(Number(selectedPlan.min_investment))} | Max: {formatCurrency(Number(selectedPlan.max_investment))}</span>
                </div>
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full border border-gray-200 bg-gray-50/50 rounded-[12px] px-4 py-3.5 text-[14px] focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] transition-all"
                />
              </div>

              {/* Earnings Breakdown */}
              <div className="space-y-4 pt-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <span className="text-gray-500 text-[12px]">Daily Income</span>
                  <span className="text-[#22c55e] text-[14px] font-bold">{formatCurrency(dailyIncome)}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <span className="text-gray-500 text-[12px]">Total Return</span>
                  <span className="text-[#0f172a] text-[14px] font-bold">{formatCurrency(totalReturn)}</span>
                </div>
                <div className="flex justify-between items-center pb-2">
                  <span className="text-gray-500 text-[12px]">Capital Return</span>
                  <span className="text-[#8b5cf6] text-[14px] font-bold">Yes</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-gray-100 bg-white flex flex-col items-center gap-3">
              <div className="text-[12px] text-gray-500">
                Total Balance: <span className="text-[#f59e0b] font-bold">{formatCurrency(balances[balanceSource])}</span>
              </div>
              <button 
                onClick={handleInvest}
                disabled={isInvesting}
                className="w-full bg-[#8b5cf6] text-white font-bold py-4 rounded-[12px] hover:bg-purple-600 transition-colors text-[15px] shadow-md disabled:opacity-50 flex items-center justify-center cursor-pointer"
              >
                {isInvesting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Invest Now"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
