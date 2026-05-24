import mongoose from "mongoose";



const workSchema=new mongoose.Schema({
    companyName:{
        type:String,    
        default:''
    },
    position:{      
        type:String,
        default:''
    },
    startDate:{
        type:Date,
        default:Date.now    

    }
});

const educationSchema=new mongoose.Schema({ 
    institutionName:{
        type:String,    
        default:''  
    },
    degree:{
        type:String,
        default:''          
        },  
    fieldOfStudy:{
        type:String,
        default:''
    },
    school:{
        type:String,
        default:''  
    }

});

const ProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    bio: {
        type: String,
        default: ""
    },
    currentPost: {
        type: String,
        default: ""
    },
    pastWork: {
        type: [workSchema],
        default: []
    },
    education: {
        type: [educationSchema],
        default: []
    }
});



export default mongoose.model("Profile", ProfileSchema);
