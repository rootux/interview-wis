import { NextFunction, Response } from "express";

export default function AuthMiddleware( req: any, res: Response, next: NextFunction) {
  // Dummy user id mock
  req.auth = { userId: "1" };
  next();
}
