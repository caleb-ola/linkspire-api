import { Router } from "express";

import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import linkRoutes from "./linkRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/links", linkRoutes);

export default router;
