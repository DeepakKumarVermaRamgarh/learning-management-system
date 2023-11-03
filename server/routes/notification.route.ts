import express from "express";
import { isAuthenticated } from "../middlewares/auth";
import { authorizeRole, updateAccessToken } from "../controllers/user.controller";
import {
  getNotifications,
  updateNotification,
} from "../controllers/notification.controller";
const router = express.Router();

router.get(
  "/get-all-notifications",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("admin"),
  getNotifications
);

router.put(
  "/update-notification/:id",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("admin"),
  updateNotification
);

export default router;
