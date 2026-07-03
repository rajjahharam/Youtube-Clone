const CommentSkeleton = () => {
  return (
    <div className="flex gap-3 animate-pulse">
      <div className="w-8 h-8 rounded-full bg-neutral-800 flex-shrink-0"></div>
      
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-3.5 bg-neutral-800 rounded w-24"></div>
          <div className="h-3 bg-neutral-800 rounded w-12"></div>
        </div>
        <div className="space-y-1.5">
          <div className="h-4 bg-neutral-800 rounded w-full"></div>
          <div className="h-4 bg-neutral-800 rounded w-5/6"></div>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-6 pt-1">
          <div className="h-6 w-12 bg-neutral-800 rounded"></div>
          <div className="h-6 w-10 bg-neutral-800 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default CommentSkeleton;