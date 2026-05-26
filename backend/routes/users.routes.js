import { Router } from "express";
import multer from "multer";

import {
    getAllusersProfile,
    registerUser,
    loginUser,
    uploadFile,
    updateUserProfile,
    getUserProfileData,
    downloadResume,
    sendConnectionRequest,
    getMyConnectionRequest,
    allrecivedConnectionRequest,
    acceptconncection
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


userRouter.post("/sendconnectionrequest",
    findUserByToken,
    sendConnectionRequest
)


userRouter.route("/getallusers").get(getAllusersProfile);

userRouter.route("/getAllRequset")
.get(
    findUserByToken, 
    getMyConnectionRequest
);


userRouter.route("/getallrecivedconnectionrequest")
.get(
    findUserByToken,    
    allrecivedConnectionRequest
);

userRouter.route("/acceptconnectionrequest")
.post(
    findUserByToken,    
    acceptconncection
);

userRouter.route("/getallusers").get(
    getAllusersProfile
);




export default userRouter;



