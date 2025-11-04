// Simple in-memory cache middleware
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const cacheMiddleware = (duration = CACHE_DURATION) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = req.originalUrl || req.url;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      const { data, timestamp } = cachedResponse;
      const age = Date.now() - timestamp;

      // Check if cache is still valid
      if (age < duration) {
        console.log(`✅ Cache hit for: ${key}`);
        return res.status(200).json(data);
      } else {
        // Remove expired cache
        cache.delete(key);
      }
    }

    // Store original res.json function
    const originalJson = res.json.bind(res);

    // Override res.json to cache the response
    res.json = (data) => {
      cache.set(key, {
        data,
        timestamp: Date.now()
      });
      console.log(`💾 Cached response for: ${key}`);
      return originalJson(data);
    };

    next();
  };
};

// Clear cache for specific patterns (useful when data is updated)
export const clearCache = (pattern = null) => {
  if (pattern) {
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
        console.log(`🗑️ Cleared cache for: ${key}`);
      }
    }
  } else {
    cache.clear();
    console.log('🗑️ Cleared all cache');
  }
};

// Periodically clean up expired cache entries
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      cache.delete(key);
    }
  }
}, CACHE_DURATION);

