"use client";

import { useState } from "react";
import { 
  User, 
  Globe, 
  MessageCircle, 
  ChevronDown, 
  ChevronUp,
  Eye, 
  EyeOff,
  Download, 
  Upload, 
  BarChart3,
  Wallet,
  CreditCard,
  BarChart2,
  Users,
  Info,
  Clock,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Search,
  X,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";

const languages = [
  { code: 'EN', name: 'English', sub: 'English', short: 'GB' },
  { code: 'ES', name: 'Español', sub: 'Spanish', short: 'ES' },
  { code: 'FR', name: 'Français', sub: 'French', short: 'FR' },
  { code: 'DE', name: 'Deutsch', sub: 'German', short: 'DE' },
  { code: 'IT', name: 'Italiano', sub: 'Italian', short: 'IT' },
  { code: 'PT', name: 'Português', sub: 'Portuguese', short: 'BR' },
  { code: 'RU', name: 'Русский', sub: 'Russian', short: 'RU' },
  { code: 'ZH', name: '中文', sub: 'Chinese', short: 'CN' },
  { code: 'JA', name: '日本語', sub: 'Japanese', short: 'JP' },
  { code: 'KO', name: '한국어', sub: 'Korean', short: 'KR' },
  { code: 'AR', name: 'العربية', sub: 'Arabic', short: 'SA' },
  { code: 'HI', name: 'हिन्दी', sub: 'Hindi', short: 'IN' },
  { code: 'ID', name: 'Bahasa Indonesia', sub: 'Indonesian', short: 'ID' },
  { code: 'TR', name: 'Türkçe', sub: 'Turkish', short: 'TR' },
  { code: 'VI', name: 'Tiếng Việt', sub: 'Vietnamese', short: 'VN' },
  { code: 'TH', name: 'ไทย', sub: 'Thai', short: 'TH' },
  { code: 'NL', name: 'Nederlands', sub: 'Dutch', short: 'NL' },
  { code: 'PL', name: 'Polski', sub: 'Polish', short: 'PL' }
];

export default function AccountPage() {
  const [currency, setCurrency] = useState("USD");
  const [showBalance, setShowBalance] = useState(true);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [currentLang, setCurrentLang] = useState("EN");
  const [searchQuery, setSearchQuery] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleCurrency = () => {
    setCurrency(prev => prev === "USD" ? "NGN" : "USD");
  };

  const balances = {
    USD: {
      total: "$5.10",
      deposit: "$0.00",
      withdraw: "$0.00",
      income: "$5.10"
    },
    NGN: {
      total: "₦6,938.78",
      deposit: "₦0.00",
      withdraw: "₦0.00",
      income: "₦6,938.78"
    }
  };

  const currentBalance = balances[currency];

  const menuItems = [
    { icon: Info, label: "About Us", href: "/dashboard/about", color: "text-[#3b82f6]", bg: "bg-[#eff6ff]" },
    { icon: Users, label: "Invite", href: "/dashboard/invite", color: "text-[#3b82f6]", bg: "bg-[#eff6ff]" },
    { icon: Clock, label: "Transactions", href: "/dashboard/transactions", color: "text-[#3b82f6]", bg: "bg-[#eff6ff]" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings", color: "text-[#3b82f6]", bg: "bg-[#eff6ff]" },
    { icon: Download, label: "Download App", href: "#", color: "text-[#3b82f6]", bg: "bg-[#eff6ff]" },
    { icon: HelpCircle, label: "Help Center", href: "/dashboard/help", color: "text-[#3b82f6]", bg: "bg-[#eff6ff]" },
    { icon: LogOut, label: "Logout", href: "#", color: "text-[#ef4444]", bg: "bg-[#fee2e2]" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] overflow-y-auto  [&::-webkit-scrollbar]:hidden">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 flex justify-between items-center z-10 sticky top-0 shadow-sm border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <label className="relative w-10 h-10 bg-[#3b82f6] rounded-full flex items-center justify-center text-white shadow-sm cursor-pointer overflow-hidden group shrink-0">
            {profilePic ? (
              <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={20} fill="currentColor" className="opacity-80" />
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload size={14} className="text-white" />
            </div>
            <input 
              type="file" 
              accept="image/*"
              className="hidden" 
              onChange={handleProfilePicChange} 
            />
          </label>
          <div>
            <h1 className="text-[#1e3a8a] text-[15px] font-bold leading-tight">Spark</h1>
            <p className="text-gray-400 text-[10px] mt-0.5">chinedufreedom10@gmail.com</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => setShowLanguageModal(true)}
            className="flex items-center gap-1 bg-gray-50 px-2 py-1.5 rounded-lg text-[10px] font-bold text-gray-500 hover:bg-gray-100 transition-colors border border-gray-100"
          >
            <Globe size={12} className="text-[#3b82f6]" /> {currentLang}
          </button>
          <Link href="/dashboard/help" className="w-7 h-7 bg-gray-50 rounded-lg flex items-center justify-center text-[#3b82f6] hover:bg-gray-100 transition-colors border border-gray-100">
            <MessageCircle size={12} fill="currentColor" className="opacity-80" />
          </Link>
        </div>
      </div>

      <div className="px-4 pt-4 pb-4 space-y-4 max-w-[480px] mx-auto w-full">
        
        {/* Total Balance Card */}
        <div className="bg-[#2563eb] rounded-[24px] p-1.5 shadow-[0_4px_14px_rgba(37,99,235,0.3)]">
          <div className="bg-[#3b82f6] rounded-[20px] p-[16px] text-white">
            {/* Top section */}
            <div className="flex justify-between items-start mb-1">
              <span className="text-[10px] text-white/90">Total Balance</span>
              <button 
                onClick={toggleCurrency}
                className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded text-[9px] font-bold hover:bg-white/30 transition-colors"
              >
                {currency} {currency === "USD" ? <ChevronDown size={10} /> : <ChevronUp size={10} />}
              </button>
            </div>

            {/* Main Balance */}
            <div className="flex items-center gap-2 mb-5">
              <span className="text-[24px] font-bold tracking-tight">
                {showBalance ? currentBalance.total : "****"}
              </span>
              <button 
                onClick={() => setShowBalance(!showBalance)}
                className="text-white/80 hover:text-white transition-colors p-1"
              >
                {showBalance ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-2.5">
              <button className="flex-1 bg-white text-[#1e3a8a] flex items-center justify-center gap-1.5 py-2 rounded-[10px] text-[11px] font-bold hover:bg-gray-50 transition-colors shadow-sm">
                <Wallet size={12} /> Deposit
              </button>
              <button className="flex-1 bg-white/20 text-white flex items-center justify-center gap-1.5 py-2 rounded-[10px] text-[11px] font-bold hover:bg-white/30 transition-colors border border-white/10">
                <CreditCard size={12} /> Withdraw
              </button>
            </div>
          </div>
        </div>

        {/* Account Overview */}
        <div className="bg-white rounded-[16px] p-[16px] border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-1.5 mb-3.5">
            <BarChart3 size={14} className="text-[#3b82f6]" />
            <h2 className="text-[#334155] font-bold text-[13px]">Account Overview</h2>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Total Deposit */}
            <div className="bg-[#f8f9fa] rounded-[12px] p-3 flex flex-col gap-2 border border-gray-50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#dcfce7] rounded-[8px] flex items-center justify-center text-[#16a34a]">
                  <Wallet size={12} />
                </div>
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Total Deposit</span>
              </div>
              <div className="text-[13px] font-bold text-[#0f172a] ml-1">{currentBalance.deposit}</div>
            </div>

            {/* Total Withdraw */}
            <div className="bg-[#f8f9fa] rounded-[12px] p-3 flex flex-col gap-2 border border-gray-50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#fee2e2] rounded-[8px] flex items-center justify-center text-[#ef4444]">
                  <CreditCard size={12} />
                </div>
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Total Withdraw</span>
              </div>
              <div className="text-[13px] font-bold text-[#0f172a] ml-1">{currentBalance.withdraw}</div>
            </div>

            {/* Total Income */}
            <div className="bg-[#f8f9fa] rounded-[12px] p-3 flex flex-col gap-2 border border-gray-50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#dbeafe] rounded-[8px] flex items-center justify-center text-[#3b82f6]">
                  <BarChart2 size={12} />
                </div>
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Total Income</span>
              </div>
              <div className="text-[13px] font-bold text-[#0f172a] ml-1">{currentBalance.income}</div>
            </div>

            {/* Team Members */}
            <div className="bg-[#f8f9fa] rounded-[12px] p-3 flex flex-col gap-2 border border-gray-50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#fef08a] rounded-[8px] flex items-center justify-center text-[#ca8a04]">
                  <Users size={12} />
                </div>
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Team Members</span>
              </div>
              <div className="text-[13px] font-bold text-[#0f172a] ml-1">0</div>
            </div>
          </div>
        </div>

        {/* Menu List */}
        <div className="bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
          {menuItems.map((item, index) => {
            const isDownload = item.label === "Download App";
            return (
              <Link 
                key={index} 
                href={item.href}
                onClick={(e) => {
                  if (isDownload) {
                    e.preventDefault();
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 3000);
                  }
                }}
                className={`flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors ${
                  index !== menuItems.length - 1 ? 'border-b border-gray-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-[10px] flex items-center justify-center ${item.bg} ${item.color}`}>
                    <item.icon size={14} />
                  </div>
                  <span className={`text-[13px] font-medium ${item.label === 'Logout' ? 'text-[#ef4444]' : 'text-[#334155]'}`}>
                    {item.label}
                  </span>
                </div>
                <ChevronRight size={14} className="text-gray-300" />
              </Link>
            );
          })}
        </div>

      </div>

      {/* Language Modal (Bottom Sheet) */}
      {showLanguageModal && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
            onClick={() => setShowLanguageModal(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-[480px] mx-auto rounded-t-[24px] overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-full duration-300">
            
            {/* Header */}
            <div className="bg-[#2563eb] p-5 flex justify-between items-center text-white">
              <h2 className="text-[16px] font-bold">Select Language</h2>
              <button 
                onClick={() => setShowLanguageModal(false)}
                className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Search */}
            <div className="p-3 border-b border-gray-100 flex items-center gap-2">
              <Search size={16} className="text-gray-400 ml-2" />
              <input 
                type="text"
                placeholder="Search language..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 px-2 text-[13px] outline-none placeholder:text-gray-400"
              />
            </div>

            {/* Language List */}
            <div className="p-4 space-y-3 overflow-y-auto flex-1">
              {languages
                .filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.sub.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((lang) => {
                const isSelected = currentLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setCurrentLang(lang.code);
                      setTimeout(() => setShowLanguageModal(false), 200);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-[12px] border transition-colors ${
                      isSelected 
                        ? 'border-[#3b82f6] bg-[#eff6ff]' 
                        : 'border-gray-200 hover:border-[#3b82f6] bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-[12px] font-bold text-gray-400 shadow-sm">
                        {lang.short}
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 bg-white rounded-full">
                            <CheckCircle2 size={14} className="text-[#10b981]" fill="#fff" />
                          </div>
                        )}
                      </div>
                      <div className="text-left">
                        <div className="text-[13px] font-bold text-[#0f172a]">{lang.name}</div>
                        <div className="text-[11px] text-gray-500">{lang.sub}</div>
                      </div>
                    </div>
                    <ChevronRight size={16} className={isSelected ? 'text-[#3b82f6]' : 'text-gray-300'} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Coming Soon Toast */}
      {showToast && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none p-4">
          <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] px-5 py-4 flex items-center gap-4 animate-in fade-in zoom-in-95 duration-300 pointer-events-auto max-w-[320px] w-full border border-gray-100/50">
            <div className="w-12 h-12 bg-[#eff6ff] rounded-[14px] flex items-center justify-center shrink-0">
              <div className="w-6 h-6 bg-[#2563eb] rounded-full flex items-center justify-center text-white">
                <Info size={14} strokeWidth={3} />
              </div>
            </div>
            <span className="text-[#0f172a] text-[18px] font-bold">Coming soon</span>
          </div>
        </div>
      )}
    </div>
  );
}
