import { Router } from "express";
import { signup, login } from "../controllers/authController.js";
import { validatePassword } from "../middlewares/validatePassword.js";

const router = new Router();

router.post("/signup", validatePassword, signup);
router.post("/login", login);

export const authRoutes = router;
