import mongoose from "mongoose";

const postSchems = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,

    default: Date.now,
  },

  likesCount: {
    type: Number,
    default: 0,
  },

  likedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  ],

  
  media: {
    type: String,
    default: "",
  },


  active: {
    type: Boolean,
    default: true,
  },


  fileType: {
    // we are useing ec2 instance to store media files so we can store the file type in the database
    type: String,
    default: "",
  },
});

const Post = mongoose.model("Posts", postSchems);

export default Post;
