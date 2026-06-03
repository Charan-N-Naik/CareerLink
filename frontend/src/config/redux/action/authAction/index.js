import { clientserver } from "../../../index.jsx";
import { createAsyncThunk } from "@reduxjs/toolkit";

// creeate the api user/login  send to the resducer

// also create the user/login/pending user/login/fulfilled  user/login/rejected that matched on the extraReducers in the authReducer/index.js file
export const loginUser = createAsyncThunk(
  "users/login",
  async (user, thunkApi) => {
    try {
      const response = await clientserver.post("users/login", {
        email: user.email,
        password: user.password,
      });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      } else {
        return thunkApi.rejectWithValue("Token not found in response");
      }
      return thunkApi.fulfillWithValue(response.data.token);
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data.message);
    }
  },
);

export const registerUser = createAsyncThunk(
  "/users/register",
  async (user, thunkApi) => {
    try {
      const response = await clientserver.post("/users/register", {
        username: user.username,
        name: user.name,
        email: user.email,
        password: user.password,
      });
      return thunkApi.fulfillWithValue(response.data);
    } catch (err) {
      return thunkApi.rejectWithValue(err.response.data.message);
    }
  },
);

export const getAboutUser = createAsyncThunk(
  "users/userprofdata",
  async (_, thunkApi) => {
    try {
      const token = localStorage.getItem("token");
      console.log("token sending:", token);

      const response = await clientserver.get("/users/userprofdata", {
        params: { token },
      });

      return thunkApi.fulfillWithValue(response.data);
    } catch (err) {
      return thunkApi.rejectWithValue(
        err.response?.data?.error || "Failed to get user",
      );
    }
  },
);

export const getAllUsers = createAsyncThunk(
  "/users/getAllUsers",
  async (_, thunkApi) => {
    try {
      const respose = await clientserver.get("users/getallusers");

      return thunkApi.fulfillWithValue(respose.data);
    } catch (err) {
      return thunkApi.rejectWithValue(err.response.data);
    }
  },
);

// connection actions

export const sendConnectionRequest = createAsyncThunk(
  "users/sendconnectionrequest",
  async (user, thunkAPI) => {
    try {
      const response = await clientserver.post("/users/sendconnectionrequest", {
        token: user.token,
        connectionId: user.connectionId,
      });

      thunkAPI.dispatch(getConnectionsRequest({token:user.token}));

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);



export const getConnectionsRequest = createAsyncThunk(
  "users/getConnectionsRequest",
  async (user, thunkAPI) => {
    try {
      const response = await clientserver.get("/users/getAllRequset", {
        params: {
          token: user.token,
        },
      });
      
      return thunkAPI.fulfillWithValue(response.data.connectionRequests || []);

    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);



export const getMyConnectionRequests = createAsyncThunk(
  "users/getallrecivedconnectionrequest",
  async (_, thunkAPI) => {
    try {
      const token=localStorage.getItem("token");
      const response = await clientserver.get(
        "/users/getallrecivedconnectionrequest",
        {
          params: {
            token:token,
          },
        }
      );
      

      return thunkAPI.fulfillWithValue(response.data.contectionRequests || []);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const AcceptConnection = createAsyncThunk(
  "users/acceptconnectionrequest",
  async (user, thunkAPI) => {
    try {
      const response = await clientserver.post(
        "/users/acceptconnectionrequest",
        {
          token: user.token,
          requistId: user.connectionId,
          action_Type: user.action,
        },
      );
      thunkAPI.dispatch(getMyConnectionRequests({ token: user.token }));
      thunkAPI.dispatch(getConnectionsRequest({ token: user.token }));

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
     return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);
