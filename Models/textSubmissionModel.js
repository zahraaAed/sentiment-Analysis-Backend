import mongoose from "mongoose";
import {model} from "mongoose";
export const textSubmissionSchema=new mongoose.Schema({
    userId: {
        type: String,
        required: true,
      },
      text:{
        type: String,
        required: true,
      },
      URL:{
        type: String,
        
      },
      sentiment_score:{
        type: Number,
        required: true,
      },
      sentiment_label:{
        type: String,
        enum: ['positive', 'negative', 'neutral'],
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now, // Set the creation date to the current date and time
        index: true // This field is required for the TTL index
      },
      expiresAt: {
        type: Date,
        default: () => new Date(Date.now() +   1 *   60 *   1000), // Set the expiration date to  1 minute from now
        // default: () => new Date(Date.now() +  15 *  24 *  60 *  60 *  1000), // Set the expiration date to  15 days from now
        index: { expiresAfterSeconds: 0 } 
      }
},{ timestamps: true });

const TextSubmission = model('textSubmission', textSubmissionSchema);

export default TextSubmission;
