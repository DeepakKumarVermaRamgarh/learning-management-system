import { NextFunction, Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors";
import User, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import ejs from "ejs";
import { join } from "path";
import sendMail from "../utils/sendMail";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendJwtToken,
} from "../utils/sendJwtToken";
import { redis } from "../utils/redis";
import cloudinary from "cloudinary";
import {
  getAllUsersService,
  getUserById,
  updateUserRoleService,
} from "../services/user.service";

interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

interface IActivationToken {
  token: string;
  activationCode: string;
}

// generate activation token
const createActivationToken = (user: IRegistrationBody): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign(
    { user, activationCode },
    process.env.ACTIVATION_SECRET_KEY as Secret,
    {
      expiresIn: "10m",
    }
  );
  return { token, activationCode };
};

// function to register user and send activation token to email
export const registrationUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;
    const isEmailExists = await User.findOne({ email });
    if (isEmailExists) {
      return next(new ErrorHandler("Email already exists.", 400));
    }

    const user: IRegistrationBody = {
      name,
      email,
      password,
    };

    const activationToken = createActivationToken(user);
    const activationCode = activationToken.activationCode;
    const data = { user: { name: user.name }, activationCode };
    const html = await ejs.renderFile(
      join(__dirname, "../mails/activation-mail.ejs"),
      data
    );

    await sendMail({
      email: user.email,
      subject: "Activate your account",
      template: "activation-mail.ejs",
      data,
    });

    res.status(201).json({
      success: true,
      message: `Please check your email: ${user.email} to activate your account!`,
      activationToken: activationToken.token,
    });
  }
);

interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

// function to activate user using token
export const activateUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { activation_token, activation_code } =
      req.body as IActivationRequest;

    const newUser: { user: IUser; activationCode: string } = jwt.verify(
      activation_token,
      process.env.ACTIVATION_SECRET_KEY as string
    ) as { user: IUser; activationCode: string };

    if (newUser.activationCode !== activation_code) {
      return next(new ErrorHandler("Invalid activation code", 400));
    }

    const { name, email, password } = newUser.user;

    const existUser = await User.findOne({ email });

    if (existUser) return next(new ErrorHandler("User already exists.", 400));

    const user = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      success: true,
      message: "User activation successfull.",
    });
  }
);

interface ILoginRequest {
  email: string;
  password: string;
}

// function to login user using email and password
export const loginUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as ILoginRequest;

    if (!email || !password)
      return next(new ErrorHandler("Please enter email and password", 400));

    const user = await User.findOne({ email }).select("+password");

    if (!user) return next(new ErrorHandler("Invalid Email Or Password", 400));

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched)
      return next(new ErrorHandler("Invalid Email Or Password", 400));

    sendJwtToken(user, 200, res);
  }
);

// logout user
export const logoutUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    res.cookie("access_token", "", { maxAge: 1 });
    res.cookie("refresh_token", "", { maxAge: 1 });

    const userId = req.user?._id || "";
    redis.del(userId);

    res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  }
);

// validate user role
export const authorizeRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || ""))
      return next(
        new ErrorHandler(
          `Role: ${req.user?.role} is not allowed to access this resource.`,
          403
        )
      );
    next();
  };
};

// update access token
export const updateAccessToken = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const refresh_token = req.cookies.refresh_token as string;

    if (!refresh_token)
      return next(
        new ErrorHandler("Please login first to access this resource", 400)
      );

    const decoded = jwt.verify(
      refresh_token,
      process.env.REFRESH_TOKEN as string
    ) as JwtPayload;

    if (!decoded) return next(new ErrorHandler("Could not refresh token", 400));
    const session = await redis.get(decoded.id as string);

    if (!session)
      return next(
        new ErrorHandler("Please login first to access this resource", 400)
      );

    const user = JSON.parse(session);
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN as string,
      {
        expiresIn: "5m",
      }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN as string,
      {
        expiresIn: "5d",
      }
    );

    req.user = user;

    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);

    await redis.set(user._id, JSON.stringify(user), "EX", 60 * 60 * 24 * 7); // keep cache data for 7 days

    next();
  }
);

// get user info
export const getUserInfo = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;

    if (!userId)
      return next(
        new ErrorHandler("Please login first to access this resource", 400)
      );

    await getUserById(userId, res, next);
  }
);

// social auth

interface ISocialAuthBody {
  email: string;
  name: string;
  avatar: string;
}

export const socialAuth = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, name, avatar } = req.body as ISocialAuthBody;
    const user = await User.findOne({ email });
    if (!user) {
      const newUser = await User.create({ email, name, avatar });
      sendJwtToken(newUser, 201, res);
    } else {
      sendJwtToken(user, 200, res);
    }
  }
);

// update user info
interface IUpdateUserInfo {
  name?: string;
  email?: string;
}

export const updateUserInfo = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body as IUpdateUserInfo;
    const userId = req.user?._id;
    const user = await User.findById(userId);

    if (name && user) {
      user.name = name;
    }

    await user?.save();

    await redis.set(userId, JSON.stringify(user));

    res.status(200).json({
      success: true,
      user,
    });
  }
);

// update user password
interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}

export const updatePassword = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { oldPassword, newPassword } = req.body as IUpdatePassword;

    if (!oldPassword || !newPassword)
      return next(
        new ErrorHandler("Please enter old password and new password", 400)
      );

    if (oldPassword === newPassword)
      return next(
        new ErrorHandler("Old password and new password are same", 400)
      );

    const user = await User.findById(req.user?._id).select("+password");

    if (user?.password === undefined) {
      return next(new ErrorHandler("User password not found", 400));
    }

    const isPasswordMatched = await user?.comparePassword(oldPassword);

    if (!isPasswordMatched)
      return next(new ErrorHandler("Invalid old password", 400));

    user.password = newPassword;

    await user?.save({ validateBeforeSave: true });
    await redis.set(req.user?._id, JSON.stringify(user));

    res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  }
);

// update profile avatar

interface IUpdateProfileAvatar {
  avatar: string;
}

export const updateProfileAvatar = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { avatar } = req.body as IUpdateProfileAvatar;
    const userId = req.user?._id;

    const user = await User.findById(userId);

    if (!user)
      return next(new ErrorHandler(`No user found with id ${userId}`, 400));

    if (avatar && user) {
      // if user has already an avatar
      if (user?.avatar?.public_id) {
        // remove it from cloudinary storage
        await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);
      }

      // uploading new avatar image
      const avatarResult = await cloudinary.v2.uploader.upload(avatar, {
        folder: "avatars",
        width: 200,
        height: 200,
        crop: "scale",
      });

      user.avatar = {
        public_id: avatarResult.public_id,
        url: avatarResult.secure_url,
      };

      await user?.save();
      await redis.set(userId, JSON.stringify(user));

      res.status(200).json({
        success: true,
        user,
      });
    }
  }
);

// get all users -- only for admin
export const getAllUsers = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    await getAllUsersService(res);
  }
);

// update user role -- only for admin
export const updateUserRole = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, role } = req.body;

    await updateUserRoleService(email, role, res, next);
  }
);

// delete user -- only admin
export const deleteUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user)
      return next(new ErrorHandler(`No user found with id ${id}`, 400));

    await user.deleteOne({ id });

    await redis.del(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  }
);
