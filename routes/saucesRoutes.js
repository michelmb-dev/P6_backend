import { Router } from "express";
import { createSauce, deleteSauce, getAllSauces, getSauce, updateSauce, likeSauce } from "../controllers/saucesController.js";
import { multerStorage } from "../middlewares/multer.js";
import { authorization } from "../middlewares/auth.js";


/* Creating a new instance of the Router. */
const router = new Router();

/* Creating a POST route for create a new sauce */
router.post("/", authorization, multerStorage, createSauce);

/* Creating a GET route for get all sauces. */
router.get("/", authorization, getAllSauces);

/* Creating a GET route for get one sauce. */
router.get("/:id", authorization, getSauce);

/* Creating a PUT route for update one sauce. */
router.put("/:id", authorization, multerStorage, updateSauce);

/* Creating a DELETE route for delete one sauce. */
router.delete("/:id", authorization, deleteSauce);

/* Creating a POST route for like or dislike a sauce. */
router.post("/:id/like", authorization, likeSauce);

export const saucesRoutes = router;
