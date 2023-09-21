import { Response } from "express";
import Course from "../models/course.model";

export const createCourse = async (data: any, res: Response) => {
  const course = await Course.create(data);
  res.status(201).json({
    success: true,
    message: "Course created successfully.",
    course,
  });
};

// get all courses -- admin
export const getAllCoursesService = async (res: Response) => {
  const courses = await Course.find({}).sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    courses,
  });
};
