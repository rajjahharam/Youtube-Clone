import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
export interface Comment {
  id: string;
  videoId: string;
  author: string;
  text: string;
  createdAt: string;
  parentId: string | null;
}
interface CommentsState {
  byVideoId: Record<string, Comment[]>;
}
const STORAGE_KEY = "youtube_clone_comments";
/* -------------------------------------------------------------------------- */
/* Default Comments */
/* -------------------------------------------------------------------------- */
const createSeedComments = (): Record<string, Comment[]> => {
  const authors = [
    "Alex",
    "John",
    "Emma",
    "Sophia",
    "David",
    "Olivia",
    "Michael",
    "Chris",
  ];
  const texts = [
    "This video deserves way more views 🔥",
    "Amazing explanation. Thank you!",
    "Who's watching this in 2026? 😂",
    "The editing is so clean.",
    "Subscribed instantly!",
    "One of the best tutorials on YouTube.",
    "Can you make a part 2?",
    "Really helpful content ❤️",
  ];
  const data: Record<string, Comment[]> = {};
  const randomTime = (hours: number) =>
    new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
  // Seed for first 100 videos
  for (let i = 0; i < 100; i++) {
    const videoId = `seed-${i}`;
    data[videoId] = [
      {
        id: crypto.randomUUID(),
        videoId,
        author: authors[i % authors.length],
        text: texts[i % texts.length],
        createdAt: randomTime(i + 1),
        parentId: null,
      },
      {
        id: crypto.randomUUID(),
        videoId,
        author: authors[(i + 1) % authors.length],
        text: texts[(i + 2) % texts.length],
        createdAt: randomTime(i + 4),
        parentId: null,
      },
    ];
    // Reply
    data[videoId].push({
      id: crypto.randomUUID(),
      videoId,
      author: "YouTube User",
      text: "Totally agree 👍",
      createdAt: randomTime(i + 5),
      parentId: data[videoId][0].id,
    });
  }
  return data;
};
/* -------------------------------------------------------------------------- */
/* Local Storage */
/* -------------------------------------------------------------------------- */
const loadComments = (): Record<string, Comment[]> => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    const seeded = createSeedComments();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  } catch {
    return createSeedComments();
  }
};
const saveComments = (comments: Record<string, Comment[]>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
  } catch {
    // Ignore storage errors
  }
};
const initialState: CommentsState = {
  byVideoId: loadComments(),
};
const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    addComment: (
      state,
      action: PayloadAction<{
        videoId: string;
        text: string;
        parentId?: string;
      }>
    ) => {
      const { videoId, text, parentId } = action.payload;
      const newComment: Comment = {
        id: crypto.randomUUID(),
        videoId,
        author: "You",
        text,
        createdAt: new Date().toISOString(),
        parentId: parentId ?? null,
      };
      if (!state.byVideoId[videoId]) {
        state.byVideoId[videoId] = [];
      }
      // Newest comments first
      state.byVideoId[videoId].unshift(newComment);
      saveComments(state.byVideoId);
    },
    editComment: (
      state,
      action: PayloadAction<{
        videoId: string;
        commentId: string;
        text: string;
      }>
    ) => {
      const { videoId, commentId, text } = action.payload;
      const comment = state.byVideoId[videoId]?.find(
        (c) => c.id === commentId
      );
      if (comment) {
        comment.text = text;
      }
      saveComments(state.byVideoId);
    },
    deleteComment: (
      state,
      action: PayloadAction<{
        videoId: string;
        commentId: string;
      }>
    ) => {
      const { videoId, commentId } = action.payload;
      if (!state.byVideoId[videoId]) return;
      // Delete comment + its replies
      state.byVideoId[videoId] = state.byVideoId[videoId].filter(
        (comment) =>
          comment.id !== commentId &&
          comment.parentId !== commentId
      );
      saveComments(state.byVideoId);
    },
    clearVideoComments: (
      state,
      action: PayloadAction<string>
    ) => {
      delete state.byVideoId[action.payload];
      saveComments(state.byVideoId);
    },
    resetComments: (state) => {
      state.byVideoId = createSeedComments();
      saveComments(state.byVideoId);
    },
    seedComments: (
      state,
      action: PayloadAction<{ videoId: string }>
    ) => {
      const { videoId } = action.payload;

      if (state.byVideoId[videoId]?.length) return;

      const comments: Comment[] = [
        {
          id: crypto.randomUUID(),
          videoId,
          author: "Alex",
          text: "Amazing video! Learned a lot 🔥",
          createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          parentId: null,
        },
        {
          id: crypto.randomUUID(),
          videoId,
          author: "Sophia",
          text: "Who's watching in 2026? 😄",
          createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
          parentId: null,
        },
        {
          id: crypto.randomUUID(),
          videoId,
          author: "David",
          text: "Great explanation. Thank you!",
          createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
          parentId: null,
        },
      ];

      state.byVideoId[videoId] = comments;

      saveComments(state.byVideoId);
    },
  },
});
export const {
  addComment,
  editComment,
  deleteComment,
  clearVideoComments,
  resetComments,
  seedComments,
} = commentsSlice.actions;
export default commentsSlice.reducer;