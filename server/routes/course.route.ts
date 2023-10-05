import express from "express";
import { isAuthenticated } from "../middlewares/auth";
import {
  authorizeRole,
  updateAccessToken,
} from "../controllers/user.controller";
import {
  addAnswer,
  addQuestion,
  addReplyToReview,
  addReview,
  deleteCourse,
  editCourse,
  generateVideoUrl,
  getAllCourses,
  getCompleteCourses,
  getCourseByUser,
  getSingleCourse,
  uploadCourse,
} from "../controllers/course.controller";
const router = express.Router();

router.post(
  "/create-course",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("admin"),
  uploadCourse
);

router.put(
  "/edit-course/:courseId",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("admin"),
  editCourse
);

router.get("/get-course/:id", getSingleCourse);

router.get("/get-course-content/:id", isAuthenticated, getCourseByUser);

router.get("/get-courses", getAllCourses);

router.put("/add-question", updateAccessToken, isAuthenticated, addQuestion);

router.put("/add-answer", updateAccessToken, isAuthenticated, addAnswer);

router.put("/add-review/:id", updateAccessToken, isAuthenticated, addReview);

router.put(
  "/add-reply",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("admin"),
  addReplyToReview
);

router.get(
  "/get-all-courses",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("admin"),
  getCompleteCourses
);

router.delete(
  "/delete-course/:courseId",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("admin"),
  deleteCourse
);

router.post("/getVdoCipherOTP", generateVideoUrl);

export default router;
