"use client";

import { useState } from "react";
import { Wallet, Eye, EyeOff, ChevronDown, ChevronUp, Download, Upload, Clock, ArrowRight, Receipt, Loader2, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFetchData } from "@/hooks/useApi";
import { format } from "date-fns";
import { toast } from "react-hot-toast";

export default function WalletPage() {
  const [currency, setCurrency] = useState("USDT");
  const [showBalance, setShowBalance] = useState(true);
  const router = useRouter();

  const toggleCurrency = () => {
    setCurrency(prev => prev === "USDT" ? "NGN" : "USDT");
  };

  const { data: userRes, isLoading: loadingUser } = useFetchData("/users/me", ["user"]);
  const { data: txRes, isLoading: loadingTx } = useFetchData("/users/transactions", ["transactions"]);

  const user = userRes?.user || {};
  const transactions = txRes?.transactions || [];

  const mainBalance = Number(user.balance || 0);
  const giftBalance = Number(user.gift_balance || 0);
  const totalBalance = mainBalance + giftBalance;

  // Assuming a static exchange rate for now
  const EXCHANGE_RATE = 1400;

  const formatMoney = (amount, curr) => {
    if (curr === "USDT") {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    } else {
      return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount * EXCHANGE_RATE);
    }
  };

  const currentBalance = {
    total: formatMoney(totalBalance, currency),
    main: formatMoney(mainBalance, currency),
    gift: formatMoney(giftBalance, currency)
  };

  const handleAction = (actionPath) => {
    if (user && !user.email_verified) {
      toast.error("Please verify your email to perform this action");
      router.push("/dashboard/settings/auth");
      return;
    }
    router.push(actionPath);
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] overflow-y-auto  [&::-webkit-scrollbar]:hidden">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 flex justify-between items-center shadow-sm z-10 sticky top-0 border-b border-gray-100">
        <h1 className="text-[#1e3a8a] text-[15px] font-bold">Wallet</h1>
        <Link href="/dashboard/wallet" className="w-8 h-8 bg-[#4082F6] rounded-xl flex items-center justify-center text-white hover:bg-blue-600 transition-colors shadow-sm">
          <Wallet size={14} />
        </Link>
      </div>

      <div className="px-4 pt-4 pb-4 space-y-3 max-w-[480px] mx-auto w-full">
        {/* Balance Card */}
        <div className="bg-[#4082F6] rounded-[16px] p-[16px] text-white shadow-[0_4px_14px_rgba(59,130,246,0.3)] relative overflow-hidden">
          {/* Top section */}
          <div className="flex justify-between items-start mb-1">
            <span className="text-[10px] text-white/90">Available Balance</span>
            <button
              onClick={toggleCurrency}
              className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded text-[9px] font-bold hover:bg-white/30 transition-colors"
            >
              {currency} {currency === "USDT" ? <ChevronDown size={10} /> : <ChevronUp size={10} />}
            </button>
          </div>

          {/* Main Balance */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[24px] font-bold tracking-tight">
              {loadingUser ? <Loader2 className="w-5 h-5 animate-spin" /> : showBalance ? currentBalance.total : "****"}
            </span>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="text-white/80 hover:text-white transition-colors p-1"
            >
              {showBalance ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
          </div>

          {/* Sub Balances */}
          <div className="flex gap-2.5 mb-3.5">
            <div className="bg-white/20 rounded-lg p-2 flex-1 border border-white/5">
              <div className="text-[7px] font-bold text-white/80 uppercase tracking-wide mb-1">Main Balance</div>
              <div className="text-[12px] font-bold">{loadingUser ? "..." : showBalance ? currentBalance.main : "****"}</div>
            </div>
            <div className="bg-white/20 rounded-lg p-2 flex-1 border border-white/5">
              <div className="text-[7px] font-bold text-white/80 uppercase tracking-wide mb-1">Gift Balance</div>
              <div className="text-[12px] font-bold">{loadingUser ? "..." : showBalance ? currentBalance.gift : "****"}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2.5">
            <button 
              onClick={() => handleAction("/dashboard/wallet/deposit")}
              className="flex-1 bg-white text-[#1e3a8a] flex items-center justify-center gap-1.5 py-2 rounded-[8px] text-[11px] font-bold hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Download size={12} /> Deposit
            </button>
            <button 
              onClick={() => handleAction("/dashboard/wallet/withdraw")}
              className="flex-1 bg-white/20 text-white flex items-center justify-center gap-1.5 py-2 rounded-[8px] text-[11px] font-bold hover:bg-white/30 transition-colors border border-white/10"
            >
              <Upload size={12} /> Withdraw
            </button>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-[16px] p-[16px] border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] min-h-[180px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-[#3b82f6]" />
              <h2 className="text-[#0f172a] font-bold text-[13px]">Recent Transactions</h2>
            </div>
            <Link href="/dashboard/transactions" className="flex items-center gap-1 text-[#3b82f6] text-[10px] font-medium hover:text-blue-700 transition-colors">
              View All <ArrowRight size={10} />
            </Link>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-2 min-h-[100px]">
            {loadingTx ? (
               <Loader2 className="w-5 h-5 animate-spin text-[#cbd5e1]" />
            ) : transactions.length > 0 ? (
               <div className="w-full space-y-3">
                 {transactions.slice(0, 10).map((tx) => (
                   <div key={tx.id} className="flex justify-between items-center bg-[#f8f9fa] rounded-xl p-3 border border-gray-100">
                     <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === 'DEPOSIT' ? 'bg-green-100 text-green-600' : tx.type === 'WITHDRAWAL' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                          {tx.type === 'DEPOSIT' ? <ArrowDownLeft size={14} /> : tx.type === 'WITHDRAWAL' ? <ArrowUpRight size={14} /> : <Receipt size={14} />}
                        </div>
                        <div>
                          <div className="text-[12px] font-bold text-gray-800 capitalize">{tx.type.replace('_', ' ').toLowerCase()}</div>
                          <div className="text-[9px] text-gray-400">{format(new Date(tx.created_at), 'MMM dd, yyyy HH:mm')}</div>
                        </div>
                     </div>
                     <div className="text-right">
                        <div className={`text-[13px] font-bold ${tx.type === 'DEPOSIT' || tx.type.includes('reward') ? 'text-green-500' : 'text-red-500'}`}>
                          {tx.type === 'DEPOSIT' || tx.type.includes('reward') ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                        </div>
                     </div>
                   </div>
                 ))}
               </div>
            ) : (
               <>
                 <div className="w-10 h-10 bg-[#f1f5f9] rounded-xl flex items-center justify-center border border-gray-100 shadow-sm">
                   <Receipt size={18} className="text-[#cbd5e1]" />
                 </div>
                 <span className="text-[11px] text-[#94a3b8] font-medium">No transactions yet</span>
               </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
