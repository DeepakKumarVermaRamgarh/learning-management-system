import { Request, Response, NextFunction } from "express";
import { catchAsyncErrors } from "./catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import jwt from "jsonwebtoken";
import { redis } from "../utils/redis";

// authenticated user

export const isAuthenticated = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token;
    if (!access_token)
      return next(
        new ErrorHandler("Please login first to access this resource.", 400)
      );

    const decoded: any = jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN as string
    );

    if (!decoded) return next(new ErrorHandler("Invalid access token", 400));

    const user = await redis.get(decoded.id);

    if (!user)
      return next(
        new ErrorHandler("Please login first to access this resource.", 400)
      );

    req.user = JSON.parse(user);

    next();
  }
);
