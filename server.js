import http from "http";
import express from "express";
import logger from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import * as socketIo from 'socket.io'; // Update import statement
import cookieParser from 'cookie-parser';
import userRoute from "./Routes/userRoute.js";
import feedbackRoute from "./Routes/feedbackRoute.js";
import contentRoute from "./Routes/contentRoute.js";
import roomRoute from "./Routes/roomsRoute.js";
import messageRoute from "./Routes/messagesRoute.js";
import TextSubmissionRoute from "./Routes/textSubmissionRoute.js";
dotenv.config();

const PORT = process.env.PORT ||  4000;
const app = express();

app.use(cookieParser());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cors());
// CORS configuration
const corsOptions = {
  origin: '*', // Replace with your frontend's origin
  credentials: true, // This allows cookies to be included in requests
};

app.use(cors(corsOptions));

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

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new socketIo.Server(server); // Use the Server constructor

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
