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

router.get("/logout", updateAccessToken, isAuthenticated, logoutUser);

router.get("/refresh", updateAccessToken);

router.get("/me", updateAccessToken, isAuthenticated, getUserInfo);

router.patch(
  "/update-user-info",
  updateAccessToken,
  isAuthenticated,
  updateUserInfo
);

router.patch(
  "/update-user-avatar",
  updateAccessToken,
  isAuthenticated,
  updateProfileAvatar
);

router.put(
  "/update-user-password",
  updateAccessToken,
  isAuthenticated,
  updatePassword
);

router.get(
  "/get-all-users",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("admin"),
  getAllUsers
);

router.put(
  "/update-user-role",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("admin"),
  updateUserRole
);

router.delete(
  "/delete-user/:id",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("admin"),
  deleteUser
);

export default router;
