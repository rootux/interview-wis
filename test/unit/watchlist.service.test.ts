import db from "../../src/db/models/db.models"
import WatchlistService from "../../src/watchlist/watchlist.service"
import 'jest-extended'

describe("test the Watchlist Service", () => {
  let thisDb: any = db
  let testWords = ['warning','one','shall','alert']

  async function seed() {
    await thisDb.sequelize.sync({ force: true })
    await thisDb.Watchlist.bulkCreate(
      testWords.map((word:string) => {return {word}})
    )
  }

  beforeAll(async () => {
    await seed()
  })

  it("should return tested words", async () => {
    const wordsSet = await WatchlistService.getWords()
    expect(testWords).toIncludeAllMembers(Array.from(wordsSet))
  })

  it("should return invalid content when appears in Watchlist", async () => {
    const isValid = await WatchlistService.isContentValid("In the middle alert word exist")
    expect(isValid).toBeFalse()
  })

  it("should return invalid content in any case sensitivity when appears in Watchlist", async () => {
    const isValid = await WatchlistService.isContentValid("In the middle ALERT word exist")
    expect(isValid).toBeFalse()
  })

  it("should return valid content when appears in Watchlist", async () => {
    const isValid = await WatchlistService.isContentValid("Nothing suspicious here")
    expect(isValid).toBeTrue()
  })

  it("should still store words in memory after db change", async () => {
    await thisDb.Watchlist.drop()
    const wordsSet = await WatchlistService.getWords()
    expect(Array.from(wordsSet)).toIncludeAllMembers(testWords)
    await seed()
  })

  it("should send an email when invalid", async () => {
    const isValid = await WatchlistService.validate("This shall send a warning alert", "some-url")
    expect(isValid).toBeFalse()
    // TODO: add super test and inject Email service as a mock
  })

  afterAll(async () => {
    await thisDb.sequelize.close()
  })
})
