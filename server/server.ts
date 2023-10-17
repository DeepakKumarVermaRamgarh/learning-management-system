import app from "./app";
import { initSocketServer } from "./socketServer";
import { connectDB } from "./utils/db";
import cloudinary from "cloudinary";
import http from "http";

// cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// unhandled promise rejections
process.on("unhandledRejection", (err: any) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to unhandled promise rejections`);
  process.exit(1);
});

// http server
const httpServer = http.createServer(app);

initSocketServer(httpServer);

// initializing server
const server = httpServer.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  // connect to database
  connectDB();
});

// uncaught exception error
process.on("uncaughtException", (err: any) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to uncaught exception error`);
  server.close(() => {
    process.exit(1);
  });
});
