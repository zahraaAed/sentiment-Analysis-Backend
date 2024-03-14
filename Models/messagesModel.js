import mongoose from "mongoose";
import { model ,Schema} from "mongoose";
const messageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true,
      },
    content: {
      type: String,
      required: true,
  
    },
  },
  { timestamps: true }
);

const Message = model("message", messageSchema);

export default Message;
