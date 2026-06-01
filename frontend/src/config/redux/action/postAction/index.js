import { clientserver } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllposts = createAsyncThunk(
  "post/posts",
  async (_, thunkApi) => {
    try {
      const response = await clientserver.get("post/posts");
      return thunkApi.fulfillWithValue(response.data);
    } catch (err) {
      return thunkApi.rejectWithValue(err.response.data);
    }
  },
);

export const createPost = createAsyncThunk(
  "post/createPost",
  async (userData, thunkAPI) => {
    const { file, body } = userData;

    try {
      const formData = new FormData();

      formData.append("token", localStorage.getItem("token"));
      formData.append("body", body);

      if (file) {
        formData.append("media", file);
      }

      const response = await clientserver.post("/post/create", formData);

      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || err.message || "Post not uploaded",
      );
    }
  },
);

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (userData, thunkAPI) => {
    try {
      const response = await clientserver.delete("/post/delete", {
        data: {
          token: userData.token,
          postId: userData.postId,
        },
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const increamentPostLikes = createAsyncThunk(
  "/post/increametlike",
  async (userData, thunkApi) => {
    try {
      const payload = { ...(userData || {}) };
      if (!payload.token) payload.token = localStorage.getItem("token");
      const reponse = await clientserver.post("post/like", payload);
      return thunkApi.fulfillWithValue(reponse.data);
    } catch (err) {
      return thunkApi.rejectWithValue();
    }
  },
);

export const getAllComments = createAsyncThunk(
  "post/getAllComments",
  async (postData, thunkAPI) => {
    try {
      const response = await clientserver.get("/post/get_comments", {
        params: {
          postId: postData.postId,
        },
      });

      return thunkAPI.fulfillWithValue({
        comments: response.data.comments,
        post_id: postData.postId,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue("Something went wrong");
    }
  }
);

export const postComment = createAsyncThunk(
  "/post/comment",
  async (userData, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      console.log(token);

      const respose = await clientserver.post("/post/comment", {
        token,
        postId: userData.postId,
        commentBody: userData.body,
      });

      return thunkAPI.fulfillWithValue({
        comments: respose.data.comments,
        post_id: postData.postId,
      });
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  },
);
