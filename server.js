import http from "http";
import express from "express";
import logger from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { Server } from 'socket.io'; // Update import statement
import cookieParser from 'cookie-parser';
import userRoute from "./Routes/userRoute.js";
import feedbackRoute from "./Routes/feedbackRoute.js";
import contentRoute from "./Routes/contentRoute.js";
import roomRoute from "./Routes/roomsRoute.js";
import messageRoute from "./Routes/messagesRoute.js";
import TextSubmissionRoute from "./Routes/textSubmissionRoute.js";
import QuestionRoute from "./Routes/questionRoute.js";
dotenv.config();

const PORT = process.env.PORT ||  4000;
const app = express();

app.use(cookieParser());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(cors({
//   origin: 'https://tonify-b853d.web.app/',
//   credentials: true 
// }));

app.use(cors({
  origin: '*', // Use a wildcard for development
  credentials: true // Allow requests with credentials
 }));

 
app.use((req, res, next) => {
 console.log(req.path, req.method);   
 next();
});

// Routes
app.use("/images", express.static("images"));
app.use("/api/user", userRoute);
app.use("/api/feedback", feedbackRoute);
app.use("/api/content", contentRoute);
app.use("/api/room", roomRoute);
app.use("/api/message", messageRoute);
app.use("/api/textSubmission", TextSubmissionRoute);
app.use("/api/question", QuestionRoute);
// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server); // Use the Server constructor

io.on('connection', (socket) => {
  console.log('A user was connected');

  // Handle 'join room' event
  socket.on('join room', ({ userId, roomId }) => {
    socket.join(`room-${roomId}`);
    console.log(`User ${userId} joined room ${roomId}`);
  });

  // Handle 'send message' event
  socket.on('send message', ({ userId, roomId, content }) => {
    const message = { userId, roomId, content };
    // Save message to database here
    io.to(`room-${roomId}`).emit('receive message', message);
  });

  socket.on('disconnect', () => {
    console.log('A user was disconnected');
  });
});

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`DB connected and Server is running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to the database:", err);
  });
