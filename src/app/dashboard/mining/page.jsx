import { ArrowLeft, Wallet } from "lucide-react";
import Link from "next/link";

export default function MiningPlansPage() {
  const plans = [
    {
      id: 1,
      name: "Core",
      days: 10,
      dailyRate: "4.0%",
      min: "$10.00",
      max: "$9,999.00",
    },
    {
      id: 2,
      name: "Edge",
      days: 3,
      dailyRate: "2.0%",
      min: "$5.00",
      max: "$2,999.00",
    },
    {
      id: 3,
      name: "Genesis",
      days: 30,
      dailyRate: "5.0%",
      min: "$30.00",
      max: "$49,999.00",
    }
  ];

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] overflow-y-auto pb-24 [&::-webkit-scrollbar]:hidden">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 flex justify-between items-center shadow-sm z-10 sticky top-0 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <h1 className="text-[#1e3a8a] text-[15px] font-bold">Products</h1>
        </div>
        <Link href="/dashboard/wallet" className="w-8 h-8 bg-[#4082F6] rounded-xl flex items-center justify-center text-white hover:bg-blue-600 transition-colors shadow-sm">
          <Wallet size={14} />
        </Link>
      </div>

      {/* Plans List */}
      <div className="px-4 pt-4 pb-4 space-y-3 max-w-[480px] mx-auto w-full">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-[16px] p-[16px] border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5 w-1/3">
                {/* Plan Icon */}
                <div className="w-[42px] h-[42px] bg-[#020617] rounded-full flex items-center justify-center shadow-inner relative overflow-hidden shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-transparent"></div>
                  {/* Inner glowing card representation */}
                  <div className="w-[18px] h-[26px] border border-blue-400/50 rounded flex flex-col items-center justify-center bg-[#0f172a] z-10 shadow-[0_0_8px_rgba(59,130,246,0.5)]">
                    <span className="text-blue-400 text-[9px] font-bold leading-none">{plan.days}</span>
                    <span className="text-white text-[4px] opacity-80 uppercase mt-0.5">Days</span>
                  </div>
                </div>
                
                <h2 className="text-[#0f172a] font-bold text-[15px]">{plan.name}</h2>
              </div>
              
              <div className="text-center w-1/3">
                <span className="text-[#1e3a8a] font-bold text-[12px]">{plan.days} days</span>
              </div>

              <div className="text-right w-1/3">
                <div className="text-[#22c55e] font-bold text-[20px] leading-none mb-1 tracking-tight">{plan.dailyRate}</div>
                <div className="text-gray-400 text-[10px]">daily</div>
              </div>
            </div>

            <div className="text-right mb-3">
               <p className="text-[10px] text-gray-400 font-medium tracking-tight">
                 Min: <span className="text-[#3b82f6]">{plan.min}</span> | Max: <span className="text-[#3b82f6]">{plan.max}</span>
               </p>
            </div>

            <button className="w-full bg-[#4082F6] text-white font-semibold py-2 rounded-[10px] hover:bg-blue-600 transition-colors text-[13px] shadow-sm">
              Mine
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
