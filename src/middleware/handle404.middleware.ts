import {NextFunction, Request, Response} from "express";
import createError from "http-errors";

// catch 404 and forward to error handler
export default function handle404Middleware (req: Request, res: Response, next: NextFunction) {
  next(createError(404));
}
