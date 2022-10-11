import { Router } from "express";
import {
  createSauce,
  deleteSauce,
  getAllSauces,
  getSauce,
  updateSauce,
  likeSauce,
} from "../controllers/saucesController.js";
import { multerStorage } from "../middlewares/multer.js";
import { authorization } from "../middlewares/auth.js";

const router = new Router();

router.post("/", authorization, multerStorage, createSauce);
router.get("/", authorization, getAllSauces);
router.get("/:id", authorization, getSauce);
router.put("/:id", authorization, multerStorage, updateSauce);
router.delete("/:id", authorization, deleteSauce);
router.post("/:id/like", authorization, likeSauce);

export const saucesRoutes = router;
