import User from "../models/users.models.js";
import Profile from "../models/profiles.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import ConnectionRequest from "../models/connections.model.js";
import fs from "fs";
import pdfkit from "pdfkit";
import Comments from "../models/comments.model.js";

const consvertToPDF = async (userdata) => {
  const doc = new pdfkit();
  const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
  const stream = fs.createWriteStream("uploads/" + outputPath);

  doc.pipe(stream);

  doc.image(`uploads/${userdata.userId.profilePicture}`, {
    align: "center",
    width: 150,
  });

  doc.fontSize(20).text(userdata.userId.name, { align: "center" });
  doc.fontSize(14).text(`Email: ${userdata.userId.email}`, { align: "center" });
  doc
    .fontSize(14)
    .text(`Username: ${userdata.userId.username}`, { align: "center" });
  doc.fontSize(14).text(`Bio: ${userdata.bio}`, { align: "center" });

  doc
    .fontSize(14)
    .text(`Current position: ${userdata.currentPost}`, { align: "center" });

  doc.fontSize(14).text("Past Work:", { align: "center" });

  userdata.pastWork.forEach((work, index) => {
    doc.fontSize(14).text(`Work ${index + 1}:`, { align: "center" });
    doc.fontSize(12).text(`Company: ${work.companyName}`, { align: "center" });
    doc.fontSize(12).text(`Position: ${work.position}`, { align: "center" });
    doc
      .fontSize(12)
      .text(`Start date: ${work.startDate.toDateString()}`, {
        align: "center",
      });
  });

  doc.end();

  return outputPath;
};

//  REGISTER
export const registerUser = async (req, res) => {
  try {
    const { username, name, email, password } = req.body;

    if (!username || !name || !email || !password) {
      return res.status(400).json({ message: "all fields are required" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "user already exists" });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      name,
      email,
      password: hashedPass,
    });

    await newUser.save();

    const newProfile = new Profile({
      userId: newUser._id,
      bio: "",
    });

    await newProfile.save();

    res.status(201).json({ message: "user registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal server error" });
  }
};

//  LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "all fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "invalid credentials" });
    }

    const token = crypto.randomBytes(64).toString("hex");

    user.token = token;
    await user.save();

    res.status(200).json({
      token,
      message: "login successful",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal server error" });
  }
};

// UPLOAD FILE
export const uploadFile = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "no file uploaded" });
    }

    const user = req.user; // from middleware

    user.profilePicture = file.filename;
    await user.save();

    res.status(200).json({
      message: "file uploaded successfully",
      filename: file.filename,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal server error" });
  }
};

// UPDATE PROFILE
// export const updateUserProfile = async (req, res) => {
//   try {
//     const user = req.user;
//     const updateData = req.body;

//     // where the user data is updated by useing the otp to verify the user and then update the data
//     // heare we are not updating email and username because they are unique and if we update them then we have to check for the uniqueness of the email and username and if we update them then we have to generate a new otp for the user and send it to the user and then the user has to verify the otp and then we can update the email and username but for now we are not updating them because it will take more time to implement that feature and also it is not required for the project but in future we can implement that feature if we have time and if we want to implement that feature then we can implement that feature by using the otp verification and then we can update the email and username and then we can generate a new otp for the user and send it to the user and then the user has to verify the otp and then we can update the email and username but for now we are not updating them because it will take more time to implement that feature and also it is not required for the project but in future we can implement that feature if we have time and if we want to implement that feature then we can implement that feature by using the otp verification and then we can update the email and username and then we can generate a new otp for the user and send it to the user and then the user has to verify the otp and then we can update the email and username but for now we are not updating them because it will take more time
//     // const existingUser = await User.findOne({
//     //     $or: [
//     //         { email: updateData.email },
//     //         { username: updateData.username }
//     //     ]
//     // });

//     // if (existingUser && existingUser._id.toString() !== user._id.toString()) {
//     //     return res.status(400).json({
//     //         error: "email or username already in use"
//     //     });
//     // }

//     const profile = await Profile.findOne({ userId: user._id });
//     if (!profile) {
//       return res.status(404).json({ error: "profile not found" });
//     }
//     Object.assign(profile, updateData);
//     await profile.save();

//     res.status(200).json({
//       message: "profile updated successfully",
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "internal server error" });
//   }
// };

export const updateUserData = async (req, res) => {
  try {
    const user = req.user;

    const { name } = req.body;

    if (name) user.name = name;

    await user.save();

    res.status(200).json({
      message: "user updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal server error" });
  }
};


