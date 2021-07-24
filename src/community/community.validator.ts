import ValidationError from "../errors/validation.error";
import {Request} from "express";
import CommunityService from "./community.service";

// TODO: replace with express-validator
class CommunityValidator {
  private communityService

  constructor(communityService: CommunityService) {
    this.communityService = communityService
  }

  async validate(req:Request) {
    const { communityId } = req.params
    if(isNaN(parseInt(communityId))) {
      throw new ValidationError('communityId')
    }

    const result = await this.communityService.exists(communityId)
    if(!result) {
      throw new ValidationError('communityId', "Community doesn't exist")
    }
  }

}

export default CommunityValidator
