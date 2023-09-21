import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notification.route";
import analyticRouter from "./routes/analytics.route";
import layoutRouter from "./routes/layout.route";

// environment configuration
import dotenv from "dotenv";
import { errorMiddleWare } from "./middlewares/Error";
dotenv.config();

// initializing express app
const app = express();

// middlewares
// cors middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);

// using body-parser
app.use(express.json({ limit: "50mb" }));

// cookie-parser
app.use(cookieParser());

// routes
app.use(
  "/api/v1",
  userRouter,
  courseRouter,
  orderRouter,
  notificationRouter,
  analyticRouter,
  layoutRouter
);

// testing route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Hello World",
  });
});

// all other routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} does not exist`) as any;
  err.statusCode = 404;
  next(err);
});

app.use(errorMiddleWare);

// exporting app
export default app;
