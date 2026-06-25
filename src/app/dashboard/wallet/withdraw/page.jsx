"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Wallet, Info, Hexagon, X } from "lucide-react";
import { useFetchData, usePost } from "@/hooks/useApi";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function WithdrawPage() {
  const router = useRouter();
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const [cryptoNetwork, setCryptoNetwork] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [withdrawalPassword, setWithdrawalPassword] = useState("");
  
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
  
  const mainBalance = Number(user.balance || 0);
  const giftBalance = Number(user.gift_balance || 0);
  const totalBalance = mainBalance + giftBalance;
  const feeAmount = amount ? (Number(amount) * (withdrawalCharge / 100)) : 0;

  const handleCloseModal = () => {
    setShowCryptoModal(false);
    setCryptoNetwork("");
    setWalletAddress("");
    setAmount("");
    setWithdrawalPassword("");
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] overflow-y-auto [&::-webkit-scrollbar]:hidden">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-3 sticky top-0 z-20 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border-b border-gray-100">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-xl flex items-center justify-center transition-colors text-gray-600 shadow-sm border border-gray-100 cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <h1 className="text-[#4c1d95] text-[16px] font-bold">Withdraw</h1>
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
               `$${totalBalance.toFixed(2)}`
            )}
          </div>
        </div>

        {/* Selection Area */}
        <div>
          <h2 className="text-[#4c1d95] font-bold text-[14px] mb-3 px-1">Select Withdrawal Method</h2>
          
          <div className="grid grid-cols-1 gap-3">

            {/* Crypto Card (Active) */}
            <button 
              onClick={() => setShowCryptoModal(true)} 
              className="bg-white cursor-pointer border border-gray-100 rounded-md p-4 flex items-center justify-between shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:border-blue-200 hover:shadow-[0_8px_20px_-6px_rgba(37,99,235,0.15)] transition-all group w-full"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#0f172a] rounded-[12px] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-300">
                  <Hexagon size={24} className="fill-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-[#0f172a] font-bold text-[14px] mb-0.5 group-hover:text-[#8b5cf6] transition-colors">Withdraw to Crypto</h3>
                  <p className="text-[#64748b] text-[11px] leading-relaxed">Transfer to your crypto wallet directly</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-purple-50 transition-colors text-gray-400 group-hover:text-purple-500">
                <ArrowLeft size={16} className="rotate-180" />
              </div>
            </button>
            
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-[#fffbeb] border border-[#fde68a] rounded-[16px] p-4 shadow-sm">
          <div className="flex items-center gap-1.5 mb-3">
            <Info size={16} className="text-[#b45309] fill-[#fde68a]" />
            <h3 className="text-[#92400e] font-bold text-[13px]">Important Information</h3>
          </div>
          
          <div className="space-y-2.5">
            <div className="flex gap-2 items-start text-[11px] text-[#92400e]/80 font-medium">
              <span className="font-bold">1.</span>
              <p>Follow the below steps to make your withdrawal in the correct manner</p>
            </div>
            <div className="flex gap-2 items-start text-[11px] text-[#92400e]/80 font-medium">
              <span className="font-bold">2.</span>
              <p>Enter your wallet address to withdraw correctly</p>
            </div>
            <div className="flex gap-2 items-start text-[11px] text-[#92400e]/80 font-medium">
              <span className="font-bold">3.</span>
              <p>You can make a minimum withdrawal of ${minWithdrawal.toFixed(2)}</p>
            </div>
            <div className="flex gap-2 items-start text-[11px] text-[#92400e]/80 font-medium">
              <span className="font-bold">4.</span>
              <p>Withdrawal may take 5 - 10 minutes with a {withdrawalCharge}% charge</p>
            </div>
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
            className="bg-white rounded-t-[24px] sm:rounded-[20px] w-full max-w-[450px] overflow-hidden shadow-2xl animate-slide-up flex flex-col max-h-[85vh] mt-auto sm:mt-0 cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Mobile Grabber */}
            <div className="w-full flex justify-center pt-3 sm:hidden pb-1 shrink-0">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div>
            </div>
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-4 py-3 sm:py-4 border-b border-gray-100 shrink-0">
              <h3 className="text-[#4c1d95] text-[15px] font-bold">Withdraw to Crypto</h3>
              <button 
                onClick={handleCloseModal}
                className="cursor-pointer w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              
              <div className="space-y-1.5">
                <label className="block text-[#0f172a] text-[12px] font-bold">Select Cryptocurrency *</label>
                <select 
                  value={cryptoNetwork}
                  onChange={(e) => setCryptoNetwork(e.target.value)}
                  className="cursor-pointer w-full bg-white border border-gray-200 rounded-[10px] px-3.5 py-2.5 text-[13px] text-gray-800 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 appearance-none"
                >
                  <option value="" disabled>Choose cryptocurrency & network</option>
                  {isLoadingCryptos ? (
                    <option disabled>Loading...</option>
                  ) : (
                    cryptos.map(crypto => (
                      <option key={crypto.id} value={`${crypto.symbol} (${crypto.network})`}>
                        {crypto.name} ({crypto.network})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[#0f172a] text-[12px] font-bold">Wallet Address *</label>
                <input 
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="Enter your wallet address"
                  className="w-full bg-white border border-gray-200 rounded-[10px] px-3.5 py-2.5 text-[13px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
                <p className="text-red-500 text-[10px]">Double-check your address. Incorrect addresses may result in lost funds.</p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[#0f172a] text-[12px] font-bold">Withdrawal Amount *</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-[#8b5cf6] font-bold text-[14px]">$</span>
                  <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-white border border-gray-200 rounded-[10px] pl-8 pr-16 py-2.5 text-[14px] font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  />
                  <button 
                    onClick={() => setAmount(totalBalance.toString())}
                    className="absolute right-2 bg-[#8b5cf6] text-white text-[10px] font-bold px-2.5 py-1 rounded-sm hover:bg-purple-600 transition-colors"
                  >
                    MAX
                  </button>
                </div>
                <p className="text-gray-500 text-[10px]">Min: ${minWithdrawal.toFixed(2)} - Max: ${maxWithdrawal.toFixed(2)}</p>
              </div>

              <div className="bg-[#fffbeb] border border-[#fde68a] rounded-[10px] p-3 space-y-2">
                <div className="flex justify-between items-center text-[12px] text-[#b45309]">
                  <span>Charge ({withdrawalCharge.toFixed(2)}%)</span>
                  <span className="font-medium text-red-500">-${feeAmount.toFixed(2)}</span>
                </div>
                <div className="w-full border-t border-dashed border-[#fde68a]"></div>
                <div className="flex justify-between items-center text-[12px] font-bold text-[#92400e]">
                  <span>You will receive</span>
                  <span>${amount ? (Number(amount) - feeAmount).toFixed(2) : "0.00"}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[#0f172a] text-[12px] font-bold">Withdrawal Password *</label>
                <input 
                  type="password"
                  value={withdrawalPassword}
                  onChange={(e) => setWithdrawalPassword(e.target.value)}
                  placeholder="Enter your login password"
                  className="w-full bg-white border border-gray-200 rounded-[10px] px-3.5 py-2.5 text-[13px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 pb-12 sm:pb-4 border-t border-gray-100 shrink-0">
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
