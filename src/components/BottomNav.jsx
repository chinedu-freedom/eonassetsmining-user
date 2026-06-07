"use client";

import { Home, BarChart2, Wallet, FileText, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Mining Plans", href: "/dashboard/mining", icon: BarChart2 },
    { name: "Wallet", href: "/dashboard/wallet", icon: Wallet, isCenter: true },
    { name: "News", href: "/dashboard/news", icon: FileText },
    { name: "Account", href: "/dashboard/account", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[65px] bg-white border-t border-gray-100 flex justify-center z-50">
      <div className="w-full max-w-[480px] flex justify-around items-center px-2 h-full relative">
      {navItems.map((item, index) => {
        const isActive = pathname === item.href || (pathname === '/' && item.href === '/dashboard');

        if (item.isCenter) {
          return (
            <div key={index} className="relative -top-5 flex flex-col items-center justify-center">
              <div className="absolute inset-0 bg-[#eef2ff] rounded-full scale-[1.3] -z-10"></div>
              <Link
                href={item.href}
                className="w-[52px] h-[52px] bg-[#3C3CF6] rounded-full flex items-center justify-center shadow-md text-white hover:bg-[#2e2ee6] transition-colors"
              >
                <item.icon size={22} fill="currentColor" strokeWidth={1.5} className="text-white" />
              </Link>
            </div>
          );
        }

        return (
          <Link
            key={index}
            href={item.href}
            className={`flex flex-col items-center justify-center w-[60px] gap-1.5 ${
              isActive ? "text-[#3C3CF6]" : "text-gray-400"
            }`}
          >
            <item.icon 
              size={22} 
              strokeWidth={isActive ? 2 : 1.5}
              className={isActive ? "text-[#3C3CF6]" : "text-gray-400"} 
              fill={isActive && item.name !== "Mining Plans" ? "currentColor" : "none"}
            />
            <span className="text-[10px] font-semibold tracking-tight">{item.name}</span>
          </Link>
        );
      })}
      </div>
    </div>
  );
}
