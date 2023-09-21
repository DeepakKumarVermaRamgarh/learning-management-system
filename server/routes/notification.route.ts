import express from "express";
import { isAuthenticated } from "../middlewares/auth";
import { authorizeRole } from "../controllers/user.controller";
import {
  getNotifications,
  updateNotification,
} from "../controllers/notification.controller";
const router = express.Router();

router.get(
  "/get-all-notifications",
  isAuthenticated,
  authorizeRole("admin"),
  getNotifications
);

router.get(
  "/update-notification/:id",
  isAuthenticated,
  authorizeRole("admin"),
  updateNotification
);

export default router;
