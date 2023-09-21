import { NextFunction, Response } from "express";
import { redis } from "../utils/redis";
import User from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";

// get user by id
export const getUserById = async (id: string, res: Response) => {
  const userJson = await redis.get(id);

  if (userJson) {
    const user = JSON.parse(userJson);
    res.status(200).json({
      success: true,
      user,
    });
  }
};

// get all users -- admin
export const getAllUsersService = async (res: Response) => {
  const users = await User.find({}).sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    users,
  });
};

// update user role -- admin
export const updateUserRoleService = async (
  id: string,
  role: any,
  res: Response,
  next: NextFunction
) => {
  const user = await User.findById(id);
  if (!user) return next(new ErrorHandler(`No user found with id ${id}`, 400));

  user.role = role;

  await user.save();

  res.status(200).json({
    success: true,
    user,
  });
};
