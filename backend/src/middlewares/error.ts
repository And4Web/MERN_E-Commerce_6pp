import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/utility-class.js";
import { ControllerType } from "../types/types.js";

export const errorMiddleware = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.message ||= "Undefined Error or Bad Request or Internal Server Error";
  err.statusCode ||= 500;

  if(err.name === "CastError") err.message = "Invalid ID";

  return res
    .status(err.statusCode)
    .json({ success: false, message: `Error: ${err.message}` });
};

export const TryCatch =
  (controllerFunc: ControllerType) =>
  (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(controllerFunc(req, res, next)).catch(err=>next(err));
  };
