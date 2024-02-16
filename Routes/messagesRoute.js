import express from "express";
import { addMessage, deleteMessage, getAllMessages, getGroupedMessages, updateMessage } from "../Controllers/messagesController.js";
const router = express.Router();
import { requireAuth } from "../Middleware/jwt.js";
// Public routes
router.post("/",requireAuth, addMessage);
router.get("/",requireAuth,getAllMessages);
router.patch("/:id",requireAuth,updateMessage);
router.delete("/:id",requireAuth,deleteMessage);
router.get("/group",requireAuth,getGroupedMessages);
export default router;
