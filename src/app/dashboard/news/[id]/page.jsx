import { ArrowLeft, Calendar, Tag, Share2 } from "lucide-react";
import Link from "next/link";

export default function NewsArticlePage({ params }) {
  // Mock data for the specific news article. In a real app, you'd fetch this based on params.id.
  const article = {
    title: "New Mining Farm Launched in Iceland",
    date: "Oct 24, 2026",
    category: "Company Update",
    tagColor: "bg-blue-100 text-blue-600",
    content: (
      <>
        <p className="mb-4">
          We are thrilled to announce the opening of our newest, state-of-the-art mining facility powered by 100% renewable geothermal energy. This new facility will increase our overall network hash rate by 25%.
        </p>
        <p className="mb-4">
          Located just outside Reykjavik, the new farm leverages the naturally cold climate to drastically reduce cooling costs, which has historically been one of the largest overheads in cryptocurrency mining.
        </p>
        <h3 className="text-[#0f172a] font-bold text-[14px] mb-2">Sustainable Mining Future</h3>
        <p className="mb-4">
          By utilizing Iceland's abundant geothermal and hydroelectric power sources, EonAssets is committing to a greener future. The carbon footprint of our operations has dropped by 40% globally as a direct result of this launch.
        </p>
        <div className="bg-[#f1f5f9] p-3 rounded-xl border border-gray-100 mb-4 text-[11px] italic text-gray-600">
          "This is a massive step forward not just for EonAssets, but for the industry standard of sustainable crypto mining."
        </div>
      </>
    )
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] overflow-y-auto pb-24 [&::-webkit-scrollbar]:hidden">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 flex justify-between items-center shadow-sm z-10 sticky top-0 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/news" className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <h1 className="text-[#1e3a8a] text-[15px] font-bold">Article</h1>
        </div>
        <button className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center text-[#1e3a8a] hover:bg-gray-100 transition-colors shadow-sm">
          <Share2 size={14} />
        </button>
      </div>

      <div className="px-4 pt-4 pb-4 max-w-[480px] mx-auto w-full">
        <div className="bg-white rounded-[16px] p-[20px] border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
          {/* Meta */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${article.tagColor} flex items-center gap-1`}>
              <Tag size={8} /> {article.category}
            </span>
            <span className="text-[9px] font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-500 flex items-center gap-1">
              <Calendar size={8} /> {article.date}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-[#0f172a] font-extrabold text-[18px] leading-snug mb-5">
            {article.title}
          </h1>

          {/* Featured Image Placeholder */}
          <div className="w-full h-[140px] bg-gradient-to-r from-blue-500 to-[#0f172a] rounded-xl mb-6 shadow-inner relative overflow-hidden flex items-center justify-center">
             <div className="absolute inset-0 bg-black/20"></div>
             <span className="text-white/50 text-[10px] font-bold tracking-widest uppercase z-10">EonAssets News</span>
          </div>

          {/* Content */}
          <div className="text-gray-600 text-[12px] leading-relaxed">
            {article.content}
          </div>
        </div>
      </div>
    </div>
  );
}
