const VideoCardSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Thumbnail */}
      <div className="aspect-video bg-neutral-800 rounded-xl mb-3"></div>
      
      {/* Info */}
      <div className="flex gap-3">
        {/* Channel Avatar */}
        <div className="w-9 h-9 rounded-full bg-neutral-800 flex-shrink-0"></div>
        
        <div className="flex-1 space-y-2">
          {/* Title */}
          <div className="h-4 bg-neutral-800 rounded w-4/5"></div>
          <div className="h-4 bg-neutral-800 rounded w-3/4"></div>
          
          {/* Channel name */}
          <div className="h-3 bg-neutral-800 rounded w-2/3 mt-3"></div>
          
          {/* Metadata */}
          <div className="h-3 bg-neutral-800 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
};

export default VideoCardSkeleton;