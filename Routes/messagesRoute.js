import express from "express";
import { addMessage, deleteMessage, getAllMessages, getGroupedMessages, updateMessage } from "../Controllers/messagesController.js";
const router = express.Router();

// Public routes
router.post("/",addMessage);
router.get("/", getAllMessages);
router.patch("/:id",updateMessage);
router.delete("/:id",deleteMessage);
router.get("/group",getGroupedMessages);
export default router;
