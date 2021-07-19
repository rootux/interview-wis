import 'jest-extended'
import WatchlistService from "../../src/watchlist/watchlist.service"
import app from "../../src/app"
import sinon, {SinonFake,SinonSpy} from "sinon";
import WatchlistProvider from "../../src/watchlist/watchlist.provider";
import {WatchedWords} from "../../src/watchlist/watchlist.types";
import UserService from "../../src/user/user.service";
import {User} from "../../src/db/models/user.model";
import EmailService from "../../src/email/email.service";
import config from "../../src/config/config"

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

// TODO: replace with sinon magic
class TestUserService extends UserService {
  private readonly result:User[]
  constructor(result:User[]) {
    super(null);
    this.result = result
  }
  getModsAndSuperMods():Promise<User[]> {
    return Promise.resolve(this.result)
  }
}

describe("test the Watchlist Service", () => {
  let models: any = app.locals.models
  let watchlistService:WatchlistService
  let watchlistProvider:any
  let emailService:EmailService
  let emailServiceFakeFunc:SinonSpy
  let userService:UserService
  let testWords = ['warning','one','shall','alert']
  let modsEmails:any = [{email:'john@gmail.com'}, {email:'jonny@gmail.com'}]

  let initWatchlist = (emailServiceParam:any) => {
    watchlistProvider = new TestWatchlistProvider(testWords) //TODO: see if sinon.fake can shorten this
    emailService = emailServiceParam
    userService = new TestUserService(modsEmails)

    watchlistService = new WatchlistService(watchlistProvider,emailService,userService)
  }

  beforeAll(async () => {
    initWatchlist(sinon.fake())
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
  })

  it("should send an email when invalid", async () => {
    emailServiceFakeFunc = sinon.fake()
    emailService = {sendEmail: emailServiceFakeFunc}
    initWatchlist(emailService)
    const isValid = await watchlistService.validateAndAlert("This shall send a warning alert", "some-url")
    expect(isValid).toBeFalse()
    sinon.assert.calledOnce(emailServiceFakeFunc)
  })

  it("should validate correct email is sent to mods", async () => {
    emailServiceFakeFunc = sinon.fake()
    emailService = {sendEmail: emailServiceFakeFunc}
    initWatchlist(emailService)
    const postUrl = 'some-url'
    await watchlistService.validateAndAlert(
      "This shall send a warning alert", postUrl)
    sinon.assert.calledWith(emailServiceFakeFunc, {
      to: modsEmails.map((e:any) => e.email),
      subject: config.TRIGGER_TITLE,
      body: `${config.TRIGGER_BODY} ${postUrl}`
    })
  })

})
