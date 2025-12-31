import { useState, useEffect } from 'react';

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isStartingSoon: boolean;
  isLive: boolean;
}

export const useCountdown = (startTime: string, endTime: string): CountdownTime => {
  const [countdown, setCountdown] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isStartingSoon: false,
    isLive: false,
  });

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date().getTime();
      const start = new Date(startTime).getTime();
      const end = new Date(endTime).getTime();
      
      // Check if contest is live
      if (now >= start && now < end) {
        const remaining = end - now;
        return {
          days: 0,
          hours: Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((remaining % (1000 * 60)) / 1000),
          isStartingSoon: false,
          isLive: true,
        };
      }

      const difference = start - now;
      
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isStartingSoon: false, isLive: false };
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      const isStartingSoon = difference < 24 * 60 * 60 * 1000; // Less than 24 hours

      return { days, hours, minutes, seconds, isStartingSoon, isLive: false };
    };

    setCountdown(calculateCountdown());
    
    const timer = setInterval(() => {
      setCountdown(calculateCountdown());
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, endTime]);

  return countdown;
};
