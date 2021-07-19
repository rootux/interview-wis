import UserService from "../../src/user/user.service"
import app from '../../src/app'
import * as faker from "faker"
import {Roles} from "../../src/user/user.roles.enum";
import {User} from "../../src/db/models/user.model";

describe("test the User Service", () => {
  let thisDb: any = app.locals.db
  let {userService}:{userService:UserService} = app.locals.services

  // Before any tests run, clear the DB and run migrations
  beforeAll(async () => {
    await thisDb.sequelize.sync({ force: true })
  })

  it("should create a user", async () => {
    const userMock:User = {
      email: 'johndoe@gmail.com',
      name: 'john',
      country: 'Israel',
      image: faker.image.people(),
      role: Roles.Normal
    }
    const user = await userService.create(userMock)
    expect(user.email).toMatch(userMock.email)
    expect(user.name).toMatch(userMock.name)
    expect(user.image).toMatch(userMock.image)
    expect(user.country).toMatch(userMock.country)
  })

  it("should create a moderator and super moderator", async () => {
    const userMock:User = {
      email: 'mod@gmail.com',
      name: 'mod',
      country: 'Israel',
      image: faker.image.people(),
      role: Roles.Moderator
    }
    const user = await userService.create(userMock)
    expect(user.role).toMatch(Roles.Moderator)

    const userSuperModMock:User = {
      ...userMock,
      email: 'supermod@gmail.com',
      role: Roles.SuperModerator
    }
    const userSuperMod = await userService.create(userSuperModMock)
    expect(userSuperMod.role).toMatch(Roles.SuperModerator)

  })

  afterAll(async () => {
    await thisDb.sequelize.close()
  })
})
