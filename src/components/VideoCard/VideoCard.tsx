import { useNavigate } from "react-router-dom";
import type { YouTubeVideo, YouTubeSearchItem } from "../../types/youtube";

interface VideoCardProps {
  video: YouTubeVideo | YouTubeSearchItem;
}

// Type guard to check if it's a full video (has statistics) or search item
const isFullVideo = (
  video: YouTubeVideo | YouTubeSearchItem
): video is YouTubeVideo => {
  return "statistics" in video;
};

const getVideoId = (video: YouTubeVideo | YouTubeSearchItem): string => {
  return isFullVideo(video) ? video.id : video.id.videoId;
};

const formatViews = (viewCount?: string): string => {
  if (!viewCount) return "";
  const num = parseInt(viewCount, 10);
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M views`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K views`;
  return `${num} views`;
};

const formatDuration = (duration?: string): string => {
  if (!duration) return "";
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return "";
  const hours = match[1] ? match[1].replace("H", "") : "";
  const minutes = match[2] ? match[2].replace("M", "") : "0";
  const seconds = match[3] ? match[3].replace("S", "").padStart(2, "0") : "00";
  return hours
    ? `${hours}:${minutes.padStart(2, "0")}:${seconds}`
    : `${minutes}:${seconds}`;
};

const formatTimeAgo = (publishedAt: string): string => {
  const diff = Date.now() - new Date(publishedAt).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 1) return "Today";
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? "s" : ""} ago`;
};

const VideoCard = ({ video }: VideoCardProps) => {
  const navigate = useNavigate();
  const videoId = getVideoId(video);
  const { title, channelTitle, thumbnails, publishedAt } = video.snippet;
  const thumbnailUrl = thumbnails.medium.url;

  const views = isFullVideo(video)
    ? formatViews(video.statistics?.viewCount)
    : "";
  const duration = isFullVideo(video)
    ? formatDuration(video.contentDetails?.duration)
    : "";

  return (
    <div
      className="cursor-pointer group"
      onClick={() => navigate(`/watch/${videoId}`)}
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-neutral-800">
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        {duration && (
          <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
            {duration}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex gap-3 mt-3">
        <div className="w-9 h-9 rounded-full bg-neutral-700 flex-shrink-0 flex items-center justify-center text-xs font-semibold">
          {channelTitle.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-white line-clamp-2 leading-snug">
            {title}
          </h3>
          <p className="text-xs text-neutral-400 mt-1">{channelTitle}</p>
          <p className="text-xs text-neutral-400">
            {views && `${views} • `}
            {formatTimeAgo(publishedAt)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;