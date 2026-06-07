import { ArrowLeft, Bell, ChevronRight, Calendar } from "lucide-react";
import Link from "next/link";

export default function NewsPage() {
  const newsItems = [
    {
      id: 1,
      title: "New Mining Farm Launched in Iceland",
      date: "Oct 24, 2026",
      summary: "We are thrilled to announce the opening of our newest, state-of-the-art mining facility powered by 100% renewable geothermal energy. This new facility will increase our overall network hash rate by 25%.",
      category: "Company Update",
      tagColor: "bg-blue-100 text-blue-600"
    },
    {
      id: 2,
      title: "Bitcoin Halving: What It Means for You",
      date: "Oct 18, 2026",
      summary: "The upcoming Bitcoin halving is approaching. Find out how this will affect daily mining yields, market volatility, and our long-term strategies for sustaining high ROIs.",
      category: "Market Analysis",
      tagColor: "bg-purple-100 text-purple-600"
    },
    {
      id: 3,
      title: "Security Upgrade Notice",
      date: "Oct 12, 2026",
      summary: "To ensure the highest level of security for our users' assets, we will be performing a scheduled security upgrade to our cold storage protocols this weekend. No action is required from you.",
      category: "System Alert",
      tagColor: "bg-orange-100 text-orange-600"
    },
    {
      id: 4,
      title: "Introduction to the Genesis Plan",
      date: "Sep 28, 2026",
      summary: "Due to high demand, we've rolled out the Genesis mining plan offering a 5% daily return for 30 days. Perfect for long-term holders looking to maximize their cryptocurrency earnings.",
      category: "Product News",
      tagColor: "bg-green-100 text-green-600"
    }
  ];

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] overflow-y-auto  [&::-webkit-scrollbar]:hidden">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 flex justify-between items-center shadow-sm z-10 sticky top-0 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <h1 className="text-[#1e3a8a] text-[15px] font-bold">Latest News</h1>
        </div>
        <button className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center text-[#1e3a8a] hover:bg-gray-100 transition-colors shadow-sm relative">
          <Bell size={14} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
        </button>
      </div>

      <div className="px-4 pt-4 pb-4 space-y-3 max-w-[480px] mx-auto w-full">
        {newsItems.map((news) => (
          <Link href={`/dashboard/news/${news.id}`} key={news.id} className="block bg-white rounded-[16px] p-[16px] border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-2">
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${news.tagColor}`}>
                {news.category}
              </span>
              <div className="flex items-center gap-1 text-gray-400 text-[9px]">
                <Calendar size={10} />
                <span>{news.date}</span>
              </div>
            </div>

            <h2 className="text-[#0f172a] font-bold text-[14px] leading-tight mb-1.5">
              {news.title}
            </h2>

            <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-2 mb-3">
              {news.summary}
            </p>

            <div className="flex items-center text-[#3b82f6] text-[10px] font-bold">
              Read Full Article <ChevronRight size={12} className="ml-0.5" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
