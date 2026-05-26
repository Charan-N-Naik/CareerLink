
import Post from "../models/posts.models.js"


export const TestPost=async(req,res)=>{
    res.status(200).json({
        message:"Post route is working fine"
    })
}


export const createPost=async(req,res)=>{
    const user=req.user;
    const createdPost=new Post({
        userId:user._id,
        body:req.body.body,
        media:req.file != undefined?req.file.path:'',
        fileType: req.file!=undefined?req.file.mimetype.split("/")[1]:'',
    })
    await createdPost.save();
    res.status(201).json({
        message:"Post created successfully",
        post:createdPost
    })
}



export  const getAllPosts=async(req,res)=>{

    try{
        const posts=await Post.find().populate("userId").sort({createdAt:-1});
        res.status(200).json({
            posts
        });
    }
    catch(err){
        console.error(err);
        res.status(500).json({error:"Internal server error"});
    }
}

export const delete_post=async(req,res)=>{
    try{
        const postId=req.body.postId;
        const userId=req.user._id;


        const post = await Post.findOne({_id:postId});
        if(!post){
            return res.status(404).json({error:"Post not found"});
        }

        // authontication and authorization used the token 
        if(post.userId.toString()!==userId.toString()){ // important to convert to string because post.userId is an object and userId is a string so we need to convert it to string before comparing
            return res.status(403).json({error:"Unauthorized"});
        }

        await Post.delete_post({_id:postId});
        res.status(200).json({message:"Post deleted successfully"});
    }
    catch(err){
        console.error(err);
        res.status(500).json({error:"Internal server error"});
    }
}

export const getCommetsByPost=async(req,res)=>{

    try{
        const {postId}=req.body;
        const post = await Post.findOne({_id:postId});
        if(!post){
            return res.status(404).json({
                error:"Post not found"  
            });
        }

        return  res.status(200).json({
            comments:post.comments
        });

    }catch(err){
        console.error(err);
        res.status(500).json({ error: "internal server error  " });
    }

}
export const commentOnPost=async(req,res)=>{
    try{
        const userId=req.user._id;
        const {postId,commentBody}=req.body;

        const post=await Post.findById(postId);
        if(!post){
            return res.status(404).json({
                message:"post not found"
            });
        }
        const newCommnet = new Comments({
            postId,
            userId,
            body:commentBody   
        }); 
        newCommnet.save();
        res.status(200).json({
            message:"comment added successfully",
            comment:newCommnet
        });
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: "internal server error  " });
    }
}


export const delete_commet=async(req,res)=>{
    

    try{
        const userId=req.user._id;
        const {commentId}=req.body;

        const comment=await Comments.findById(commentId);
        if(!comment){
            return res.status(404).json({
                message:"comment not found"
            });
        }

        if(comment.userId.toString()!==userId.toString()){
            return res.status(403).json({
                message:"Unauthorized"
            });
        }   
        await Comments.deleteOne({_id:commentId});
        res.status(200).json({
            message:"comment deleted successfully"
        });

    }catch(err){
        console.error(err);
        res.status(500).json({error:"Internal server error"
        });

    }
}


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

    const alreadyLiked = post.likedBy.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyLiked) {
      return res.status(400).json({
        message: "You already liked this post",
      });
    }

    post.likedBy.push(userId);
    post.likesCount += 1;

    await post.save();

    res.status(200).json({
      message: "Post liked successfully",
      likesCount: post.likesCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};


