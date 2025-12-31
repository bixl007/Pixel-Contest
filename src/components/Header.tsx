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
    <header className="border-b-2 border-border pb-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 border-2 border-primary">
            <Terminal className="w-5 h-5 md:w-6 md:h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-sm md:text-base text-primary">
              CONTEST_TRACKER
            </h1>
            <p className="text-[8px] md:text-[10px] text-muted-foreground mt-1">
              UPCOMING CODING BATTLES
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="text-right">
            <div className="text-[8px] md:text-[10px] text-muted-foreground">CONTESTS</div>
            <div className="text-lg md:text-xl text-primary">{contestCount}</div>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-right">
            <div className="text-[8px] md:text-[10px] text-muted-foreground">LOCAL TIME</div>
            <div className="text-[10px] md:text-xs text-foreground">
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

      {/* Blinking cursor effect */}
      <div className="mt-4 text-[10px] md:text-xs text-muted-foreground flex items-center gap-1">
        <span>{'>'}</span>
        <span>LOADING LIVE DATA</span>
        <span className="animate-blink">_</span>
      </div>
    </header>
  );
};
