import { Request, Response, NextFunction } from "express";
import Order, { IOrder } from "../models/order.model";
import User from "../models/user.model";
import Course from "../models/course.model";
import Notification from "../models/notification.model";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import ejs from "ejs";
import { getAllOrdersService, newOrder } from "../services/order.service";
import { join } from "path";
import sendMail from "../utils/sendMail";

// create order
export const createOrder = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { courseId, payment_info } = req.body as IOrder;

    const user = await User.findById(req.user?._id);

    const courseExistInUser = user?.courses.some(
      (course: any) => course._id.toString() === courseId
    );

    if (courseExistInUser)
      return next(
        new ErrorHandler("You have already purchased this course.", 400)
      );

    const course = await Course.findById(courseId);

    if (!course) return next(new ErrorHandler("Course not found", 400));

    const data: any = {
      courseId: course._id,
      userId: user?._id,
      payment_info,
    };

    const mailData = {
      order: {
        _id: course._id.toString().slice(0, 6),
        name: course.name,
        price: course.price,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      },
    };

    const html = await ejs.renderFile(
      join(__dirname, "../mails/order-confirmation.ejs"),
      { order: mailData }
    );

    if (user) {
      await sendMail({
        email: user.email,
        subject: "Order Confirmation",
        template: "order-confirmation.ejs",
        data: mailData,
      });
    }

    user?.courses.push(course?._id);

    await user?.save();

    await Notification.create({
      user: user?._id,
      title: "New Order",
      message: `You have a new order from ${course?.name}`,
    });

    if (course) course.purchased += 1;

    await course.save();

    newOrder(data, res, next);
  }
);

// get all Orders -- only for admin
export const getAllOrders = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    await getAllOrdersService(res);
  }
);
