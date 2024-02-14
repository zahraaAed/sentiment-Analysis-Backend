import mongoose from "mongoose";
import Message from "../Models/messagesModel.js";
import Room from "../Models/roomsModel.js";
import User from "../Models/userModel.js";


//get all messages
export const getAllMessages = async (req, res) => {
    try {
      const messages = await Message.find();
      res.json(messages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  //add message
  export const addMessage = async (req, res) => {
    const { content, userId,roomId } = req.body;
    try {
      if (content && userId && roomId) {
        const userExists = await User.exists({ _id: userId });
        if (!userExists) {
          return res.status(404).json({ error: "User not found" });
        }
        const message = await Message.create({ content, userId,roomId });
        await User.findByIdAndUpdate(userId, {
          $push: { messages: message._id },
        });
        res.json(message);
      } else {
        console.log("Error: content or userId or roomId is missing");
        res.status(400).json({ error: "content or userId or roomId is missing" });
      }
    } catch (error) {
      console.error("Error in adding message:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  //delete message
  export const deleteMessage = async (req, res) => {
    try {
      const deletedMessage = await Message.findByIdAndDelete(req.params.id);
  
      if (!deletedMessage) {
        return res.status(404).json({ message: "message not found" });
      }
  
      res.json({ message: "message deleted successfully" });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  };

  //update message

  export const updateMessage= async (req, res) => {
    try {
      const { content } = req.body;
  
      const updatedMessage= await Message.findByIdAndUpdate( req.params.id, { content },{ new: true } // Option to return the updated document
      );
  
      if (!updatedMessage) {
          return res.status(404).json({ message: "Failed to update message: message not found" });
      }
  
      res.json(updateMessage);
      console.log("message updated successfully")
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  };
  
  //get grouped messages
  export const getGroupedMessages = async (req, res) => {
    try {
      const groupedMessages = await Message.aggregate([ //aggregate method provided by Mongoose to perform aggregation queries.
      // Aggregation queries allow us to perform operations like grouping, sorting, and filtering on our data.
        {
          $group: {
            _id: { userId: "$userId", roomId: "$roomId" },
            messages: { $push: "$content" },
            count: { $sum: 1 } // Optional: Count of messages in the group
          }
        }
      ]);
      
      res.json(groupedMessages);
    } catch (error) {
      console.error("Error in retrieving grouped messages:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };