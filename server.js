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
const allowedOrigins = ['https://sentiment-analysis-frontend-psbh.vercel.app/', 'https://sentiment-analysis-frontend-sigma.vercel.app/'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // Allow requests with credentials
}));
// app.use(cors());
// CORS configuration
// const corsOptions = {
//   origin: 'https://sentiment-analysis-frontend-cv4q-704mbhdkv-zahraaaeds-projects.vercel.app/', // Update this to match your frontend's domain
//   credentials: true, // This allows the frontend to send cookies
//   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify the methods you want to allow
//   allowedHeaders: ['Content-Type', 'Authorization'], // Specify the headers you want to allow
//  };
 
//  app.use(cors(corsOptions));


// Define a function to dynamically set the origin based on the request
// const corsOptions = {
//  origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);
//     if (origin === 'https://sentiment-analysis-frontend-psbh.vercel.app/' || origin === 'https://sentiment-analysis-frontend-sigma.vercel.app/') {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//  },
//  credentials: true,
// };

// // Use the cors middleware with the dynamic origin function
// app.use(cors(corsOptions));

// Your existing middleware and routes
// app.options('*', cors());
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
