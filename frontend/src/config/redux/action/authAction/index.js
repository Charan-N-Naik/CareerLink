import { clientserver } from "../../../index.jsx";
import { createAsyncThunk } from "@reduxjs/toolkit";

// creeate the api user/login  send to the resducer 

// also create the user/login/pending user/login/fulfilled  user/login/rejected that matched on the extraReducers in the authReducer/index.js file
export const loginUser= createAsyncThunk(
    "users/login",
    async (user,thunkApi)=>{
        try{
            const response =await clientserver.post("users/login",{
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
    "/users/register",
    async (user,thunkApi)=>{
        try{
            const response =await clientserver.post("/users/register",{
                username:user.username,
                name:user.name,
                email:user.email,
                password:user.password
            });
            return thunkApi.fulfillWithValue(response.data.message);  
        }
        catch(err){
            return thunkApi.rejectWithValue(err.response.data.message);
        }
    }
)


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
        err.response?.data?.error || "Failed to get user"
      );
    }
  }
);
