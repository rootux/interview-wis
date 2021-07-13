import db from '../db/models/db.models';
import {UserAttributes} from "../db/models/user.model";

export default class UserService {
  static create(userAttributes: UserAttributes) {
    const { name, email, image, country } = userAttributes;
    return db.User.create({
      name, email, image, country
    })
  }
  static getFeed(userId: string) {
    return `Feed for ${userId}`;
  }
}
