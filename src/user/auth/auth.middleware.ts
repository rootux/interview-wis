import { NextFunction, Request, Response } from "express";

export default function AuthMiddleware( req: Request, res: Response, next: NextFunction) {
  // Dummy user id mock
  req.auth = { userId: "1" };
  next();
}
