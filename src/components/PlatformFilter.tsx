interface PlatformFilterProps {
  platforms: string[];
  selectedPlatform: string;
  onSelect: (platform: string) => void;
}

const platformConfig: Record<string, { color: string; activeClass: string }> = {
  All: {
    color: 'border-primary text-primary',
    activeClass: 'bg-primary text-primary-foreground',
  },
  LeetCode: {
    color: 'border-leetcode text-leetcode',
    activeClass: 'bg-leetcode text-background',
  },
  Codeforces: {
    color: 'border-codeforces text-codeforces',
    activeClass: 'bg-codeforces text-background',
  },
  CodeChef: {
    color: 'border-codechef text-codechef',
    activeClass: 'bg-codechef text-background',
  },
};

export const PlatformFilter = ({ platforms, selectedPlatform, onSelect }: PlatformFilterProps) => {
  const allPlatforms = ['All', ...platforms];

  return (
    <div className="flex flex-wrap gap-2 md:gap-3">
      {allPlatforms.map((platform) => {
        const isActive = selectedPlatform === platform;
        const config = platformConfig[platform];
        
        return (
          <button
            key={platform}
            onClick={() => onSelect(platform)}
            className={`px-3 py-2 text-[8px] md:text-[10px] border-2 transition-all duration-200 ${
              isActive 
                ? config.activeClass 
                : `${config.color} bg-transparent hover:bg-secondary`
            }`}
          >
            {platform.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
};
