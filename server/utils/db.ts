import mongoose, { Connection } from "mongoose";
import { config } from "dotenv";

// configuring enviroment variables
config();

const database_url: string = process.env.DB_URI || "";

export const connectDB = async (): Promise<void> => {
  try {
    const connection: Connection = await mongoose.connect(database_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error: any) {
    console.error(error.message);
    setTimeout(connectDB, 5000);
  }
};
