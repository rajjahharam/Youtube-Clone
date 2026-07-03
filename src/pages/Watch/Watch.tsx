import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ThumbsUp, ChevronDown, ChevronUp } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchVideoById } from "../../features/videos/videosSlice";
import {
  addComment,
  seedComments,
} from "../../features/comments/commentsSlice";
import CommentItem from "../../components/CommentItem/CommentItem";
import WatchSkeleton from "../../components/Skeleton/WatchSkeleton";
import CommentSkeleton from "../../components/Skeleton/CommentSkeleton";

const formatViews = (viewCount?: string): string => {
  if (!viewCount) return "";
  const num = parseInt(viewCount, 10);
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M views`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K views`;
  return `${num} views`;
};

const Watch = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const dispatch = useAppDispatch();

  const { currentVideo, loading, error } = useAppSelector((state) => state.videos);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [subscribed, setSubscribed] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const comments = useAppSelector((state) =>
    videoId ? state.comments.byVideoId[videoId] ?? [] : []
  );

  useEffect(() => {
    if (videoId) {
      dispatch(fetchVideoById(videoId));
      dispatch(seedComments({ videoId }));
    }
  }, [dispatch, videoId]);

  useEffect(() => {
    if (currentVideo?.statistics?.likeCount) {
      setLikeCount(parseInt(currentVideo.statistics.likeCount, 10));
    }
  }, [currentVideo]);

  const handleLike = () => {
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    setLiked((prev) => !prev);
  };

  const handleAddComment = () => {
    if (!videoId || commentText.trim() === "") return;
    dispatch(addComment({ videoId, text: commentText.trim() }));
    setCommentText("");
  };

  if (loading) return <WatchSkeleton />;
  if (error || !currentVideo) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        Failed to load video: {error ?? "Not found"}
      </div>
    );
  }

  const { title, channelTitle, description } = currentVideo.snippet;
  const viewCount = formatViews(currentVideo.statistics?.viewCount);

  return (
    <div className="max-w-5xl mx-auto px-4">
      {/* Video Player */}
      <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-2xl mb-5">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Title */}
      <h1 className="text-xl font-bold text-white leading-tight mb-4">{title}</h1>

    {/* Channel + Actions */}
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
  <div className="flex items-center gap-4">
    <div className="w-11 h-11 rounded-full bg-neutral-700 flex items-center justify-center text-lg font-semibold flex-shrink-0">
      {channelTitle.charAt(0).toUpperCase()}
    </div>
    <div>
      <p className="font-medium text-white">{channelTitle}</p>
      <p className="text-xs text-neutral-400">1.2M subscribers</p>
    </div>
    
    <button
      onClick={() => setSubscribed(!subscribed)}
      className={`ml-2 px-6 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
        subscribed 
          ? "bg-neutral-800 text-white hover:bg-neutral-700" 
          : "bg-white text-black hover:bg-neutral-200"
      }`}
    >
      {subscribed ? "Subscribed" : "Subscribe"}
    </button>
  </div>

  <button
    onClick={handleLike}
    className={`flex items-center gap-3 px-6 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
      liked ? "bg-blue-600 text-white" : "bg-neutral-800 hover:bg-neutral-700 text-white"
    }`}
  >
    <ThumbsUp size={18} className={liked ? "fill-white" : ""} />
    <span>{likeCount.toLocaleString()}</span>
  </button>
</div>

      {/* Description */}
      <div 
        className={`bg-neutral-900 rounded-2xl p-4 mt-4 cursor-pointer transition-all ${isDescriptionExpanded ? 'max-h-none' : 'line-clamp-3'}`}
        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
      >
        <div className="flex items-center justify-between text-xs text-neutral-400 mb-3">
          <span>{viewCount}</span>
          <span className="flex items-center gap-1">
            {isDescriptionExpanded ? "Show less" : "Show more"} 
            {isDescriptionExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </div>
        <p className="text-sm text-neutral-300 whitespace-pre-line">
          {description || "No description available."}
        </p>
      </div>

      {/* Comments Section */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-white mb-6">
          {comments.filter((c) => !c.parentId).length} Comments
        </h2>

        {/* Add Comment */}
        <div className="flex gap-4 mb-8">
          <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-black font-semibold flex-shrink-0">U</div>
          <div className="flex-1">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              placeholder="Add a public comment..."
              className="w-full bg-transparent border-b border-neutral-700 pb-3 text-sm focus:border-white outline-none"
            />
            {commentText && (
              <div className="flex justify-end gap-3 mt-3">
                <button onClick={() => setCommentText("")} className="px-5 py-2 text-sm text-neutral-400 hover:text-white">Cancel</button>
                <button onClick={handleAddComment} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-full">Comment</button>
              </div>
            )}
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-6">
          {comments.length === 0 ? (
            Array.from({ length: 4 }).map((_, i) => <CommentSkeleton key={i} />)
          ) : (
            comments
              .filter((c) => !c.parentId)
              .map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  videoId={videoId!}
                  replies={comments.filter((c) => c.parentId === comment.id)}
                />
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Watch;