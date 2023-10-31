import { Response, Request, NextFunction } from "express";
import Course from "../models/course.model";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors";

export const createCourse = catchAsyncErrors(
  async (data: any, res: Response) => {
    const course = await Course.create(data);
    res.status(201).json({
      success: true,
      message: "Course created successfully.",
      course,
    });
  }
);

// get all courses -- admin
export const getAllCoursesService = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const courses = await Course.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      courses,
    });
  }
);
