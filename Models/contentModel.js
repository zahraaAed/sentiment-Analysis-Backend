import mongoose from "mongoose";
import { model } from "mongoose";
const contentSchema = new mongoose.Schema(
  {
    aboutusContent: {
      type: String,
      required: true,
    },
    subtitleHeader: {
      type: String,
      required: true,
    },
    ourmissionContent: {
      type: String,
      required: true,
    },
    imageHome: {
      type: String,

      
    },
    imageAbout: {
      type: String,

      
    },
    imageAnalysisSection: {
      type: String,

    
    },
  },
  { timestamps: true }
);

const Content = model("content", contentSchema);

export default Content;
