import redis from 'redis'
import config from '../config'
import logger from '../../log'

const redisClient = redis.createClient({
  port: config.redis.port,
  password: config.redis.password,
  host: config.redis.host,
  tls: config.redis.tls_enabled === 'true' ? {} : false,
  prefix: 'systemToken:',
})

redisClient.on('error', error => {
  logger.error({ err: error }, 'Redis error')
})

async function getRedisAsync<T>(key: string): Promise<T | null> {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, val) => {
      if (err) return reject(err)

      if (val == null) return resolve(val)

      return resolve(JSON.parse(val) as T)
    })
  })
}

async function setRedisAsync(key: string, value: unknown, mode: string, duration: number): Promise<void> {
  return new Promise((resolve, reject) => {
    redisClient.set(key, JSON.stringify(value), mode, duration, err => {
      if (err) return reject(err)
      return resolve()
    })
  })
}

export default {
  getRedisAsync,
  setRedisAsync,
}
