require("regenerator-runtime");

module.exports = async ({res, key, cache, jsonPayload}) => {
  const cacheData = cache.get(key);
  if (cacheData) {
    res.json(cacheData);
  } else {
    cache.set(key, jsonPayload);
    res.json(jsonPayload);
  }
};
