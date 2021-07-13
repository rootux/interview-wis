import NodeCache, {Key} from "node-cache"

// In memory cache
export default class CacheService {
  private static _cache: any = new NodeCache();
  static set<T>(key: Key, obj:T, ttlInSeconds?: number) {
    this._cache.set(key, obj, ttlInSeconds);
  }
  static get<T>(key: Key):T {
    return this._cache.get(key);
  }
}
