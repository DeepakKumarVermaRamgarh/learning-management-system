import express from "express";
import { isAuthenticated } from "../middlewares/auth";
import {
  authorizeRole,
  updateAccessToken,
} from "../controllers/user.controller";
import {
  getOrdersAnalytics,
  getUsersAnalytics,
} from "../controllers/analytics.controller";
import { getCourseByUser } from "../controllers/course.controller";
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
  getCourseByUser
);

router.get(
  "/get-orders-analytics",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("admin"),
  getOrdersAnalytics
);

export default router;
