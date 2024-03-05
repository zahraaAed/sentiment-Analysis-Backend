import express from "express";
import {addTextSubmission,getAllTextSubmissions, getGroupedTextSubmissions } from "../Controllers/textSubmissionController.js";
import { requireAuth } from "../Middleware/jwt.js";
const router = express.Router();

// Public routes
router.post("/",addTextSubmission);
router.get("/",requireAuth, getAllTextSubmissions);
router.get("/group",requireAuth, getGroupedTextSubmissions);
export default router;
