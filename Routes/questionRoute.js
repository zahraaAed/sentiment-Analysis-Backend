import express from "express";
import {
    addAnswer,
 addQuestion,
 deleteQuestion,
 getAllQuestions,
 getGroupedQuestions,
} from "../Controllers/questionController.js"
import { requireAuth } from "../Middleware/jwt.js"

const router = express.Router();

// Public routes
router.get("/", getAllQuestions);
router.post("/", addQuestion);
router.delete("/:id", requireAuth, deleteQuestion);
router.get("/group", getGroupedQuestions);
router.post("/:questionId",addAnswer)

export default router;
