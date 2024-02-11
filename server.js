import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from 'cookie-parser';
import userRoute from "./Routes/userRoute.js";
import feedbackRoute from "./Routes/feedbackRoute.js"
dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/user",userRoute)
app.use("/api/feedback",feedbackRoute)




//mongoose connection
mongoose.connect(process.env.MONGO)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`DB connected and Server is running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to the database:", err);
  });