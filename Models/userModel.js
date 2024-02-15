import mongoose from "mongoose";
import {model} from "mongoose";
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"], 
    required: true
  },
  feedbacks: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'feedback' 
  }],
  rooms: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'room' 
  }],
  messages: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'message' 
  }],
  text_Submissions:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'textSubmission' 
  }]
}, { timestamps: true });

const User = model('user', userSchema);

export default User;
