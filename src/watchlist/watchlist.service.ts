import EmailService from '../email/email.service';
import CacheService from "../cache/cache.service";
import UserService from "../user/user.service";
import {WatchedWords} from "./watchlist.types";
import WatchlistProvider from "./watchlist.provider";
import config from "../config/config";

const WORDS_CACHE_TTL = 600; // 10 minutes

interface MessageToValidate {
  content: string
  url: string
}

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
      words = await this.watchListProvider.getWords()
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

  validateAndAlert = async (message: MessageToValidate):Promise<boolean> => {
    return this.bulkValidateAndAlert([message])
  }

  bulkValidateAndAlert = async (messages: MessageToValidate[]):Promise<boolean> => {
    let invalidMessages = []
    let promises = []
    for (let message of messages) {
      promises.push(this.isContentValid(message.content))
    }
    const results = await Promise.all(promises)
    for(let i=0; i<results.length; i++) {
      if(!results[i]) { invalidMessages.push(messages[i])}
    }

    if(invalidMessages.length <= 0) return true

    const modsAndSuperMods = await this.userService.getModsAndSuperMods()
    const emails = modsAndSuperMods.map((user:any) => user.email)

    const emailParams = {to: emails,
      subject: config.TRIGGER_TITLE,
      body: `${config.TRIGGER_BODY} ${invalidMessages.map(m=>m.url).toString()}`};
    await this.emailService.sendEmail(emailParams);
    return false;
  }
}
