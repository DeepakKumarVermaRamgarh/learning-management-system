import { Request, Response, NextFunction } from "express";
import Course from "../models/course.model";
import cloudinary from "cloudinary";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors";
import { createCourse, getAllCoursesService } from "../services/course.service";
import { redis } from "../utils/redis";
import ErrorHandler from "../utils/ErrorHandler";
import mongoose from "mongoose";
import ejs from "ejs";
import { join } from "path";
import sendMail from "../utils/sendMail";
import Notification from "../models/notification.model";
import axios from "axios";

// upload course
export const uploadCourse = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;

    if (!data)
      return next(new ErrorHandler("please fill required details.", 400));

    const thumbnail = data.thumbnail;
    if (thumbnail) {
      const cloud = await cloudinary.v2.uploader.upload(thumbnail, {
        folder: "courses",
      });

      data.thumbnail = {
        public_id: cloud.public_id,
        url: cloud.secure_url,
      };
    }

    await redis.del("allCourses");

    createCourse(data, res, next);
  }
);

// edit course
export const editCourse = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    const thumbnail = data.thumbnail;

    const courseId = req.params.id;

    const courseData = (await Course.findById(courseId)) as any;

    if (thumbnail && !thumbnail.startsWith("https")) {
      await cloudinary.v2.uploader.destroy(thumbnail.public_id);

      const cloud = await cloudinary.v2.uploader.upload(thumbnail, {
        folder: "courses",
      });

      data.thumbnail = {
        public_id: cloud.public_id,
        url: cloud.secure_url,
      };
    }

    if (thumbnail && thumbnail.startsWith("https")) {
      data.thumbnail = {
        public_id: courseData?.thumbnail.public_id,
        url: courseData?.thumbnail.url,
      };
    }

    const course = await Course.findByIdAndUpdate(
      courseId,
      {
        $set: data,
      },
      { new: true }
    );

    await redis.del("allCourses");

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  }
);

// get single course -- without purchasing
export const getSingleCourse = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const courseId = req.params.id;

    const isCacheExists = await redis.get(courseId);

    let course;

    if (isCacheExists) {
      course = JSON.parse(isCacheExists);
    } else {
      course = await Course.findById(req.params.id).select(
        "-courseData.videoUrl -courseData.suggestions -courseData.questions -courseData.links"
      );

      await redis.set(courseId, JSON.stringify(course), "EX", 7 * 24 * 60 * 60);
    }

    res.status(200).json({
      success: true,
      course,
    });
  }
);

// get all courses -- without purchasing
export const getAllCourses = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const isCacheExists = await redis.get("allCourses");

    let courses;

    if (isCacheExists) {
      courses = JSON.parse(isCacheExists);
    } else {
      courses = await Course.find().select(
        "-courseData.videoUrl -courseData.suggestions -courseData.questions -courseData.links"
      );

      await redis.set("allCourses", JSON.stringify(courses));
    }

    res.status(200).json({
      success: true,
      courses,
    });
  }
);

// get course content -- only for purchased user
export const getCourseByUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const userCourseList = req.user?.courses;
    const courseId = req.params.id;

    const courseExists = userCourseList?.find(
      (course: any) => course.courseId.toString() === courseId
    );

    if (!courseExists)
      return next(
        new ErrorHandler("You aren't eligible to access this resource", 404)
      );

    const course = await Course.findById(courseId);

    const content = course?.courseData;

    if (!content)
      return next(new ErrorHandler("Course content not found", 404));

    res.status(200).json({
      success: true,
      content,
    });
  }
);

// add question in course
interface IAddQuestionData {
  question: string;
  courseId: string;
  contentId: string;
}

export const addQuestion = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { question, courseId, contentId }: IAddQuestionData = req.body;

    if (!mongoose.Types.ObjectId.isValid(courseId))
      return next(new ErrorHandler("Invalid course id", 404));

    if (!mongoose.Types.ObjectId.isValid(contentId))
      return next(new ErrorHandler("Invalid content id", 404));

    const course = await Course.findById(courseId);

    if (!course) return next(new ErrorHandler("Course not found", 404));

    const content = course?.courseData.find((content: any) =>
      content._id.equals(contentId)
    );

    if (!content) return next(new ErrorHandler("Content not found", 404));

    const newQuestion: any = {
      user: req.user,
      question,
      questionReplies: [],
    };

    content.questions.push(newQuestion);

    await Notification.create({
      user: req.user?._id,
      title: `New Question Received`,
      message: `You have a new question in ${content.title}`,
    });

    await course.save();

    res.status(200).json({
      success: true,
      message: "Question added successfully",
      course,
    });
  }
);

// add answer in course question
interface IAddQuestionData {
  answer: string;
  courseId: string;
  contentId: string;
  questionId: string;
}

