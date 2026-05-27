


import { loginUser } from "../../action/authAction";
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
    }
})


export default authSlice.reducer;