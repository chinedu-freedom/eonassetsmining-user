"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Wallet, Info, CheckCircle2, ChevronRight, Download, X, Copy, Check } from "lucide-react";
import { useFetchData, usePost } from "@/hooks/useApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

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

function DepositContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cryptoId = searchParams.get("cryptoId");
  
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [paymentAddress, setPaymentAddress] = useState("");
  const [trackId, setTrackId] = useState(null);
  const [copied, setCopied] = useState(false);

  const { data: cryptosRes, isLoading: isLoadingCryptos } = useFetchData("/settings/payout-cryptos", ["payout-cryptos"]);
  const cryptos = cryptosRes?.data || [];
  
  const { data: settingsRes, isLoading: isLoadingSettings } = useFetchData("/settings", ["platform-settings"]);
  const settings = settingsRes?.settings || {};

  const selectedCrypto = cryptos.find(c => c.id === cryptoId);

  // If cryptos loaded and no crypto matched, show error or redirect
  useEffect(() => {
    if (!isLoadingCryptos && (!cryptoId || !selectedCrypto)) {
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
          setPaymentAddress(res.address);
          setTrackId(res.trackId || null);
          setStep(2);
        }
      }
    );
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(paymentAddress).then(() => {
      setCopied(true);
      toast.success("Address copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      toast.error("Failed to copy address. Please copy manually.");
    });
  };



  return (
    <div className="flex flex-col h-full bg-transparent overflow-y-auto [&::-webkit-scrollbar]:hidden relative">
      {/* Header */}
      <div className="bg-[#131F37] px-4 py-4 flex items-center justify-center sticky top-0 z-20 shadow-sm border-b border-white/5">
        <button
          onClick={() => {
            if (step === 2) {
              setStep(1);
            } else {
              router.back();
            }
          }}
          className="absolute left-4 w-8 h-8 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-colors text-gray-300 shadow-sm border border-gray-100 cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <h1 className="text-white/90 text-[16px] font-bold">
          {step === 1 ? "Deposit" : "Complete Payment"}
        </h1>
      </div>

      <div className="px-4 py-5 max-w-[480px] mx-auto w-full space-y-4 pb-[80px]">
        {isLoadingCryptos || isLoadingSettings || !selectedCrypto ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-purple-500" size={32} />
          </div>
        ) : step === 1 ? (
          <>
            {/* Selected Crypto Card */}
            <div className="bg-[#131F37] border border-white/5 rounded-[10px] p-3 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 bg-white/5 rounded-[8px] flex items-center justify-center shadow-sm overflow-hidden border border-white/5 shrink-0">
                  {selectedCrypto.icon ? (
                    <Image src={selectedCrypto.icon} alt={selectedCrypto.name} width={32} height={32} className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#8b5cf6] flex items-center justify-center text-white font-bold text-sm">
                      {selectedCrypto.symbol.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-[13px] text-white/90 uppercase flex items-center gap-1.5">
                    {selectedCrypto.name} 
                    <span className="text-[8.5px] px-1.5 py-0.5 bg-purple-100 text-purple-600 rounded-md font-medium tracking-wide">
                      {selectedCrypto.symbol}-{selectedCrypto.network}
                    </span>
                  </h3>
                  <p className="text-[11px] text-gray-400">Limits: {settings.currency_symbol || "$"}{settings?.min_deposit || 10} - {settings.currency_symbol || "$"}{settings?.max_deposit || 100000}</p>
                </div>
              </div>
              <button 
                onClick={() => router.replace("?depositModal=true")}
                className="bg-[#8b5cf6] text-white font-semibold text-[11.5px] px-3 py-1.5 rounded-[6px] border border-[#8b5cf6] hover:bg-purple-600 transition-colors shadow-sm cursor-pointer"
              >
                Change
              </button>
            </div>

            {/* Deposit Amount Section */}
            <div className="bg-[#131F37] border border-white/5 rounded-[10px] p-4 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-white/5 rounded-full flex items-center justify-center text-purple-500 font-bold text-[12px]">{settings.currency_symbol || "$"}</div>
                <h3 className="font-bold text-[13px] text-white/90">Deposit Amount</h3>
              </div>

              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500 font-bold text-[16px]">{settings.currency_symbol || "$"}</div>
                <input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full h-[45px] bg-[#0b1426] border border-white/10 rounded-[8px] pl-8 pr-4 text-[18px] font-bold text-white/90 focus:outline-none focus:border-purple-300 focus:ring-1 focus:ring-purple-100 transition-all placeholder:text-gray-500"
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                {presetAmounts.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => handleAmountSelect(preset)}
                    className={`h-[32px] rounded-[6px] font-semibold text-[12px] transition-colors border cursor-pointer ${
                      amount === preset.toString() 
                        ? 'bg-white/5 border-white/10 text-white' 
                        : 'bg-[#131F37] border-white/5 text-gray-400 hover:bg-white/5'
                    }`}
                  >
                    {settings.currency_symbol || "$"}{preset}
                  </button>
                ))}
              </div>

              <div className="bg-[#10b981] rounded-[10px] p-3 text-white flex items-center justify-between shadow-[0_4px_12px_-4px_rgba(16,185,129,0.5)]">
                <div>
                  <p className="text-[11px] font-medium text-white/80">You will receive</p>
                  <p className="text-[18px] font-bold">{settings.currency_symbol || "$"}{getEstimatedCrypto()}</p>
                </div>
                <div className="text-[9.5px] font-medium text-white/90 text-right leading-tight">
                  <div>Rate: 1 {settings.currency_symbol || "$"} = 1 {selectedCrypto.symbol.toUpperCase()}</div>
                  {Number(settings?.deposit_charge || 0) > 0 && (
                    <div className="mt-0.5">Fee: {settings.deposit_charge}%</div>
                  )}
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="bg-white/5 border border-white/5 rounded-[16px] p-5 shadow-sm space-y-3.5">
              <div className="flex items-center gap-2.5 text-white/90">
                <Info size={19} className="text-[#8b5cf6]" />
                <h3 className="font-bold text-[15px]">Important Information</h3>
              </div>
              
              <div className="text-[13px] text-gray-300 leading-normal">
                {settings.deposit_notice && parseNoticeToLines(settings.deposit_notice).length > 0 ? (
                  <div className="space-y-1">
                    {parseNoticeToLines(settings.deposit_notice).map((line, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-[#8b5cf6] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <p className="leading-normal font-medium text-gray-300 mt-0.5" dangerouslySetInnerHTML={{ __html: line }} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#8b5cf6] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</div>
                      <p className="leading-normal font-medium">Enter amount ({settings.currency_symbol || "$"}{settings?.min_deposit || 10} - {settings.currency_symbol || "$"}{settings?.max_deposit || 100000})</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#8b5cf6] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</div>
                      <p className="leading-normal font-medium">You will get the deposit details immediately</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#8b5cf6] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</div>
                      <p className="leading-normal font-medium">Confirmation takes 5-30 minutes</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#8b5cf6] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">4</div>
                      <p className="leading-normal font-medium">Funds credited automatically upon blockchain receipt</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleProceed}
              disabled={isPending || !amount}
              className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white py-2.5 rounded-[8px] font-bold text-[13px] transition-all shadow-[0_4px_12px_-4px_rgba(139,92,246,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              {isPending ? <Loader2 className="animate-spin" size={16} /> : <Wallet size={16} />}
              Proceed to Payment
            </button>
          </>
        ) : (
          <>
            {/* Step 2 Payment Details */}
            <div className="bg-[#131F37] border border-white/5 rounded-[10px] p-4 shadow-sm space-y-4">
              <div className="text-center space-y-0.5">
                <p className="text-[11px] text-gray-400 font-medium">Send exactly</p>
                <p className="text-[20px] font-bold text-white/90">
                  {settings.currency_symbol || "$"}{Number(amount).toFixed(2)}
                </p>
                <p className="text-[9.5px] text-purple-600 font-semibold bg-white/5 inline-block px-2 py-0.5 rounded-full uppercase tracking-wider mt-0.5">
                  On {selectedCrypto.network} network
                </p>
              </div>

              {/* QR Code */}
              <div className="flex justify-center py-1">
                <div className="w-[130px] h-[130px] bg-[#131F37] border border-white/5 p-1.5 rounded-xl shadow-inner flex items-center justify-center">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(paymentAddress)}&margin=6&color=4c1d95&bgcolor=ffffff`}
                    alt="Payment QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Payment Address */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Deposit Address</label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-[#0b1426] border border-white/10 rounded-lg px-2.5 py-2 text-[10px] font-mono text-gray-300 break-all select-all flex items-center leading-normal">
                    {paymentAddress}
                  </div>
                  <button
                    onClick={handleCopyAddress}
                    className={`px-2.5 rounded-lg border font-semibold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-all ${
                      copied
                        ? "bg-green-500 border-green-500 text-white"
                        : "bg-white/5 border-white/10 text-purple-400 hover:bg-white/10"
                    }`}
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Warning Banner */}
              <div className="bg-amber-900/20 border border-amber-500/20 rounded-[10px] p-3 flex gap-2 items-start">
                <Info className="text-amber-500 shrink-0 mt-0.5" size={14} />
                <p className="text-[10px] text-amber-200 leading-relaxed">
                  Only send <strong>{selectedCrypto.symbol.toUpperCase()}</strong> on the <strong>{selectedCrypto.network}</strong> network to this address. Sending other assets or using the wrong network will result in permanent loss.
                </p>
              </div>

            </div>

            {/* Waiting for Payment Notification */}
            <div className="bg-[#131F37] border border-white/5 rounded-[10px] p-4 shadow-sm flex flex-col items-center justify-center space-y-3">
              <Loader2 className="animate-spin text-purple-500" size={28} />
              <div className="text-center">
                <h4 className="text-[13px] font-bold text-white/90">Awaiting Payment</h4>
                <p className="text-[11px] text-gray-400">Your balance will be credited automatically once the network confirms your transaction. You can safely leave this page.</p>
              </div>
            </div>
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
