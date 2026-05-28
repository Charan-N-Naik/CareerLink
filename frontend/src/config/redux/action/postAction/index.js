

import { clientserver } from "@/config"
import { createAsyncThunk } from "@reduxjs/toolkit"

export  const getAllposts=createAsyncThunk("post/posts",async (_,thunkApi)=>{
    try{

        const response=await clientserver.get("post/posts");

        return thunkApi.fulfillWithValue(response.data)

    }
    catch(err){
        thunkApi.rejectWithValue(err.response.data)
    }
})

