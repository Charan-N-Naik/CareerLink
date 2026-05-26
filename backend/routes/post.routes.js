import {
    createPost,
    TestPost,
    getAllPosts,
    delete_post,
    commentOnPost,
    delete_commet,
    increase_count_in_likes

} from "../controllers/post.controllers.js";

import multer from "multer";
import { Router } from "express";
import { findUserByToken } from "../middelwares/userAuth.middleware.js";

const postRouter=Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");   
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});


const uploader = multer({ storage });



postRouter.route("/test").get(TestPost);
postRouter.route("/create").post(findUserByToken, uploader.single("media"), createPost);
postRouter.route("/").get(getAllPosts);
postRouter.route("/delete").delete(findUserByToken, delete_post);
postRouter.route("/comment").post(findUserByToken, commentOnPost);
postRouter.route("/deleteComment").delete(findUserByToken, delete_commet);
postRouter.route("/like").post(increase_count_in_likes);




export default postRouter;