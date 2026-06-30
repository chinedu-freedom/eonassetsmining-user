"use client";

import { ArrowLeft, Gift, Lock, CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFetchData, usePost } from "@/hooks/useApi";
import { useRef, useEffect } from "react";
import { toast } from "sonner";

export default function TaskPage() {
  const router = useRouter();

  const { data: tasksData, isLoading, refetch } = useFetchData("/users/tasks", ["user-tasks"]);
  const claimMutation = usePost("/users/tasks/claim", "user-tasks");
  const { data: settingsRes } = useFetchData("/settings", ["platform-settings"]);
  const settings = settingsRes?.settings || {};

  const confettiCanvasRef = useRef(null);
  const confettiRef = useRef(null);

  useEffect(() => {
    if (!confettiCanvasRef.current) return;
    class Confetti {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.particles = [];
            this.running = false;
        }
        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
        launch(count = 150) {
            this.resize();
            this.canvas.style.display = 'block';
            this.particles = [];
            const colors = ['#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
            for (let i = 0; i < count; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: -20 - Math.random() * 200,
                    size: Math.random() * 10 + 4,
                    speedY: Math.random() * 4 + 2,
                    speedX: (Math.random() - 0.5) * 6,
                    rotation: Math.random() * 360,
                    rotSpeed: (Math.random() - 0.5) * 15,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    shape: Math.random() > 0.5 ? 'rect' : 'circle'
                });
            }
            this.running = true;
            this.animate();
        }
        animate() {
            if (!this.running) return;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            let active = 0;
            this.particles.forEach(p => {
                if (p.y < this.canvas.height + 50) {
                    active++;
                    p.y += p.speedY;
                    p.x += p.speedX;
                    p.rotation += p.rotSpeed;
                    p.speedY += 0.15;
                    this.ctx.save();
                    this.ctx.translate(p.x, p.y);
                    this.ctx.rotate(p.rotation * Math.PI / 180);
                    this.ctx.fillStyle = p.color;
                    if (p.shape === 'rect') {
                        this.ctx.fillRect(-p.size/2, -p.size/4, p.size, p.size/2);
                    } else {
                        this.ctx.beginPath();
                        this.ctx.arc(0, 0, p.size/2, 0, Math.PI * 2);
                        this.ctx.fill();
                    }
                    this.ctx.restore();
                }
            });
            if (active > 0) {
                requestAnimationFrame(() => this.animate());
            } else {
                this.running = false;
                this.canvas.style.display = 'none';
            }
        }
    }
    confettiRef.current = new Confetti(confettiCanvasRef.current);
  }, []);

  const tasks = tasksData?.tasks || [];
  const todayInvites = tasksData?.todayReferralsCount || 0;
  
  const totalTasks = tasks.length;
  const readyTasks = tasks.filter(t => t.isReady).length;
  const claimedTasks = tasks.filter(t => t.isClaimed).length;

  const handleClaim = (taskId) => {
    claimMutation.mutate({ taskId }, {
      onSuccess: () => {
        confettiRef.current?.launch(150);
        refetch();
      }
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] overflow-y-auto [&::-webkit-scrollbar]:hidden">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-3 shadow-sm z-10 relative">
        <button 
          onClick={() => router.back()}
          className="w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} className="text-[#4c1d95]" />
        </button>
        <h1 className="text-[#4c1d95] font-bold text-[18px]">Task</h1>
      </div>

      <div className="p-4 space-y-4 pb-24">
        {/* Stats Card */}
        <div className="bg-[#8b5cf6] rounded-[16px] p-5 text-white shadow-sm flex justify-between items-center text-center">
          <div className="flex flex-col gap-1 items-center">
            <span className="text-[24px] font-bold leading-none">{totalTasks}</span>
            <span className="text-[11px] text-purple-100">Total Tasks</span>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <span className="text-[24px] font-bold leading-none">{readyTasks}</span>
            <span className="text-[11px] text-purple-100">Ready</span>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <span className="text-[24px] font-bold leading-none">{claimedTasks}</span>
            <span className="text-[11px] text-purple-100">Claimed</span>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <span className="text-[24px] font-bold leading-none">{todayInvites}</span>
            <span className="text-[11px] text-purple-100">Today's Invites</span>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No active tasks available.</div>
          ) : (
            tasks.map(task => {
              const progressPercent = Math.min((task.progress / task.required_referrals) * 100, 100);
              
              return (
                <div key={task.id} className="bg-white rounded-[10px] p-4 shadow-sm border border-gray-100 flex gap-3">
                  <div className="w-12 h-12 bg-[#e0e7ff] rounded-[12px] flex items-center justify-center shrink-0">
                    <Gift className="text-[#6366f1]" size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-[14px] font-bold text-[#1e293b] leading-tight mb-0.5">{task.task_name}</h3>
                        <div className="flex items-center gap-2 text-[12px]">
                          <span className="text-[#f59e0b] font-bold">{settings.currency_symbol || "$"}{Number(task.reward_amount).toFixed(2)}</span>
                          <span className="text-gray-500">{task.required_referrals} invites today</span>
                        </div>
                      </div>
                      
                      {task.isClaimed ? (
                        <button className="bg-green-50 text-green-600 px-2.5 py-1.5 rounded-full cursor-pointer text-[11px] font-bold flex items-center gap-1.5 shrink-0 ml-2">
                          <CheckCircle2 size={12} />
                          Claimed
                        </button>
                      ) : task.isReady ? (
                        <button 
                          onClick={() => handleClaim(task.id)}
                          disabled={claimMutation.isPending}
                          className="bg-[#f59e0b] text-white px-3 py-1.5 rounded-full cursor-pointer text-[11px] font-bold shrink-0 ml-2 hover:bg-[#d97706] transition-colors disabled:opacity-70"
                        >
                          {claimMutation.isPending ? "Claiming..." : "Claim"}
                        </button>
                      ) : (
                        <button className="bg-gray-100 text-gray-400 px-2.5 py-1.5 rounded-full cursor-pointer text-[11px] font-bold flex items-center gap-1.5 shrink-0 ml-2">
                          <Lock size={12} />
                          Locked
                        </button>
                      )}
                    </div>
                    
                    <div className="relative w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1">
                      <div 
                        className={`absolute top-0 left-0 h-full ${task.isClaimed ? 'bg-green-500' : 'bg-[#f59e0b]'} transition-all duration-500`} 
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                    <div className="text-[11px] text-gray-500 font-medium">
                      {task.progress}/{task.required_referrals} today ({Math.floor(progressPercent)}%)
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <canvas 
        ref={confettiCanvasRef} 
        className="pointer-events-none fixed inset-0 z-[100] w-full h-full" 
        style={{ display: 'none' }}
      />
    </div>
  );
}
