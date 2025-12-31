export const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="p-4 md:p-6 bg-card border-2 border-border animate-pulse"
        >
          {/* Platform badge skeleton */}
          <div className="flex justify-between mb-4">
            <div className="h-5 w-20 bg-secondary" />
          </div>
          
          {/* Title skeleton */}
          <div className="h-4 w-full bg-secondary mb-2" />
          <div className="h-4 w-3/4 bg-secondary mb-4" />
          
          {/* Countdown skeleton */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[...Array(4)].map((_, j) => (
              <div key={j} className="text-center">
                <div className="h-6 w-full bg-secondary mb-1" />
                <div className="h-3 w-full bg-secondary/50" />
              </div>
            ))}
          </div>
          
          {/* Footer skeleton */}
          <div className="border-t border-border pt-3">
            <div className="h-3 w-1/3 bg-secondary" />
          </div>
        </div>
      ))}
    </div>
  );
};
