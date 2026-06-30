"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Wallet, Info, ChevronDown, CheckCircle2, ChevronRight, Download, X } from "lucide-react";
import { useFetchData, usePost } from "@/hooks/useApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

function DepositContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cryptoId = searchParams.get("cryptoId");
  
  const [amount, setAmount] = useState("");
  
  const { data: cryptosRes, isLoading: isLoadingCryptos } = useFetchData("/settings/payout-cryptos", ["payout-cryptos"]);
  const cryptos = cryptosRes?.data || [];
  
  const { data: settingsRes, isLoading: isLoadingSettings } = useFetchData("/settings", ["platform-settings"]);
  const settings = settingsRes?.settings || {};

  const selectedCrypto = cryptos.find(c => c.id === cryptoId);

  // If cryptos loaded and no crypto matched, show error or redirect
  useEffect(() => {
    if (!isLoadingCryptos && (!cryptoId || !selectedCrypto)) {
      // Just to be safe, show the modal again if they somehow land here without a crypto
      router.replace("?depositModal=true");
    }
  }, [isLoadingCryptos, cryptoId, selectedCrypto, router]);

  const presetAmounts = [10, 50, 100, 500];
  
  const handleAmountSelect = (val) => {
    setAmount(val.toString());
  };

  const getEstimatedCrypto = () => {
    if (!amount || isNaN(amount) || !selectedCrypto) return "0.00";
    const charge = Number(settings?.deposit_charge || 0);
    if (charge > 0) {
      const fee = Number(amount) * (charge / 100);
      return (Number(amount) - fee).toFixed(2);
    }
    return Number(amount).toFixed(2);
  };

  const { mutate: submitDeposit, isPending } = usePost("/users/deposit");

  const handleProceed = () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return toast.error("Please enter a valid deposit amount");
    }
    const minDep = Number(settings?.min_deposit || 10);
    const maxDep = Number(settings?.max_deposit || 100000);

    if (selectedCrypto && (Number(amount) < minDep || Number(amount) > maxDep)) {
      return toast.error(`Amount must be between ${settings.currency_symbol || "$"}${minDep} and ${settings.currency_symbol || "$"}${maxDep}`);
    }

    submitDeposit(
      { amount: Number(amount), cryptoId: selectedCrypto.id },
      {
        onSuccess: (res) => {
          if (res.payment_url && res.payment_url.startsWith('http')) {
            toast.success(res.message || "Redirecting to payment...");
            setTimeout(() => {
              window.location.href = res.payment_url;
            }, 1500);
          } else {
            toast.success(res.message || "Deposit initiated successfully");
            setTimeout(() => {
              router.push("/dashboard/wallet");
            }, 1500);
          }
        },
        onError: (err) => {
          toast.error(err.message || "Failed to initiate deposit");
        }
      }
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] overflow-y-auto [&::-webkit-scrollbar]:hidden relative">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-center sticky top-0 z-20 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border-b border-gray-100">
        <button
          onClick={() => router.back()}
          className="absolute left-4 w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-xl flex items-center justify-center transition-colors text-gray-600 shadow-sm border border-gray-100 cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <h1 className="text-[#4c1d95] text-[16px] font-bold">Deposit</h1>
      </div>

      <div className="px-4 py-5 max-w-[480px] mx-auto w-full space-y-4 pb-[80px]">
        {isLoadingCryptos || isLoadingSettings || !selectedCrypto ? (
           <div className="flex justify-center py-20">
             <Loader2 className="animate-spin text-purple-500" size={32} />
           </div>
        ) : (
          <>
            {/* Selected Crypto Card */}
            <div className="bg-[#eef2ff] border border-purple-100 rounded-[12px] p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-[10px] flex items-center justify-center shadow-sm overflow-hidden border border-purple-50">
                   {selectedCrypto.icon ? (
                    <Image src={selectedCrypto.icon} alt={selectedCrypto.name} width={40} height={40} className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#8b5cf6] flex items-center justify-center text-white font-bold">
                      {selectedCrypto.symbol.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-[#4c1d95] uppercase flex items-center gap-2">
                    {selectedCrypto.name} 
                    <span className="text-[10px] px-1.5 py-0.5 bg-purple-100 text-purple-600 rounded-md font-medium tracking-wide">
                      {selectedCrypto.network}
                    </span>
                  </h3>
                  <p className="text-[12px] text-gray-500">Limits: {settings.currency_symbol || "$"}{settings?.min_deposit || 10} - {settings.currency_symbol || "$"}{settings?.max_deposit || 100000}</p>
                </div>
              </div>
              <button 
                onClick={() => router.replace("?depositModal=true")}
                className="bg-white text-purple-500 font-semibold text-[13px] px-4 py-2 rounded-[8px] border border-purple-100 hover:bg-purple-50 transition-colors shadow-sm"
              >
                Change
              </button>
            </div>

            {/* Deposit Amount Section */}
            <div className="bg-white border border-gray-100 rounded-[12px] p-5 shadow-sm space-y-5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-purple-50 rounded-full flex items-center justify-center text-purple-500 font-bold text-[14px]">{settings.currency_symbol || "$"}</div>
                <h3 className="font-bold text-[#4c1d95]">Deposit Amount</h3>
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 font-bold text-[20px]">{settings.currency_symbol || "$"}</div>
                <input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full h-[60px] bg-gray-50 border border-gray-100 rounded-[12px] pl-10 pr-4 text-[24px] font-bold text-gray-800 focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-purple-100 transition-all placeholder:text-gray-300"
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                {presetAmounts.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => handleAmountSelect(preset)}
                    className={`h-[40px] rounded-[8px] font-semibold text-[14px] transition-colors border ${
                      amount === preset.toString() 
                        ? 'bg-purple-50 border-blue-200 text-purple-600' 
                        : 'bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {settings.currency_symbol || "$"}{preset}
                  </button>
                ))}
              </div>

              <div className="bg-[#10b981] rounded-[12px] p-4 text-white flex items-center justify-between shadow-[0_4px_12px_-4px_rgba(16,185,129,0.5)]">
                <div>
                  <p className="text-[12px] font-medium text-white/80">You will receive</p>
                  <p className="text-[24px] font-bold">{settings.currency_symbol || "$"}{getEstimatedCrypto()}</p>
                </div>
                <div className="text-[11px] font-medium text-white/90 text-right">
                  <div>Rate: 1 {settings.currency_symbol || "$"} = 1 {selectedCrypto.symbol.toUpperCase()}</div>
                  {Number(settings?.deposit_charge || 0) > 0 && (
                    <div className="mt-0.5">Fee: {settings.deposit_charge}%</div>
                  )}
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="bg-[#eef2ff] border border-purple-100 rounded-[12px] p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[#4c1d95] mb-2">
                <Info size={18} />
                <h3 className="font-bold">Important Information</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#8b5cf6] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</div>
                  <p className="text-[13px] text-gray-600">Enter amount ({settings.currency_symbol || "$"}{settings?.min_deposit || 10} - {settings.currency_symbol || "$"}{settings?.max_deposit || 100000})</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#8b5cf6] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</div>
                  <p className="text-[13px] text-gray-600">You will be redirected to payment page</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#8b5cf6] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</div>
                  <p className="text-[13px] text-gray-600">Confirmation takes 5-30 minutes</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#8b5cf6] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">4</div>
                  <p className="text-[13px] text-gray-600">Funds credited automatically</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleProceed}
              disabled={isPending || !amount}
              className="w-full bg-[#8b5cf6] hover:bg-[#8b5cf6] text-white py-4 rounded-[12px] font-bold text-[16px] transition-all shadow-[0_4px_12px_-4px_rgba(37,99,235,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 cursor-pointer"
            >
              {isPending ? <Loader2 className="animate-spin" size={20} /> : <Wallet size={20} />}
              Proceed to Payment
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function DepositPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-purple-500" size={32} />
      </div>
    }>
      <DepositContent />
    </Suspense>
  );
}
