import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/users.routes.js';
import multer from 'multer';
import path from 'path';
import  postRouter from './routes/post.routes.js';
dotenv.config();
const app=express();


app.use(cors());
app.use(express.json());  /// to parse json data from request body

// const foldername = path.join(__dirname, "uploads");

// app.use("/uploads",express.static(foldername));  // to serve static files from uploads folder
// // app.post('/upload',);



// app.use(express.static('uploads'));  // to serve static files from uploads folder

app.use("/uploads", express.static("uploads"));


const run=async () => {
    const mongocont= await mongoose.connect(process.env.MOGODB_URL);
    app.listen(process.env.PORT,()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}


app.get('/',(req,res)=>{ 
    res.send('Hello World');
});

// Routes
app.use('/users',userRouter);
app.use('/post',postRouter);




run().
then(()=>{
    console.log('Server started successfully');
}).
catch((err)=>{
    console.error('Error starting the server:', err);
});




