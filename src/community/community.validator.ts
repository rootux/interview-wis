import ValidationError from "../errors/validation.error";
import {Request} from "express";

export default (req:Request) => {
  const { communityId } = req.params
  if(isNaN(parseInt(communityId))) {
    throw new ValidationError('communityId')
  }
}
