import {
  getAboutUser,
  getAllUsers,
  loginUser,
  registerUser,
  getMyConnectionRequests,
  getConnectionsRequest
} from "../../action/authAction";


import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  user: undefined,
  alluser: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  loggedIn: false,
  isTokenisThere: false,
  profileFeached: false,

  // sended connecctions request
  connections: [],

  // recived connections request
  connectionRequests: [],
  message: "",
  all_profile_fetched: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    reset: () => initialState,
    emptymessage: (state) => {
      state.message = "";
    },
    handelLoginUser: (state) => {
      state.message = "hello";
    },
    setTokenisthere: (state) => {
      state.isTokenisThere = true;
    },
    setTokenisnotthere: (state) => {
      state.isTokenisThere = false;
    },

    // use also make this action and reduce can writen in  the  both way by creating the action and reducer folder
    // loadingUser: async (state)=>{
    //     const request=axios.post('/user/login',{})

    //     const response =[];

    //     state.user=req
    // }
  },

  // heare the extra reduder update is done by the loingUser give the user/login and .pending , .fullfiled and .rejected that match the action in the authAction/index.js file

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isError = false;
        state.isLoading = true;
        state.message = "Knowing you are logging in";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.loggedIn = true;
        state.message = "You are logged in";
        //  action is the payload that is retuned from the loginUseraction in the authAction/index.js file and the payload is the token that is retuned from the api call in the loginUser action in the authAction/index.js file
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Login failed";
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.message = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.loggedIn = false;
        state.message = "You are registered please login";
        //  action is the payload that is retuned from the loginUseraction in the authAction/index.js file and the payload is the token that is retuned from the api call in the loginUser action in the authAction/index.js file
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "registration failed";
      })
      .addCase(getAboutUser.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.message = "error during the user data featch";
      })
      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.user = action.payload.profile;
        // console.log(state.user.userId._id);
        console.log(state.user);
        state.profileFeached = true;
        state.isError = false;
        state.isLoading = false;
        state.message = "fetched successfully";
      })
      .addCase(getAboutUser.pending, (state) => {
        ((state.isError = false),
          (state.isLoading = true),
          (state.message = "loading>>>>>>>>"));
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.alluser = action.payload.userprof;
        state.isError = false;
        state.isLoading = false;
        state.all_profile_fetched = true;
        state.message = "All profiles fetched";
      })
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to fetch users";
      })
      .addCase(getConnectionsRequest.fulfilled, (state, action) => {
        state.connections = action.payload;
      })
      .addCase(getConnectionsRequest.rejected, (state, action) => {
        state.message = action.payload;
      })
      .addCase(getMyConnectionRequests.fulfilled, (state, action) => {
        state.connectionRequests = action.payload;
      })
      .addCase(getMyConnectionRequests.rejected, (state, action) => {
        state.message = action.payload;
      });
    },
  }
);

export const { reset, emptymessage, setTokenisthere, setTokenisnotthere } =
  authSlice.actions;

export default authSlice.reducer;
