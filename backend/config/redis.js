let redisClient = null;

try {

  const redis = require("redis");

  redisClient = redis.createClient({
    url: process.env.REDIS_URL || "redis://127.0.0.1:6379"
  });

  redisClient.on("error", () => {
    redisClient = null;
  });

  redisClient.connect().catch(() => {
    redisClient = null;
  });

} catch (error) {
  redisClient = null;
}

module.exports = redisClient;