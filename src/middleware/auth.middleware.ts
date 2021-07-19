import { NextFunction, Response } from "express"
import {Roles} from "../user/user.roles.enum";

export default function AuthMiddleware(req: any, res: Response | {}, next: NextFunction) {
  // Dummy user id mock
  // This validation is to test cases for mod users vs normal user -
  // in production - this would be extracted from the logged in user\
  let role = Roles.Normal
  if(req.query?.mod == 'supermod') {
    role = Roles.SuperModerator
  }
  req.auth = { userId: "1", role, isMod: ()=> role == Roles.SuperModerator || role == Roles.Moderator}
  next()
}
