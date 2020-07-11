require("regenerator-runtime");

export default async (res, key, cache, jsonPayload) => {
  const cacheData = cache.get(key);
  if (cacheData) {
    console.log(`cacheData: ${key}`);
    res.json(cacheData);
  } else {
    cache.set(key, jsonPayload);
    res.json(jsonPayload);
  }
};
