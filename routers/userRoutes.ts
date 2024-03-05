import { Router } from "express";
import {
  activateUser,
  deactivateUser,
  deleteUser,
  getAllUsers,
  getCurrentUser,
  getUserByEmail,
  getUserById,
  getUserByUsername,
  updateUserAvatar,
  updateUserBanner,
  updateUserProfile,
} from "../controllers/userController";
import protect from "../middlewares/protect";
import {
  resizeUserAvatar,
  resizeUserBanner,
  uploadImage,
} from "../services/fileUpload";
import restrictTo from "../middlewares/restrictTo";

const router = Router();

router.get("/", getAllUsers);
router.get("/user/:id", getUserById);
router.get("/user", getUserByEmail);
router.get("/username/:username", getUserByUsername);
router.get("/current-user", protect, getCurrentUser);
router.patch("/update-user", protect, updateUserProfile);
router.patch(
  "/update-user-avatar",
  protect,
  uploadImage,
  resizeUserAvatar,
  updateUserAvatar
);
router.patch(
  "/update-user-banner",
  protect,
  uploadImage,
  resizeUserBanner,
  updateUserBanner
);
router.patch(
  "/deactivate-user/:username",
  protect,
  restrictTo("admin"),
  deactivateUser
);
router.patch(
  "/activate-user/:username",
  protect,
  restrictTo("admin"),
  activateUser
);
router.delete("/delete-user", protect, restrictTo("admin"), deleteUser);

export default router;
