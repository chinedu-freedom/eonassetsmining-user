"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Send } from "lucide-react";

export default function TelegramModal({ isOpen, setIsOpen }) {
  useEffect(() => {
    // Only show automatically once per session/visit if we want, but user requested "immediately when page loads"
    // The parent component can handle setting isOpen to true on mount.
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[360px] p-0 overflow-hidden bg-white rounded-[24px] border-0 shadow-2xl">
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 w-7 h-7 bg-gray-100 cursor-pointer rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors z-10"
        >
          <X size={14} />
        </button>

        <div className="p-8 flex flex-col items-center text-center">
          <div className="w-[70px] h-[70px] bg-[#e0f2fe] rounded-full flex items-center justify-center mb-5 shadow-sm">
            <div className="w-[50px] h-[50px] bg-[#0ea5e9] rounded-full flex items-center justify-center shadow-[0_4px_14px_rgba(14,165,233,0.4)]">
              <Send className="text-white ml-[-2px] mt-[2px]" size={24} fill="currentColor" />
            </div>
          </div>

          <h2 className="text-[18px] font-bold text-[#0f172a] mb-2">Join Our Telegram</h2>
          
          <p className="text-[13px] text-gray-500 mb-6 leading-relaxed px-2">
            Join our Telegram channel to get exclusive gift codes, updates, and stay connected with our community!
          </p>
          
          <Button 
            className="w-full bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded-[12px] h-[44px] text-[14px] font-bold shadow-md transition-all flex items-center gap-2"
            onClick={() => {
              setIsOpen(false);
              window.open('https://t.me/your_telegram_channel', '_blank');
            }}
          >
            <Send size={16} fill="currentColor" className="ml-[-2px] mt-[1px]" />
            Join Channel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
