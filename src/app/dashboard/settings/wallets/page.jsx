"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Plus, Trash2, Wallet, Info, Lock, Eye, EyeOff } from "lucide-react";
import { useFetchData, usePost, useDelete } from "@/hooks/useApi";
import { toast } from "sonner";

export default function LinkedWalletsPage() {
  const router = useRouter();
  const [selectedCryptoId, setSelectedCryptoId] = useState("");
  const [address, setAddress] = useState("");
  const [label, setLabel] = useState("");
  const [isLinking, setIsLinking] = useState(false);

  // Password confirmation states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [withdrawalPassword, setWithdrawalPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Fetch linked wallets
  const { data: walletsRes, isLoading: isLoadingWallets, refetch } = useFetchData("/wallets", ["user-wallets"]);
  const wallets = walletsRes?.wallets || [];

  // Fetch active payout cryptos to choose from
  const { data: cryptosRes, isLoading: isLoadingCryptos } = useFetchData("/settings/payout-cryptos", ["payout-cryptos"]);
  const cryptos = Array.isArray(cryptosRes) ? cryptosRes : cryptosRes?.data || [];

  const linkWalletMutation = usePost("/wallets", ["user-wallets"]);
  const unlinkWalletMutation = useDelete((id) => `/wallets/${id}`, "user-wallets");

  const selectedCrypto = cryptos.find(c => c.id === selectedCryptoId);

  const handleOpenConfirm = (e) => {
    e.preventDefault();
    if (!selectedCryptoId || !address.trim()) {
      toast.error("Please select a coin and enter a valid address");
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmLink = async () => {
    if (!withdrawalPassword) {
      toast.error("Please enter your withdrawal password");
      return;
    }

    setIsLinking(true);
    try {
      const res = await linkWalletMutation.mutateAsync({
        symbol: selectedCrypto.symbol,
        network: selectedCrypto.network,
        address: address.trim(),
        label: label.trim() || undefined,
        withdrawalPassword: withdrawalPassword
      });
      if (res?.success) {
        toast.success(res.message || "Wallet address linked successfully!");
        setAddress("");
        setLabel("");
        setSelectedCryptoId("");
        setWithdrawalPassword("");
        setShowConfirmModal(false);
        refetch();
      } else {
        toast.error(res?.error || "Failed to link address");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || error?.message || "Failed to link address");
    } finally {
      setIsLinking(false);
    }
  };

  const handleUnlink = async (id) => {
    try {
      await unlinkWalletMutation.mutateAsync(id);
      toast.success("Wallet address unlinked!");
      refetch();
    } catch (error) {
      toast.error("Failed to delete address");
    }
  };

  const isLoading = isLoadingWallets || isLoadingCryptos;

  return (
    <div className="flex flex-col h-full bg-transparent overflow-y-auto [&::-webkit-scrollbar]:hidden">
      {/* Header */}
      <div className="bg-[#111827] px-4 py-3.5 flex items-center sticky top-0 z-20 shadow-sm border-b border-white/5">
        <button 
          onClick={() => router.push('/dashboard/settings')}
          className="mr-3 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <h1 className="text-white/90 text-[15px] font-bold">Linked Wallet Addresses</h1>
      </div>

      <div className="px-4 py-4 max-w-[480px] mx-auto w-full space-y-5">
        {/* Important Info Alert */}
        <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3 flex gap-3 text-xs leading-normal">
          <Info size={18} className="text-amber-500 shrink-0" />
          <p className="text-gray-400">
            Adding wallet addresses here will automatically suggest and autofill them during withdrawal requests, eliminating manual entry mistakes.
          </p>
        </div>

        {/* Link Wallet Form */}
        <div className="bg-[#111827] rounded-[16px] border border-white/5 p-4 space-y-4">
          <h3 className="text-white/90 text-sm font-bold flex items-center gap-2">
            <Plus size={16} className="text-[#f59e0b]" /> Link New Wallet Address
          </h3>

          <form onSubmit={handleOpenConfirm} className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-gray-400 text-[11px] font-semibold uppercase">Select Cryptocurrency</label>
              <select
                value={selectedCryptoId}
                onChange={(e) => setSelectedCryptoId(e.target.value)}
                className="w-full bg-[#0b0f19] border border-white/5 text-white/90 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b]"
              >
                <option value="">-- Choose Coin & Network --</option>
                {cryptos.map((coin) => (
                  <option key={coin.id} value={coin.id}>
                    {coin.name} ({coin.symbol}) • {coin.network}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-400 text-[11px] font-semibold uppercase">Wallet Address</label>
              <input
                type="text"
                placeholder="Paste your address here"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-[#0b0f19] border border-white/5 text-white/90 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] placeholder:text-gray-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-400 text-[11px] font-semibold uppercase">Label (Optional)</label>
              <input
                type="text"
                placeholder="e.g. My Trust Wallet, Binance"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full bg-[#0b0f19] border border-white/5 text-white/90 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] placeholder:text-gray-600"
              />
            </div>

            <button
              type="submit"
              disabled={isLinking || isLoading}
              className="w-full bg-[#f59e0b] text-white font-bold py-2.5 rounded-lg hover:bg-amber-600 transition-colors text-xs disabled:opacity-50 flex items-center justify-center cursor-pointer mt-2 shadow-md"
            >
              {isLinking ? <Loader2 className="w-4 h-4 animate-spin" /> : "Link Wallet Address"}
            </button>
          </form>
        </div>

        {/* Linked Wallets List */}
        <div className="space-y-3">
          <h3 className="text-white/90 text-sm font-bold">Your Linked Addresses</h3>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
              <Loader2 className="w-6 h-6 animate-spin text-[#f59e0b]" />
            </div>
          ) : wallets.length === 0 ? (
            <div className="bg-[#111827] rounded-[16px] border border-white/5 py-10 text-center text-gray-500 text-xs">
              No wallet addresses linked yet.
            </div>
          ) : (
            <div className="space-y-2.5">
              {wallets.map((wallet) => (
                <div 
                  key={wallet.id}
                  className="bg-[#111827] rounded-[16px] border border-white/5 p-3 flex justify-between items-center gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 text-[#f59e0b]">
                      <Wallet size={15} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-white/90 font-bold text-xs">{wallet.symbol}</span>
                        <span className="text-gray-400 text-[10px] bg-white/5 px-1.5 py-0.5 rounded uppercase tracking-wider">{wallet.network}</span>
                        {wallet.label && (
                          <span className="text-amber-500 text-[10px] italic">({wallet.label})</span>
                        )}
                      </div>
                      <p className="text-gray-500 text-[11px] font-mono truncate mt-0.5 max-w-[240px]">
                        {wallet.address}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleUnlink(wallet.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-white/5 rounded-[24px] w-full max-w-[360px] p-6 space-y-4 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Background decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#f59e0b]/5 rounded-full blur-3xl -z-10"></div>

            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center text-[#f59e0b]">
                <Lock size={20} />
              </div>
              <h3 className="text-white/90 text-sm font-bold">Verify Withdrawal Password</h3>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Please enter your withdrawal password to authorize and link this wallet address.
              </p>
            </div>

            <div className="space-y-1.5 relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={withdrawalPassword}
                onChange={(e) => setWithdrawalPassword(e.target.value)}
                className="w-full bg-[#0b0f19] border border-white/5 text-white/90 rounded-lg pl-3 pr-10 py-2.5 text-xs focus:outline-none focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b]"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowConfirmModal(false);
                  setWithdrawalPassword("");
                }}
                className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold py-2.5 rounded-lg transition-colors cursor-pointer border border-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLink}
                disabled={isLinking || !withdrawalPassword}
                className="flex-1 bg-[#f59e0b] hover:bg-amber-600 text-[#111827] text-xs font-bold py-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center"
              >
                {isLinking ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
