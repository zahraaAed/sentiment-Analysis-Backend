import express from "express";
import {
  getUserById,
  getUsers,
  userLogin,
  userRegister,
} from "../Controllers/userController.js";

const router = express.Router();

// Public routes
router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/:id", getUserById);
router.get("/", getUsers);
export default router;
