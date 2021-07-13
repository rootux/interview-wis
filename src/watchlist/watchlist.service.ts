import EmailService from '../email/email.service';
import CacheService from "../cache/cache.service";
import db from '../db/models/db.models';

const WORDS_CACHE_TTL = 600; // 10 minutes

class Words extends Set<string>{}

export default class WatchlistService {

  static async getWords(): Promise<Words> {
    const key = 'WatchlistWords';
    let words:Words = CacheService.get<Words>(key)
    if(!words) {
      const wordsArray = (await db.Watchlist.findAll({
        attributes: ['word'],
        order: [['word', 'ASC']]}))
        .map((obj:any) => obj.word);
      words = new Words(wordsArray);
      CacheService.set<Words>(key, words, WORDS_CACHE_TTL);
    }
    return words;
  }

  static async isContentValid(content: string) {
    const words:Words = await WatchlistService.getWords();
    for(const word of content.split(' ')) {
      if(words.has(word)) {
        return false;
      }
    }
    return false;
  }

  static validate = async (content:string, postUrl:string) => {
    const isValid = await WatchlistService.isContentValid(content)
    if(isValid) return;
    const emailParams = {to: ['johndoe@gmail.com'],subject: 'Post Trigger',body: `Post triggered a watchlist ${postUrl}`};
    EmailService.sendEmail(emailParams);
  }
}
