import Post from "../models/posts.models.js";
import Comment from "../models/comments.model.js";
import { uploadBuffer } from "../utils/cloudinary.js";

export const TestPost = async (req, res) => {
  res.status(200).json({
    message: "Post route is working fine",
  });
};

export const createPost = async (req, res) => {
  try {
    const user = req.user;

    let mediaUrl = "";
    let fileType = "";

    if (req.file) {
      const result = await uploadBuffer(req.file.buffer, { folder: "socialApp/posts" });
      mediaUrl = result.secure_url;
      fileType = req.file.mimetype.split("/")[1];
    }

    const createdPost = new Post({
      userId: user._id,
      body: req.body.body,
      media: mediaUrl,
      fileType,
    });

    await createdPost.save();

    return res.status(201).json({
      message: "Post created successfully",
      post: createdPost,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("userId").sort({ createdAt: -1 });
    res.status(200).json({
      posts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const delete_post = async (req, res) => {
  try {
    const postId = req.body.postId;
    const userId = req.user._id;

    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // authontication and authorization used the token
    if (post.userId.toString() !== userId.toString()) {
      // important to convert to string because post.userId is an object and userId is a string so we need to convert it to string before comparing
      return res.status(403).json({ error: "Unauthorized" });
    }

    await Post.deleteOne({ _id: postId });
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getCommetsByPost = async (req, res) => {
  try {
    const { postId } = req.query;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comments = await Comment.find({ postId: post._id })
      .populate("userId")
      .populate("postId");

    return res.status(200).json({
      comments,
      postId: post._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal server error" });
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId, commentBody } = req.body;
    

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "post not found",
      });
    }
    const newComment = new Comment({
      postId,
      userId,
      body: commentBody,
    });

    await newComment.save();

    res.status(200).json({
      message: "comment added successfully",
      comment: newComment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal server error  " });
  }
};

export const delete_commet = async (req, res) => {
  try {
    const userId = req.user._id;
    const { commentId } = req.body;

    const comment = await Comments.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        message: "comment not found",
      });
    }

    if (comment.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }
    await Comments.deleteOne({ _id: commentId });
    res.status(200).json({
      message: "comment deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// export const increase_count_in_likes=async(req,res)=>{
//     try{
//         const {postId}=req.body;

//         const posts=await Post.findOne({_id:postId});

//         if(!posts){
//             return  res.status(404).json({message:"Post not found"});
//         }
//         posts.likesCount+=1;
//         await posts.save();

//         res.status(200).json({
//             message:"Likes count increased successfully",
//             likesCount:posts.likesCount
//         });

//     }
//     catch(err){
//          console.error(err);
//         res.status(500).json({error:"Internal server error"});
//     }
// }

export const increase_count_in_likes = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const alreadyLikedIndex = post.likedBy.findIndex(
      (id) => id.toString() === userId.toString(),
    );

    let liked;

    if (alreadyLikedIndex !== -1) {
      // user has already liked -> remove like (unlike)
      post.likedBy.splice(alreadyLikedIndex, 1);
      post.likesCount = Math.max(0, post.likesCount - 1);
      liked = false;
    } else {
      // add like
      post.likedBy.push(userId);
      post.likesCount += 1;
      liked = true;
    }

    await post.save();

    res.status(200).json({
      message: liked ? "Post liked" : "Post unliked",
      postId: post._id,
      likesCount: post.likesCount,
      liked,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
