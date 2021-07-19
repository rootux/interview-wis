import ValidationError from "../errors/validation.error";
import {Request} from "express";
import CommunityService from "./community.service";

export default async (req:Request) => {
  const { communityId } = req.params
  if(isNaN(parseInt(communityId))) {
    throw new ValidationError('communityId')
  }
  const {communityService}:{communityService:CommunityService} = req.app.locals.services
  const result = await communityService.exists(communityId)
  if(!result) {
    throw new ValidationError('communityId', "Community doesn't exist")
  }
}
