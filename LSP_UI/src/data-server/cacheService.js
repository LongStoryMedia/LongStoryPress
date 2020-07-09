import NodeCache from "node-cache";

class Cache {
  constructor(ttlSeconds) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
    });
  }

  get(key, storeFunction) {
    const value = this.cache.get(key);
    console.log(`key: ${key}, value: ${value}`);
    if (value) {
      return Promise.resolve(value);
    }
    return storeFunction().then((result) => {
      console.log(`key: ${key}, result: ${value}`);
      this.cache.set(key, result);
      return result;
    });
  }

  del(keys) {
    this.cache.del(keys);
  }

  delStartWith(startStr = "") {
    if (!startStr) {
      return;
    }

    const keys = this.cache.keys();
    for (const key of keys) {
      if (key.indexOf(startStr) === 0) {
        this.del(key);
      }
    }
  }

  flush() {
    this.cache.flushAll();
  }
}

export default Cache;
