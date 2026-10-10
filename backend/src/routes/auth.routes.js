import express from "express";
const router = express.Router();
import { register, login, getMe } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);

export default router;
