import db from "../../src/db/models/db.models"
import WatchlistService from "../../src/watchlist/watchlist.service";
import 'jest-extended';

describe("test the Watchlist Service", () => {
  let thisDb: any = db
  let testWords = ['this','one','shall','alert']

  // Before any tests run, clear the DB and run migrations
  beforeAll(async () => {
    await thisDb.sequelize.sync({ force: true })
    await thisDb.Watchlist.bulkCreate(
      testWords.map((word:string) => {return {word}})
    )
  })

  it("should return tested words", async () => {
    const wordsSet = await WatchlistService.getWords();
    expect(testWords).toIncludeAllMembers(Array.from(wordsSet));
  })

  afterAll(async () => {
    await thisDb.sequelize.close()
  })
})
