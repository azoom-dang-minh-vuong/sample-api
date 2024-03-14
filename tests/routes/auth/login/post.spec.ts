import client from '~vitest/client'
import { userFactory } from '~vitest/fixtures/factories'

test('POST /auth/login', async () => {
  const res = await client.post('/auth/login')
  expect(res.status).toBe(200)
})
