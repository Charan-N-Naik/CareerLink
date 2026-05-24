import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/users.routes.js';
import multer from 'multer';
import path from 'path';
dotenv.config();
const app=express();


app.use(cors());
app.use(express.json());  /// to parse json data from request body

// const foldername = path.join(__dirname, "uploads");

// app.use("/uploads",express.static(foldername));  // to serve static files from uploads folder
// // app.post('/upload',);



app.use(express.static('uploads'));  // to serve static files from uploads folder


const run=async () => {
    const mongocont= await mongoose.connect(process.env.MOGODB_URL);
    app.listen(process.env.PORT,()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}


app.get('/',(req,res)=>{ 
    res.send('Hello World');
});


app.use('/users',userRouter);

run().
then(()=>{
    console.log('Server started successfully');
}).
catch((err)=>{
    console.error('Error starting the server:', err);
});




