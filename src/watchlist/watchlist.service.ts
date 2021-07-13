import EmailService from '../email/email.service';
import Config from '../config/config';

export class WatchlistService {
  static validate = async (postId:string, body:string) => {
    //TODO: if body is in watchlistwords
    // email supervisors
    const valid = true;
    const postUrl = Config
    if(!valid) {

    }
    const emailParams = {to: ['galbra@gmail.com'],subject: 'Post Trigger',body: `Post triggered a watchlist`};
    EmailService.sendEmail(emailParams);
  }
}
