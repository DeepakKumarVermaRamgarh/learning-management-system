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
import dotenv from "dotenv";
import Stripe from "stripe";
import { redis } from "../utils/redis";
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-08-16",
  maxNetworkRetries: 1,
  timeout: 10000,
  telemetry: true,
});

// create order
export const createOrder = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { courseId, payment_info } = req.body as IOrder;

    if (payment_info) {
      if ("id" in payment_info) {
        const paymentIntent = await stripe.paymentIntents.retrieve(
          payment_info.id as string
        );

        if (paymentIntent.status !== "succeeded")
          return next(new ErrorHandler("Payment failed", 400));
      }
    }

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

    if (course) course.purchased = course.purchased + 1;

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

    await redis.set(req.user?._id, JSON.stringify(user));

    await user?.save();

    await Notification.create({
      user: user?._id,
      title: "New Order",
      message: `You have a new order from ${course?.name}`,
    });

    await redis.del("allCourses");
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

// send strip publisable key to client
export const sendStripPublishableKey = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  }
);

// new payment
export const newPayment = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { amount } = req.body;
    const myPayment = await stripe.paymentIntents.create({
      amount,
      currency: "inr",
      metadata: { company: "E-Learning" },
      automatic_payment_methods: { enabled: true },
      receipt_email: req.user?.email,
      description: "E-Learning course purchase",
    });

    res.status(201).json({
      success: true,
      client_secret: myPayment.client_secret,
    });
  }
);
