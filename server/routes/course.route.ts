import express from "express";
import { isAuthenticated } from "../middlewares/auth";
import { authorizeRole } from "../controllers/user.controller";
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
  isAuthenticated,
  authorizeRole("admin"),
  uploadCourse
);

router.put(
  "/edit-course/:courseId",
  isAuthenticated,
  authorizeRole("admin"),
  editCourse
);

router.get("/get-course/:id", getSingleCourse);

router.get("/get-course-content/:id", isAuthenticated, getCourseByUser);

router.get("/get-courses", getAllCourses);

router.put("/add-question", isAuthenticated, addQuestion);

router.put("/add-answer", isAuthenticated, addAnswer);

router.put("/add-review/:id", isAuthenticated, addReview);

router.put(
  "/add-reply",
  isAuthenticated,
  authorizeRole("admin"),
  addReplyToReview
);

router.get(
  "/get-all-courses",
  isAuthenticated,
  authorizeRole("admin"),
  getCompleteCourses
);

router.delete(
  "/delete-course/:courseId",
  isAuthenticated,
  authorizeRole("admin"),
  deleteCourse
);

router.post("/getVdoCipherOTP", generateVideoUrl);

export default router;
