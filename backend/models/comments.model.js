import mongoose from "mongoose";

const commentSchema=mongoose.Schema({
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Posts',
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true
    },
    body:{      
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now    
    }
});

export default mongoose.model('Comments',commentSchema);