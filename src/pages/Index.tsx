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
    <div className="min-h-screen w-full bg-background relative font-sans selection:bg-primary/20 transition-colors duration-300">
      {/* Aurora Mystic Mist Background */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 100%, rgba(58, 175, 169, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 50% 100%, rgba(255, 140, 0, 0.15) 0%, transparent 60%),
            radial-gradient(circle at 50% 100%, rgba(238, 130, 238, 0.1) 0%, transparent 70%)
          `,
        }}
      />
      <div className="max-w-7xl mx-auto relative z-10 p-6 md:p-12">
        <Header contestCount={filteredContests.length} />

        {/* Filters Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">Filter by Platform</div>
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
            className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-foreground hover:text-primary bg-card/40 backdrop-blur-xl hover:bg-card/60 rounded-full transition-all duration-200 disabled:opacity-50 border border-border/50 hover:border-primary/20 shadow-lg"
          >
            <RefreshCw className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-4 p-6 mb-8 bg-destructive/10 backdrop-blur-md border border-destructive/20 rounded-2xl text-destructive shadow-lg">
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
          <div className="text-center py-20 bg-card/20 backdrop-blur-md border border-dashed border-border/50 rounded-[2rem]">
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
        <footer className="mt-20 pt-8 border-t border-border/40 text-center">
          <div className="text-xs font-medium text-muted-foreground">
            Made with ❤️ by <a href="https://xyrix.xyz" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Bishal Baira</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
