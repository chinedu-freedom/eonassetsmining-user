import BottomNav from "@/components/BottomNav";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0b1426] flex justify-center">
      <div className="w-full max-w-[480px] bg-[#f8f9fa] min-h-screen relative shadow-2xl overflow-hidden pb-[80px]">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
