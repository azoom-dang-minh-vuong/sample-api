import client from '~vitest/client'
import { userFactory } from '~vitest/fixtures/factories'

test('POST /auth/logout', async () => {
  const res = await client.post('/auth/logout')
  expect(res.status).toBe(200)
})
