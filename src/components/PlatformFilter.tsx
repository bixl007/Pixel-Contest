interface PlatformFilterProps {
  platforms: string[];
  selectedPlatform: string;
  onSelect: (platform: string) => void;
}

const platformConfig: Record<string, { color: string; activeClass: string; hoverClass: string }> = {
  All: {
    color: '#a855f7',
    activeClass: 'bg-purple-500 text-white shadow-lg shadow-purple-500/25 border-purple-500',
    hoverClass: 'hover:bg-purple-500/10 hover:text-purple-400 hover:border-purple-500/30',
  },
  LeetCode: {
    color: '#ffa116',
    activeClass: 'bg-[#ffa116] text-white shadow-lg shadow-[#ffa116]/25 border-[#ffa116]',
    hoverClass: 'hover:bg-[#ffa116]/10 hover:text-[#ffa116] hover:border-[#ffa116]/30',
  },
  Codeforces: {
    color: '#3182ce',
    activeClass: 'bg-[#3182ce] text-white shadow-lg shadow-[#3182ce]/25 border-[#3182ce]',
    hoverClass: 'hover:bg-[#3182ce]/10 hover:text-[#3182ce] hover:border-[#3182ce]/30',
  },
  CodeChef: {
    color: '#d0b33f',
    activeClass: 'bg-[#d0b33f] text-white shadow-lg shadow-[#d0b33f]/25 border-[#d0b33f]',
    hoverClass: 'hover:bg-[#d0b33f]/10 hover:text-[#d0b33f] hover:border-[#d0b33f]/30',
  },
};

export const PlatformFilter = ({ platforms, selectedPlatform, onSelect }: PlatformFilterProps) => {
  const allPlatforms = ['All', ...platforms];

  return (
    <div className="flex flex-wrap gap-3 p-1.5 bg-secondary/30 dark:bg-white/10 backdrop-blur-2xl rounded-full border border-border/50 dark:border-white/20 shadow-2xl inline-flex">
      {allPlatforms.map((platform) => {
        const isActive = selectedPlatform === platform;
        const config = platformConfig[platform];
        
        return (
          <button
            key={platform}
            onClick={() => onSelect(platform)}
            className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-300 border ${
              isActive 
                ? config.activeClass
                : `bg-transparent border-transparent text-muted-foreground hover:text-foreground ${config.hoverClass}`
            }`}
          >
            {platform}
          </button>
        );
      })}
    </div>
  );
};
