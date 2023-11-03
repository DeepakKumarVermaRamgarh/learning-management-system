import express from "express";
import { isAuthenticated } from "../middlewares/auth";
import {
  authorizeRole,
  updateAccessToken,
} from "../controllers/user.controller";
import {
  getCoursesAnalytics,
  getOrdersAnalytics,
  getUsersAnalytics,
} from "../controllers/analytics.controller";
const router = express.Router();

router.get(
  "/get-users-analytics",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("admin"),
  getUsersAnalytics
);

router.get(
  "/get-courses-analytics",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("admin"),
  getCoursesAnalytics
);

router.get(
  "/get-orders-analytics",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("admin"),
  getOrdersAnalytics
);

export default router;
