import 'jest-extended'
import CacheService from "../../src/cache/cache.service"
import {sleep} from "../../src/utils/unittest.utils";

describe("test the Cache Service", () => {

  it("should store and retrieve simple key", async () => {
    const key = 'my_key'
    const value = 'my_value'
    await CacheService.set(key, value)
    const cached = await CacheService.get(key)
    expect(cached).toBe(value)
  })

  it("should remove a key upon ttl expiry", async () => {
    const mock = {key: 'my_key', value: 'my_value'}
    await CacheService.set(mock.key, mock.value, 1)
    const cached = await CacheService.get(mock.key)
    expect(cached).toBe(mock.value)
    await sleep(1500)
    const cachedAfterTimeout = await CacheService.get(mock.key)
    expect(cachedAfterTimeout).toBeUndefined()
  })

  it("should return undefined for unknown keys", async () => {
    const value = await CacheService.get('unknown_key')
    expect(value).toBeUndefined()
  })
})
