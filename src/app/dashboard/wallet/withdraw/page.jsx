"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Wallet, Info, Hexagon, X, Eye, EyeOff } from "lucide-react";
import { useFetchData, usePost } from "@/hooks/useApi";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const parseNoticeToLines = (htmlString) => {
  if (!htmlString) return [];
  
  // Extract list items if present
  const liMatches = htmlString.match(/<li[^>]*>([\s\S]*?)<\/li>/gi);
  if (liMatches && liMatches.length > 0) {
    return liMatches.map(li => li.replace(/^<li[^>]*>/i, '').replace(/<\/li>$/i, '').trim()).filter(Boolean);
  }
  
  // Extract paragraphs if present
  const pMatches = htmlString.match(/<p[^>]*>([\s\S]*?)<\/p>/gi);
  if (pMatches && pMatches.length > 0) {
    return pMatches.map(p => p.replace(/^<p[^>]*>/i, '').replace(/<\/p>$/i, '').trim()).filter(Boolean);
  }
  
  // Split by <br> or newline tags
  return htmlString
    .split(/<br\s*\/?>/gi)
    .map(line => line.trim())
    .filter(Boolean);
};

export default function WithdrawPage() {
  const router = useRouter();
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const [cryptoNetwork, setCryptoNetwork] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [withdrawalPassword, setWithdrawalPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const { mutate: submitWithdrawal, isPending: isSubmitting } = usePost("/users/withdraw");
  
  const { data: userRes, isLoading } = useFetchData("/users/me", ["profile"]);
  const user = userRes?.user || {};
  
  const { data: settingsRes } = useFetchData("/settings", ["platform-settings"]);
  const settings = settingsRes?.settings || {};
  
  const { data: cryptosRes, isLoading: isLoadingCryptos } = useFetchData(
    "/settings/payout-cryptos",
    ["payout-cryptos"]
  );
  const cryptos = cryptosRes?.data || [];
  const minWithdrawal = Number(settings.min_withdrawal) || 5;
  const maxWithdrawal = Number(settings.max_withdrawal) || 10000;
  const withdrawalCharge = Number(settings.withdrawal_charge) || 2;
  
  const mainBalance = Number(user.withdrawable_balance || 0);
  const giftBalance = Number(user.gift_balance || 0);
  const totalBalance = mainBalance + giftBalance;
  const feeAmount = amount ? (Number(amount) * (withdrawalCharge / 100)) : 0;

  const handleCloseModal = () => {
    setShowCryptoModal(false);
    setCryptoNetwork("");
    setWalletAddress("");
    setAmount("");
    setWithdrawalPassword("");
    setShowPassword(false);
  };

  return (
    <div className="flex flex-col h-full bg-transparent overflow-y-auto [&::-webkit-scrollbar]:hidden">
      {/* Header */}
      <div className="bg-[#131F37] px-4 py-4 flex items-center gap-3 sticky top-0 z-20 shadow-sm border-b border-white/5">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-colors text-gray-300 shadow-sm border border-white/5 cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <h1 className="text-white/90 text-[16px] font-bold">Withdraw</h1>
      </div>

      <div className="px-4 py-5 max-w-[480px] mx-auto w-full space-y-6">
        
        {/* Balance Card */}
        <div className="bg-[#8b5cf6] rounded-[16px] p-5 text-white shadow-[0_8px_20px_-6px_rgba(37,99,235,0.4)] relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          
          <div className="flex items-center gap-1.5 mb-2 relative z-10">
            <div className="bg-white/20 p-1 rounded-md">
              <Wallet size={12} className="text-white" />
            </div>
            <span className="text-[12px] font-medium text-white/90">Total Balance</span>
          </div>
          
          <div className="text-[32px] font-bold tracking-tight relative z-10 flex items-center">
            {isLoading ? (
               <Loader2 size={24} className="animate-spin text-white/70" />
            ) : (
               `${settings.currency_symbol || "$"}${totalBalance.toFixed(2)}`
            )}
          </div>
        </div>

        {/* Selection Area */}
        <div>
          <h2 className="text-white/90 font-bold text-[14px] mb-3 px-1">Select Withdrawal Method</h2>
          
          <div className="grid grid-cols-1 gap-3">

            {/* Crypto Card (Active) */}
            <button 
              onClick={() => setShowCryptoModal(true)} 
              className="bg-[#131F37] cursor-pointer border border-white/5 rounded-md p-4 flex items-center justify-between shadow-sm hover:border-[#8b5cf6] hover:shadow-[0_8px_20px_-6px_rgba(139,92,246,0.15)] transition-all group w-full"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-[12px] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-300">
                  <Hexagon size={24} className="fill-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-white/90 font-bold text-[14px] mb-0.5 group-hover:text-[#8b5cf6] transition-colors">Withdraw to Crypto</h3>
                  <p className="text-gray-400 text-[11px] leading-relaxed">Transfer to your crypto wallet directly</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors text-gray-400 group-hover:text-purple-400">
                <ArrowLeft size={16} className="rotate-180" />
              </div>
            </button>
            
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-amber-900/20 border border-amber-500/20 rounded-[16px] p-5 shadow-sm space-y-3.5">
          <div className="flex items-center gap-2.5 text-amber-300">
            <Info size={19} className="text-amber-400" />
            <h3 className="font-bold text-[15px]">Important Information</h3>
          </div>
          
          <div className="text-[13px] text-amber-200 leading-normal">
            {settings.withdrawal_notice && parseNoticeToLines(settings.withdrawal_notice).length > 0 ? (
              <div className="space-y-1">
                {parseNoticeToLines(settings.withdrawal_notice).map((line, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="leading-normal font-medium text-amber-200 mt-0.5" dangerouslySetInnerHTML={{ __html: line }} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</div>
                  <p className="leading-normal font-medium">Follow the below steps to make your withdrawal in the correct manner</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</div>
                  <p className="leading-normal font-medium">Enter your wallet address to withdraw correctly</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</div>
                  <p className="leading-normal font-medium">You can make a minimum withdrawal of {settings.currency_symbol || "$"}{minWithdrawal.toFixed(2)}</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">4</div>
                  <p className="leading-normal font-medium">Withdrawal may take 5 - 10 minutes with a {withdrawalCharge}% charge</p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Crypto Withdrawal Modal */}
      {showCryptoModal && (
        <div 
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in cursor-pointer"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-[#0B1426] border border-white/10 rounded-t-[24px] sm:rounded-[20px] w-full max-w-[450px] overflow-hidden shadow-2xl animate-slide-up flex flex-col max-h-[85vh] mt-auto sm:mt-0 cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Mobile Grabber */}
            <div className="w-full flex justify-center pt-3 sm:hidden pb-1 shrink-0">
              <div className="w-12 h-1.5 bg-white/20 rounded-full"></div>
            </div>
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-4 py-3 sm:py-4 border-b border-white/5 shrink-0">
              <h3 className="text-white/90 text-[15px] font-bold">Withdraw to Crypto</h3>
              <button 
                onClick={handleCloseModal}
                className="cursor-pointer w-7 h-7 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-gray-400 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              
              <div className="space-y-1.5">
                <label className="block text-white/90 text-[12px] font-bold">Select Cryptocurrency *</label>
                <select 
                  value={cryptoNetwork}
                  onChange={(e) => setCryptoNetwork(e.target.value)}
                  className="cursor-pointer w-full bg-[#131F37] border border-white/10 rounded-[10px] px-3.5 py-2.5 text-[13px] text-white/90 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 appearance-none"
                >
                  <option value="" disabled className="bg-[#131F37]">Choose cryptocurrency & network</option>
                  {isLoadingCryptos ? (
                    <option disabled className="bg-[#131F37]">Loading...</option>
                  ) : (
                    cryptos.map(crypto => (
                      <option key={crypto.id} value={`${crypto.symbol} (${crypto.network})`} className="bg-[#131F37]">
                        {crypto.name} ({crypto.network})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-white/90 text-[12px] font-bold">Wallet Address *</label>
                <input 
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="Enter your wallet address"
                  className="w-full bg-[#131F37] border border-white/10 rounded-[10px] px-3.5 py-2.5 text-[13px] text-white/90 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
                <p className="text-red-400 text-[10px]">Double-check your address. Incorrect addresses may result in lost funds.</p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-white/90 text-[12px] font-bold">Withdrawal Amount *</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-[#8b5cf6] font-bold text-[14px]">{settings.currency_symbol || "$"}</span>
                  <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-[#131F37] border border-white/10 rounded-[10px] pl-8 pr-16 py-2.5 text-[14px] font-medium text-white/90 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  />
                  <button 
                    onClick={() => setAmount(totalBalance.toString())}
                    className="absolute right-2 bg-[#8b5cf6] text-white text-[10px] font-bold px-2.5 py-1 rounded-sm hover:bg-purple-600 transition-colors cursor-pointer"
                  >
                    MAX
                  </button>
                </div>
                <p className="text-gray-400 text-[10px]">Min: {settings.currency_symbol || "$"}{minWithdrawal.toFixed(2)} - Max: {settings.currency_symbol || "$"}{maxWithdrawal.toFixed(2)}</p>
              </div>

              <div className="bg-amber-900/20 border border-amber-500/20 rounded-[10px] p-3 space-y-2">
                <div className="flex justify-between items-center text-[12px] text-amber-300">
                  <span>Charge ({withdrawalCharge.toFixed(2)}%)</span>
                  <span className="font-medium text-red-400">-{settings.currency_symbol || "$"}{feeAmount.toFixed(2)}</span>
                </div>
                <div className="w-full border-t border-dashed border-amber-500/20"></div>
                <div className="flex justify-between items-center text-[12px] font-bold text-amber-200">
                  <span>You will receive</span>
                  <span>{settings.currency_symbol || "$"}{amount ? (Number(amount) - feeAmount).toFixed(2) : "0.00"}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-white/90 text-[12px] font-bold">Withdrawal Password *</label>
                <div className="relative flex items-center">
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={withdrawalPassword}
                    onChange={(e) => setWithdrawalPassword(e.target.value)}
                    placeholder="Enter your withdrawal password"
                    className="w-full bg-[#131F37] border border-white/10 rounded-[10px] pl-3.5 pr-11 py-2.5 text-[13px] text-white/90 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-gray-500 hover:text-gray-300 focus:outline-none cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 pb-12 sm:pb-4 border-t border-white/5 shrink-0">
              <button 
                onClick={() => {
                  submitWithdrawal({
                    amount: Number(amount),
                    network: cryptoNetwork,
                    wallet_address: walletAddress,
                    password: withdrawalPassword,
                    method: "crypto"
                  }, {
                    onSuccess: () => {
                      setShowCryptoModal(false);
                      setAmount("");
                      setWalletAddress("");
                      setCryptoNetwork("");
                      setWithdrawalPassword("");
                      setShowPassword(false);
                      toast.success("Withdrawal request submitted successfully!");
                    }
                  });
                }}
                disabled={isSubmitting || !cryptoNetwork || !walletAddress || !amount || Number(amount) < minWithdrawal || Number(amount) > maxWithdrawal || Number(amount) > totalBalance || !withdrawalPassword}
                className="w-full bg-[#f59e0b] hover:bg-[#d97706] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none text-white font-bold text-[14px] py-3 rounded-[12px] transition-all shadow-sm flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Wallet size={16} />}
                {isSubmitting ? "Processing..." : "Submit Withdrawal"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
