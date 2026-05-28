


import { actionAsyncStorageInstance } from "next/dist/server/app-render/action-async-storage-instance";
import { getAboutUser,loginUser,registerUser } from "../../action/authAction";

import {createSlice} from "@reduxjs/toolkit";
const initialState = {
    user:[],
    isError:false,
    isSuccess:false,
    isLoading:false,
    loggedIn:false,
    profileFeached:false,
    conntections:[],
    connectionRequests:[],
    message:"",
}

const authSlice= createSlice({
    name:"auth",
    initialState,

    reducers:{
        reset:()=>initialState,
        emptymessage:(state)=>{
            state.message=""
        },
        handelLoginUser:(state)=>{
            state.message="hello"
        },

         // use also make this action and reduce can writen in  the  both way by creating the action and reducer folder 
         // loadingUser: async (state)=>{
         //     const request=axios.post('/user/login',{})

         //     const response =[];

        //     state.user=req
        // }
    },

    // heare the extra reduder update is done by the loingUser give the user/login and .pending , .fullfiled and .rejected that match the action in the authAction/index.js file

    extraReducers:(builder)=>{
        builder
        .addCase(loginUser.pending,(state)=>{
            state.isError=false;
            state.isLoading=true;
            state.message="Knowing you are logging in";
        })
        .addCase(loginUser.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.isSuccess=true;
            state.loggedIn=true;
            state.message="You are logged in";
            //  action is the payload that is retuned from the loginUseraction in the authAction/index.js file and the payload is the token that is retuned from the api call in the loginUser action in the authAction/index.js file
        })
        .addCase(loginUser.rejected,(state,action)=>{
            state.isLoading=false;
            state.isError=true;
            state.message=action.payload || "Login failed";
        })


        .addCase(registerUser.pending,(state)=>{
            state.isLoading=true;
            state.message="loading";
        })

        .addCase(registerUser.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.isSuccess=true;
            state.isError=false;
            state.loggedIn=false;
            state.message="You are registered please login";
            //  action is the payload that is retuned from the loginUseraction in the authAction/index.js file and the payload is the token that is retuned from the api call in the loginUser action in the authAction/index.js file
        })
        .addCase(registerUser.rejected,(state,action)=>{
            state.isLoading=false;
            state.isError=true;
            state.message=action.payload || "registration failed";
        })
        .addCase(getAboutUser.rejected,(state)=>{
            state.isLoading=false;
            state.isError=true;
            state.message="error during the user data featch"
        })

        .addCase(getAboutUser.fulfilled, (state, action) => {
            state.user = action.payload.profile;
            console.log(state.user)
            state.profileFeached = true;
            state.isError = false;
            state.isLoading = false;
            state.message = "fetched successfully";
        })

        .addCase(getAboutUser.pending,(state)=>{
            state.isError=false,
            state.isLoading=true,
            state.message="loading>>>>>>>>"
        })
    }
})






export const {reset,emptymessage}= authSlice.actions;

export default authSlice.reducer;