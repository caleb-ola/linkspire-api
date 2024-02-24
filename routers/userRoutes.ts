import { Router } from "express";
import {
  getAllUsers,
  getCurrentUser,
  getUserByEmail,
  getUserById,
  getUserByUsername,
  updateUserProfile,
} from "../controllers/userController";
import protect from "../middlewares/protect";

const router = Router();

router.get("/", getAllUsers);
router.get("/user/:id", getUserById);
router.get("/user", getUserByEmail);
router.get("/username/:username", getUserByUsername);
router.get("/current-user", protect, getCurrentUser);
router.get("/update-user/:username", protect, updateUserProfile);

export default router;
