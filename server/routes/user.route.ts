import express from "express";
import {
  activateUser,
  authorizeRole,
  deleteUser,
  getAllUsers,
  getUserInfo,
  loginUser,
  logoutUser,
  registrationUser,
  socialAuth,
  updateAccessToken,
  updatePassword,
  updateProfileAvatar,
  updateUserInfo,
  updateUserRole,
} from "../controllers/user.controller";
import { isAuthenticated } from "../middlewares/auth";
const router = express.Router();

router.post("/registration", registrationUser);

router.post("/social-auth", socialAuth);

router.post("/activate-user", activateUser);

router.post("/login", loginUser);

router.get("/logout", isAuthenticated, logoutUser);

router.get("/refresh", isAuthenticated, updateAccessToken);

router.get("/me", isAuthenticated, getUserInfo);

router.patch("/update-user-info", isAuthenticated, updateUserInfo);

router.patch("/update-user-avatar", isAuthenticated, updateProfileAvatar);

router.put("/update-user-password", isAuthenticated, updatePassword);

router.get(
  "/get-all-users",
  isAuthenticated,
  authorizeRole("admin"),
  getAllUsers
);

router.put(
  "/update-user-role",
  isAuthenticated,
  authorizeRole("admin"),
  updateUserRole
);

router.delete(
  "/delete-user/:id",
  isAuthenticated,
  authorizeRole("admin"),
  deleteUser
);

export default router;
