import { Router } from "express";
import protect from "../middlewares/protect";
import { createLink } from "../controllers/linkController";

const router = Router();

router.post("/", protect, createLink);

export default router;
