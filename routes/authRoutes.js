import { Router } from "express";
import { signup, login } from "../controllers/authController.js";


/* Creating a new instance of the Router. */
const router = new Router();

/* Creating a POST route for signup a new user. */
router.post("/signup", signup);

/* Creating a POST route for login a user. */
router.post("/login", login);

export const authRoutes = router;
