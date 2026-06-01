import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getAllComments,
  getAllposts,
  increamentPostLikes,
} from "../../action/postAction";
import { clientserver } from "@/config";
const initialState = {
  posts: [],
  isError: false,
  postFetched: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  comments: [],
  postId: "",
  isLiked: false,
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    reset: () => initialState,
    resetPostId: (state) => {
      state.postId = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllposts.pending, (state) => {
        state.isLoading = true;
        state.message = "loading....";
      })
      .addCase(getAllposts.fulfilled, (state, action) => {
        state.isError = false;
        state.postFetched = true;
        state.isLoading = false;
        state.posts = action.payload.posts;
      })
      .addCase(getAllposts.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.message = action.payload;
      })
      .addCase(increamentPostLikes.fulfilled, (state, action) => {
        const { postId, likesCount, liked } = action.payload;
        const idx = state.posts.findIndex(
          (p) => p._id === postId || p._id == postId,
        );
        if (idx !== -1) {
          state.posts[idx].likesCount = likesCount;
          state.posts[idx].isLiked = liked;
        }
      })
      .addCase(getAllComments.fulfilled, (state, action) => {
        // console.log(action.payload)
      
        state.postId = action.payload.post_id;
          console.log(state.postId);
        state.comments = action.payload.comments;
      });
  },
});

export const { reset, resetPostId } = postSlice.actions;
export default postSlice.reducer;
