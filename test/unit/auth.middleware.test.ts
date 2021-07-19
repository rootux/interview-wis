import 'jest-extended'
import AuthMiddleware from "../../src/middleware/auth.middleware"
import sinon from 'sinon'
import {Roles} from "../../src/user/user.roles.enum";

describe("test the AuthMiddleware Middleware", () => {

  it("should set auth on request", (async () => {
    const req:any = {}
    const next = sinon.fake();
    const res = {}
    AuthMiddleware(req, res, next)
    expect(req.auth).toMatchObject({ userId: "1", role: Roles.Normal })
    sinon.assert.calledOnce(next)
  }))

  it("should set super mod on mod request", (async () => {
    const req:any = {query: {mod: 'supermod'}}
    const next = sinon.fake();
    const res = {}
    AuthMiddleware(req, res, next)
    expect(req.auth).toMatchObject({ userId: "1", role: Roles.SuperModerator })
    sinon.assert.calledOnce(next)
  }))
})
