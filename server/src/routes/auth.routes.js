import express from "express";
import {
  login,
  register,
  validateLogin,
  validateRegister,
} from "../controllers/authController.js";

const router = express.Router();

// Register route
router.post("/register", validateRegister, register);

// Login route
router.post("/login", validateLogin, login);

export default router;
