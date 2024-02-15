import mongoose from "mongoose";
import Room from "../Models/roomsModel.js";
import User from "../Models/userModel.js";
//add a room
export const addRoom = async (req, res) => {
  const { name, userId } = req.body;
  try {
    if (name && userId) {
      const userExists = await User.exists({ _id: userId });
      if (!userExists) {
        return res.status(404).json({ error: "User not found" });
      }
      const room = await Room.create({ name, userId });
      res.json(room);
    } else {
      console.log("Error: room or userId is missing");
      res.status(400).json({ error: "room or userId is missing" });
    }
  } catch (error) {
    console.error("Error in adding room:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
//get rooms
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate("messages");
    res.json(rooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//delete room
export const deleteRoom = async (req, res) => {
  try {
    const deletedRoom = await Room.findByIdAndDelete(req.params.id);

    if (!deletedRoom) {
      return res.status(404).json({ message: "room not found" });
    }

    res.json({ message: "room deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

//update room

export const updateRoom = async (req, res) => {
  try {
    const { name } = req.body;

    const updatedRoom = await Room.findByIdAndUpdate( req.params.id, { name },{ new: true } // Option to return the updated document
    );

    if (!updatedRoom) {
        return res.status(404).json({ message: "Failed to update room: Room not found" });
    }

    res.json(updatedRoom);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};


  //get grouped rooms
  export const getGroupedRooms = async (req, res) => {
    try {
      const groupedRooms= await Room.aggregate([ 
        {
          $group: {
            _id: { userId: "$userId"},
            names: { $push: "$name" },
            count: { $sum: 1 } // Optional: Count of  feedbacks messages in the group
          }
        }
      ]);
      
      res.json(groupedRooms);
    } catch (error) {
      console.error("Error in retrieving grouped rooms:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };