const SidebarSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Mini Video Cards */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-3">
          <div className="w-40 aspect-video bg-neutral-800 rounded-xl flex-shrink-0"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-neutral-800 rounded"></div>
            <div className="h-4 bg-neutral-800 rounded w-4/5"></div>
            <div className="h-3 bg-neutral-800 rounded w-3/4 mt-3"></div>
          </div>
        </div>
      ))}
    </div>
  );