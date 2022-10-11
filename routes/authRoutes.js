import { Router } from "express";
import { signup, login } from "../controllers/authController.js";

const router = new Router();

router.post("/signup", signup);
router.post("/login", login);

export const authRoutes = router;
