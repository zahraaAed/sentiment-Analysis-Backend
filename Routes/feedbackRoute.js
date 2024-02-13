import express from "express";
import {
  addFeedback,
  deleteFeedback,
  getAllFeedback,
} from "../Controllers/feedbackController.js";
import { requireAuth } from "../Middleware/jwt.js";

const router = express.Router();

// Public routes
router.get("/", requireAuth, getAllFeedback);
router.post("/", requireAuth, addFeedback);
router.delete("/:id", requireAuth, deleteFeedback);

export default router;
