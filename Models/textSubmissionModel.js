import mongoose from "mongoose";
import {model} from "mongoose";
export const textSubmissionSchema=new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        
      },
})