export interface YouTubeThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface YouTubeSnippet {
  title: string;
  channelTitle: string;
  publishedAt: string;
  description: string;
  thumbnails: {
    default: YouTubeThumbnail;
    medium: YouTubeThumbnail;
    high: YouTubeThumbnail;
  };
}

export interface YouTubeContentDetails {
  duration: string;
}

export interface YouTubeStatistics {
  viewCount: string;
  likeCount: string;
  commentCount: string;
}

export interface YouTubeVideo {
  kind: string;
  etag: string;
  id: string;
  snippet: YouTubeSnippet;
  contentDetails?: YouTubeContentDetails;
  statistics?: YouTubeStatistics;
}

export interface YouTubeSearchItem {
  kind: string;
  etag: string;
  id: {
    kind: string;
    videoId: string;
  };
  snippet: YouTubeSnippet;
}

export interface VideosState {
  allVideos: YouTubeVideo[];
  shorts: YouTubeSearchItem[];
  currentVideo: YouTubeVideo | null;
  loading: boolean;
  error: string | null;
}

export interface SearchState {
  query: string;
  results: YouTubeSearchItem[];
  loading: boolean;
  error: string | null;
}