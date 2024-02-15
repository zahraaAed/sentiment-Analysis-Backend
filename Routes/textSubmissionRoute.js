import express from "express";
import { addTextSubmission, getAllTextSubmissions, getGroupedTextSubmissions } from "../Controllers/textSubmissionController.js";

const router = express.Router();

// Public routes
router.post("/", addTextSubmission);
router.get("/", getAllTextSubmissions);
router.get("/group", getGroupedTextSubmissions);
export default router;
