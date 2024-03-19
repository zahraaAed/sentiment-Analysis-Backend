import express from "express";
import {
  addFeedback,
  deleteFeedback,
  getAllFeedback,
  getGroupedFeedbacks,
} from "../Controllers/feedbackController.js";
import { requireAuth } from "../Middleware/jwt.js";

const router = express.Router();

// Public routes
router.get("/",getAllFeedback);
router.post("/", addFeedback);
router.delete("/:id", requireAuth, deleteFeedback);
router.get("/group",getGroupedFeedbacks);
export default router;
