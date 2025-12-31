export const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="p-6 bg-card border-2 pixel-shadow animate-pulse"
        >
          {/* Platform badge skeleton */}
          <div className="flex justify-between mb-6">
            <div className="h-6 w-24 bg-secondary" />
          </div>
          
          {/* Title skeleton */}
          <div className="h-6 w-full bg-secondary mb-2" />
          <div className="h-6 w-3/4 bg-secondary mb-6" />
          
          {/* Countdown skeleton */}
          <div className="grid grid-cols-4 gap-2 mb-6 p-3 bg-secondary border-2 border-muted-foreground/20">
            {[...Array(4)].map((_, j) => (
              <div key={j} className="flex flex-col items-center gap-1">
                <div className="h-6 w-8 bg-secondary" />
                <div className="h-3 w-6 bg-secondary" />
              </div>
            ))}
          </div>
          
          {/* Footer skeleton */}
          <div className="flex justify-between pt-2 border-t-2 border-muted">
            <div className="h-8 w-24 bg-secondary" />
            <div className="h-8 w-16 bg-secondary" />
          </div>
        </div>
      ))}
    </div>
  );
};
