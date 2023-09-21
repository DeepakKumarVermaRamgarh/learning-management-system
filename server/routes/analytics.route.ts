import express from "express";
import { isAuthenticated } from "../middlewares/auth";
import { authorizeRole } from "../controllers/user.controller";
import {
  getOrdersAnalytics,
  getUsersAnalytics,
} from "../controllers/analytics.controller";
import { getCourseByUser } from "../controllers/course.controller";
const router = express.Router();

router.get(
  "/get-users-analytics",
  isAuthenticated,
  authorizeRole("admin"),
  getUsersAnalytics
);

router.get(
  "/get-courses-analytics",
  isAuthenticated,
  authorizeRole("admin"),
  getCourseByUser
);

router.get(
  "/get-orders-analytics",
  isAuthenticated,
  authorizeRole("admin"),
  getOrdersAnalytics
);

export default router;
