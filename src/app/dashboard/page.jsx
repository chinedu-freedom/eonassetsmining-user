"use client";

import { useState, useEffect } from "react";
import { Globe, MessageCircle, Eye, EyeOff, Wallet, CreditCard, Volume2, HelpCircle, CheckSquare, Users, Loader, Loader2, Download, Gift, Calendar, Activity, ArrowDown, DollarSign, BadgeCheck, BarChart2, ChevronRight, X, Lock, Coins, Search, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFetchData } from "@/hooks/useApi";
import { fetchData } from "@/config/apiHelpers";
import { usePWA } from "@/components/PWAProvider";
import { toast } from "sonner";
import WhatsAppModal from "@/components/WhatsAppModal";
import { useSharedSettings } from "@/hooks/useSharedSettings";
const activities = [
  { type: "deposit", name: "", text: "deposited", amount: "+$1,910", iconBg: "bg-green-100", iconCol: "text-green-600", Icon: ArrowDown },
  { type: "profit", name: "henry***", text: "earned profit", amount: "+$138", iconBg: "bg-emerald-100", iconCol: "text-emerald-600", Icon: DollarSign },
  { type: "bonus", name: "nancy***", text: "claimed bonus", amount: "+$87", iconBg: "bg-orange-100", iconCol: "text-orange-500", Icon: Gift },
  { type: "deposit", name: "alex***", text: "deposited", amount: "+$500", iconBg: "bg-green-100", iconCol: "text-green-600", Icon: ArrowDown },
  { type: "profit", name: "mike***", text: "earned profit", amount: "+$42", iconBg: "bg-emerald-100", iconCol: "text-emerald-600", Icon: DollarSign },
];
const doubledActivities = [...activities, ...activities];



