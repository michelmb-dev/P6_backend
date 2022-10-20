import { Router } from "express";
import { signup, login } from "../controllers/authController.js";
import { validatePassword } from "../middlewares/validatePassword.js";
import { limiter } from "../middlewares/rateLimit.js";

const router = new Router();

router.post("/signup", validatePassword, signup);
router.post("/login", limiter, login);

export const authRoutes = router;
