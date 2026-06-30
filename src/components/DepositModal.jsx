"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useFetchData } from "@/hooks/useApi";
import { Loader2, X, Hexagon, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function DepositModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const isVisible = searchParams.get('depositModal') === 'true';

  const { data: cryptosRes, isLoading: isLoadingCryptos } = useFetchData(
    "/settings/payout-cryptos",
    ["payout-cryptos"],
    isVisible // Only fetch when modal is visible
  );
  const cryptos = cryptosRes?.data || [];

  const { data: settingsRes, isLoading: isLoadingSettings } = useFetchData(
    "/settings",
    ["platform-settings"],
    isVisible
  );
  const settings = settingsRes?.settings || {};

  const handleClose = () => {
    // Remove depositModal from URL
    const params = new URLSearchParams(searchParams);
    params.delete('depositModal');
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSelectCrypto = (crypto) => {
    handleClose();
    setTimeout(() => {
      router.push(`/dashboard/wallet/deposit?cryptoId=${crypto.id}`);
    }, 100); // Wait a bit for modal to close smoothly
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in cursor-pointer"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-t-[24px] sm:rounded-[20px] w-full max-w-[450px] overflow-hidden shadow-2xl animate-slide-up flex flex-col max-h-[85vh] mt-auto sm:mt-0 cursor-pointer"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10 shrink-0">
          <div>
            <h3 className="font-bold text-[18px] text-gray-800">Deposit Method</h3>
            <p className="text-[13px] text-gray-500">Select cryptocurrency</p>
          </div>
          <button 
            onClick={handleClose}
            className="w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors text-gray-500 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto overflow-x-hidden flex-1 space-y-3 pb-[80px] sm:pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {isLoadingCryptos || isLoadingSettings ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-3">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
              <p className="text-sm text-gray-500">Loading methods...</p>
            </div>
          ) : cryptos.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No deposit methods available.
            </div>
          ) : (
            cryptos.map((crypto) => (
              <div 
                key={crypto.id}
                onClick={() => handleSelectCrypto(crypto)}
                className="p-4 rounded-[16px] border border-gray-100 bg-white hover:bg-gray-50 shadow-sm cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  {/* Square shape maintained per user request */}
                  <div className="w-12 h-12 bg-gray-50 group-hover:bg-white rounded-[12px] flex items-center justify-center border border-gray-100 shrink-0 overflow-hidden shadow-inner">
                    {crypto.icon ? (
                      <Image src={crypto.icon} alt={crypto.name} width={48} height={48} className="object-cover" />
                    ) : (
                      <Hexagon className="text-gray-400" size={24} />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 uppercase flex items-center gap-2">
                      {crypto.name}
                      <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full font-medium tracking-wide">
                        {crypto.network}
                      </span>
                    </h4>
                    <p className="text-[12px] text-gray-500 mt-0.5">
                      Limit: {settings?.currency_symbol || "$"}{settings?.min_deposit || 10} - {settings?.currency_symbol || "$"}{settings?.max_deposit || 100000}
                    </p>
                  </div>
                </div>
                
                <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors border-gray-200 group-hover:border-blue-300">
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
