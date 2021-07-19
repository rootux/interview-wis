import 'jest-extended'
import WatchlistService from "../../src/watchlist/watchlist.service"
import app from "../../src/app"
import sinon from "sinon";
import WatchlistProvider from "../../src/watchlist/watchlist.provider";
import {WatchedWords} from "../../src/watchlist/watchlist.types";

class TestWatchlistProvider extends WatchlistProvider {
  private readonly words:WatchedWords;
  constructor(words:string[]) {
    super(null)
    this.words = new WatchedWords(words)
  }
  async getWords(): Promise<WatchedWords>{
    return Promise.resolve(this.words)
  }
}

describe("test the Watchlist Service", () => {
  let models: any = app.locals.models
  let watchlistService:WatchlistService
  let watchlistProvider:any
  let emailService:any
  let userService:any
  let testWords = ['warning','one','shall','alert']

  beforeAll(async () => {
    watchlistProvider = new TestWatchlistProvider(testWords) //TODO: see if sinon.fake can shorten this
    emailService = sinon.fake()
    userService = sinon.fake()

    watchlistService = new WatchlistService(watchlistProvider,emailService,userService)
  })

  it("should return tested words", async () => {
    const wordsSet = await watchlistService.getWords()
    expect(testWords).toIncludeAllMembers(Array.from(wordsSet))
  })

  it("should return invalid content when appears in Watchlist", async () => {
    const isValid = await watchlistService.isContentValid("In the middle alert word exist")
    expect(isValid).toBeFalse()
  })

  it("should return invalid content in any case sensitivity when appears in Watchlist", async () => {
    const isValid = await watchlistService.isContentValid("In the middle ALERT word exist")
    expect(isValid).toBeFalse()
  })

  it("should return valid content when appears in Watchlist", async () => {
    const isValid = await watchlistService.isContentValid("Nothing suspicious here")
    expect(isValid).toBeTrue()
  })

  it("should still store words in memory after db change", async () => {
    await models.Watchlist.drop()
    const wordsSet = await watchlistService.getWords()
    expect(Array.from(wordsSet)).toIncludeAllMembers(testWords)
    // await seed()
  })

  it("should send an email when invalid", async () => {
    const isValid = await watchlistService.validateAndAlert("This shall send a warning alert", "some-url")
    expect(isValid).toBeFalse()
    // TODO: add super test and inject Email service as a mock
  })

})