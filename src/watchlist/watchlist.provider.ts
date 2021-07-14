import {WatchedWords} from "./watchlist.types";

export default class WatchlistProvider {
  private models: any;

  constructor(models:any) {
    this.models = models
  }

  async getWords(): Promise<WatchedWords>{
    const wordsArray = (await this.models.Watchlist.findAll({
      attributes: ['word']
    })).map((obj:any) => obj.word.toLowerCase());
    return new WatchedWords(wordsArray);
  }
}
