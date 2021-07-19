import UserService from "../../src/user/user.service"
import app from '../../src/app'
import * as faker from "faker"
import {Roles} from "../../src/user/user.roles.enum";
import {UserCreation} from "../../src/db/models/user.model";
import {getCountry} from '../../src/user/user.countries.enum';

describe("test the User Service", () => {
  let thisDb: any = app.locals.db
  let {userService}:{userService:UserService} = app.locals.services

  // Before any tests run, clear the DB and run migrations
  beforeAll(async () => {
    await thisDb.sequelize.sync({ force: true })
  })

  it("should create a user", async () => {
    const userMock:UserCreation = {
      email: 'johndoe@gmail.com',
      name: 'john',
      country: getCountry('Israel'),
      image: faker.image.people(),
      role: Roles.Normal
    }
    const user = await userService.create(userMock)
    expect(user.email).toEqual(userMock.email)
    expect(user.name).toEqual(userMock.name)
    expect(user.image).toEqual(userMock.image)
    expect(user.country).toEqual(userMock.country)
  })

  it("should create a moderator and super moderator", async () => {
    const userMock:UserCreation = {
      email: 'mod@gmail.com',
      name: 'mod',
      country: getCountry('Israel'),
      image: faker.image.people(),
      role: Roles.Moderator
    }
    const user = await userService.create(userMock)
    expect(user.role).toEqual(Roles.Moderator)

    const userSuperModMock:UserCreation = {
      ...userMock,
      email: 'supermod@gmail.com',
      role: Roles.SuperModerator
    }
    const userSuperMod = await userService.create(userSuperModMock)
    expect(userSuperMod.role).toEqual(Roles.SuperModerator)

  })

  afterAll(async () => {
    await thisDb.sequelize.close()
  })
})
