import { NextFunction, Request, Response, ErrorRequestHandler } from "express";

export const errorHandler = (err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
  return res.status(400).json({success: true, message: "some Error"})
}