export default function DashboardPage() {
  const router = useRouter();
  const { isInstallable, installPWA } = usePWA();
  const { currency, setCurrency, showBalance, setShowBalance } = useSharedSettings();
  const [showToast, setShowToast] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [currentLang, setCurrentLang] = useState("EN");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: partnersResponse, isLoading: isLoadingPartners } = useFetchData("/partners", ["partners"]);
  const partnersData = partnersResponse?.partners || [];

  const { data: userProfileResponse, isLoading: isLoadingProfile } = useFetchData("/users/me", ["user-profile"]);
  const userProfile = userProfileResponse?.user;

  const { data: marketResponse, isLoading: isLoadingMarket } = useFetchData("/live-market", ["live-market"]);
  const marketData = marketResponse?.assets || [];
  const isMarketVisible = marketResponse?.isVisible ?? true;

  const { data: languagesResponse } = useFetchData("/auth/languages", ["languages"]);
  const dynamicLanguages = languagesResponse?.data || [];

  const { data: settingsResponse } = useFetchData("/settings", ["platform-settings"]);
  const settings = settingsResponse?.settings || {};
  const siteName = settings.site_name || "Polychainapp";
  const siteLogo = settings.platform_logo || null;

  const [liveExchangeRate, setLiveExchangeRate] = useState(null);
  const [liveMarketData, setLiveMarketData] = useState([]);

  useEffect(() => {
    if (marketData && marketData.length > 0) {
      setLiveMarketData(marketData);
      
      const fetchLivePrices = async () => {
        try {
          const promises = marketData.map(async (asset) => {
            // Only try to fetch if we have a valid symbol
            if (!asset.symbol) return null;
            
            try {
              // Use backend proxy to bypass browser CORS and network blocks
              const data = await fetchData(`/live-market/proxy?symbol=${asset.symbol.toUpperCase()}`);
              if (!data || data.error || !data.lastPrice) return null;
              
              return {
                symbol: asset.symbol,
                current_price: parseFloat(data.lastPrice),
                price_change_24h: parseFloat(data.priceChangePercent) * 100 // MEXC returns decimal, so multiply by 100
              };
            } catch (err) {
              return null; // Ignore failed requests for individual coins
            }
          });

          const results = await Promise.all(promises);
          
          setLiveMarketData(prev => prev.map(asset => {
            const liveInfo = results.find(r => r && r.symbol === asset.symbol);
            if (liveInfo) {
              return {
                ...asset,
                current_price: liveInfo.current_price,
                price_change_24h: liveInfo.price_change_24h
              };
            }
            return asset; // Fallback to DB data if API fails
          }));
        } catch (error) {
          console.error("Live price fetch failed:", error);
        }
      };

      // Fetch immediately, then every 10 seconds
      fetchLivePrices();
      const interval = setInterval(fetchLivePrices, 10000); 

      return () => clearInterval(interval);
    }
  }, [marketData]);

  const toggleCurrency = () => {
    if (!userProfile?.country) return;
    const localCurrency = userProfile.country.currency_code?.trim() ? userProfile.country.currency_code : "NGN";
    const baseCurrency = settings.currency_name || "USDT";
    setCurrency(prev => prev === baseCurrency ? localCurrency : baseCurrency);
  };

  useEffect(() => {
    if (userProfile?.language?.language_code) {
      setCurrentLang(userProfile.language.language_code);
    }
  }, [userProfile?.language]);

  // Fetch live exchange rate when user profile loads
  useEffect(() => {
    const fetchLiveRate = async () => {
      if (userProfile?.country) {
        const targetCurrency = userProfile.country.currency_code?.trim() ? userProfile.country.currency_code : "NGN";
        const baseCurrency = settings.currency_name || "USDT";
        if (targetCurrency !== baseCurrency && targetCurrency !== 'USD') {
          try {
            const res = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
            const data = await res.json();
            if (data && data.rates && data.rates[targetCurrency]) {
              setLiveExchangeRate(data.rates[targetCurrency]);
            }
          } catch (error) {
            console.error("Failed to fetch live exchange rate:", error);
          }
        }
      }
    };
    fetchLiveRate();
  }, [userProfile?.country, settings.currency_name]);

  // Convert balance based on selected currency
  const getDisplayBalance = () => {
    const baseSymbol = settings.currency_symbol || "$";
    if (!userProfile) return `${baseSymbol}0.00`;
    
    const balanceUSD = parseFloat(userProfile.balance || 0) + parseFloat(userProfile.withdrawable_balance || 0) + parseFloat(userProfile.gift_balance || 0);
    const baseCurrency = settings.currency_name || "USDT";
    
    if (currency === "USDT" || currency === baseCurrency) {
      return `${baseSymbol}${balanceUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      // Use live exchange rate if available, fallback to database static rate, then fallback to 1
      const exchangeRate = liveExchangeRate !== null ? liveExchangeRate : parseFloat(userProfile.country?.exchange_rate || 1);
      const localBalance = balanceUSD * exchangeRate;
      const symbol = userProfile.country?.currency_symbol || "";
      return `${symbol}${localBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  };

  const currentBalanceTotal = getDisplayBalance();

  return (
    <div className="flex flex-col h-full bg-transparent overflow-y-auto  [&::-webkit-scrollbar]:hidden">
      
      {/* Header */}
      <div className="bg-[#131F37] px-4 pt-4 pb-3 flex justify-between items-center rounded-b-[20px] shadow-sm z-10 relative">
        <div className="flex items-center gap-2">
          {siteLogo ? (
            <div className="w-9 h-9 rounded-full overflow-hidden shadow-sm flex items-center justify-center bg-white/5 border border-white/5">
              <img src={siteLogo} alt="Logo" className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="w-9 h-9 bg-purple-900/30 rounded-full flex items-center justify-center shadow-sm">
              <div className="text-white text-[9px] font-bold tracking-wider">
                {siteName.substring(0, 4).toUpperCase()}
              </div>
            </div>
          )}
          <span className="text-white/90 font-bold text-[15px]">{siteName}</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowLanguageModal(true)}
            className="flex items-center gap-1 bg-[#0b1426] border border-white/10 px-2.5 py-1 rounded-sm cursor-pointer text-[11px] font-bold text-white/90 shadow-sm hover:bg-white/5 transition-colors"
          >
            <Globe size={13} className="text-[#8b5cf6]" />
            {currentLang}
          </button>
          <button 
            onClick={() => router.push('/dashboard/help')}
            className="bg-white/5 p-1.5 rounded-full text-[#8b5cf6] hover:bg-[#ede9fe] transition-colors cursor-pointer"
          >
            <MessageCircle size={16} />
          </button>
        </div>
      </div>

      <div className="px-4 pt-4 pb-4 space-y-3">
        
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-[#4c1d95] to-[#0f172a] rounded-2xl p-[18px] text-white shadow-lg relative overflow-hidden border border-white/10">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
          
          <div className="flex justify-between items-start mb-2 relative z-10">
            <p className="text-white/80 text-[13px] font-medium">Total Balance</p>
            <button 
              onClick={toggleCurrency}
              className="bg-white/10 px-2 py-1 cursor-pointer rounded-md text-[11px] font-bold flex items-center gap-1 hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/10"
            >
              {currency === (settings.currency_name || "USDT") ? (settings.currency_name || "USDT") : (userProfile?.country?.currency_code || "NGN")} <span className="text-[7px] opacity-70 cursor-pointer">▼</span>
            </button>
          </div>
          
          <div className="flex items-center gap-2 mb-5 relative z-10">
            <h2 className="text-[28px] font-bold tracking-wider leading-none">
              {showBalance ? currentBalanceTotal : "****"}
            </h2>
            <button 
              onClick={() => setShowBalance(!showBalance)}
              className="text-white/60 hover:text-white transition-colors ml-1 cursor-pointer"
            >
              {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          <div className="flex gap-2.5 relative z-10">
            <Link href="?depositModal=true" className="flex-1 bg-[#8b5cf6] text-white py-2 rounded-lg text-[13px] font-semibold flex items-center justify-center gap-1.5 hover:bg-purple-600 transition-colors shadow-md cursor-pointer">
              <Wallet size={16} />
              Deposit
            </Link>
            <Link href="/dashboard/wallet/withdraw" className="flex-1 bg-white/10 text-white py-2 rounded-lg text-[13px] font-semibold flex items-center justify-center gap-1.5 hover:bg-white/20 transition-colors border border-white/15 backdrop-blur-sm cursor-pointer">
              <CreditCard size={16} />
              Withdraw
            </Link>
          </div>
        </div>

        {/* Marquee Banner */}
        <div className="bg-[#131F37] rounded-lg py-2 px-3 flex items-center gap-2 shadow-sm border border-white/5">
          <Volume2 className="text-[#8b5cf6] shrink-0" size={16} />
          <div className="overflow-hidden whitespace-nowrap w-full relative">
            <p className="text-[12px] text-gray-300 animate-[marquee_15s_linear_infinite] inline-block">
              Start mining today and grow your wealth with us. Welcome to {siteName}!
            </p>
          </div>
        </div>

        {/* Action Grid */}
        <div className="bg-[#131F37] rounded-[18px] p-4 shadow-sm border border-white/5">
          <div className="grid grid-cols-4 gap-y-5 gap-x-2">
            <div onClick={() => router.push('/dashboard/investments')} className="flex flex-col items-center gap-1.5 cursor-pointer group">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-white/10 transition-colors shadow-sm">
                <Wallet className="text-[#8b5cf6]" size={20} />
              </div>
              <span className="text-[10px] text-white/90 font-medium">Active Mining</span>
            </div>

            <div onClick={() => router.push('/dashboard/about')} className="flex flex-col items-center gap-1.5 cursor-pointer group">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-white/10 transition-colors shadow-sm">
                <HelpCircle className="text-[#8b5cf6]" size={20} />
              </div>
              <span className="text-[10px] text-white/90 font-medium">Info</span>
            </div>

            <div onClick={() => router.push('/dashboard/task')} className="flex flex-col items-center gap-1.5 cursor-pointer group relative">
              <div className="absolute -top-1.5 right-1 bg-[#8b5cf6] text-white text-[7px] font-bold px-1 py-[1px] rounded z-10 shadow-sm">
                NEW
              </div>
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-white/10 transition-colors shadow-sm">
                <CheckSquare className="text-[#8b5cf6]" size={20} />
              </div>
              <span className="text-[10px] text-white/90 font-medium">Task</span>
            </div>

            <div onClick={() => router.push('/dashboard/team')} className="flex flex-col items-center gap-1.5 cursor-pointer group">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-white/10 transition-colors shadow-sm">
                <Users className="text-[#8b5cf6]" size={20} />
              </div>
              <span className="text-[10px] text-white/90 font-medium">My Team</span>
            </div>
            
            <div onClick={() => router.push('/dashboard/spin')} className="flex flex-col items-center gap-1.5 cursor-pointer group relative mt-1">
              <div className="absolute -top-1.5 right-0.5 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[7px] font-bold px-1 py-[1px] rounded z-10 shadow-sm animate-pulse">
                HOT
              </div>
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-white/10 transition-colors shadow-sm">
                <Loader className="text-[#8b5cf6]" size={20} />
              </div>
              <span className="text-[10px] text-white/90 font-medium">Spin Wheel</span>
            </div>

            <div 
              onClick={() => { 
                if (isInstallable) {
                  installPWA();
                } else {
                  toast.info("To install on iOS: tap Share, then 'Add to Home Screen'. On Android, it may already be installed.");
                }
              }} 
              className="flex flex-col items-center gap-1.5 cursor-pointer group mt-1"
            >
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-white/10 transition-colors shadow-sm">
                <Download className="text-[#8b5cf6]" size={20} />
              </div>
              <span className="text-[10px] text-white/90 font-medium text-center leading-tight">Download App</span>
            </div>

            <div onClick={() => router.push('/dashboard/treasure')} className="flex flex-col items-center gap-1.5 cursor-pointer group mt-1">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-white/10 transition-colors shadow-sm">
                <Gift className="text-[#8b5cf6]" size={20} />
              </div>
              <span className="text-[10px] text-white/90 font-medium">Bonus Code</span>
            </div>

            <div onClick={() => router.push('/dashboard/help')} className="flex flex-col items-center gap-1.5 cursor-pointer group mt-1">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-white/10 transition-colors shadow-sm">
                <HelpCircle className="text-[#8b5cf6]" size={20} />
              </div>
              <span className="text-[10px] text-white/90 font-medium">Help</span>
            </div>
          </div>
        </div>

        {/* Daily Check-in */}
        <div 
          onClick={() => window.dispatchEvent(new Event('open-daily-checkin'))}
          className="bg-gradient-to-r from-[#8b5cf6] to-[#2563eb] rounded-[16px] py-3 px-4 flex items-center justify-between text-white shadow-sm shadow-purple-500/20 cursor-pointer hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Calendar className="text-white" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-[14px]">Daily Check-in</h3>
              <p className="text-white/90 text-[11px] mt-0.5">Claim your daily rewards!</p>
            </div>
          </div>
          <div className="bg-white/20 px-3 py-1.5 rounded-full text-[12px] font-semibold flex items-center gap-1 hover:bg-white/30 transition-colors backdrop-blur-sm">
            Claim <ChevronRight size={14} />
          </div>
        </div>

        {/* Live Activity */}
        <div className="bg-[#131F37] rounded-[18px] p-3.5 shadow-sm border border-white/5">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5">
              <Activity className="text-[#8b5cf6]" size={16} />
              <h3 className="font-semibold text-white/90 text-[14px]">Live Activity</h3>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-green-500 font-medium">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              Live
            </div>
          </div>

          <div className="h-[180px] overflow-hidden relative -mx-1">
            <div className="space-y-3 animate-[scrollVertical_15s_linear_infinite]">
              {doubledActivities.map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white/5 p-1.5 rounded-lg">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 ${activity.iconBg} rounded-lg flex items-center justify-center`}>
                      <activity.Icon className={activity.iconCol} size={16} />
                    </div>
                    <div>
                      {activity.name && <p className="text-[13px] font-semibold text-white/90 leading-tight mb-0.5">{activity.name}</p>}
                      <p className={`text-[${activity.name ? '11px' : '12px'}] text-gray-500 leading-tight ${activity.name ? '' : 'mb-0.5'}`}>{activity.text}</p>
                    </div>
                  </div>
                  <div className={`font-semibold ${activity.iconCol} text-[13px]`}>{activity.amount.replace('$', settings.currency_symbol || '$')}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Partners & Exchanges */}
        <div className="mt-5 mb-2">
          <div className="flex items-center gap-1.5 mb-3 px-1">
            <BadgeCheck className="text-[#8b5cf6]" size={16} />
            <h3 className="font-semibold text-white/90 text-[14px]">Our Partners & Exchanges</h3>
          </div>
          
          <div className="bg-[#131F37] rounded-[18px] p-3.5 shadow-sm border border-white/5 min-h-[80px]">
            {isLoadingPartners ? (
              <div className="flex items-center justify-center h-full py-4">
                <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
              </div>
            ) : partnersData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <p className="text-xs text-gray-500">No partners to display</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-y-5 gap-x-2">
                {partnersData.map((partner) => (
                  <div key={partner.id} className="flex flex-col items-center gap-1.5 mt-1">
                    <div className="w-12 h-12 bg-white/5 border border-white/5 rounded-[14px] flex items-center justify-center shadow-sm overflow-hidden p-2">
                      {partner.logo ? (
                        <img src={partner.logo} alt={partner.partner_name} className="w-full h-full object-contain" />
                      ) : (
                        <div className="w-7 h-7 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {partner.partner_name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-500 font-medium text-center truncate w-full px-1">{partner.partner_name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Live Market */}
        {isMarketVisible && (
          <div className="bg-[#131F37] rounded-[18px] p-3.5 shadow-sm border border-white/5">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-1.5">
                <BarChart2 className="text-[#8b5cf6]" size={16} />
                <h3 className="font-semibold text-white/90 text-[14px]">Live Market</h3>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-green-500 font-medium">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                Live
              </div>
            </div>

            <div className="space-y-3">
              {isLoadingMarket ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                </div>
              ) : liveMarketData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <p className="text-xs text-gray-500">No live market data available</p>
                </div>
              ) : (
                liveMarketData.map((asset, index) => {
                  const isPositive = parseFloat(asset.price_change_24h) >= 0;
                  return (
                    <div key={asset.id} className={`flex items-center justify-between py-1 ${index !== liveMarketData.length - 1 ? 'border-b border-white/5 pb-2.5' : 'pb-1'}`}>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                          {asset.logo_url ? (
                            <img src={asset.logo_url} alt={asset.symbol} className="w-full h-full object-contain" />
                          ) : (
                            <span className="text-gray-400 font-bold text-sm bg-white/5 w-full h-full flex items-center justify-center">{asset.symbol.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-white/90 leading-tight mb-0.5">{asset.symbol}</p>
                          <p className="text-[11px] text-gray-400 leading-tight">{asset.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-white/90 text-[13px] mb-0.5">${parseFloat(asset.current_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</div>
                        <div className={`text-[9px] font-bold px-1 py-0.5 rounded ml-auto w-fit ${isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {isPositive ? '+' : ''}{parseFloat(asset.price_change_24h || 0).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

      </div>


      {/* Language Modal (Bottom Sheet) */}
      {showLanguageModal && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer" 
            onClick={() => setShowLanguageModal(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-[#0B1426] border border-white/10 w-full max-w-[480px] mx-auto rounded-t-[24px] overflow-hidden flex flex-col h-[75vh] animate-in slide-in-from-bottom-full duration-300 shadow-2xl">
            
            {/* Header */}
            <div className="bg-[#131F37] border-b border-white/5 p-5 flex justify-between items-center text-white">
              <h2 className="text-[16px] font-bold text-white/90">Select Language</h2>
              <button 
                onClick={() => setShowLanguageModal(false)}
                className="w-7 h-7 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-gray-400"
              >
                <X size={14} />
              </button>
            </div>

            {/* Search */}
            <div className="p-3 border-b border-white/5 flex items-center gap-2 bg-[#131F37]">
              <Search size={16} className="text-gray-400 ml-2" />
              <input 
                type="text"
                placeholder="Search language..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 px-2 text-[13px] outline-none bg-transparent text-white/90 placeholder:text-gray-500"
              />
            </div>

            {/* Language List */}
            <div className="p-4 space-y-3 overflow-y-auto flex-1 bg-transparent">
              {dynamicLanguages
                .filter(l => l.native_name.toLowerCase().includes(searchQuery.toLowerCase()) || l.language_name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((lang) => {
                const isSelected = currentLang === lang.language_code;
                return (
                  <button
                    key={lang.language_code}
                    onClick={async () => {
                      setCurrentLang(lang.language_code);
                      const targetCode = lang.language_code.toLowerCase();
                      
                      // Set Google Translate cookies
                      document.cookie = `googtrans=/en/${targetCode}; path=/`;
                      document.cookie = `googtrans=/en/${targetCode}; path=/; domain=${window.location.hostname}`;
                      
                      if (targetCode === 'en') {
                        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
                      }

                      // Save to backend
                      try {
                        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me/language`, {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                          },
                          body: JSON.stringify({ language_code: lang.language_code })
                        });
                      } catch (error) {
                        console.error('Failed to update language preference', error);
                      }

                      setTimeout(() => {
                        setShowLanguageModal(false);
                        window.location.reload();
                      }, 200);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-[12px] border transition-colors ${
                      isSelected 
                        ? 'border-[#8b5cf6] bg-purple-900/20' 
                        : 'border-white/5 hover:border-[#8b5cf6] bg-[#131F37]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 bg-[#0B1426] border border-white/5 rounded-xl flex items-center justify-center text-[12px] font-bold text-gray-400 shadow-sm">
                        {lang.language_code.substring(0, 2).toUpperCase()}
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 bg-[#0B1426] rounded-full">
                            <CheckCircle2 size={14} className="text-[#8b5cf6] fill-[#8b5cf6]/20" />
                          </div>
                        )}
                      </div>
                      <div className="text-left">
                        <div className="text-[13px] font-bold text-white/90">{lang.native_name}</div>
                        <div className="text-[11px] text-gray-400">{lang.language_name}</div>
                      </div>
                    </div>
                    <ChevronRight size={16} className={isSelected ? 'text-[#8b5cf6]' : 'text-gray-500'} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#1e293b] text-white px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 animate-in slide-in-from-top-5 duration-300">
          <span className="text-[13px] font-medium">Coming Soon!</span>
        </div>
      )}

      <WhatsAppModal />
    </div>
  );
}
