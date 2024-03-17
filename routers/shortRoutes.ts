import { Router } from "express";
import protect from "../middlewares/protect";
import { createShort } from "../controllers/shortController";

const router = Router();

router.post("/", protect, createShort);

export default router;
