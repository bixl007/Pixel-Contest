import { useState, useMemo } from "react";
import { useContests } from "@/hooks/useContests";
import { Header } from "@/components/Header";
import { PlatformFilter } from "@/components/PlatformFilter";
import { ContestCard } from "@/components/ContestCard";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { AlertCircle, RefreshCw } from "lucide-react";

const PLATFORMS = ["LeetCode", "Codeforces", "CodeChef"];

const Index = () => {
  const { data: contests, isLoading, error, refetch, isRefetching } = useContests();
  const [selectedPlatform, setSelectedPlatform] = useState<string>("All");

  const filteredContests = useMemo(() => {
    if (!contests) return [];
    return contests.filter((contest) => {
      if (selectedPlatform === "All") return true;
      return contest.site === selectedPlatform;
    });
  }, [contests, selectedPlatform]);

  return (
    <div className="min-h-screen bg-transparent p-6 md:p-12 font-pixel relative">
      <div className="scanlines" />
      <div className="max-w-7xl mx-auto relative z-10">
        <Header contestCount={filteredContests.length} />

        {/* Filters Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="text-[10px] font-bold text-muted-foreground mb-3 uppercase tracking-wider">Filter by Platform</div>
            <PlatformFilter 
              platforms={PLATFORMS} 
              selectedPlatform={selectedPlatform} 
              onSelect={setSelectedPlatform} 
            />
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => refetch()}
            disabled={isRefetching}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-muted-foreground hover:text-primary bg-card hover:bg-card/80 border-2 pixel-shadow transition-none disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-4 p-4 mb-8 bg-destructive/10 border-2 border-destructive text-destructive pixel-shadow">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <div className="font-bold text-sm">Error Loading Contests</div>
              <div className="text-xs opacity-90 mt-1">
                {error.message || "Failed to fetch contest data. Please try again."}
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && <LoadingSkeleton />}

        {/* Empty State */}
        {!isLoading && !error && filteredContests.length === 0 && (
          <div className="text-center py-20 bg-card border-2 border-dashed">
            <div className="text-muted-foreground font-bold mb-2 text-sm">No contests found</div>
            <div className="text-xs text-muted-foreground/70">Try selecting different platforms</div>
          </div>
        )}

        {/* Contest Grid */}
        {!isLoading && !error && filteredContests.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContests.map((contest, index) => (
              <ContestCard key={`${contest.site}-${contest.name}-${index}`} contest={contest} />
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t-2 border-border text-center">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Made with ❤️ by <a href="https://xyrix.xyz" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Bishal Baira</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
