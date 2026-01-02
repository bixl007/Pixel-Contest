import { useCountdown } from '@/hooks/useCountdown';
import { Contest } from '@/hooks/useContests';
import { ExternalLink, Timer, Code2, Trophy, Terminal } from 'lucide-react';
import { useMemo } from 'react';

interface ContestCardProps {
  contest: Contest;
}

const platformConfig: Record<string, { color: string; icon: any }> = {
  LeetCode: {
    color: '#ffa116',
    icon: Code2,
  },
  Codeforces: {
    color: '#3182ce',
    icon: Terminal,
  },
  CodeChef: {
    color: '#d0b33f',
    icon: Trophy,
  },
  Default: {
    color: '#a855f7',
    icon: Code2,
  }
};

export const ContestCard = ({ contest }: ContestCardProps) => {
  const countdown = useCountdown(contest.start_time, contest.end_time);
  const config = platformConfig[contest.site] || platformConfig.Default;
  
  const start = new Date(contest.start_time);
  const end = new Date(contest.end_time);
  const now = new Date();
  
  const durationMs = end.getTime() - start.getTime();
  const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
  const durationMins = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  
  const durationString = durationHours > 0 
    ? `${durationHours}h ${durationMins > 0 ? `${durationMins}m` : ''}`
    : `${durationMins}m`;

  // Calculate progress for the curve icon
  const progress = useMemo(() => {
    if (countdown.isLive) {
      const total = end.getTime() - start.getTime();
      const elapsed = now.getTime() - start.getTime();
      return Math.min(Math.max((elapsed / total) * 100, 0), 100);
    }
    return 0;
  }, [countdown, start, end, now]);

  // Calculate icon position on Quadratic Bezier Curve
  // P0=(0,60), P1=(50,0), P2=(100,60)
  // y(t) = (1-t)^2(60) + 2(1-t)t(0) + t^2(60)
  const t = progress / 100;
  const yVal = 60 * Math.pow(1 - t, 2) + 60 * Math.pow(t, 2);
  const yPercent = (yVal / 60) * 100;

  return (
    <div className="group relative h-full">
      <div 
        className="relative h-full overflow-hidden rounded-[2.5rem] bg-card/40 backdrop-blur-xl border border-border/50 p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
      >
        {/* Dynamic Hover Shadow */}
        <div 
            className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
                boxShadow: `0 20px 40px -10px ${config.color}30`
            }}
        />
        
        {/* Glow Top Center */}
        <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 blur-[60px] rounded-full pointer-events-none transition-colors duration-300"
            style={{ backgroundColor: `${config.color}20` }} 
        />

        {/* Header */}
        <div className="relative flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <config.icon className="w-5 h-5" style={{ color: config.color }} />
            <span className="text-lg font-medium text-foreground/90">{contest.site}</span>
          </div>
          
          <a 
            href={contest.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-secondary/50 border border-border/50 text-xs font-medium text-foreground hover:bg-secondary transition-all duration-300"
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${config.color}60`;
                e.currentTarget.style.backgroundColor = `${config.color}20`;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '';
                e.currentTarget.style.backgroundColor = '';
            }}
          >
            <span>Enter</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Main Stats */}
        <div className="relative flex justify-between items-end mb-12">
          <div>
            <div className="text-sm text-muted-foreground mb-2 font-medium">
                {countdown.isLive ? 'Ends In' : 'Starts In'}
            </div>
            <div className="text-3xl font-bold text-foreground tracking-tight tabular-nums">
              {countdown.days > 0 ? `${countdown.days}d ` : ''}
              {countdown.hours}h {countdown.minutes}m
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground mb-2 font-medium">Duration</div>
            <div className="text-3xl font-bold text-foreground tracking-tight tabular-nums">
              {durationString}
            </div>
          </div>
        </div>

        {/* Curve Visualization */}
        <div className="relative h-16 mb-8 w-full select-none pointer-events-none">
          <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 60" preserveAspectRatio="none">
            <path 
              d="M 0,60 Q 50,0 100,60" 
              fill="none" 
              stroke="currentColor" 
              className="text-muted-foreground/20"
              strokeWidth="2" 
              strokeDasharray="4 4"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          
          {/* Start Dot */}
          <div 
            className="absolute left-0 bottom-0 w-3 h-3 rounded-full bg-card border-2 translate-y-1/2 z-10"
            style={{ borderColor: config.color, boxShadow: `0 0 10px ${config.color}80` }}
          />
          
          {/* End Dot */}
          <div className="absolute right-0 bottom-0 w-3 h-3 rounded-full bg-card border-2 border-muted-foreground/20 translate-y-1/2 z-10" />
          
          {/* Floating Icon */}
          <div 
            className="absolute w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center shadow-lg shadow-black/10 z-20 transition-all duration-1000 ease-linear group/icon cursor-default pointer-events-auto"
            style={{ 
                left: `${progress}%`,
                top: `${yPercent}%`,
                transform: 'translate(-50%, -50%)',
                borderColor: countdown.isLive ? config.color : undefined
            }}
          >
             {countdown.isLive ? (
                 <Timer className="w-5 h-5 animate-pulse" style={{ color: config.color }} />
             ) : (
                 <Timer className="w-5 h-5 text-muted-foreground" />
             )}
             
             {/* Status Tooltip */}
             <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-popover border border-border rounded-lg text-[10px] font-medium text-popover-foreground whitespace-nowrap opacity-0 group-hover/icon:opacity-100 transition-opacity duration-200 pointer-events-none shadow-xl z-30">
                {countdown.isLive ? "Ongoing" : "Yet to start"}
                <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-popover border-r border-b border-border rotate-45"></div>
             </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="relative flex justify-between items-start">
          <div>
            <div className="text-xs text-muted-foreground mb-1 font-medium">
                {countdown.isLive ? 'Started' : 'Start Date'}
            </div>
            <div className="text-sm font-medium text-foreground/90">
              {start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
             <div className="text-xs text-muted-foreground/80 mt-0.5">
              {start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          
          <div className="text-right max-w-[50%]">
             <div className="text-xs text-muted-foreground mb-1 font-medium">Contest</div>
             <div className="text-sm font-medium text-foreground/90 truncate" title={contest.name}>
              {contest.name}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
