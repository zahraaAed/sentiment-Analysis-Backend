import express from "express";
import {
  createContent,
  getAllContent,
  updateContent,
} from "../Controllers/contentController.js";
import upload from "../Middleware/multer.js";
import { requireAuth } from "../Middleware/jwt.js";
const router = express.Router();

// Public routes
router.get("/",requireAuth, getAllContent);
router.post(
  "/",requireAuth,
  upload.fields([
    { name: "imageHome", maxCount: 1 },
    { name: "imageAbout", maxCount: 1 },
    { name: "imageAnalysisSection", maxCount: 1 }
  ]),
  createContent
);

router.patch(
  "/:id",requireAuth,
  upload.fields([
    { name: "imageHome", maxCount: 1 },
    { name: "imageAbout", maxCount: 1 },
    { name: "imageAnalysisSection", maxCount: 1 },
  ]),
  updateContent
);
export default router;
