import express from "express";

import { addRoom, deleteRoom, getAllRooms, updateRoom } from "../Controllers/roomsController.js";
import { verifyToken } from "../Middleware/auth.js";
const router = express.Router();

// Public routes
router.post("/",addRoom);
router.get("/", verifyToken,getAllRooms);
router.patch("/:id",updateRoom);
router.delete("/:id",deleteRoom);
export default router;
