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
import rateLimit from "express-rate-limit";
dotenv.config();

// initializing express app
const app = express();

// middlewares
// cors middleware
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

// using body-parser
app.use(express.json({ limit: "50mb" }));

// cookie-parser
app.use(cookieParser());

// api requests limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each ip to 100 requests per 'window' in 15 minutes
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

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

// middleware calls
app.use(limiter);

app.use(errorMiddleWare);

// exporting app
export default app;
