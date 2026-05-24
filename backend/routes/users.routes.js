import { Router } from "express";
import multer from "multer";

import {
    getAllusersProfile,
    registerUser,
    loginUser,
    uploadFile,
    updateUserProfile,
    getUserProfileData,
    downloadResume
} from "../controllers/users.controllers.js";

import { findUserByToken } from "../middelwares/userAuth.middleware.js";

const userRouter = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const uploader = multer({ storage });


//  ROUTES
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

userRouter.post(
    "/upload",
    findUserByToken,
    uploader.single("file"),
    uploadFile
);

userRouter.put(
    "/user_update",
    findUserByToken,
    updateUserProfile
);

userRouter.get(
    "/userprofdata",
    findUserByToken,
    getUserProfileData
);


userRouter.get("/downlodaresume",
    
    downloadResume
);




userRouter.route("/getallusers").get(getAllusersProfile);

export default userRouter;