export const addAnswer = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { answer, courseId, contentId, questionId }: IAddQuestionData =
      req.body;

    if (!mongoose.Types.ObjectId.isValid(courseId))
      return next(new ErrorHandler("Invalid course id", 404));

    if (!mongoose.Types.ObjectId.isValid(contentId))
      return next(new ErrorHandler("Invalid content id", 404));

    if (!mongoose.Types.ObjectId.isValid(questionId))
      return next(new ErrorHandler("Invalid question id", 404));

    const course = await Course.findById(courseId);

    if (!course) return next(new ErrorHandler("Course not found", 404));

    const content = course?.courseData.find((content: any) =>
      content._id.equals(contentId)
    );

    if (!content) return next(new ErrorHandler("Content not found", 404));

    const question = content.questions.find((question: any) =>
      question._id.equals(questionId)
    );

    if (!question) return next(new ErrorHandler("Question not found", 404));

    const newAnswer = {
      user: req.user,
      answer,
    };

    // add this answer to course content
    question.questionReplies?.push(newAnswer);

    await course.save();

    if (req.user?._id.equals(question.user?._id)) {
      // send notification to user
      await Notification.create({
        user: req.user?._id,
        title: `New Question Reply Received`,
        message: `You have a new question reply in ${content.title}`,
      });
    } else {
      const data = {
        name: question.user.name,
        title: content.title,
      };

      const html = await ejs.renderFile(
        join(__dirname, "../mails/question-reply.ejs"),
        data
      );

      await sendMail({
        email: question.user.email,
        subject: "Question Reply",
        template: "question-reply.ejs",
        data,
      });
    }

    res.status(200).json({
      success: true,
      course,
    });
  }
);

// add review in course

interface IAddReviewData {
  review: string;
  rating: number;
  userId: string;
}

export const addReview = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const userCourseList = req.user?.courses;
    const courseId = req.params.id;

    // check if courseId already exists in user courses or not
    const courseExists = userCourseList?.some((course: any) =>
      course._id.equals(courseId)
    );

    if (!courseExists)
      return next(
        new ErrorHandler("You aren't eligible to access this resource", 404)
      );

    const course = await Course.findById(courseId);

    if (!course) return next(new ErrorHandler("Course not found", 404));

    const { review, rating }: IAddReviewData = req.body;

    const newReview: any = {
      user: req.user,
      comment: review,
      rating,
    };

    course.reviews.push(newReview);

    let avg = 0;

    course.reviews.forEach((rev: any) => {
      avg += rev.rating;
    });

    course.ratings = avg / course.reviews.length;

    await course.save();

    await redis.set(courseId, JSON.stringify(course), "EX", 604800); // expire after 7days

    // create notification for review
    await Notification.create({
      user: req.user?._id,
      title: "New Review Recieved.",
      message: `${req.user?.name} has given a review for ${course.name}.`,
    });

    res.status(200).json({
      success: true,
      course,
    });
  }
);

// add reply in review
interface IAddReviewData {
  reply: string;
  reviewId: string;
  courseId: string;
}

export const addReplyToReview = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { reply, courseId, reviewId }: IAddReviewData = req.body;

    if (!mongoose.Types.ObjectId.isValid(courseId))
      return next(new ErrorHandler("Invalid course id", 404));

    if (!mongoose.Types.ObjectId.isValid(reviewId))
      return next(new ErrorHandler("Invalid review id", 404));

    const course = await Course.findById(courseId);

    if (!course) return next(new ErrorHandler("Course not found", 404));

    const review = course.reviews.find((rev: any) => rev._id.equals(reviewId));

    if (!review) return next(new ErrorHandler("Review not found", 404));

    const newReply: any = {
      user: req.user,
      comment: reply,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!review.commentReplies) {
      review.commentReplies = [];
    }

    review.commentReplies?.push(newReply);

    await course.save();

    await redis.set(courseId, JSON.stringify(course), "EX", 604800);

    res.status(200).json({
      success: true,
      course,
    });
  }
);

// get all courses -- only for admin
export const getCompleteCourses = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("here");
    getAllCoursesService(req, res, next);
  }
);

// delete course -- only admin
export const deleteCourse = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);
    if (!course) return next(new ErrorHandler("Course not found", 404));

    await course.deleteOne();

    await redis.del(courseId);

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  }
);

// generate video url
export const generateVideoUrl = catchAsyncErrors(
  (req: Request, res: Response, next: NextFunction) => {
    const { videoId } = req.body;

    const options = {
      method: "POST",
      url: `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
      },
      data: { ttl: 300 },
    };

    axios(options)
      .then((response) => {
        res.status(200).json({ data: response.data });
      })
      .catch((error) => {
        console.error(error);
        res.status(400).json({ success: false });
      });
  }
);
