import User from "../models/users.models.js";
import Profile from "../models/profiles.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

import  fs from "fs";
import pdfkit from "pdfkit";

const consvertToPDF = async (userdata) => {
    const doc = new pdfkit();
    const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
    const stream = fs.createWriteStream("uploads/" + outputPath);

    doc.pipe(stream);

    doc.image(`uploads/${userdata.userId.profilePicture}`, { align: "center", width: 150 });

    doc.fontSize(20).text(userdata.userId.name, { align: "center" });
    doc.fontSize(14).text(`Email: ${userdata.userId.email}`, { align: "center" });
    doc.fontSize(14).text(`Username: ${userdata.userId.username}`, { align: "center" });
    doc.fontSize(14).text(`Bio: ${userdata.bio}`, { align: "center" });
    
    doc.fontSize(14).text(`Current position: ${userdata.currentPosition}`, { align: "center" });

    doc.fontSize(14).text("Past Work:", { align: "center" });

    userdata.pastWork.forEach((work, index) => {
        doc.fontSize(14).text(`Work ${index + 1}:`, { align: "center" });
        doc.fontSize(12).text(`Company: ${work.company}`, { align: "center" });
        doc.fontSize(12).text(`Position: ${work.position}`, { align: "center" });
        doc.fontSize(12).text(`Start date: ${work.startDate.toDateString()}`, { align: "center" });
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

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "user already exists" });
        }

        const hashedPass = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            name,
            email,
            password: hashedPass
        });

        await newUser.save();

        const newProfile = new Profile({
            userId: newUser._id,
            bio: ""
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
            message: "login successful"
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
            filename: file.filename
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "internal server error" });
    }
};


// UPDATE PROFILE
export const updateUserProfile = async (req, res) => {
    try {
        const user = req.user;
        const updateData = req.body;


        // where the user data is updated by useing the otp to verify the user and then update the data
        // heare we are not updating email and username because they are unique and if we update them then we have to check for the uniqueness of the email and username and if we update them then we have to generate a new otp for the user and send it to the user and then the user has to verify the otp and then we can update the email and username but for now we are not updating them because it will take more time to implement that feature and also it is not required for the project but in future we can implement that feature if we have time and if we want to implement that feature then we can implement that feature by using the otp verification and then we can update the email and username and then we can generate a new otp for the user and send it to the user and then the user has to verify the otp and then we can update the email and username but for now we are not updating them because it will take more time to implement that feature and also it is not required for the project but in future we can implement that feature if we have time and if we want to implement that feature then we can implement that feature by using the otp verification and then we can update the email and username and then we can generate a new otp for the user and send it to the user and then the user has to verify the otp and then we can update the email and username but for now we are not updating them because it will take more time
        // const existingUser = await User.findOne({
        //     $or: [
        //         { email: updateData.email },
        //         { username: updateData.username }
        //     ]
        // });

        // if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        //     return res.status(400).json({
        //         error: "email or username already in use"
        //     });
        // }

        const profile=await Profile.findOne({userId:user._id});
        if(!profile){
            return res.status(404).json({ error: "profile not found" });
        }
        Object.assign(profile, updateData);
        await profile.save();

        res.status(200).json({
            message: "profile updated successfully"
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

        const profile = await Profile.findOne({ userId: user._id })
            .populate("userId");

        res.status(200).json({
            profile
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "internal server error" });
    }
};


export const getAllusersProfile=async(req,res)=>{
    try{
        const userprof=await Profile.find({}).populate("userId");
        
        res.status(200).json({
            userprof
        });
    }catch(err){
        console.error(err);
        res.status(500).json({ error: "internal server error" });
    }
}



export const downloadResume = async (req, res) => { 

    try{
        const userId = req.query.userId;

        const userdata= await Profile.findById(userId).populate("userId");
        
        const outputpath=await consvertToPDF(userdata)
        res.status(200).json({
            message: "resume downloaded successfully"
        });

    }catch(err){
        console.error(err);
        res.status(500).json({ error: "internal server error  000" });
    }

}












