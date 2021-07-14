import 'jest-extended'
import AuthMiddleware from "../../src/middleware/auth.middleware"
import sinon from 'sinon'

describe("test the AuthMiddleware Middleware", () => {

  it("should set auth on request", sinon.test(async () => {
    const req:any = {}
    const next = sinon.fake();
    const res = {}
    AuthMiddleware(req, res, next)
    expect(req.auth).toMatchObject({ userId: "1" })
    sinon.assert.calledOnce(next)
  }))
})
