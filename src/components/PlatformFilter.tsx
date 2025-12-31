interface PlatformFilterProps {
  platforms: string[];
  selectedPlatform: string;
  onSelect: (platform: string) => void;
}

const platformConfig: Record<string, { color: string; activeClass: string }> = {
  All: {
    color: 'text-primary hover:bg-primary/10 border-primary/50',
    activeClass: 'bg-primary text-primary-foreground border-primary',
  },
  LeetCode: {
    color: 'text-[hsl(var(--leetcode))] hover:bg-[hsl(var(--leetcode))]/10 border-[hsl(var(--leetcode))]/50',
    activeClass: 'bg-[hsl(var(--leetcode))] text-black border-[hsl(var(--leetcode))]',
  },
  Codeforces: {
    color: 'text-[hsl(var(--codeforces))] hover:bg-[hsl(var(--codeforces))]/10 border-[hsl(var(--codeforces))]/50',
    activeClass: 'bg-[hsl(var(--codeforces))] text-black border-[hsl(var(--codeforces))]',
  },
  CodeChef: {
    color: 'text-[hsl(var(--codechef))] hover:bg-[hsl(var(--codechef))]/10 border-[hsl(var(--codechef))]/50',
    activeClass: 'bg-[hsl(var(--codechef))] text-black border-[hsl(var(--codechef))]',
  },
};

export const PlatformFilter = ({ platforms, selectedPlatform, onSelect }: PlatformFilterProps) => {
  const allPlatforms = ['All', ...platforms];

  return (
    <div className="flex flex-wrap gap-4">
      {allPlatforms.map((platform) => {
        const isActive = selectedPlatform === platform;
        const config = platformConfig[platform];
        
        return (
          <button
            key={platform}
            onClick={() => onSelect(platform)}
            className={`px-4 py-2 text-[10px] uppercase font-bold border-2 transition-all duration-200 ${
              isActive 
                ? `${config.activeClass} pixel-shadow translate-x-[-2px] translate-y-[-2px]` 
                : `${config.color} bg-transparent hover:border-current hover:pixel-shadow hover:translate-x-[-2px] hover:translate-y-[-2px]`
            }`}
          >
            {platform}
          </button>
        );
      })}
    </div>
  );
};
