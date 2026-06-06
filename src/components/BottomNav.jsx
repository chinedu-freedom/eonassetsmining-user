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
    <div className="absolute bottom-0 left-0 right-0 h-[70px] bg-white border-t rounded-t-2xl flex justify-around items-center px-2 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      {navItems.map((item, index) => {
        const isActive = pathname === item.href;

        if (item.isCenter) {
          return (
            <div key={index} className="relative -top-6 flex flex-col items-center justify-center">
              <Link
                href={item.href}
                className="w-14 h-14 bg-[#3C3CF6] rounded-full flex items-center justify-center shadow-lg text-white hover:bg-[#2e2ee6] transition-colors"
              >
                <item.icon size={24} />
              </Link>
            </div>
          );
        }

        return (
          <Link
            key={index}
            href={item.href}
            className={`flex flex-col items-center justify-center w-[60px] gap-1 ${
              isActive ? "text-[#3C3CF6]" : "text-gray-400"
            }`}
          >
            <item.icon size={20} className={isActive ? "text-[#3C3CF6]" : "text-gray-400"} />
            <span className="text-[10px] font-medium">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
