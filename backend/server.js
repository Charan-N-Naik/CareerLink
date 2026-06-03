import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import userRouter from "./routes/users.routes.js";
import postRouter from "./routes/post.routes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const MONGODB_URL = process.env.MONGODB_URL;

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/users", userRouter);
app.use("/post", postRouter);

const run = async () => {
  try {
    if (!MONGODB_URL) {
      throw new Error("MONGODB_URL is missing in environment variables");
    }

    await mongoose.connect(MONGODB_URL);
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Error starting the server:", err);
    process.exit(1);
  }
};

run();