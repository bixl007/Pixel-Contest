import { useCountdown } from '@/hooks/useCountdown';
import { Contest } from '@/hooks/useContests';
import { ExternalLink } from 'lucide-react';

interface ContestCardProps {
  contest: Contest;
}

const platformStyles = {
  LeetCode: {
    borderColor: 'border-[hsl(var(--leetcode))]',
    textColor: 'text-[hsl(var(--leetcode))]',
    bgColor: 'bg-[hsl(var(--leetcode))]/10',
  },
  Codeforces: {
    borderColor: 'border-[hsl(var(--codeforces))]',
    textColor: 'text-[hsl(var(--codeforces))]',
    bgColor: 'bg-[hsl(var(--codeforces))]/10',
  },
  CodeChef: {
    borderColor: 'border-[hsl(var(--codechef))]',
    textColor: 'text-[hsl(var(--codechef))]',
    bgColor: 'bg-[hsl(var(--codechef))]/10',
  },
};

const formatDuration = (seconds: string) => {
  const totalSeconds = parseInt(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  
  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  }
  return `${minutes}m`;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export const ContestCard = ({ contest }: ContestCardProps) => {
  const countdown = useCountdown(contest.start_time, contest.end_time);
  const styles = platformStyles[contest.site];

  return (
    <a
      href={contest.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block p-6 pixel-card group relative overflow-hidden`}
    >
      {/* Hover Effect Overlay */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 pointer-events-none transition-opacity duration-200 ${styles.bgColor.replace('/10', '')}`} />

      {/* Platform Badge */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <span className={`text-[10px] font-bold uppercase tracking-wider ${styles.textColor} px-2 py-1 ${styles.bgColor} border-2 ${styles.borderColor}`}>
          {contest.site}
        </span>
        {countdown.isLive && (
          <span className="flex items-center gap-2 text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 border-2 border-primary animate-pulse">
            <span className="w-2 h-2 bg-primary" />
            LIVE
          </span>
        )}
        {countdown.isStartingSoon && !countdown.isLive && (
          <span className="text-[10px] font-bold text-yellow-500 bg-yellow-500/10 px-2 py-1 border-2 border-yellow-500">
            SOON
          </span>
        )}
      </div>

      {/* Contest Name */}
      <h3 className="text-xs font-bold text-foreground mb-6 line-clamp-2 leading-relaxed group-hover:text-primary transition-colors relative z-10 h-12">
        {contest.name}
      </h3>

      {/* Countdown Timer */}
      <div className="grid grid-cols-4 gap-2 mb-6 p-2 bg-secondary border-2 border-border relative z-10">
        {[
          { value: countdown.days, label: 'D' },
          { value: countdown.hours, label: 'H' },
          { value: countdown.minutes, label: 'M' },
          { value: countdown.seconds, label: 'S' },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <div className={`text-sm font-bold tabular-nums ${countdown.isLive ? 'text-primary' : 'text-foreground'}`}>
              {String(item.value).padStart(2, '0')}
            </div>
            <div className="text-[8px] text-muted-foreground font-bold mt-1">
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* Date & Duration */}
      <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-3 border-t-2 border-border relative z-10">
        <div className="flex flex-col gap-1">
          <span className="font-bold text-foreground">{formatDate(contest.start_time)}</span>
          <span>{formatTime(contest.start_time)}</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span>DURATION</span>
          <span className="font-bold text-foreground">{formatDuration(contest.duration)}</span>
        </div>
      </div>
    </a>
  );
};

