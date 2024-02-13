import express from "express";
import {
  createContent,
  getAllContent,
  updateContent,
} from "../Controllers/contentController.js";
import upload from "../Middleware/multer.js";

const router = express.Router();

// Public routes
router.get("/", getAllContent);
router.post(
  "/",
  upload.fields([
    { name: "imageHome", maxCount: 1 },
    { name: "imageAbout", maxCount: 1 },
    { name: "imageAnalysisSection", maxCount: 1 }
  ]),
  createContent
);

router.patch(
  "/:id",
  upload.fields([
    { name: "imageHome", maxCount: 1 },
    { name: "imageAbout", maxCount: 1 },
    { name: "imageAnalysisSection", maxCount: 1 },
  ]),
  updateContent
);
export default router;
