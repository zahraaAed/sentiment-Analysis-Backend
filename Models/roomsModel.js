import mongoose from "mongoose";
import { model } from "mongoose";
const roomSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      unique:true,
    },
  },
  { timestamps: true }
);

const Room = model("Room", roomSchema);

export default Room;
