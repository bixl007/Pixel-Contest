import { useCountdown } from '@/hooks/useCountdown';
import { Contest } from '@/hooks/useContests';
import { ExternalLink } from 'lucide-react';

interface ContestCardProps {
  contest: Contest;
}

const platformStyles = {
  LeetCode: {
    bg: 'bg-leetcode/10',
    border: 'border-leetcode',
    text: 'text-leetcode',
    glow: 'hover:shadow-[0_0_20px_hsl(var(--leetcode)/0.3)]',
  },
  Codeforces: {
    bg: 'bg-codeforces/10',
    border: 'border-codeforces',
    text: 'text-codeforces',
    glow: 'hover:shadow-[0_0_20px_hsl(var(--codeforces)/0.3)]',
  },
  CodeChef: {
    bg: 'bg-codechef/10',
    border: 'border-codechef',
    text: 'text-codechef',
    glow: 'hover:shadow-[0_0_20px_hsl(var(--codechef)/0.3)]',
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
      className={`block p-4 md:p-6 bg-card border-2 ${styles.border} ${styles.glow} transition-all duration-300 group`}
    >
      {/* Platform Badge */}
      <div className="flex items-center justify-between mb-4">
        <span className={`text-[8px] md:text-[10px] ${styles.text} px-2 py-1 ${styles.bg} border ${styles.border}`}>
          {contest.site.toUpperCase()}
        </span>
        {countdown.isLive && (
          <span className="text-[8px] md:text-[10px] text-primary px-2 py-1 bg-primary/20 border border-primary animate-pulse-slow">
            ● LIVE
          </span>
        )}
        {countdown.isStartingSoon && !countdown.isLive && (
          <span className="text-[8px] md:text-[10px] text-accent px-2 py-1 bg-accent/20 border border-accent animate-pulse-slow">
            SOON
          </span>
        )}
      </div>

      {/* Contest Name */}
      <h3 className="text-[10px] md:text-xs text-foreground mb-4 leading-relaxed line-clamp-2 min-h-[2.5em]">
        {contest.name}
      </h3>

      {/* Countdown Timer */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[
          { value: countdown.days, label: 'DAYS' },
          { value: countdown.hours, label: 'HRS' },
          { value: countdown.minutes, label: 'MIN' },
          { value: countdown.seconds, label: 'SEC' },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <div className={`text-sm md:text-lg ${countdown.isLive ? 'text-primary' : countdown.isStartingSoon ? 'text-accent' : 'text-foreground'}`}>
              {String(item.value).padStart(2, '0')}
            </div>
            <div className="text-[6px] md:text-[8px] text-muted-foreground">
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* Date & Duration */}
      <div className="flex items-center justify-between text-[8px] md:text-[10px] text-muted-foreground border-t border-border pt-3">
        <div>
          <div>{formatDate(contest.start_time)}</div>
          <div>{formatTime(contest.start_time)}</div>
        </div>
        <div className="text-right">
          <div>DURATION</div>
          <div className="text-foreground">{formatDuration(contest.duration)}</div>
        </div>
      </div>

      {/* External Link Icon */}
      <div className="mt-3 flex justify-end">
        <ExternalLink className={`w-3 h-3 md:w-4 md:h-4 ${styles.text} opacity-50 group-hover:opacity-100 transition-opacity`} />
      </div>
    </a>
  );
};
