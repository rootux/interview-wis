import EmailService from '../email/email.service';
import CacheService from "../cache/cache.service";
import UserService from "../user/user.service";
import {WatchedWords} from "./watchlist.types";
import WatchlistProvider from "./watchlist.provider";

const WORDS_CACHE_TTL = 600; // 10 minutes

export default class WatchlistService {
  private emailService:EmailService;
  private watchListProvider: WatchlistProvider;
  private userService: UserService;

  constructor(watchListProvider:WatchlistProvider, emailService:EmailService, userService: UserService) {
    this.watchListProvider = watchListProvider
    this.emailService = emailService
    this.userService = userService
  }

  async getWords(): Promise<WatchedWords> {
    const key = 'WatchlistWords';
    let words:WatchedWords = CacheService.get<WatchedWords>(key)
    if(!words) {
      const wordsSet = this.watchListProvider.getWords()
      CacheService.set<WatchedWords>(key, words, WORDS_CACHE_TTL);
    }
    return words;
  }

  async isContentValid(content: string):Promise<boolean> {
    const words:WatchedWords = await this.getWords();
    for(const word of content.split(' ')) {
      if(words.has(word.toLowerCase())) {
        return false;
      }
    }
    return true;
  }

  validateAndAlert = async (content:string, postUrl:string):Promise<boolean> => {
    const isValid = await this.isContentValid(content)
    if(isValid) return isValid
    const modsAndSuperMods = await this.userService.getModsAndSuperMods()
    const emails = modsAndSuperMods.map((user:any) => user.email)
    const emailParams = {to: emails, subject: 'Post Trigger',body: `Post triggered a watchlist ${postUrl}`};
    await this.emailService.sendEmail(emailParams);
    return isValid;
  }
}
