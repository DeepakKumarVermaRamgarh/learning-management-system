import { NextFunction, Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors";
import Notification from "../models/notification.model";
import ErrorHandler from "../utils/ErrorHandler";
import nodeCron from "node-cron";

// get all notification -- admin
export const getNotifications = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const notifications = await Notification.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      notifications,
    });
  }
);

// update notification status
export const updateNotification = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const notification = await Notification.findById(req.params.id);
    if (!notification)
      return next(new ErrorHandler("Notification not found.", 400));

    notification.status = "read";

    await notification.save();

    const notifications = await Notification.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      notifications,
    });
  }
);

// delete notification -- only admin
nodeCron.schedule("0 0 0 * * *", async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  await Notification.deleteMany({
    status: "read",
    createdAt: { $lte: thirtyDaysAgo },
  });

  console.log("Deleted read notifications");
});
