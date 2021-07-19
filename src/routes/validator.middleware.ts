import { matchedData, validationResult } from 'express-validator';
import {Response, NextFunction} from "express";

// Validates the express validator rules
export default (req:any, res:Response, next:NextFunction) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    req.matchedData = matchedData(req);
    return next();
  }

  const extractedErrors:any = [];
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
}
