import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { VideosState, YouTubeVideo, YouTubeSearchItem } from "../../types/youtube";
import type { RootState } from "../../app/store";

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY as string;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

export const fetchVideos = createAsyncThunk<YouTubeVideo[], void, { rejectValue: string }>(
  "videos/fetchVideos",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/videos?part=snippet,contentDetails,statistics&chart=mostPopular&maxResults=20&regionCode=US&key=${API_KEY}`
      );
      if (!response.ok) throw new Error("Failed to fetch videos");
      const data = await response.json();
      return data.items as YouTubeVideo[];
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// pageToken undefined = first page. Passing it means "load more."
// Return shape now carries nextPageToken so the slice can track whether
// there's anything left to fetch — the old version threw this away.
export const fetchShorts = createAsyncThunk<
  { items: YouTubeSearchItem[]; nextPageToken: string | null },
  string | undefined,
  { rejectValue: string; state: RootState }
>(
  "videos/fetchShorts",
  async (pageToken, { rejectWithValue }) => {
    try {
      const pageParam = pageToken ? `&pageToken=${pageToken}` : "";
      const response = await fetch(
        `${BASE_URL}/search?part=snippet&q=shorts&type=video&videoDuration=short&maxResults=20&key=${API_KEY}${pageParam}`
      );
      if (!response.ok) throw new Error("Failed to fetch shorts");
      const data = await response.json();
      return {
        items: data.items as YouTubeSearchItem[],
        nextPageToken: data.nextPageToken ?? null,
      };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
  {
    // Bail out before firing the request if: a load-more is already in
    // flight (prevents duplicate calls if the scroll trigger fires twice),
    // or we already know there are no more pages (prevents a guaranteed
    // wasted 100-unit call once shortsHasMore is false).
    condition: (pageToken, { getState }) => {
      const { videos } = getState();
      if (videos.shortsLoadingMore) return false;
      if (pageToken && !videos.shortsHasMore) return false;
      return true;
    },
  }
);

export const fetchVideoById = createAsyncThunk<YouTubeVideo, string, { rejectValue: string }>(
  "videos/fetchVideoById",
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${API_KEY}`
      );
      if (!response.ok) throw new Error("Failed to fetch video");
      const data = await response.json();
      if (!data.items || data.items.length === 0) {
        throw new Error("Video not found");
      }
      return data.items[0] as YouTubeVideo;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const initialState: VideosState = {
  allVideos: [],
  shorts: [],
  shortsNextPageToken: null,
  shortsHasMore: true,
  shortsLoadingMore: false,
  currentVideo: null,
  loading: false,
  error: null,
};

const videosSlice = createSlice({
  name: "videos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.allVideos = action.payload;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      })

      // fetchShorts.pending: distinguish first page vs load-more by the
      // arg (pageToken). First page uses the existing full-screen `loading`
      // flag. Load-more uses its own flag so the already-rendered feed
      // does NOT get replaced by the loading screen on every page fetch.
      .addCase(fetchShorts.pending, (state, action) => {
        if (action.meta.arg) {
          state.shortsLoadingMore = true;
        } else {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchShorts.fulfilled, (state, action) => {
        const { items, nextPageToken } = action.payload;
        const isLoadMore = !!action.meta.arg;

        if (isLoadMore) {
          // Dedupe: YouTube's search endpoint can return overlapping
          // results across page boundaries. Without this you get repeated
          // videoIds in the feed, which also breaks the IntersectionObserver
          // logic in Shorts.tsx (data-video-id keys collide).
          const existingIds = new Set(state.shorts.map((s) => s.id.videoId));
          const deduped = items.filter((item) => !existingIds.has(item.id.videoId));
          state.shorts = [...state.shorts, ...deduped];
          state.shortsLoadingMore = false;
        } else {
          state.shorts = items;
          state.loading = false;
        }

        state.shortsNextPageToken = nextPageToken;
        state.shortsHasMore = nextPageToken !== null;
      })
      .addCase(fetchShorts.rejected, (state, action) => {
        if (action.meta.arg) {
          state.shortsLoadingMore = false;
        } else {
          state.loading = false;
        }
        state.error = action.payload ?? "Unknown error";
      })

      .addCase(fetchVideoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideoById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentVideo = action.payload;
      })
      .addCase(fetchVideoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      });
  },
});

export default videosSlice.reducer;