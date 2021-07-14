import UserService from "../../src/user/user.service"
import db from "../../src/db/models/db.models"
import * as faker from "faker"
import {Roles} from "../../src/user/user.roles.enum";

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

  it("should create a moderator and super moderator", async () => {
    const userMock = {
      email: 'mod@gmail.com',
      name: 'mod',
      country: 'Israel',
      image: faker.image.people(),
      role: Roles.Moderator
    }
    const user = await UserService.createWithRole(userMock)
    expect(user.role).toMatch(Roles.Moderator)

    const userSuperModMock = {
      ...userMock,
      email: 'supermod@gmail.com',
      role: Roles.SuperModerator
    }
    const userSuperMod = await UserService.createWithRole(userSuperModMock)
    expect(userSuperMod.role).toMatch(Roles.SuperModerator)

  })

  afterAll(async () => {
    await thisDb.sequelize.close()
  })
})
