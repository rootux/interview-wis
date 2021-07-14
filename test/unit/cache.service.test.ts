import 'jest-extended'
import CacheService from "../../src/cache/cache.service"

describe("test the Cache Service", () => {

  it("should store and retrieve simple key", async () => {
    const key = 'my_key'
    const value = 'my_value'
    await CacheService.set(key, value)
    const cached = await CacheService.get(key)
    expect(cached).toBe(value)
  })
})
