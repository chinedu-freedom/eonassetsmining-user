"use client";

import { ArrowLeft, Calendar, Tag, Share2, Loader2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useFetchData } from "@/hooks/useApi";

export default function NewsArticlePage() {
  const params = useParams();
  const { data, isLoading, error } = useFetchData(params?.id ? `/news/${params.id}` : null, ["news-public", params?.id]);

  const article = data?.news;

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] overflow-y-auto  [&::-webkit-scrollbar]:hidden">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 flex justify-between items-center shadow-sm z-10 sticky top-0 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/news" className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer">
            <ArrowLeft size={16} />
          </Link>
          <h1 className="text-[#4c1d95] text-[15px] font-bold">Article</h1>
        </div>
        <button className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center text-[#4c1d95] hover:bg-gray-100 transition-colors shadow-sm cursor-pointer">
          <Share2 size={14} />
        </button>
      </div>

      <div className="px-4 pt-4 pb-4 max-w-[480px] mx-auto w-full flex-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-purple-500" />
            <p className="text-sm font-medium">Loading article...</p>
          </div>
        ) : error || !article ? (
          <div className="flex flex-col items-center justify-center py-20 text-red-400 bg-white rounded-[16px] border border-gray-100 shadow-sm">
            <p className="text-sm font-medium">Article not found</p>
            <Link href="/dashboard/news" className="mt-4 text-purple-500 text-xs font-bold underline cursor-pointer">
              Return to News
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-[16px] p-[20px] border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
            {/* Meta */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-600 flex items-center gap-1">
                <Tag size={8} /> {article.category || "General"}
              </span>
              <span className="text-[9px] font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-500 flex items-center gap-1">
                <Calendar size={8} /> {new Date(article.published_at).toLocaleDateString()}
              </span>
              <span className="text-[9px] font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-500 flex items-center gap-1 ml-auto">
                {article.views} views
              </span>
            </div>

            {/* Title */}
            <h1 className="text-[#0f172a] font-extrabold text-[18px] leading-snug mb-5">
              {article.title}
            </h1>

            {/* Featured Image Placeholder */}
            {article.image ? (
              <div className="w-full h-[180px] rounded-xl mb-6 shadow-sm overflow-hidden flex items-center justify-center bg-gray-100">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-full h-[140px] bg-gradient-to-r from-purple-500 to-[#0f172a] rounded-xl mb-6 shadow-inner relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-black/20"></div>
                <span className="text-white/50 text-[10px] font-bold tracking-widest uppercase z-10 flex items-center gap-2">
                  <ImageIcon size={14} /> Polychainapp News
                </span>
              </div>
            )}

            {/* Content */}
            <div className="text-gray-600 text-[13px] leading-relaxed whitespace-pre-wrap">
              {article.content}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
