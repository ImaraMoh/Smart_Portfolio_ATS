const cache = new Map();
const inFlight = new Map();
const versions = new Map();

export const getCached = (key) => cache.get(key)?.data;
export const hasCached = (key) => cache.has(key);
export const setCached = (key, data) => {
  cache.set(key, { data, updatedAt: Date.now() });
  return data;
};
export const invalidateCached = (key) => {
  cache.delete(key);
  versions.set(key, (versions.get(key) || 0) + 1);
  inFlight.delete(key);
};

export const clearQueryCache = () => {
  for (const key of new Set([...cache.keys(), ...inFlight.keys()])) {
    versions.set(key, (versions.get(key) || 0) + 1);
  }
  cache.clear();
  inFlight.clear();
};

export const fetchCached = (key, fetcher) => {
  if (inFlight.has(key)) return inFlight.get(key);
  const version = versions.get(key) || 0;
  let request;
  request = Promise.resolve()
    .then(fetcher)
    .then((data) => version === (versions.get(key) || 0) ? setCached(key, data) : data)
    .finally(() => { if (inFlight.get(key) === request) inFlight.delete(key); });
  inFlight.set(key, request);
  return request;
};
