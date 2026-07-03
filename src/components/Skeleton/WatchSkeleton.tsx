const WatchSkeleton = () => {
  return (
    <div className="max-w-4xl animate-pulse">
      {/* Video Player */}
      <div className="aspect-video bg-neutral-900 rounded-xl mb-4"></div>

      {/* Title */}
      <div className="h-6 bg-neutral-800 rounded w-3/4 mb-4"></div>

      {/* Channel + Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neutral-800"></div>
          <div className="space-y-2">
            <div className="h-4 bg-neutral-800 rounded w-32"></div>
            <div className="h-3 bg-neutral-800 rounded w-24"></div>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="h-9 w-28 bg-neutral-800 rounded-full"></div>
          <div className="h-9 w-28 bg-neutral-800 rounded-full"></div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-neutral-900 rounded-xl p-4 mb-8 space-y-3">
        <div className="h-4 bg-neutral-800 rounded w-1/3"></div>
        <div className="space-y-2">
          <div className="h-4 bg-neutral-800 rounded"></div>
          <div className="h-4 bg-neutral-800 rounded w-11/12"></div>
          <div className="h-4 bg-neutral-800 rounded w-4/5"></div>
        </div>
      </div>

      {/* Comments Header */}
      <div className="h-7 bg-neutral-800 rounded w-48 mb-6"></div>
    </div>
  );
};

export default WatchSkeleton;