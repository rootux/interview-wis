import PostController from "../../../src/post/post.controller"
import sinon from "sinon"

const mockResponse = () => {
  const res:any = {}
  res.status = () => res
  res.json = () => res
  res.send = () => res
  return res;
}

let communityValidator = { validate: () => {}}

describe("test the Post controller", () => {
  it("should disallow seeing pending posts for normal users", async () => {
    const spy = sinon.spy()
    const res = mockResponse()
    let postService = { list: spy }
    let communityId = 1
    const req:any = {
      auth: {isMod: () => { return false}},
      params: { communityId},
      app: {locals: {services: { postService }, validators: {communityValidator}}}
    }

    await PostController.list(req, res)
    sinon.assert.calledWith(spy, communityId, { includeAllStatus: false })
  })

  it("should allow seeing pending posts for Moderators", async () => {
    const spy = sinon.spy()
    const res = mockResponse()
    let postService = { list: spy }
    let communityId = 1
    const req:any = {
      auth: {isMod: () => { return true}},
      params: { communityId},
      app: {locals: {services: { postService }, validators: {communityValidator}}}
    }

    await PostController.list(req, res)
    sinon.assert.calledWith(spy, communityId, { includeAllStatus: true })
  })
})
