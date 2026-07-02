'use client';

import { useState, useEffect } from 'react';

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Target date: 30 days from now
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);
    targetDate.setHours(targetDate.getHours() + 14);

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="flex gap-2 sm:gap-3 items-center opacity-50">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/40 rounded-2xl" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 sm:gap-3 items-center">
      <TimeUnit value={timeLeft.days} label="Days" />
      <span className="text-2xl font-black text-white/50 pb-5 animate-pulse">:</span>
      <TimeUnit value={timeLeft.hours} label="Hrs" />
      <span className="text-2xl font-black text-white/50 pb-5 animate-pulse">:</span>
      <TimeUnit value={timeLeft.minutes} label="Min" />
      <span className="text-2xl font-black text-white/50 pb-5 animate-pulse">:</span>
      <TimeUnit value={timeLeft.seconds} label="Sec" />
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl flex items-center justify-center shadow-[0_8px_16px_rgba(24,16,89,0.2)] relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50"></div>
        <span className="text-2xl sm:text-3xl font-black text-[#5C4FFF] relative z-10">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-[10px] sm:text-xs font-bold text-white/90 mt-2 uppercase tracking-widest drop-shadow-sm">{label}</span>
    </div>
  );
}
