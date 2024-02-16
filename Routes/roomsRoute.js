import express from "express";

import { addRoom, deleteRoom, getAllRooms, getGroupedRooms, updateRoom } from "../Controllers/roomsController.js";
const router = express.Router();
import { requireAuth } from "../Middleware/jwt.js";
// Public routes
router.post("/",requireAuth,addRoom);
router.get("/",requireAuth, getAllRooms);
router.patch("/:id",requireAuth,updateRoom);
router.delete("/:id",requireAuth,deleteRoom);
router.get("/group",requireAuth,getGroupedRooms);
export default router;
