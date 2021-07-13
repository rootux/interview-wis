import UserService from "../../src/user/user.service"
import db from "../../src/db/models/db.models"
import * as faker from "faker"

describe("test the User Service", () => {
  let thisDb: any = db

  // Before any tests run, clear the DB and run migrations
  beforeAll(async () => {
    await thisDb.sequelize.sync({ force: true })
  })

  it("should create a user", async () => {
    const userMock = {
      email: 'johndoe@gmail.com',
      name: 'john',
      country: 'Israel',
      image: faker.image.people()
    }
    const user = await UserService.create(userMock)
    expect(user.email).toMatch(userMock.email)
    expect(user.name).toMatch(userMock.name)
    expect(user.image).toMatch(userMock.image)
    expect(user.country).toMatch(userMock.country)
  })

  afterAll(async () => {
    await thisDb.sequelize.close()
  })
})
