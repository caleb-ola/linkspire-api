import { Router } from "express";

import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import linkRoutes from "./linkRoutes";
import shortRoutes from "./shortRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/links", linkRoutes);
router.use("/shorts", shortRoutes);

export default router;
