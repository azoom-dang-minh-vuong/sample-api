import { Environment } from 'vitest'

const maxWorkers = Number(process.env.VITEST_MAX_WORKERS) || 3

export default {
  name: 'test',
  transformMode: 'ssr',
  setup(global) {
    global.process.env.DATABASE_URL = getDatabaseURL(
      (Number(process.env.VITEST_WORKER_ID) - 1) % maxWorkers,
    )
    return {
      teardown() {},
    }
  },
} as Environment

const getDatabaseURL = (id: number) => {
  const dbURL = new URL(process.env.DATABASE_URL!)
  dbURL.pathname = id ? `${dbURL.pathname}-${id}` : dbURL.pathname
  return dbURL.toString()
}
