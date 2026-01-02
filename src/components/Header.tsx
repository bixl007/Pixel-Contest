import { useState, useEffect } from 'react';
import { Terminal, Sparkles } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

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
    <header className="mb-12 relative z-20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Logo & Title */}
        <div className="flex items-center gap-5 group">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full group-hover:bg-purple-500/30 transition-colors duration-500" />
            <div className="relative p-4 bg-card/60 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl group-hover:scale-105 transition-transform duration-300">
              <Terminal className="w-8 h-8 text-primary" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
              PIXO
              <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
            </h1>
            <p className="text-sm text-muted-foreground mt-1 font-medium">
              Track upcoming coding battles
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Stats */}
          <div className="flex items-center gap-8 bg-card/40 backdrop-blur-xl p-5 rounded-[2rem] border border-border/50 shadow-xl hover:bg-card/60 transition-colors duration-300">
            <div className="text-right">
              <div className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Active Contests</div>
              <div className="text-2xl font-bold text-foreground leading-none tabular-nums">{contestCount}</div>
            </div>
            <div className="w-px h-10 bg-gradient-to-b from-transparent via-border to-transparent" />
            <div className="text-right">
              <div className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Local Time</div>
              <div className="text-sm font-bold text-foreground/90 tabular-nums leading-none">
                {currentTime.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false,
                })}
              </div>
            </div>
          </div>
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
