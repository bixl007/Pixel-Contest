export const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="p-6 bg-card/40 backdrop-blur-xl rounded-[2rem] border border-border/50 animate-pulse"
        >
          {/* Platform badge skeleton */}
          <div className="flex justify-between mb-6">
            <div className="h-8 w-24 bg-secondary/50 rounded-full" />
            <div className="h-8 w-16 bg-secondary/50 rounded-full" />
          </div>
          
          {/* Title skeleton */}
          <div className="h-8 w-full bg-secondary/50 rounded-lg mb-3" />
          <div className="h-8 w-2/3 bg-secondary/50 rounded-lg mb-8" />
          
          {/* Countdown skeleton */}
          <div className="grid grid-cols-4 gap-3 mb-8">
            {[...Array(4)].map((_, j) => (
              <div key={j} className="flex flex-col items-center p-3 rounded-2xl bg-secondary/30">
                <div className="h-6 w-8 bg-secondary/50 rounded mb-1" />
                <div className="h-3 w-6 bg-secondary/50 rounded" />
              </div>
            ))}
          </div>
          
          {/* Footer skeleton */}
          <div className="flex justify-between pt-6 border-t border-border/50">
            <div className="h-4 w-24 bg-secondary/50 rounded" />
            <div className="h-4 w-20 bg-secondary/50 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};
