import { NextFunction, Request, Response } from "express";

export const catchAsyncErrors =
  (asyncFunction: Function) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(asyncFunction(req, res, next)).catch(next);
  };
