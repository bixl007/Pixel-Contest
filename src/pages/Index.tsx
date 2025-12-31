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
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Header contestCount={filteredContests.length} />

        {/* Filters Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="text-[10px] md:text-xs text-muted-foreground mb-2">{">"} FILTER BY PLATFORM</div>
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
            className="flex items-center gap-2 px-3 py-2 text-[8px] md:text-[10px] border-2 border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isRefetching ? "animate-spin" : ""}`} />
            REFRESH
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-3 p-4 mb-8 bg-destructive/10 border-2 border-destructive text-destructive">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <div className="text-[10px] md:text-xs">ERROR LOADING CONTESTS</div>
              <div className="text-[8px] md:text-[10px] opacity-80 mt-1">
                {error.message || "Failed to fetch contest data. Please try again."}
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && <LoadingSkeleton />}

        {/* Empty State */}
        {!isLoading && !error && filteredContests.length === 0 && (
          <div className="text-center py-16 border-2 border-border">
            <div className="text-muted-foreground text-xs md:text-sm mb-2">NO CONTESTS FOUND</div>
            <div className="text-[8px] md:text-[10px] text-muted-foreground/70">TRY SELECTING DIFFERENT PLATFORMS</div>
          </div>
        )}

        {/* Contest Grid */}
        {!isLoading && !error && filteredContests.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredContests.map((contest, index) => (
              <ContestCard key={`${contest.site}-${contest.name}-${index}`} contest={contest} />
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t-2 border-border text-center">
          <div className="text-[8px] md:text-[10px] text-muted-foreground">
            DATA FROM KONTESTS.NET • AUTO-REFRESH EVERY 30 MIN
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
