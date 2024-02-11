import mongoose from "mongoose";
import {model} from "mongoose";
const feedbackSchema = new mongoose.Schema({

        userId: {
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'User', 
          required: true,
        },

     message: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Feedback = model('feedback', feedbackSchema);

export default Feedback;
