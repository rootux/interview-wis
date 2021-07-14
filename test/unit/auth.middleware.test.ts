import 'jest-extended'
import AuthMiddleware from "../../src/user/auth/auth.middleware"
import sinon from 'sinon'

describe("test the Auth Middleware", () => {

  it("should set auth on request", async () => {
    const req:any = {}
    const next = sinon.fake();
    const res = {}
    AuthMiddleware(req, res, next)
    expect(req.auth).toMatchObject({ userId: "1" })
    sinon.assert.calledOnce(next)
  })
})