export const updateProfileData = async (req, res) => {
  try {
    const user = req.user;

    const { bio, currentPost, pastWork, education } = req.body;

    const profile = await Profile.findOne({ userId: user._id });

    if (!profile) {
      return res.status(404).json({ error: "profile not found" });
    }

    profile.bio = bio;
    profile.currentPost = currentPost;
    profile.pastWork = pastWork;
    profile.education = education;

    await profile.save();

    res.status(200).json({
      message: "profile updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal server error" });
  }
};

//  GET PROFILE DATA
export const getUserProfileData = async (req, res) => {
  try {
    const user = req.user;

    const profile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
    );

    res.status(200).json({
      profile,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal server error" });
  }
};

export const getAllusersProfile = async (req, res) => {
  try {
    const userprof = await Profile.find({}).populate("userId");
    // console.log(userprof);

    return res.status(200).json({
      userprof,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal server error" });
  }
};

export const downloadResume = async (req, res) => {
  try {
    const userId = req.query.userId;

    const userdata = await Profile.findById(userId).populate("userId");

    const outputpath = await consvertToPDF(userdata);
    res.status(200).json({
      message: outputpath,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal server error  000" });
  }
};

export const sendConnectionRequest = async (req, res) => {
  try {
    const user = req.user;
    const { connectionId } = req.body;

    console.log(connectionId);

    const connectionUser = await User.findById(connectionId);

    if (!connectionUser) {
      return res.status(400).json({
        message: "invalid connection id",
      });
    }

    const existingconnections = await ConnectionRequest.findOne({
      userId: user._id,
      connectionId: connectionId,
    });

    if (existingconnections) {
      return res.status(400).json({
        message: "connection request already sent",
      });
    }

    const newConnection = new ConnectionRequest({
      userId: user._id,
      connectionId: connectionId,
      status_accepted: null,
    });

    await newConnection.save();

    res.status(200).json({
      message: "connection request sent successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal server error 000" });
  }
};

export const getMyConnectionRequest = async (req, res) => {
  // sended connection request
  try {
    const user = req.user;
    const connectionRequests = await ConnectionRequest.find({
      userId: user._id,
    }).populate("connectionId"); // to find the connection request where the connection id is present in the db and the status is null then we can show the connection request to the user
    res.status(200).json({
      connectionRequests,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal server error  000" });
  }
};

export const allrecivedConnectionRequest = async (req, res) => {
  // recived connection
  try {
    const user = req.user;

    const contectionRequests = await ConnectionRequest.find({
      connectionId: user._id,
    }).populate("userId"); // to find the connection request where the connection id is present in the db and the status is null then we can show the connection request to the user
    if (!contectionRequests) {
      return res.status(404).json({
        message: "no connection request found",
      });
    }
    console.log(contectionRequests);
    res.status(200).json({
      contectionRequests,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal server error  000" });
  }
};

export const acceptconncection = async (req, res) => {
  try {
    const user = req.user;
    const { requistId, action_Type } = req.body;

    const connectionRequest = await ConnectionRequest.findById(requistId);

    if (!connectionRequest) {
      return res.status(404).json({
        message: "connection request not found",
      });
    }
    if (action_Type === "accept") {
      connectionRequest.status_accepted = true;
    } else {
      connectionRequest.status_accepted = false;
    }

    connectionRequest.save();

    res.status(200).json({
      message: "connection request " + action_Type + "ed successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal server error  000" });
  }
};

// export const likeOnpost =async(req,res)=>{
//     const userId=req.user._id;

//     try{

//         const {postId} =req.body;
//         const post =await Post.findById(postId);

//         if(!post){
//             return res.status(404).json({
//                 message:"post not found"
//             });
//         }

//         const isLiked=await Post.findOne({_id:postId,userId:userId});
//         if(isLiked){
//             // desable the like buttion
//         }
//         //
//         post.likes+=1;
//         await post.save();
//         res.status(200).json({
//             message:"post liked successfully"
//         });

//     }catch(err){
//         console.error(err);
//         res.status(500).json({ error: "internal server error  " });
//     }
// }

export const getUserBasedOnUserName = async (req, res) => {
  try {
    const { username } = req.query;

    console.log("username from query:", username);

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const userProfile = await Profile.findOne({
      userId: user._id,
    }).populate("userId");

    if (!userProfile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    return res.status(200).json({
      userProfile,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "internal server error",
    });
  }
};
