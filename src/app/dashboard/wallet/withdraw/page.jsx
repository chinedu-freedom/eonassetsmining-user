"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Wallet, Info, ChevronDown, Copy, Check, Loader2, Eye, EyeOff } from "lucide-react";
import { useFetchData, usePost } from "@/hooks/useApi";
import { toast } from "sonner";
import Link from "next/link";

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

function WithdrawContent() {
  const router = useRouter();
  
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [withdrawalPassword, setWithdrawalPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const { mutate: submitWithdrawal, isPending: isSubmitting } = usePost("/users/withdraw");
  
  const { data: userRes, isLoading: isLoadingUser } = useFetchData("/users/me", ["profile"]);
  const user = userRes?.user || {};
  
  const { data: settingsRes, isLoading: isLoadingSettings } = useFetchData("/settings", ["platform-settings"]);
  const settings = settingsRes?.settings || {};
  
  const { data: cryptosRes, isLoading: isLoadingCryptos } = useFetchData("/settings/payout-cryptos", ["payout-cryptos"]);
  const cryptos = cryptosRes?.data || [];

  const minWithdrawal = Number(settings.min_withdrawal) || 20;
  const maxWithdrawal = Number(settings.max_withdrawal) || 10000;
  const withdrawalCharge = Number(settings.withdrawal_charge) || 2;
  
  const mainBalance = Number(user.withdrawable_balance || 0);
  const totalBalance = mainBalance;
  const feeAmount = amount ? (Number(amount) * (withdrawalCharge / 100)) : 0;

  // Auto-select first crypto if available
  useEffect(() => {
    if (!isLoadingCryptos && !selectedCrypto && cryptos.length > 0) {
      setSelectedCrypto(cryptos[0]);
    }
  }, [isLoadingCryptos, cryptos, selectedCrypto]);

  // Click outside to close dropdown
  useEffect(() => {
    if (!isDropdownOpen) return;
    const closeDropdown = () => setIsDropdownOpen(false);
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, [isDropdownOpen]);

  const handleSelectCrypto = (crypto) => {
    setSelectedCrypto(crypto);
    setIsDropdownOpen(false);
  };

  const handlePasteAddress = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setWalletAddress(text);
      setCopied(true);
      toast.success("Address pasted from clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to read clipboard. Please paste manually.");
    }
  };

  const handleSubmit = () => {
    if (!selectedCrypto) {
      return toast.error("Please select a cryptocurrency network");
    }
    if (!walletAddress) {
      return toast.error("Please enter a wallet address");
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return toast.error("Please enter a valid withdrawal amount");
    }
    if (Number(amount) < minWithdrawal) {
      return toast.error(`Minimum withdrawal amount is ${settings.currency_symbol || "$"}${minWithdrawal}`);
    }
    if (Number(amount) > maxWithdrawal) {
      return toast.error(`Maximum withdrawal amount is ${settings.currency_symbol || "$"}${maxWithdrawal}`);
    }
    if (Number(amount) > totalBalance) {
      return toast.error("Insufficient balance");
    }
    if (!withdrawalPassword) {
      return toast.error("Please enter your withdrawal password");
    }

    submitWithdrawal({
      amount: Number(amount),
      network: `${selectedCrypto.symbol} (${selectedCrypto.network})`,
      wallet_address: walletAddress,
      password: withdrawalPassword,
      method: "crypto"
    }, {
      onSuccess: () => {
        setAmount("");
        setWalletAddress("");
        setWithdrawalPassword("");
        setShowPassword(false);
      }
    });
  };

  const customRules = settings.withdrawal_notice ? parseNoticeToLines(settings.withdrawal_notice) : [];

  return (
    <div className="flex flex-col h-full bg-transparent overflow-y-auto [&::-webkit-scrollbar]:hidden relative z-10">
      {/* Background Ambient Bubbles */}
      <div className="absolute top-[15%] left-[-40px] w-[180px] h-[180px] bg-amber-500/5 rounded-full blur-[80px] pointer-events-none z-0" />
      <div className="absolute bottom-[25%] right-[-40px] w-[180px] h-[180px] bg-amber-500/5 rounded-full blur-[80px] pointer-events-none z-0" />

      {/* Header */}
      <div className="bg-[#111827] px-4 py-4 flex items-center justify-center sticky top-0 z-20 shadow-sm border-b border-white/5 shrink-0">
        <button
          onClick={() => router.push("/dashboard")}
          className="absolute left-4 w-8 h-8 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-colors text-gray-300 border border-white/5 cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <h1 className="text-white/90 text-[16px] font-bold">Withdraw</h1>
      </div>

      <div className="px-4 py-6 max-w-[480px] mx-auto w-full space-y-6 pb-[100px] relative z-10 flex-1">
        
        {/* Back to Dashboard link */}
        <div className="pl-1">
          <Link 
            href="/dashboard"
            className="text-gray-400 hover:text-white text-[13px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
        </div>

        {/* Withdraw Funds Card */}
        <div className="bg-[#111827]/50 border border-white/5 rounded-[24px] p-6 shadow-xl space-y-5">
          <div className="text-center space-y-1">
            <h2 className="text-[22px] font-extrabold text-white">Withdraw Funds</h2>
            <p className="text-[12.5px] text-gray-400 leading-relaxed max-w-[320px] mx-auto">
              Transfer your funds securely From Main Balance to your external wallet.
            </p>
          </div>

          {/* Currency Selector */}
          <div className="space-y-2 relative">
            <label className="text-[13px] font-semibold text-white/80 block pl-1">Select Currency</label>
            
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(!isDropdownOpen);
              }}
              className="w-full h-[52px] bg-black/40 border border-white/10 rounded-[12px] px-4 flex items-center justify-between text-white/90 cursor-pointer hover:border-amber-500/30 transition-all"
            >
              <div className="flex items-center gap-3">
                {selectedCrypto ? (
                  <>
                    <div className="w-6 h-6 bg-white/5 rounded-full flex items-center justify-center overflow-hidden shrink-0 border border-white/5">
                      {selectedCrypto.icon ? (
                        <img src={selectedCrypto.icon} alt={selectedCrypto.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] font-bold text-[#f59e0b]">{selectedCrypto.symbol.charAt(0)}</span>
                      )}
                    </div>
                    <span className="font-bold text-[13.5px] uppercase text-white/90">
                      {selectedCrypto.name} <span className="text-[9.5px] text-gray-400 font-medium ml-1">({selectedCrypto.symbol.toUpperCase()}-{selectedCrypto.network})</span>
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-gray-400 font-medium text-[13.5px] flex items-center gap-1.5">
                      <span className="text-amber-500 font-bold text-[16px] font-sans">₮</span> Choose currency
                    </span>
                  </>
                )}
              </div>
              <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Custom Dropdown List */}
            {isDropdownOpen && (
              <div className="absolute top-[78px] left-0 right-0 bg-[#131926] border border-white/10 rounded-[12px] shadow-2xl z-50 max-h-[220px] overflow-y-auto [&::-webkit-scrollbar]:hidden py-1.5">
                {cryptos.length === 0 ? (
                  <div className="px-4 py-3 text-gray-400 text-sm">No payout options available</div>
                ) : (
                  cryptos.map((crypto) => (
                    <button
                      key={crypto.id}
                      type="button"
                      onClick={() => handleSelectCrypto(crypto)}
                      className={`w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-white/5 transition-colors cursor-pointer ${
                        selectedCrypto?.id === crypto.id ? "bg-white/5" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-white/5 rounded-full flex items-center justify-center overflow-hidden shrink-0 border border-white/5">
                          {crypto.icon ? (
                            <img src={crypto.icon} alt={crypto.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] font-bold text-[#f59e0b]">{crypto.symbol.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-[12.5px] text-white/90 uppercase">{crypto.name}</p>
                          <p className="text-[9.5px] text-gray-400">{crypto.symbol.toUpperCase()} - {crypto.network} network</p>
                        </div>
                      </div>
                      {selectedCrypto?.id === crypto.id && (
                        <Check size={14} className="text-[#f59e0b]" />
                      )}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Enter Amount */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[13px] font-semibold text-white/80 block">
                Enter Amount
              </label>
              <span className="text-[11.5px] text-gray-400 font-semibold">
                Available: {isLoadingUser ? "..." : `${settings.currency_symbol || "$"}${totalBalance.toFixed(2)}`}
              </span>
            </div>
            
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full h-[52px] bg-black/40 border border-white/10 rounded-[12px] px-4 text-[16px] font-bold text-white/90 focus:outline-none focus:border-amber-500/30 transition-all placeholder:text-gray-600"
              />
              <button
                type="button"
                onClick={() => setAmount(totalBalance.toString())}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-[#f59e0b] hover:bg-amber-600 text-black text-[10px] font-extrabold px-3 py-1.5 rounded-[8px] transition-colors cursor-pointer"
              >
                MAX
              </button>
            </div>
            
            <div className="flex justify-between items-center text-[11px] text-gray-400 font-medium px-1">
              <span>Estimated value: ${amount ? Number(amount).toFixed(2) : "0.00"} USD</span>
              {amount && (
                <span>Fee ({withdrawalCharge}%): -{settings.currency_symbol || "$"}{feeAmount.toFixed(2)}</span>
              )}
            </div>
          </div>

          {/* Wallet Address */}
          <div className="space-y-2">
            <label className="text-[13px] font-semibold text-white/80 block pl-1">Wallet Address</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="Paste your wallet address"
                className="flex-1 h-[52px] bg-black/40 border border-white/10 rounded-[12px] px-4 text-[14px] text-white/90 placeholder:text-gray-600 focus:outline-none focus:border-amber-500/30 transition-all"
              />
              <button
                type="button"
                onClick={handlePasteAddress}
                className={`w-[52px] h-[52px] rounded-[12px] border font-bold text-[12px] flex items-center justify-center cursor-pointer transition-all shrink-0 ${
                  copied
                    ? "bg-green-500 border-green-500 text-white"
                    : "bg-white/5 border-white/10 text-amber-500 hover:bg-white/10"
                }`}
                title="Paste from clipboard"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          {/* Withdrawal Password */}
          <div className="space-y-2">
            <label className="text-[13px] font-semibold text-white/80 block pl-1">Withdrawal Password</label>
            <div className="relative flex items-center">
              <input 
                type={showPassword ? "text" : "password"}
                value={withdrawalPassword}
                onChange={(e) => setWithdrawalPassword(e.target.value)}
                placeholder="Enter your withdrawal password"
                className="w-full h-[52px] bg-black/40 border border-white/10 rounded-[12px] pl-4 pr-12 text-[14px] text-white/90 placeholder:text-gray-600 focus:outline-none focus:border-amber-500/30 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-gray-500 hover:text-gray-300 focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !amount || !walletAddress || !selectedCrypto || !withdrawalPassword}
            className="w-full h-[52px] bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black py-2.5 rounded-[14px] font-bold text-[14.5px] transition-all shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:shadow-[0_0_25px_rgba(245,158,11,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin text-black" size={18} />
            ) : (
              "Continue"
            )}
          </button>
        </div>

        {/* Withdrawal Rules Card */}
        <div className="bg-[#111827]/50 border border-white/5 rounded-[24px] p-6 shadow-xl space-y-4">
          <h3 className="font-bold text-[14.5px] text-white/95 uppercase tracking-wider pl-1">Withdrawal Rules</h3>
          
          <ul className="space-y-3.5 text-[12px] text-gray-300 pl-1">
            {customRules.length > 0 ? (
              customRules.map((line, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-[#f59e0b] font-bold shrink-0 mt-0.5">•</span>
                  <p className="leading-relaxed font-medium text-gray-300" dangerouslySetInnerHTML={{ __html: line }} />
                </li>
              ))
            ) : (
              <>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#f59e0b] font-bold shrink-0 mt-0.5">▲</span>
                  <p className="leading-relaxed font-medium">Minimum withdrawal amount is ${minWithdrawal}</p>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#f59e0b] font-bold shrink-0 mt-0.5">▲</span>
                  <p className="leading-relaxed font-medium">Withdrawal requests may take several minutes to process</p>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#f59e0b] font-bold shrink-0 mt-0.5">▲</span>
                  <p className="leading-relaxed font-medium">Ensure the wallet address is correct before submitting</p>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#f59e0b] font-bold shrink-0 mt-0.5">▲</span>
                  <p className="leading-relaxed font-medium">Transactions cannot be reversed once processed</p>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#f59e0b] font-bold shrink-0 mt-0.5">▲</span>
                  <p className="leading-relaxed font-medium">Network fees may apply depending on the selected currency</p>
                </li>
              </>
            )}
          </ul>
        </div>

      </div>
    </div>
  );
}

export default function WithdrawPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-amber-500" size={32} />
      </div>
    }>
      <WithdrawContent />
    </Suspense>
  );
}
