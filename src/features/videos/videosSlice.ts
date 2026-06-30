import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { VideosState, YouTubeVideo, YouTubeSearchItem } from "../../types/youtube";

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

export const fetchShorts = createAsyncThunk<YouTubeSearchItem[], void, { rejectValue: string }>(
  "videos/fetchShorts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/search?part=snippet&q=shorts&type=video&videoDuration=short&maxResults=20&key=${API_KEY}`
      );
      if (!response.ok) throw new Error("Failed to fetch shorts");
      const data = await response.json();
      return data.items as YouTubeSearchItem[];
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const initialState: VideosState = {
  allVideos: [],
  shorts: [],
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
      .addCase(fetchShorts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShorts.fulfilled, (state, action) => {
        state.loading = false;
        state.shorts = action.payload;
      })
      .addCase(fetchShorts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      });
  },
});

export default videosSlice.reducer;