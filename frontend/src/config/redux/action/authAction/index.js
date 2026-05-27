import { clientserver } from "../../../index.jsx";
import { createAsyncThunk } from "@reduxjs/toolkit";

// creeate the api user/login  send to the resducer 

// also create the user/login/pending user/login/fulfilled  user/login/rejected that matched on the extraReducers in the authReducer/index.js file
export const loginUser= createAsyncThunk(
    "user/login",
    async (user,thunkApi)=>{
        try{
            const response =await clientserver.post("user/login",{
                email:user.email,
                password:user.password
            });
            if(response.data.token){
                localStorage.setItem("token",response.data.token);
            }
            else{
                return thunkApi.rejectWithValue("Token not found in response");
            }
            return thunkApi.fulfillWithValue(response.data.token);
            
        }
        catch(error){
            return thunkApi.rejectWithValue(error.response.data.message);
        }
    }
)


 export const registerUser=createAsyncThunk(
    "/user/register",
    async (user,thunkApi)=>{
        try{
            const response =await clientserver.post("/user/register",{
                name:user.name,
                email:user.email,
                password:user.password
            });
            if(response.data.token){
                localStorage.setItem("token",response.data.token);
            }
            else{   
                return thunkApi.rejectWithValue("Token not found in response");
            }   
            return thunkApi.fulfillWithValue(response.data.token);  

        }
        catch(err){
            return thunkApi.rejectWithValue(err.response.data.message);
        }
    }
)

