"use client";

import { useState, useEffect } from "react";
import { useFetchData, usePost } from "@/hooks/useApi";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gift, Lock, Loader2, Coins } from "lucide-react";
import { toast } from "sonner";

export default function DailyCheckinModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading, refetch } = useFetchData("/users/checkin", "checkin-status");
  const claimMutation = usePost("/users/checkin");

  useEffect(() => {
    if (data && data.enabled && !data.claimedToday) {
      setIsOpen(true);
    }
  }, [data]);

  // Allow other components to trigger the modal
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-daily-checkin', handleOpen);
    return () => window.removeEventListener('open-daily-checkin', handleOpen);
  }, []);

  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!data?.claimedToday) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setHours(24, 0, 0, 0);
      const diff = tomorrow - now;

      if (diff <= 0) {
        refetch(); // Automatically refetch when the countdown hits 0
        return "00:00:00";
      }

      const h = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
      const m = Math.floor((diff / 1000 / 60) % 60).toString().padStart(2, '0');
      const s = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');
      return `${h}:${m}:${s}`;
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [data?.claimedToday, refetch]);

  const handleClaim = async () => {
    try {
      const result = await claimMutation.mutateAsync({});
      if (result.success) {
        // toast.success("Reward Claimed!", {
        //   description: result.message,
        // });
        await refetch();
      }
    } catch (error) {
      toast.error("Claim Failed", {
        description: error.response?.data?.error || "Could not claim daily reward",
      });
    }
  };

  if (isLoading || !data || !data.enabled) return null;

  const { rewards, currentStreak, claimedToday } = data;
  const nextClaimDay = claimedToday ? currentStreak : currentStreak + 1;
  const displayDay = nextClaimDay > data.maxDays ? 1 : nextClaimDay;

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (!open) {
      window.dispatchEvent(new Event('checkin-modal-closed'));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden bg-white rounded-2xl border-0 shadow-2xl">
        <div className="p-8 flex flex-col items-center">
          
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 text-orange-500 shadow-sm relative overflow-hidden">
            <Gift className="w-8 h-8" />
            <div className="absolute top-1 right-1 text-[10px]">✨</div>
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 mb-1">Daily Rewards</h2>
          <p className="text-sm text-gray-500 mb-8 text-center px-4">
            Check in for 7 consecutive days to get maximum rewards. Missing a day resets your streak!
          </p>
          
          <div className="grid grid-cols-4 gap-3 w-full mb-4">
            {rewards.slice(0, 4).map((reward, i) => (
              <RewardCard key={reward.day} reward={reward} isNext={reward.day === displayDay && !claimedToday} />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 w-full max-w-[280px] mb-8">
            {rewards.slice(4, 7).map((reward, i) => (
              <RewardCard key={reward.day} reward={reward} isNext={reward.day === displayDay && !claimedToday} />
            ))}
          </div>

          {claimedToday ? (
            <div className="w-full bg-gray-50 text-gray-500 border border-gray-100 rounded-xl py-4 font-bold text-center tracking-[0.2em] shadow-inner text-lg">
              {timeLeft}
            </div>
          ) : (
            <Button 
              onClick={handleClaim} 
              disabled={claimMutation.isPending}
              className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-xl py-6 font-semibold shadow-md shadow-blue-500/20 transition-all active:scale-[0.98]"
            >
              {claimMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                `Claim Day ${displayDay}`
              )}
            </Button>
          )}
          
        </div>
      </DialogContent>
    </Dialog>
  );
}

function RewardCard({ reward, isNext }) {
  const isClaimed = reward.status === 'claimed';
  const isAvailable = reward.status === 'available' || isNext;
  
  return (
    <div className={`
      flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all
      ${isClaimed ? 'border-blue-100 bg-blue-50 opacity-60' : ''}
      ${isAvailable ? 'border-[#3b82f6] bg-blue-50 shadow-sm scale-105 z-10 relative' : ''}
      ${reward.status === 'locked' && !isNext ? 'border-gray-100 bg-gray-50/50' : ''}
    `}>
      <span className={`text-[10px] font-bold tracking-wider uppercase mb-2 ${isAvailable ? 'text-[#3b82f6]' : 'text-gray-400'}`}>
        Day {reward.day}
      </span>
      
      <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${isClaimed || isAvailable ? 'bg-[#f59e0b] text-white shadow-sm' : 'bg-gray-200 text-gray-400'}`}>
        {isClaimed || isAvailable ? (
          <Coins className="w-4 h-4" />
        ) : (
          <Lock className="w-4 h-4" />
        )}
      </div>
      
      <span className={`text-xs font-bold ${isAvailable ? 'text-[#3b82f6]' : 'text-gray-400'}`}>
        +${parseFloat(reward.amount).toFixed(2)}
      </span>
    </div>
  );
}
