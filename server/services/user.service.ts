import { NextFunction, Response } from "express";
import { redis } from "../utils/redis";
import User from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";

// get user by id
export const getUserById = async (
  id: string,
  res: Response,
  next: NextFunction
) => {
  const userJson = await redis.get(id);

  if (userJson) {
    const user = JSON.parse(userJson);
    return res.status(200).json({
      success: true,
      user,
    });
  }

  return next(new ErrorHandler(`Please login first`, 400));
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
  email: string,
  role: any,
  res: Response,
  next: NextFunction
) => {
  const user = await User.findOne({ email });
  if (!user)
    return next(new ErrorHandler(`No user found with id ${email}`, 400));

  user.role = role;

  await user.save({ validateModifiedOnly: true });

  res.status(200).json({
    success: true,
    user,
  });
};
