import { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';

interface HeaderProps {
  contestCount: number;
}

export const Header = ({ contestCount }: HeaderProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <header className="mb-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Logo & Title */}
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 border-2 border-primary pixel-shadow">
            <Terminal className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gradient-pixel uppercase glitch-text" data-text="PIXO">
              PIXO
            </h1>
            <p className="text-[10px] text-muted-foreground mt-2 font-bold">
              Track upcoming coding battles
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-8 bg-card p-4 border-2 border-border pixel-shadow">
          <div className="text-right">
            <div className="text-[8px] font-bold text-muted-foreground mb-2 uppercase tracking-widest">Active Contests</div>
            <div className="text-xl font-bold text-primary leading-none">{contestCount}</div>
          </div>
          <div className="w-0.5 h-8 bg-border" />
          <div className="text-right">
            <div className="text-[8px] font-bold text-muted-foreground mb-2 uppercase tracking-widest">Local Time</div>
            <div className="text-xs font-bold text-foreground tabular-nums leading-none">
              {currentTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
