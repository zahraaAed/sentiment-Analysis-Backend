// import mongoose from "mongoose";
// import {model} from "mongoose";
// const userSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//   },
//   role: {
//     type: String,
//     enum: ["admin", "user"], 
//     required: true
//   },
//   feedbacks: [{ 
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'feedback' 
//   }],
//   rooms: [{ 
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'room' 
//   }],
//   messages: [{ 
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'message' 
//   }],
//   text_Submissions:[{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'textSubmission' 
//   }]
// }, { timestamps: true });

// const User = model('user', userSchema);

// export default User;
import mongoose from "mongoose";

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
    ref: 'Feedback' // Corrected the reference name
  }],
  rooms: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room' // Assuming you have a Room model
  }],
  messages: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message' // Assuming you have a Message model
  }],
  text_Submissions:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TextSubmission' // Assuming you have a TextSubmission model
  }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
