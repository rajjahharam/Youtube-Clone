import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { SearchState, YouTubeSearchItem } from "../../types/youtube";

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY as string;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

interface SearchResult {
  query: string;
  items: YouTubeSearchItem[];
}

export const searchVideos = createAsyncThunk<SearchResult, string, { rejectValue: string }>(
  "search/searchVideos",
  async (query, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=20&key=${API_KEY}`
      );
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      return { query, items: data.items as YouTubeSearchItem[] };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const initialState: SearchState = {
  query: "",
  results: [],
  loading: false,
  error: null,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    clearQuery: (state) => {
      state.query = "";
      state.results = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.query = action.payload.query;
        state.results = action.payload.items;
      })
      .addCase(searchVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      });
  },
});

export const { setQuery, clearQuery } = searchSlice.actions;
export default searchSlice.reducer;