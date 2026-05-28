import { createSlice } from "@reduxjs/toolkit";
import { getAllposts } from "../../action/postAction";

const initialState = {
  posts: [],
  isError: false,
  postFetched: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  comments: [],
  postId: "",
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
        console.log(action.payload.posts);
        state.posts = action.payload.posts;
      })
      .addCase(getAllposts.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.message = action.payload;
      });
  },
});

export const { reset, resetPostId } = postSlice.actions;
export default postSlice.reducer;